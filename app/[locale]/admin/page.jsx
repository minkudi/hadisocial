"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { UserCircleIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function AdminProfilePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/profile");
        if (res.status === 401) {
          router.push(`/${locale}/login`);
          return;
        }
        const json = await res.json();
        setProfile({
          fullName: json.user.fullName || "",
          email: json.user.email || "",
          phone: json.user.phone || "",
          address: json.user.address || "",
          country: json.user.country || "",
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingProfile(false);
      }
    }
    load();
  }, [router, locale]);

  async function saveProfile(e) {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const json = await res.json();
      if (!res.ok) {
        setProfileMsg({ type: "error", text: json.error || "Erreur" });
      } else {
        setProfileMsg({ type: "success", text: "Profil mis à jour." });
      }
    } catch (e) {
      setProfileMsg({ type: "error", text: "Erreur réseau" });
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    setPwdMsg(null);

    if (pwd.newPassword !== pwd.confirm) {
      setPwdMsg({ type: "error", text: "Les mots de passe ne correspondent pas." });
      return;
    }

    setSavingPwd(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: pwd.currentPassword,
          newPassword: pwd.newPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setPwdMsg({ type: "error", text: json.error || "Erreur" });
      } else {
        setPwdMsg({ type: "success", text: "Mot de passe modifié." });
        setPwd({ currentPassword: "", newPassword: "", confirm: "" });
      }
    } catch (e) {
      setPwdMsg({ type: "error", text: "Erreur réseau" });
    } finally {
      setSavingPwd(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100";

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">
            Mon profil
          </span>
          <span className="text-xs text-slate-400">
            Gérez vos informations personnelles et votre mot de passe
          </span>
        </div>
      </header>

      <div className="flex-1 px-4 lg:px-8 py-6 space-y-6">
        {/* Profil */}
        <section className="rounded-2xl bg-white border border-slate-100 px-5 py-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-full bg-rose-50 text-rose-500 inline-flex items-center justify-center">
              <UserCircleIcon className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-semibold text-slate-900">
              Informations personnelles
            </h2>
          </div>

          {loadingProfile ? (
            <p className="text-xs text-slate-400">Chargement…</p>
          ) : (
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Pays
                  </label>
                  <input
                    type="text"
                    value={profile.country}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              {profileMsg && (
                <p
                  className={`text-xs rounded-lg px-3 py-2 ${
                    profileMsg.type === "success"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {profileMsg.text}
                </p>
              )}

              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-60"
              >
                {savingProfile ? "Enregistrement…" : "Enregistrer"}
              </button>
            </form>
          )}
        </section>

        {/* Mot de passe */}
        <section className="rounded-2xl bg-white border border-slate-100 px-5 py-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-full bg-rose-50 text-rose-500 inline-flex items-center justify-center">
              <LockClosedIcon className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-semibold text-slate-900">
              Changer le mot de passe
            </h2>
          </div>

          <form onSubmit={savePassword} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={pwd.currentPassword}
                  onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={pwd.newPassword}
                  onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Confirmer
                </label>
                <input
                  type="password"
                  value={pwd.confirm}
                  onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {pwdMsg && (
              <p
                className={`text-xs rounded-lg px-3 py-2 ${
                  pwdMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {pwdMsg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={savingPwd}
              className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-60"
            >
              {savingPwd ? "Modification…" : "Modifier le mot de passe"}
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
