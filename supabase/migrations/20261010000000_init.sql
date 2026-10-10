-- CELEBRATION NIGHT — schema initial (voir REQUIREMENTS.md § 6 et § 9)
-- Principe : RLS activee partout. Le public ne lit que le contenu publie ;
-- les inscriptions passent par le serveur (service role) apres validation Zod.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- roles
create type public.staff_role as enum ('super_admin', 'admin', 'communication', 'accueil', 'finance');
create type public.speaker_status as enum ('confirme', 'annonce', 'proposition');
create type public.ticket_status as enum ('valid', 'used', 'cancelled');
create type public.media_kind as enum ('photo', 'video', 'affiche', 'logo');

create table public.staff_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role public.staff_role not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Role courant de l'utilisateur connecte (null si non membre de l'equipe).
create or replace function public.current_staff_role()
returns public.staff_role
language sql stable security definer set search_path = public as $$
  select role from public.staff_profiles where user_id = auth.uid() and active
$$;

create or replace function public.has_role(allowed public.staff_role[])
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_staff_role() = any (allowed), false)
$$;

-- ---------------------------------------------------------------- contenu
create table public.editions (
  id uuid primary key default gen_random_uuid(),
  year int not null unique,
  title text not null,
  theme text,
  bible_reference text,
  starts_at timestamptz,
  venue text,
  venue_confirmed boolean not null default false,
  summary text,
  is_current boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index editions_single_current on public.editions (is_current) where is_current;

create table public.speakers (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references public.editions (id) on delete cascade,
  name text not null,
  role text not null,                       -- chantre, orateur, serviteur, groupe...
  status public.speaker_status not null default 'proposition',
  bio text,
  photo_path text,
  sort_order int not null default 0,
  published boolean not null default false
);

create table public.program_items (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references public.editions (id) on delete cascade,
  starts_at time,                           -- null tant que l'horaire n'est pas valide
  title text not null,
  description text,
  sort_order int not null default 0,
  published boolean not null default false
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid references public.editions (id) on delete set null,
  kind public.media_kind not null,
  slot text,                                -- emplacement nomme (ex. 'hero', 'logo-principal')
  storage_path text,
  external_url text,                        -- video YouTube / Facebook
  alt text not null default '',
  credit text,
  sort_order int not null default 0,
  published boolean not null default false,
  check (storage_path is not null or external_url is not null)
);

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid references public.editions (id) on delete set null,
  name text not null,
  category text,
  logo_path text,
  website text,
  sort_order int not null default 0,
  published boolean not null default false
);

-- ---------------------------------------------------------------- inscriptions
create sequence public.ticket_number_seq;

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references public.editions (id),
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text,
  city text,
  church text,
  seats int not null default 1 check (seats between 1 and 10),
  heard_from text,
  consent_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index registrations_edition_idx on public.registrations (edition_id, created_at desc);
