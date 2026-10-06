// API publique : langues activées (utilisée par le sélecteur de langue).
import { NextResponse } from "next/server";
import { getEnabledLocales } from "../../../lib/localesServer";
import { DEFAULT_LOCALE } from "../../../lib/availableLocales";

export async function GET() {
  const locales = await getEnabledLocales();
  return NextResponse.json({ locales, defaultLocale: DEFAULT_LOCALE });
}
