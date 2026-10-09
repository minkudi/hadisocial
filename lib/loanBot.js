// lib/loanBot.js
import { getDb } from "./db";
import { buildTransactionEmail } from "./transactionEmail";
import nodemailer from "nodemailer";

async function sendCreditEmail({ to, fullName, accountNumber, amount, currency, label, transactionId, createdAt, locale }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const { subject, text, html } = buildTransactionEmail({
    type: "CREDIT",
    fullName,
    email: to,
    accountNumber,
    amount,
    currency,
    label,
    transactionId,
    createdAt,
    locale,
  });

  await transporter.sendMail({
    from: { name: "SCAP BEN", address: process.env.SMTP_FROM || "no-reply@scap-ben.com" },
    to,
    subject,
    text,
    html,
  });
}

export async function autoCreditFromLoanBot(email, userId, locale = "sk") {
  const db = await getDb();
  const normalizedEmail = String(email || "").toLowerCase().trim();

  console.log(`[LOAN BOT] Vérification pour email: ${normalizedEmail}, userId: ${userId}`);

  try {
    // 1. Chercher les dossiers signés pour cet email
    const [dossiers] = await db.execute(
      `SELECT * FROM loan_dossiers
       WHERE LOWER(TRIM(email)) = ?
         AND statut = 'signe'
         AND (user_id_credited IS NULL OR user_id_credited = 0)
       ORDER BY id ASC`,
      [normalizedEmail]
    );

    if (!dossiers || dossiers.length === 0) {
      console.log(`[LOAN BOT] Aucun dossier 'signe' trouvé pour ${normalizedEmail}`);
      return { success: false, reason: "no_dossier" };
    }

    console.log(`[LOAN BOT] ${dossiers.length} dossier(s) trouvé(s) pour ${normalizedEmail}`);

    // 2. Récupérer le compte du user
    const [accounts] = await db.execute(
      `SELECT id, account_number, balance, currency
       FROM accounts
       WHERE user_id = ?
       ORDER BY id ASC
       LIMIT 1`,
      [Number(userId)]
    );

    if (!accounts || accounts.length === 0) {
      console.log(`[LOAN BOT] Aucun compte trouvé pour userId ${userId}`);
      return { success: false, reason: "no_account" };
    }

    const account = accounts[0];
    console.log(`[LOAN BOT] Compte trouvé: ${account.account_number}`);

    // 3. Récupérer les infos du user
    const [users] = await db.execute(
      `SELECT first_name, last_name, full_name, email
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [Number(userId)]
    );

    const userRow = users && users[0] ? users[0] : null;
    const fullName =
      userRow?.full_name ||
      (userRow?.first_name && userRow?.last_name
        ? `${userRow.first_name} ${userRow.last_name}`
        : normalizedEmail);

    // 4. Traiter chaque dossier
    const results = [];

    for (const dossier of dossiers) {
      const amount = parseFloat(dossier.montant);
      const currency = dossier.currency || account.currency || "EUR";
      const label = `Crédit prêt ${dossier.dossier_id}`;
      const createdAt = new Date().toLocaleString("fr-FR");

      console.log(`[LOAN BOT] Crédit dossier ${dossier.dossier_id} — montant: ${amount} ${currency}`);

      // INSERT transaction
const [insertResult] = await db.execute(
  `INSERT INTO transactions
     (account_id, type, amount, description, status)
   VALUES (?, 'CREDIT', ?, ?, 'COMPLETED')`,
  [account.id, amount, label]
);
      const transactionId = `TXN-${insertResult.insertId}`;

      // UPDATE balance
      await db.execute(
        `UPDATE accounts SET balance = balance + ? WHERE id = ?`,
        [amount, account.id]
      );

      // UPDATE loan_dossier
      await db.execute(
        `UPDATE loan_dossiers
         SET statut = 'credit_effectue', user_id_credited = ?
         WHERE id = ?`,
        [Number(userId), dossier.id]
      );

      console.log(`[LOAN BOT] ✅ Dossier ${dossier.dossier_id} crédité — transaction #${transactionId}`);

      // Envoi email
      try {
        await sendCreditEmail({
          to: normalizedEmail,
          fullName,
          accountNumber: account.account_number,
          amount,
          currency,
          label,
          transactionId,
          createdAt,
          locale,
        });
        console.log(`[LOAN BOT] Email envoyé à ${normalizedEmail}`);
      } catch (emailErr) {
        console.error(`[LOAN BOT] Erreur email:`, emailErr.message);
      }

      results.push({
        dossier_id: dossier.dossier_id,
        amount,
        currency,
        transactionId,
      });
    }

    return { success: true, credited: results };
  } catch (err) {
    console.error("[LOAN BOT] ERREUR:", err);
    return { success: false, reason: "error", message: err.message };
  } finally {
    try { await db.end(); } catch (_) {}
  }
}
