// app/api/bin-lookup/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const bin = searchParams.get("bin")?.replace(/\s/g, "");

  if (!bin || bin.length < 6) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  try {
    const res = await fetch(`https://lookup.binlist.net/${bin}`, {
      headers: { "Accept-Version": "3" },
    });

    if (!res.ok) {
      console.error("BINLIST error HTTP", res.status);
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    const data = await res.json();
    // structure typique: { scheme: "visa", type: "debit", brand: "Visa Debit", country: {...}, bank: {...} } [web:25][web:62]

    return NextResponse.json({
      ok: true,
      scheme: data.scheme || null,
      type: data.type || null,
      brand: data.brand || null,
      country: data.country?.name || null,
      bank: data.bank?.name || null,
    });
  } catch (e) {
    console.error("BINLIST fetch error", e);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
