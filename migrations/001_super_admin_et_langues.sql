-- ============================================================
-- Migration : super admin + gestion dynamique des langues
-- À exécuter une seule fois sur la base MySQL de l'application.
-- ============================================================

-- 1. Rôle super admin sur les utilisateurs
ALTER TABLE users
  ADD COLUMN is_super_admin TINYINT(1) NOT NULL DEFAULT 0;

-- 2. Langues activées (stockées en JSON dans la table settings)
--    État initial : français, anglais, slovaque, allemand
ALTER TABLE settings
  ADD COLUMN enabled_locales VARCHAR(255) NOT NULL DEFAULT '["fr","en","sk","de"]';

-- 3. Promouvoir le premier admin existant en super admin.
--    Remplacez <ID_ADMIN> par l'identifiant de votre premier admin :
-- UPDATE users SET is_super_admin = 1 WHERE id = <ID_ADMIN>;
