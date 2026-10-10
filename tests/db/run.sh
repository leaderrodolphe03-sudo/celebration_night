#!/usr/bin/env bash
# Teste la migration Supabase sur une base PostgreSQL JETABLE.
# Usage : PGURL=postgresql://postgres@127.0.0.1:54329/postgres tests/db/run.sh
# La base "cn_test" est recreee a chaque execution.
set -euo pipefail
cd "$(dirname "$0")/../.."
: "${PGURL:?Definir PGURL (base PostgreSQL jetable, jamais la production)}"
DB_URL="${PGURL%/*}/cn_test"
psql "$PGURL" -q -c "drop database if exists cn_test" -c "create database cn_test"
P="psql $DB_URL -v ON_ERROR_STOP=1 -q -t -A"
$P -f tests/db/supabase_stub.sql
for f in supabase/migrations/*.sql; do $P -f "$f"; done
$P -f supabase/seed.sql
$P <<'SQL'
insert into auth.users values ('00000000-0000-0000-0000-00000000000a'),('00000000-0000-0000-0000-00000000000b'),('00000000-0000-0000-0000-00000000000c');
insert into staff_profiles values ('00000000-0000-0000-0000-00000000000a','Admin','admin'),('00000000-0000-0000-0000-00000000000b','Accueil','accueil'),('00000000-0000-0000-0000-00000000000c','Com','communication');
update editions set published = true where year = 2026;
insert into registrations (id, edition_id, first_name, last_name, phone, consent_at)
  select '11111111-1111-1111-1111-111111111111', id, 'Test', 'Participant', '+22900000000', now() from editions where year = 2026;
insert into tickets (registration_id, ticket_number, qr_token) values
  ('11111111-1111-1111-1111-111111111111', 'CN-TEST-000001', 'tok-race'),
  ('11111111-1111-1111-1111-111111111111', 'CN-TEST-000002', 'tok-cancel');
update tickets set status = 'cancelled' where qr_token = 'tok-cancel';
SQL

fail=0
check() { if [ "$2" = "$3" ]; then echo "ok   - $1"; else echo "FAIL - $1 (attendu '$3', obtenu '$2')"; fail=1; fi; }
ACCUEIL="set role authenticated; set request.jwt.sub='00000000-0000-0000-0000-00000000000b';"
COM="set role authenticated; set request.jwt.sub='00000000-0000-0000-0000-00000000000c';"

check "anon ne voit que les editions publiees" "$($P -c "set role anon; select count(*) from editions")" 1
check "anon ne voit aucun intervenant non publie" "$($P -c "set role anon; select count(*) from speakers")" 0
check "anon ne lit aucune inscription" "$($P -c "set role anon; select count(*) from registrations")" 0
check "anon ne peut pas valider un billet" "$($P -c "set role anon; select 1 from validate_ticket('tok-race')" 2>&1 | grep -c 'permission denied')" 1
check "communication ne peut pas valider un billet" "$($P -c "$COM select 1 from validate_ticket('tok-race')" 2>&1 | grep -c 'acces refuse')" 1
check "accueil ne lit pas directement les inscriptions" "$($P -c "$ACCUEIL select count(*) from registrations")" 0
check "accueil ne modifie pas le contenu" "$($P -c "$ACCUEIL insert into speakers (edition_id,name,role) select id,'X','Y' from editions limit 1" 2>&1 | grep -c 'row-level security')" 1

# 20 scans simultanes du meme billet : un seul doit etre valide.
for _ in $(seq 1 20); do $P -c "$ACCUEIL select outcome from validate_ticket('tok-race')" & done > /dev/null; wait
check "un seul scan valide sur 20 simultanes" "$($P -c "select count(*) from ticket_scans where outcome = 'valid'")" 1
check "19 scans refuses (deja utilise)" "$($P -c "select count(*) from ticket_scans where outcome = 'already_used'")" 19
check "billet annule refuse" "$($P -c "$ACCUEIL select outcome from validate_ticket('tok-cancel')")" cancelled
check "billet inconnu refuse" "$($P -c "$ACCUEIL select outcome from validate_ticket('inconnu')")" unknown

# ------------------------------------------------------------ inscriptions
SR="set role service_role;"
H1=$(printf '%064d' 1); H2=$(printf '%064d' 2); H3=$(printf '%064d' 3)
check "anon ne peut pas creer d'inscription" "$($P -c "set role anon; select create_registration(2026,'A','B','+22901000000','', 'Cotonou',1,'Autre','$H1')" 2>&1 | grep -c 'permission denied')" 1
check "inscription de 3 places -> 3 billets" "$($P -c "$SR select array_length(create_registration(2026,'Grâce','Exemple','+229 01 97 00 00 00','', 'Cotonou',3,'Autre','$H1'),1)")" 3
check "numero de billet au format CN-2026-000000" "$($P -c "select count(*) from tickets t join registrations r on r.id=t.registration_id where r.access_key_hash='$H1' and t.ticket_number ~ '^CN-2026-[0-9]{6}$'")" 3
check "lecture par cle : 3 billets" "$($P -c "$SR select json_array_length(get_registration_by_key('$H1')->'tickets')")" 3
check "lecture avec une mauvaise cle : rien" "$($P -c "$SR select coalesce(get_registration_by_key('$H2')::text,'null')")" null
check "nouvelle cle (telephone autre format, nom sans accent)" "$($P -c "$SR select rotate_registration_key(2026,'0197000000','exemple','$H2')")" t
check "l'ancienne cle ne fonctionne plus" "$($P -c "$SR select coalesce(get_registration_by_key('$H1')::text,'null')")" null
check "mauvais nom : pas de nouvelle cle" "$($P -c "$SR select rotate_registration_key(2026,'0197000000','Autre','$H3')")" f

# Capacite : 10 places restantes, 20 inscriptions simultanees d'une place.
$P -c "update editions set capacity = (select count(*) from tickets where status <> 'cancelled') + 10 where year = 2026"
for i in $(seq 1 20); do
  $P -c "$SR select create_registration(2026,'P','Course','+2290100000$i','','Cotonou',1,'Autre',lpad(to_hex(1000+$i),64,'0'))" >/dev/null 2>&1 &
done; wait
check "capacite respectee sous concurrence (0 place restante)" "$($P -c "select capacity - (select count(*) from tickets where status <> 'cancelled') from editions where year = 2026")" 0
check "10 inscriptions acceptees sur 20" "$($P -c "select count(*) from registrations where last_name = 'Course'")" 10
check "message de capacite atteinte" "$($P -c "$SR select create_registration(2026,'X','Y','+22901999999','','Cotonou',1,'Autre','$H3')" 2>&1 | grep -c 'capacite_atteinte:0')" 1

exit $fail
