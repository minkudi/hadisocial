// app/[locale]/layout.jsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { getEnabledLocales } from "../../lib/localesServer";
import AuthLanguageWrapper from "./AuthLanguageWrapper";

const locales = [
  "fr",
  "en",
  "de",
  "nl",
  "fi",
  "es",
  "pl",
  "pt",
  "sk",
  "bg",
  "el",
  "sl",
  "lt",
  "lv",
  "it",
  "cs",
];

export default async function LocaleLayout({ children, params }) {
  // ICI il faut bien await, comme le dit l’erreur
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  // Rediriger vers le français si la langue a été désactivée par le super admin
  const enabledLocales = await getEnabledLocales();
  if (!enabledLocales.includes(locale)) {
    redirect(`/${enabledLocales.includes("fr") ? "fr" : enabledLocales[0]}`);
  }

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthLanguageWrapper locale={locale} />
      {children}
    </NextIntlClientProvider>
  );
}
