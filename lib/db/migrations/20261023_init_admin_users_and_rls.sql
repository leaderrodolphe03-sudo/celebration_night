-- Migration : 20261023_init_admin_users_and_rls.sql
-- Description : Création de la table admin_users, activation du RLS sur toutes les tables
--               et restriction stricte aux requêtes via service_role.

-- 1. Table des utilisateurs administratifs et staff terrain
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'STAFF')) DEFAULT 'STAFF',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index pour accélérer les vérifications de connexion insensibles à la casse
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON public.admin_users (LOWER(username));
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users (LOWER(email));

-- 2. Activation du Row Level Security (RLS) sur toutes les tables
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Nettoyage des anciennes politiques sur ces tables
DROP POLICY IF EXISTS "Service role full access on admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Deny anon on admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Service role full access on participants" ON public.participants;
DROP POLICY IF EXISTS "Service role full access on tickets" ON public.tickets;
DROP POLICY IF EXISTS "Service role full access on contact_messages" ON public.contact_messages;

-- 4. Politiques de sécurité RLS hermétiques :
-- Seul le serveur Next.js via 'service_role' a tous les droits.
-- Toute tentative anonyme directe ('anon') est automatiquement bloquée par PostgreSQL.
CREATE POLICY "Service role full access on admin_users" 
  ON public.admin_users 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Service role full access on participants" 
  ON public.participants 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Service role full access on tickets" 
  ON public.tickets 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Service role full access on contact_messages" 
  ON public.contact_messages 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);
