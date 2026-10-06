// API super admin : liste et création des administrateurs.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "../../../../lib/db";

export async function assertSuperAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const isAdmin = cookieStore.get("is_admin")?.value;
  const isSuperAdmin = cookieStore.get("is_super_admin")?.value;

  if (!userId || isAdmin !== "1" || isSuperAdmin !== "1") {
    return false;
  }
  return true;
}

export async function GET() {
  const ok = await assertSuperAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = await getDb();
  const [rows] = await db.execute(
    `SELECT id, full_name, email, is_admin, is_super_admin, created_at
     FROM users
     WHERE is_admin = 1
     ORDER BY created_at DESC`
  );
  await db.end();

  return NextResponse.json({
    admins: rows.map((u) => ({
      id: u.id,
      fullName: u.full_name,
      email: u.email,
      isSuperAdmin: !!u.is_super_admin,
      createdAt: u.created_at,
    })),
  });
}

export async function POST(req) {
  const ok = await assertSuperAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const { fullName, email, password } = body || {};

  if (!fullName || !fullName.trim() || !email || !email.trim() || !password) {
    return NextResponse.json(
      { error: "fullName, email et password sont requis" },
      { status: 400 }
    );
  }

  const db = await getDb();

  // Email déjà utilisé ?
  const [existing] = await db.execute(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email.trim()]
  );
  if (existing.length > 0) {
    await db.end();
    return NextResponse.json(
      { error: "Cet email est déjà utilisé" },
      { status: 409 }
    );
  }

  const [result] = await db.execute(
    `INSERT INTO users (email, password, full_name, locale, is_admin, is_super_admin)
     VALUES (?, ?, ?, 'fr', 1, 0)`,
    [email.trim(), password, fullName.trim()]
  );

  const userId = result.insertId;
  const accountNumber = Date.now().toString();

  // Un compte est nécessaire pour que la connexion fonctionne
  await db.execute(
    `INSERT INTO accounts (user_id, account_number, balance, currency)
     VALUES (?, ?, 0, 'EUR')`,
    [userId, accountNumber]
  );

  await db.end();

  return NextResponse.json({ success: true, id: userId });
}