create index registrations_phone_idx on public.registrations (phone);

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations (id) on delete cascade,
  ticket_number text not null unique,       -- CN-2026-000001
  qr_token text not null unique default encode(gen_random_bytes(24), 'hex'),  -- aucune donnee personnelle
  status public.ticket_status not null default 'valid',
  used_at timestamptz,
  used_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create table public.ticket_scans (
  id bigint generated always as identity primary key,
  ticket_id uuid references public.tickets (id) on delete cascade,
  scanned_by uuid not null references auth.users (id),
  outcome text not null check (outcome in ('valid', 'already_used', 'cancelled', 'unknown')),
  scanned_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  subject text not null,
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor uuid references auth.users (id),
  action text not null,
  target text,
  details jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- validation atomique
-- Un seul UPDATE conditionnel : sous concurrence, Postgres serialise les
-- ecritures sur la ligne et une seule transaction voit status = 'valid'.
create or replace function public.validate_ticket(p_qr_token text)
returns table (outcome text, ticket_number text, holder text, seats int, used_at timestamptz, used_by_name text)
language plpgsql security definer set search_path = public as $$
declare
  v_ticket public.tickets;
begin
  if not public.has_role(array['super_admin', 'admin', 'accueil']::public.staff_role[]) then
    raise exception 'acces refuse' using errcode = '42501';
  end if;

  update public.tickets t
     set status = 'used', used_at = now(), used_by = auth.uid()
   where t.qr_token = p_qr_token and t.status = 'valid'
  returning * into v_ticket;

  if found then
    insert into public.ticket_scans (ticket_id, scanned_by, outcome) values (v_ticket.id, auth.uid(), 'valid');
    return query
      select 'valid', v_ticket.ticket_number, r.first_name || ' ' || r.last_name, r.seats, v_ticket.used_at, null::text
        from public.registrations r where r.id = v_ticket.registration_id;
    return;
  end if;

  select * into v_ticket from public.tickets t where t.qr_token = p_qr_token;
  if not found then
    insert into public.ticket_scans (ticket_id, scanned_by, outcome) values (null, auth.uid(), 'unknown');
    return query select 'unknown', null::text, null::text, null::int, null::timestamptz, null::text;
    return;
  end if;

  insert into public.ticket_scans (ticket_id, scanned_by, outcome)
  values (v_ticket.id, auth.uid(), case when v_ticket.status = 'used' then 'already_used' else 'cancelled' end);

  return query
    select case when v_ticket.status = 'used' then 'already_used' else 'cancelled' end,
           v_ticket.ticket_number, r.first_name || ' ' || r.last_name, r.seats, v_ticket.used_at, sp.full_name
      from public.registrations r
      left join public.staff_profiles sp on sp.user_id = v_ticket.used_by
     where r.id = v_ticket.registration_id;
end;
$$;

revoke all on function public.validate_ticket(text) from public, anon;
grant execute on function public.validate_ticket(text) to authenticated;

-- ---------------------------------------------------------------- RLS
alter table public.staff_profiles   enable row level security;
alter table public.editions         enable row level security;
alter table public.speakers         enable row level security;
alter table public.program_items    enable row level security;
alter table public.media            enable row level security;
alter table public.partners         enable row level security;
alter table public.registrations    enable row level security;
alter table public.tickets          enable row level security;
alter table public.ticket_scans     enable row level security;
alter table public.contact_messages enable row level security;
alter table public.audit_logs       enable row level security;

-- Profils : chacun lit le sien ; seul le super_admin gere l'equipe.
create policy staff_self_read on public.staff_profiles for select using (user_id = auth.uid());
create policy staff_super_admin on public.staff_profiles for all
  using (public.has_role(array['super_admin']::public.staff_role[]))
  with check (public.has_role(array['super_admin']::public.staff_role[]));

-- Contenu public : lecture du contenu publie pour tous, ecriture admin/communication.
create policy editions_public_read on public.editions for select using (published);
create policy editions_staff on public.editions for all
  using (public.has_role(array['super_admin', 'admin']::public.staff_role[]))
  with check (public.has_role(array['super_admin', 'admin']::public.staff_role[]));

create policy speakers_public_read on public.speakers for select using (published);
create policy speakers_staff on public.speakers for all
  using (public.has_role(array['super_admin', 'admin', 'communication']::public.staff_role[]))
  with check (public.has_role(array['super_admin', 'admin', 'communication']::public.staff_role[]));

create policy program_public_read on public.program_items for select using (published);
create policy program_staff on public.program_items for all
  using (public.has_role(array['super_admin', 'admin', 'communication']::public.staff_role[]))
  with check (public.has_role(array['super_admin', 'admin', 'communication']::public.staff_role[]));

create policy media_public_read on public.media for select using (published);
create policy media_staff on public.media for all
  using (public.has_role(array['super_admin', 'admin', 'communication']::public.staff_role[]))
  with check (public.has_role(array['super_admin', 'admin', 'communication']::public.staff_role[]));

create policy partners_public_read on public.partners for select using (published);
create policy partners_staff on public.partners for all
  using (public.has_role(array['super_admin', 'admin', 'communication']::public.staff_role[]))
  with check (public.has_role(array['super_admin', 'admin', 'communication']::public.staff_role[]));

-- Donnees personnelles : aucune lecture publique. L'accueil passe par validate_ticket.
create policy registrations_admin on public.registrations for all
  using (public.has_role(array['super_admin', 'admin']::public.staff_role[]))
  with check (public.has_role(array['super_admin', 'admin']::public.staff_role[]));

create policy tickets_admin on public.tickets for all
  using (public.has_role(array['super_admin', 'admin']::public.staff_role[]))
  with check (public.has_role(array['super_admin', 'admin']::public.staff_role[]));

create policy scans_read on public.ticket_scans for select
  using (public.has_role(array['super_admin', 'admin']::public.staff_role[]));

create policy contact_admin on public.contact_messages for all
  using (public.has_role(array['super_admin', 'admin', 'communication']::public.staff_role[]))
  with check (public.has_role(array['super_admin', 'admin', 'communication']::public.staff_role[]));

create policy audit_read on public.audit_logs for select
  using (public.has_role(array['super_admin']::public.staff_role[]));

-- ---------------------------------------------------------------- stockage
insert into storage.buckets (id, name, public) values ('public-media', 'public-media', true)
on conflict (id) do nothing;

create policy media_bucket_write on storage.objects for all
  using (bucket_id = 'public-media' and public.has_role(array['super_admin', 'admin', 'communication']::public.staff_role[]))
  with check (bucket_id = 'public-media' and public.has_role(array['super_admin', 'admin', 'communication']::public.staff_role[]));
