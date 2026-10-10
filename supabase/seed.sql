-- Donnees issues du dossier "Projet d'organisation CELEBRATION NIGHT 2026".
-- Rien n'est publie par defaut (published = false) : l'organisation valide
-- chaque element depuis l'administration avant sa mise en ligne.

insert into public.editions (year, title, theme, bible_reference, starts_at, venue, venue_confirmed, is_current, published)
values
  (2026, 'CELEBRATION NIGHT 2026', 'La délivrance des vrais adorateurs : Génération Asaph', 'Psaume 73:17',
   '2026-11-13 20:00:00+01', 'Terrain du CEG Sainte Rita', false, true, false),
  (2025, 'CELEBRATION NIGHT — Édition 2025', 'L''adoration qui touche le cœur de Dieu', 'Genèse 22:5-18',
   '2025-11-14 19:00:00+01', 'Sikècodji, Fignon (Cotonou)', true, false, false);

insert into public.speakers (edition_id, name, role, status, sort_order)
select e.id, s.name, s.role, s.status::public.speaker_status, s.ord
from public.editions e
cross join (values
  ('Pasteur Sunday AVLA', 'Orateur', 'annonce', 1),
  ('Josias FOLLY', 'Chantre', 'annonce', 10),
  ('Claudy SHINE', 'Chantre', 'annonce', 11),
  ('AGBOTON Oda Grâce', 'Chantre', 'annonce', 12),
  ('Pst. GBEHOUNOU Blaise', 'Serviteur', 'annonce', 20),
  ('Pst. ADEKPEDJOU Michaël', 'Serviteur', 'annonce', 21),
  ('Evg. MELIHO Bruno', 'Serviteur', 'annonce', 22),
  ('Pst. Héribert Donald', 'Serviteur', 'proposition', 23)
) as s(name, role, status, ord)
where e.year = 2026;

insert into public.speakers (edition_id, name, role, status, sort_order)
select e.id, s.name, 'Chantre invité', 'confirme', s.ord
from public.editions e
cross join (values ('Chantre Samuel', 1), ('Chantre Diane', 2), ('Chantre Hubert', 3), ('Chantre Manne', 4), ('Chantre Sergio', 5)) as s(name, ord)
where e.year = 2025;

-- Activites du dossier (§ 4), sans horaire tant que le programme n'est pas valide.
insert into public.program_items (edition_id, title, sort_order)
select e.id, p.title, p.ord
from public.editions e
cross join (values
  ('Louange et adoration', 1),
  ('Prestations des chantres invités', 2),
  ('Temps de prière', 3),
  ('Exhortation et appel à la conversion', 4),
  ('Témoignages', 5)
) as p(title, ord)
where e.year = 2026;
