// app/api/admin/users/[id]/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "../../../../../lib/db";

async function assertAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const isAdmin = cookieStore.get("is_admin")?.value;
  const isSuperAdmin = cookieStore.get("is_super_admin")?.value;
  if (!userId || isAdmin !== "1") return { ok: false };
  return { ok: true, isSuperAdmin: isSuperAdmin === "1", userId: Number(userId) };
}

export async function GET(_req, ctx) {
  const { ok } = await assertAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const userId = id;

  const db = await getDb();

  // User
  const [users] = await db.execute(
    `SELECT id, email, full_name, phone, country, gender, birth_date, is_admin, created_at
     FROM users WHERE id = ? LIMIT 1`,
    [userId]
  );

  if (!users.length) {
    await db.end();
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const u = users[0];

  // Accounts
  const [accounts] = await db.execute(
    `SELECT id, account_number, balance, currency, created_at
     FROM accounts WHERE user_id = ?`,
    [userId]
  );

  await db.end();

  return NextResponse.json({
    user: {
      id: u.id,
      email: u.email,
      fullName: u.full_name,
      phone: u.phone,
      country: u.country,
      gender: u.gender,
      birthDate: u.birth_date,
      isAdmin: !!u.is_admin,
      createdAt: u.created_at,
    },
    accounts: accounts.map((a) => ({
      id: a.id,
      accountNumber: a.account_number,
      balance: a.balance,
      currency: a.currency,
      createdAt: a.created_at,
    })),
    // pour l'instant on renvoie un tableau vide
    transactions: [],
  });
}

export async function PATCH(req, ctx) {
  const { ok } = await assertAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const userId = id;

  const body = await req.json().catch(() => ({}));

  const fields = [];
  const values = [];

  const mapping = {
    email: "email",
    fullName: "full_name",
    phone: "phone",
    country: "country",
    gender: "gender",
    birthDate: "birth_date",
  };

  Object.entries(mapping).forEach(([key, column]) => {
    if (body[key] !== undefined) {
      fields.push(`${column} = ?`);
      values.push(body[key]);
    }
  });

  if (!fields.length) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  const db = await getDb();

  try {
    values.push(userId);
    await db.execute(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ? LIMIT 1`,
      values
    );
    await db.end();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin update user error:", err);
    await db.end();
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, ctx) {
  const { ok, isSuperAdmin, userId: adminId } = await assertAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const targetId = Number(id);
  if (!Number.isFinite(targetId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  // Un admin ne peut jamais se supprimer lui-même.
  if (targetId === adminId) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas supprimer votre propre compte." },
      { status: 400 }
    );
  }

  const db = await getDb();

  // Cible existante ?
  const [rows] = await db.execute(
    "SELECT id, is_admin, is_super_admin FROM users WHERE id = ? LIMIT 1",
    [targetId]
  );
  if (rows.length === 0) {
    await db.end();
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const target = rows[0];

  // Un admin (non super) ne peut supprimer que des clients.
  if (!isSuperAdmin && Number(target.is_admin) === 1) {
    await db.end();
    return NextResponse.json(
      { error: "Seul le super admin peut supprimer un administrateur." },
      { status: 403 }
    );
  }

  // Le compte super admin n'est jamais supprimable.
  if (Number(target.is_super_admin) === 1) {
    await db.end();
    return NextResponse.json(
      { error: "Le compte super admin ne peut pas être supprimé." },
      { status: 403 }
    );
  }

  try {
    // Suppression en cascade : comptes, cartes, transactions… (FK ON DELETE CASCADE)
    await db.execute("DELETE FROM users WHERE id = ?", [targetId]);
    await db.end();
    return NextResponse.json({ ok: true, deletedId: targetId });
  } catch (err) {
    console.error("Admin delete user error:", err);
    await db.end();
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
