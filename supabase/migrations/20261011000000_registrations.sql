-- Inscriptions : cle d'acces aux billets, capacite, creation atomique.
-- Ces fonctions sont appelees uniquement par le serveur (service role).

create extension if not exists unaccent;

alter table public.editions
  add column capacity int check (capacity is null or capacity > 0);

-- Empreinte SHA-256 (hex) de la cle personnelle : la cle elle-meme n'est jamais stockee.
alter table public.registrations
  add column access_key_hash text check (access_key_hash ~ '^[0-9a-f]{64}$');
create unique index registrations_access_key_idx on public.registrations (access_key_hash);

-- Normalisations partagees (telephone : 8 derniers chiffres ; nom : sans accents ni ponctuation).
create or replace function public.phone_suffix(p text)
returns text language sql immutable as $$ select right(regexp_replace(coalesce(p, ''), '\D', '', 'g'), 8) $$;

create or replace function public.name_key(p text)
returns text language sql stable as $$
  select regexp_replace(lower(public.unaccent(coalesce(p, ''))), '[^a-z]', '', 'g')
$$;

-- ------------------------------------------------------------------ creation
create or replace function public.create_registration(
  p_year int,
  p_first_name text,
  p_last_name text,
  p_phone text,
  p_email text,
  p_city text,
  p_seats int,
  p_heard_from text,
  p_access_key_hash text
)
returns text[]
language plpgsql security definer set search_path = public as $$
declare
  v_edition public.editions;
  v_used int;
  v_registration_id uuid;
  v_numbers text[] := '{}';
  v_number text;
begin
  if p_seats is null or p_seats < 1 or p_seats > 10 then
    raise exception 'nombre_de_places_invalide';
  end if;

  -- Verrou sur l'edition : les inscriptions simultanees passent une par une
  -- dans ce bloc, ce qui rend le controle de capacite fiable.
  select * into v_edition from public.editions where year = p_year and is_current for update;
  if not found then
    raise exception 'edition_introuvable';
  end if;

  if v_edition.capacity is not null then
    select count(*) into v_used
      from public.tickets t
      join public.registrations r on r.id = t.registration_id
     where r.edition_id = v_edition.id and t.status <> 'cancelled';
    if v_used + p_seats > v_edition.capacity then
      raise exception 'capacite_atteinte:%', greatest(0, v_edition.capacity - v_used);
    end if;
  end if;

  insert into public.registrations
    (edition_id, first_name, last_name, phone, email, city, seats, heard_from, consent_at, access_key_hash)
  values
    (v_edition.id, p_first_name, p_last_name, p_phone, nullif(p_email, ''), p_city, p_seats, p_heard_from, now(), p_access_key_hash)
  returning id into v_registration_id;

  for i in 1..p_seats loop
    v_number := format('CN-%s-%s', p_year, lpad(nextval('public.ticket_number_seq')::text, 6, '0'));
    insert into public.tickets (registration_id, ticket_number) values (v_registration_id, v_number);
    v_numbers := v_numbers || v_number;
  end loop;

  return v_numbers;
end;
$$;

-- ------------------------------------------------------------------ lecture par cle
create or replace function public.get_registration_by_key(p_access_key_hash text)
returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'firstName', r.first_name,
    'lastName', r.last_name,
    'seats', r.seats,
    'tickets', (
      select coalesce(json_agg(json_build_object(
               'ticketNumber', t.ticket_number,
               'status', t.status,
               'qrToken', t.qr_token
             ) order by t.ticket_number), '[]'::json)
        from public.tickets t where t.registration_id = r.id
    )
  )
  from public.registrations r
  where r.access_key_hash = p_access_key_hash
$$;

-- ------------------------------------------------------------------ nouvelle cle
create or replace function public.rotate_registration_key(
  p_year int,
  p_phone text,
  p_last_name text,
  p_new_access_key_hash text
)
returns boolean
language plpgsql security definer set search_path = public as $$
declare
  v_id uuid;
begin
  if length(public.phone_suffix(p_phone)) < 8 or public.name_key(p_last_name) = '' then
    return false;
  end if;

  select r.id into v_id
    from public.registrations r
    join public.editions e on e.id = r.edition_id
   where e.year = p_year
     and public.phone_suffix(r.phone) = public.phone_suffix(p_phone)
     and public.name_key(r.last_name) = public.name_key(p_last_name)
   order by r.created_at desc
   limit 1;

  if v_id is null then
    return false;
  end if;

  update public.registrations set access_key_hash = p_new_access_key_hash where id = v_id;
  return true;
end;
$$;

-- Reserve au serveur : ni les visiteurs (anon) ni l'equipe connectee.
revoke all on function public.create_registration(int, text, text, text, text, text, int, text, text) from public, anon, authenticated;
revoke all on function public.get_registration_by_key(text) from public, anon, authenticated;
revoke all on function public.rotate_registration_key(int, text, text, text) from public, anon, authenticated;
grant execute on function public.create_registration(int, text, text, text, text, text, int, text, text) to service_role;
grant execute on function public.get_registration_by_key(text) to service_role;
grant execute on function public.rotate_registration_key(int, text, text, text) to service_role;
