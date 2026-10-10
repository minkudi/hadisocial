// Page d'accueil publique : One Page institutionnelle SCAP BEN
import Link from "next/link";
import LanguageSwitcher from "../components/LanguageSwitcher";
import Reveal from "../components/Reveal";
import ServicesCarousel from "../components/ServicesCarousel";
import { getHomeContent } from "../../lib/homeContent";
import {
  EyeIcon,
  CursorArrowRaysIcon,
  ArrowDownTrayIcon,
  LockClosedIcon,
  BellAlertIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

const PRODUCT_ICONS = [EyeIcon, CursorArrowRaysIcon, ArrowDownTrayIcon];

const SECURITY_ICONS = [
  LockClosedIcon,
  BellAlertIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
];

export default async function HomePage({ params }) {
  const { locale = "fr" } = await params;
  const c = getHomeContent(locale);
  const lang = (path) => `/${locale}${path}`;

  return (
    <div className="min-h-screen bg-white text-[#0B1B33]">
      {/* ===== NAV ===== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="SCAP BEN" className="h-9 w-9" />
            <span className="text-lg font-bold tracking-tight">SCAP BEN</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#services" className="hover:text-[#3C50E0]">{c.nav.services}</a>
            <a href="#security" className="hover:text-[#3C50E0]">{c.nav.security}</a>
            <a href="#faq" className="hover:text-[#3C50E0]">{c.nav.faq}</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher currentLocale={locale} />
            </div>
            <Link
              href={lang("/login")}
              className="text-sm font-medium text-gray-700 hover:text-[#3C50E0] px-3 py-2"
            >
              {c.nav.login}
            </Link>
            <Link
              href={lang("/register")}
              className="rounded-lg bg-[#3C50E0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2f42c9] transition"
            >
              {c.nav.openAccount}
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="animate-rise inline-block rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-gray-500 mb-6" style={{ animationDelay: "0ms" }}>
              {c.hero.badge}
            </p>
            <h1 className="animate-rise text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-5" style={{ animationDelay: "100ms" }}>
              {c.hero.title}
            </h1>
            <p className="animate-rise text-lg text-gray-600 leading-relaxed mb-8 max-w-lg" style={{ animationDelay: "200ms" }}>
              {c.hero.subtitle}
            </p>
            <div className="animate-rise flex flex-wrap gap-3 mb-10" style={{ animationDelay: "300ms" }}>
              <Link
                href={lang("/register")}
                className="rounded-lg bg-[#3C50E0] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2f42c9] hover:-translate-y-0.5 transition"
              >
                {c.hero.ctaPrimary}
              </Link>
              <Link
                href={lang("/login")}
                className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-800 hover:border-[#3C50E0] hover:text-[#3C50E0] transition"
              >
                {c.hero.ctaSecondary}
              </Link>
            </div>
            <ul className="animate-rise flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500" style={{ animationDelay: "400ms" }}>
              {[
                [c.hero.trust1, "M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z"],
                [c.hero.trust2, "M3 10h18M3 14h18M7 6h10a4 4 0 010 12H7A4 4 0 017 6z"],
                [c.hero.trust3, "M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z"],
              ].map(([label, d], i) => (
                <li key={i} className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-[#3C50E0]">
                    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative animate-rise" style={{ animationDelay: "250ms" }}>
            <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl border border-gray-200" aria-hidden="true" />
            <img
              src="/home-hero.jpg"
              alt={c.hero.photoAlt}
              className="relative rounded-2xl w-full h-[380px] object-cover hover:scale-[1.01] transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="border-b border-gray-100 bg-gray-50/60">
        <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {c.stats.map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-[#3C50E0]">{s.value}</p>
              <p className="mt-1 text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">{c.services.title}</h2>
            <p className="text-gray-600">{c.services.subtitle}</p>
          </div>
          <Reveal>
            <ServicesCarousel cards={c.services.cards} />
          </Reveal>
        </div>
      </section>

      {/* ===== PRODUIT ===== */}
      <section className="border-b border-gray-100 bg-gray-50/60">
        <Reveal className="mx-auto max-w-6xl px-6 py-20 grid lg:grid-cols-2 gap-14 items-center">
          <div className="order-2 lg:order-1">
            <img
              src="/dashboard-preview.svg"
              alt=""
              className="w-full rounded-2xl border border-gray-100"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold tracking-tight mb-3">{c.product.title}</h2>
            <p className="text-gray-600 mb-8">{c.product.subtitle}</p>
            <ul className="space-y-6">
              {c.product.bullets.map((b, i) => {
                const Icon = PRODUCT_ICONS[i % PRODUCT_ICONS.length];
                return (
                  <li key={i} className="flex gap-4">
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3C50E0]/10 text-[#3C50E0]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold">{b.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* ===== CARTE (section sombre) ===== */}
      <section className="bg-[#0B1B33] text-white">
        <Reveal className="mx-auto max-w-6xl px-6 py-20 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-3">{c.cardSection.title}</h2>
            <p className="text-gray-300 mb-8">{c.cardSection.subtitle}</p>
            <ul className="space-y-4">
              {c.cardSection.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-5 w-5 mt-0.5 shrink-0 text-[#8B9DF9]">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <img
              src="/bank-card.svg"
              alt={c.cardSection.title}
              className="animate-float w-full max-w-md rounded-2xl shadow-2xl shadow-black/40"
            />
          </div>
        </Reveal>
      </section>

      {/* ===== ACCOMPAGNEMENT ===== */}
      <section className="border-b border-gray-100">
        <Reveal className="mx-auto max-w-6xl px-6 py-20 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">{c.advisor.title}</h2>
            <p className="text-gray-600 leading-relaxed max-w-lg">{c.advisor.text}</p>
          </div>
          <img
            src="/home-advisor.jpg"
            alt={c.advisor.title}
            className="rounded-2xl w-full h-[320px] object-cover hover:scale-[1.01] transition-transform duration-500"
          />
        </Reveal>
      </section>

      {/* ===== SECURITE ===== */}
      <section id="security" className="border-b border-gray-100 bg-gray-50/60">
        <Reveal className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">{c.security.title}</h2>
            <p className="text-gray-600">{c.security.subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.security.items.map((item, i) => {
              const Icon = SECURITY_ICONS[i % SECURITY_ICONS.length];
              return (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 hover:-translate-y-1 hover:shadow-md transition">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B1B33] text-white mb-4">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-semibold mb-2 text-sm">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="border-b border-gray-100">
        <Reveal className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-3xl font-bold tracking-tight mb-10 text-center">{c.faq.title}</h2>
          <div className="divide-y divide-gray-200 rounded-xl border border-gray-200">
            {c.faq.items.map((item, i) => (
              <details key={i} className="group">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-sm font-semibold list-none">
                  {item.q}
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                  >
                    <path d="M5.3 7.3a1 1 0 011.4 0L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4z" />
                  </svg>
                </summary>
                <p className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="bg-[#3C50E0]">
        <Reveal className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-3">{c.cta.title}</h2>
          <p className="text-indigo-100 mb-8">{c.cta.subtitle}</p>
          <Link
            href={lang("/register")}
            className="inline-block rounded-lg bg-white px-8 py-3 text-sm font-semibold text-[#3C50E0] hover:bg-indigo-50 hover:-translate-y-0.5 transition"
          >
            {c.cta.button}
          </Link>
        </Reveal>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#0B1B33] text-gray-400">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <img src="/logo.svg" alt="SCAP BEN" className="h-8 w-8" />
                <span className="text-base font-bold text-white tracking-tight">SCAP BEN</span>
              </div>
              <p className="text-sm">contact@scap-ben.com</p>
              <p className="text-sm mt-4 text-gray-500">© {new Date().getFullYear()} SCAP BEN. {c.footer.rights}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-10">
              <nav className="flex flex-col gap-2 text-sm">
                <a href="#" className="hover:text-white">{c.footer.legal}</a>
                <a href="#" className="hover:text-white">{c.footer.privacy}</a>
                <a href="#" className="hover:text-white">{c.footer.terms}</a>
              </nav>
              <div>
                <LanguageSwitcher currentLocale={locale} direction="up" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
