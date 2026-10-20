// app/api/admin/users/[id]/debit/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "../../../../../../lib/db";
import {
  sendTransactionalEmail,
  sendTransactionalSMS,
} from "../../../../../../lib/notifications";
import { buildTransactionEmail } from "../../../../../../lib/transactionEmail";
import { buildDebitSms } from "../../../../../../lib/smsTemplates";


async function assertAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const isAdmin = cookieStore.get("is_admin")?.value;
  if (!userId || isAdmin !== "1") return false;
  return true;
}

export async function POST(req, ctx) {
  const ok = await assertAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params; // user id

  const body = await req.json().catch(() => null);
  if (!body || !body.amount) {
    return NextResponse.json({ error: "amount is required" }, { status: 400 });
  }

  const amount = Number(body.amount);
  const label = body.label || "Débit manuel admin";

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const db = await getDb();

  try {
    // compte principal du user
    const [accounts] = await db.execute(
      "SELECT id, balance, currency, account_number FROM accounts WHERE user_id = ? LIMIT 1",
      [id]
    );
    if (!accounts.length) {
      await db.end();
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    const row = accounts[0];
    const account = {
      id: row.id,
      balance: row.balance,
      currency: row.currency,
      accountNumber: row.account_number || row.id,
    };

    // infos user + langue
    const [users] = await db.execute(
      "SELECT full_name AS fullName, email, phone, locale FROM users WHERE id = ? LIMIT 1",
      [id]
    );
    const user = users[0] || {};
    const locale = (user.locale || "fr").toLowerCase();

    await db.beginTransaction();

    // débiter le compte (condition dans l'UPDATE pour éviter le découvert concurrent)
    const [debitResult] = await db.execute(
      "UPDATE accounts SET balance = balance - ? WHERE id = ? AND balance >= ?",
      [amount, account.id, amount]
    );
    if (!debitResult.affectedRows) {
      await db.rollback();
      await db.end();
      return NextResponse.json(
        { error: "Solde insuffisant pour ce débit." },
        { status: 400 }
      );
    }

    // enregistrer la transaction
    const [txResult] = await db.execute(
      `INSERT INTO transactions (account_id, amount, type, description, status)
       VALUES (?, ?, 'DEBIT', ?, 'COMPLETED')`,
      [account.id, amount, label]
    );
    const transactionId = txResult.insertId;
    const displayDate = new Date().toLocaleString(locale || "fr-FR", {
      timeZone: "Europe/Berlin",
    });

    await db.commit();
    try {
      await db.end();
    } catch {}

    // notifications après commit : jamais de mail pour une opération annulée
    try {
      if (user.email) {
        const { subject, text, html } = buildTransactionEmail({
          type: "DEBIT",
          locale, // langue du client
          fullName: user.fullName,
          email: user.email,
          accountNumber: account.accountNumber,
          amount,
          currency: account.currency,
          label,
          transactionId,
          createdAt: displayDate,
          senderName: user.fullName,
          senderAccount: account.accountNumber,
          beneficiaryName: "SCAP BEN",
          beneficiaryAccount: "-",
        });

        await sendTransactionalEmail({
          to: user.email,
          subject,
          html,
          text,
        });
      }

if (user.phone) {
  await sendTransactionalSMS({
    to: user.phone,
    body: buildDebitSms({
      locale,
      amount,
      currency: account.currency,
      accountNumber: account.accountNumber,
      transactionId,
    }),
  });
}

    } catch (notifyErr) {
      console.error("Debit notification error:", notifyErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin debit error:", err);
    try {
      await db.rollback();
    } catch {}
    try {
      await db.end();
    } catch {}
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
