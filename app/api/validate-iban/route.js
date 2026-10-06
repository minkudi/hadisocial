import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const iban = searchParams.get("iban")?.replace(/\s/g, "").toUpperCase();

  if (!iban || iban.length < 15) {
    return NextResponse.json(
      { valid: false, bankData: null },
      { status: 200 }
    );
  }

  try {
    const res = await fetch(
      `https://openiban.com/validate/${iban}?getBIC=true&validateBankCode=true`
    );
    const data = await res.json();

    return NextResponse.json(
      {
        valid: data.valid === true,
        bankData: data.bankData || null,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("IBAN validation error:", e);
    return NextResponse.json(
      { valid: false, bankData: null },
      { status: 200 }
    );
  }
}
