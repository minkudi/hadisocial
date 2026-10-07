"use client";

import { useEffect, useState } from "react";
import { BellAlertIcon, LanguageIcon } from "@heroicons/react/24/outline";
import { ALL_LOCALES, flagUrl } from "../../../../lib/availableLocales";

export default function SettingsClient({ isSuperAdmin, locale }) {
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [saving, setSaving] = useState(false);

  const [enabledLocales, setEnabledLocales] = useState([]);
  const [loadingLocales, setLoadingLocales] = useState(true);
  const [savingLocales, setSavingLocales] = useState(false);
  const [localesMsg, setLocalesMsg] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.status === 401 || res.status === 403) return;
        const json = await res.json();
        setSmsEnabled(json.smsEnabled);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSettings(false);
      }
    }
    load();

    if (isSuperAdmin) {
      async function loadLocales() {
        try {
          const res = await fetch("/api/admin/locales");
          if (res.ok) {
            const json = await res.json();
            setEnabledLocales(json.locales);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingLocales(false);
        }
      }
      loadLocales();
    }
  }, [isSuperAdmin]);

  async function toggleSms() {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smsEnabled: !smsEnabled }),
      });
      if (!res.ok) {
        console.error(await res.text());
        return;
      }
      setSmsEnabled((v) => !v);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  function toggleLocale(code) {
    if (code === "fr") return; // langue par défaut toujours active

    const next = enabledLocales.includes(code)
      ? enabledLocales.filter((c) => c !== code)
      : [...enabledLocales, code];

    // Le français doit toujours rester actif
    if (!next.includes("fr")) return;

    setEnabledLocales(next);
  }

  async function saveLocales() {
    setLocalesMsg(null);
    setSavingLocales(true);
    try {
      const res = await fetch("/api/admin/locales", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locales: enabledLocales }),
      });
      const json = await res.json();
      if (!res.ok) {
        setLocalesMsg({ type: "error", text: json.error || "Erreur" });
      } else {
        setLocalesMsg({
          type: "success",
          text: "Langues mises à jour. Visibles immédiatement dans l'application.",
        });
      }
    } catch (e) {
      setLocalesMsg({ type: "error", text: "Erreur réseau" });
    } finally {
      setSavingLocales(false);
    }
  }

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">
            Paramètres
          </span>
          <span className="text-xs text-slate-400">
            Configuration globale de la plateforme
          </span>
        </div>
      </header>

      <div className="flex-1 px-4 lg:px-8 py-6 space-y-6">
        {/* SMS */}
        <section className="rounded-2xl bg-white border border-slate-100 px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-rose-50 text-rose-500 inline-flex items-center justify-center">
                <BellAlertIcon className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Envoi des SMS transactionnels
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Active ou désactive l&apos;envoi des SMS lors des transactions
                  clients. S&apos;applique immédiatement à tous les comptes.
                </p>
              </div>
            </div>
            <button
              onClick={toggleSms}
              disabled={loadingSettings || saving}
              className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
                smsEnabled
                  ? "bg-emerald-500 border-emerald-500"
                  : "bg-slate-200 border-slate-300"
              } ${saving ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                  smsEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            État actuel :{" "}
            <span className={smsEnabled ? "text-emerald-600" : "text-red-500"}>
              {smsEnabled ? "SMS ACTIVÉS" : "SMS DÉSACTIVÉS"}
            </span>
          </p>
        </section>

        {/* Langues (super admin uniquement) */}
        {isSuperAdmin && (
          <section className="rounded-2xl bg-white border border-slate-100 px-5 py-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-rose-50 text-rose-500 inline-flex items-center justify-center">
                <LanguageIcon className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Langues de l&apos;application
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Activez les langues de votre choix. Le français, langue par
                  défaut, reste toujours actif.
                </p>
              </div>
            </div>

            {loadingLocales ? (
              <p className="text-xs text-slate-400">Chargement…</p>
            ) : (
              <>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {ALL_LOCALES.map((lang) => {
                    const enabled = enabledLocales.includes(lang.code);
                    const locked = lang.code === "fr";
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => toggleLocale(lang.code)}
                        disabled={locked}
                        className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                          enabled
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        } ${locked ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <img
                            src={flagUrl(lang.flagCode)}
                            alt={lang.label}
                            width="20"
                            height="15"
                            className="rounded-[2px] object-cover shrink-0"
                          />
                          <span className="truncate">{lang.label}</span>
                        </span>
                        <span
                          className={`ml-2 h-2.5 w-2.5 shrink-0 rounded-full ${
                            enabled ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {localesMsg && (
                  <p
                    className={`text-xs rounded-lg px-3 py-2 ${
                      localesMsg.type === "success"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {localesMsg.text}
                  </p>
                )}

                <button
                  type="button"
                  onClick={saveLocales}
                  disabled={savingLocales}
                  className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-60"
                >
                  {savingLocales ? "Enregistrement…" : "Enregistrer les langues"}
                </button>
              </>
            )}
          </section>
        )}
      </div>
    </>
  );
}
