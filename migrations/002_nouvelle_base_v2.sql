-- ============================================================
-- bk-ebanking-v2 : création de la nouvelle base (structure + données de test)
--
-- À exécuter UNE FOIS sur le serveur MySQL/MariaDB de la v2 :
--   1. Créez une base vide (ex: bk_ebanking_v2) via phpMyAdmin/cPanel
--   2. Sélectionnez-la, puis exécutez ce script entier
--
-- Contient :
--   - La structure complète (identique à l'ancienne base)
--   - Les colonnes v2 : users.is_super_admin, settings.enabled_locales
--   - La ligne de réglages initiale (langues activées : fr, en, sk, de)
--   - 3 comptes de test fictifs (1 super admin, 1 admin, 1 client)
--
-- ⚠️ AUCUNE donnée réelle ici : uniquement des comptes de test.
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- ------------------------------------------------------------
-- Table users (+ colonne v2 is_super_admin)
-- ------------------------------------------------------------
CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `full_name` varchar(191) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `address` varchar(255) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `is_super_admin` tinyint(1) NOT NULL DEFAULT 0,
  `locale` varchar(5) NOT NULL DEFAULT 'fr'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- Table accounts
-- ------------------------------------------------------------
CREATE TABLE `accounts` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `account_number` varchar(34) NOT NULL,
  `balance` decimal(18,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(10) NOT NULL DEFAULT 'EUR',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- Table cards
-- ------------------------------------------------------------
CREATE TABLE `cards` (
  `id` int(10) UNSIGNED NOT NULL,
  `account_id` int(10) UNSIGNED NOT NULL,
  `card_number` varchar(19) NOT NULL,
  `expiry_date` varchar(5) NOT NULL,
  `cvv` varchar(3) NOT NULL,
  `cardholder_name` varchar(191) NOT NULL,
  `status` enum('ACTIVE','FROZEN','DELETED') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- Table transactions
-- ------------------------------------------------------------
CREATE TABLE `transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `account_id` int(10) UNSIGNED NOT NULL,
  `type` enum('DEBIT','CREDIT') NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `counterparty_iban` varchar(34) DEFAULT NULL,
  `counterparty_name` varchar(191) DEFAULT NULL,
  `status` enum('COMPLETED','FAILED') NOT NULL DEFAULT 'COMPLETED',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- Table pending_transactions
-- ------------------------------------------------------------
CREATE TABLE `pending_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `account_id` int(10) UNSIGNED NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `bank_name` varchar(191) NOT NULL,
  `iban` varchar(34) NOT NULL,
  `country` varchar(100) NOT NULL,
  `beneficiary_name` varchar(191) NOT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `status` enum('PENDING','COMPLETED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `email_sent` tinyint(1) NOT NULL DEFAULT 0,
  `sms_sent` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- Table loan_dossiers
-- ------------------------------------------------------------
CREATE TABLE `loan_dossiers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(191) NOT NULL,
  `dossier_id` varchar(50) NOT NULL,
  `montant` decimal(18,2) NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'EUR',
  `statut` enum('contrat_envoye','signe','credit_effectue') NOT NULL DEFAULT 'contrat_envoye',
  `user_id_credited` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table settings (+ colonne v2 enabled_locales)
-- ------------------------------------------------------------
CREATE TABLE `settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `sms_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `enabled_locales` varchar(255) NOT NULL DEFAULT '["fr","en","sk","de"]',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- Index et clés primaires
-- ------------------------------------------------------------
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `account_number` (`account_number`),
  ADD KEY `fk_accounts_user` (`user_id`);

ALTER TABLE `cards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cards_account` (`account_id`);

ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_transactions_account` (`account_id`);

ALTER TABLE `pending_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pending_account` (`account_id`);

ALTER TABLE `loan_dossiers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_dossier_id` (`dossier_id`),
  ADD KEY `idx_email_statut` (`email`,`statut`),
  ADD KEY `idx_user_credited` (`user_id_credited`);

ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

-- ------------------------------------------------------------
-- AUTO_INCREMENT
-- ------------------------------------------------------------
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `accounts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `cards`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `pending_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `loan_dossiers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

-- ------------------------------------------------------------
-- Contraintes de clés étrangères
-- ------------------------------------------------------------
ALTER TABLE `accounts`
  ADD CONSTRAINT `fk_accounts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `cards`
  ADD CONSTRAINT `fk_cards_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE;

ALTER TABLE `transactions`
  ADD CONSTRAINT `fk_transactions_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE;

ALTER TABLE `pending_transactions`
  ADD CONSTRAINT `fk_pending_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE;

-- ------------------------------------------------------------
-- Réglages initiaux
-- ------------------------------------------------------------
INSERT INTO `settings` (`id`, `sms_enabled`, `enabled_locales`) VALUES
  (1, 1, '["fr","en","sk","de"]');

-- ------------------------------------------------------------
-- Comptes de test fictifs (mots de passe en clair, comme l'app actuelle)
-- ⚠️ À SUPPRIMER avant toute mise en production réelle.
-- ------------------------------------------------------------
INSERT INTO `users` (`id`, `email`, `password`, `full_name`, `is_admin`, `is_super_admin`, `country`, `locale`) VALUES
  (1, 'superadmin@test-bk.local', 'SuperAdmin2026!', 'Super Admin Test', 1, 1, 'France', 'fr'),
  (2, 'admin@test-bk.local',      'AdminTest2026!',  'Admin Test',      1, 0, 'France', 'fr'),
  (3, 'marie.dupont@test-bk.local', 'ClientTest2026!', 'Marie Dupont',  0, 0, 'France', 'fr');

INSERT INTO `accounts` (`id`, `user_id`, `account_number`, `balance`, `currency`) VALUES
  (1, 1, '1000000001', 0.00, 'EUR'),
  (2, 2, '1000000002', 0.00, 'EUR'),
  (3, 3, '1000000003', 2500.00, 'EUR');

COMMIT;
