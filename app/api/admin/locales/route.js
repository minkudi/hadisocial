// API super admin : activer / désactiver des langues.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "../../../../lib/db";
import { ALL_LOCALES, DEFAULT_ENABLED_LOCALES } from "../../../../lib/availableLocales";

export async function GET() {
  const ok = await assertSuperAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = await getDb();
  const [rows] = await db.execute(
    "SELECT enabled_locales FROM settings WHERE id = 1 LIMIT 1"
  );
  await db.end();

  let locales = DEFAULT_ENABLED_LOCALES;
  if (rows.length && rows[0].enabled_locales) {
    try {
      const parsed = JSON.parse(rows[0].enabled_locales);
      if (Array.isArray(parsed) && parsed.length > 0) locales = parsed;
    } catch (_) {}
  }

  return NextResponse.json({ locales });
}

export async function PUT(req) {
  const ok = await assertSuperAdmin();
  if (!ok) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.locales)) {
    return NextResponse.json(
      { error: "locales (array) is required" },
      { status: 400 }
    );
  }

  const validCodes = ALL_LOCALES.map((l) => l.code);
  const locales = [...new Set(body.locales)];

  // Validation : uniquement des codes connus, et le français doit rester actif
  if (!locales.every((code) => validCodes.includes(code))) {
    return NextResponse.json({ error: "Invalid locale code" }, { status: 400 });
  }
  if (!locales.includes("fr")) {
    return NextResponse.json(
      { error: "La langue par défaut (français) doit rester active" },
      { status: 400 }
    );
  }

  const db = await getDb();
  await db.execute("UPDATE settings SET enabled_locales = ? WHERE id = 1", [
    JSON.stringify(locales),
  ]);
  await db.end();

  return NextResponse.json({ success: true, locales });
}

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
