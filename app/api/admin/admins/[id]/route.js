// API super admin : nommer / rétrograder un administrateur.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "../../../../../lib/db";

async function assertSuperAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const isAdmin = cookieStore.get("is_admin")?.value;
  const isSuperAdmin = cookieStore.get("is_super_admin")?.value;

  if (!userId || isAdmin !== "1" || isSuperAdmin !== "1") {
    return false;
  }
  return true;
}

export async function PATCH(req, { params }) {
  const ok = await assertSuperAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);

  if (!body || typeof body.isSuperAdmin !== "boolean") {
    return NextResponse.json(
      { error: "isSuperAdmin (boolean) is required" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const selfId = cookieStore.get("user_id")?.value;

  // On ne peut pas modifier son propre statut super admin (évite le blocage)
  if (String(id) === selfId) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas modifier votre propre statut" },
      { status: 400 }
    );
  }

  const db = await getDb();

  const [existing] = await db.execute(
    "SELECT id FROM users WHERE id = ? AND is_admin = 1 LIMIT 1",
    [id]
  );
  if (existing.length === 0) {
    await db.end();
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  await db.execute("UPDATE users SET is_super_admin = ? WHERE id = ?", [
    body.isSuperAdmin ? 1 : 0,
    id,
  ]);
  await db.end();

  return NextResponse.json({ success: true });
}
