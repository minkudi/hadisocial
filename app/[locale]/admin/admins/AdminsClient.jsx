"use client";

import { useEffect, useState } from "react";
import { ShieldCheckIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function AdminsClient({ selfId }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/admin/admins");
      if (res.status === 403) return;
      const json = await res.json();
      setAdmins(json.admins || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createAdmin(e) {
    e.preventDefault();
    setFormError("");
    setCreating(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setFormError(json.error || "Erreur");
      } else {
        setForm({ fullName: "", email: "", password: "" });
        setShowForm(false);
        setActionMsg({ type: "success", text: "Administrateur créé." });
        await load();
      }
    } catch (e) {
      setFormError("Erreur réseau");
    } finally {
      setCreating(false);
    }
  }

  async function toggleSuperAdmin(admin) {
    setActionMsg(null);
    try {
      const res = await fetch(`/api/admin/admins/${admin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSuperAdmin: !admin.isSuperAdmin }),
      });
      const json = await res.json();
      if (!res.ok) {
        setActionMsg({ type: "error", text: json.error || "Erreur" });
      } else {
        setActionMsg({
          type: "success",
          text: admin.isSuperAdmin
            ? `${admin.fullName} a été rétrogradé.`
            : `${admin.fullName} a été nommé super admin.`,
        });
        await load();
      }
    } catch (e) {
      setActionMsg({ type: "error", text: "Erreur réseau" });
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100";

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">
            Administrateurs
          </span>
          <span className="text-xs text-slate-400">
            Ajoutez et nommez les administrateurs de la plateforme
          </span>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
        >
          <PlusIcon className="h-4 w-4" />
          Ajouter un admin
        </button>
      </header>

      <div className="flex-1 px-4 lg:px-8 py-6 space-y-6">
        {actionMsg && (
          <p
            className={`text-xs rounded-lg px-3 py-2 ${
              actionMsg.type === "success"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {actionMsg.text}
          </p>
        )}

        {showForm && (
          <section className="rounded-2xl bg-white border border-slate-100 px-5 py-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Nouvel administrateur
            </h2>
            <form onSubmit={createAdmin} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
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
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {formError && (
                <p className="text-xs rounded-lg px-3 py-2 bg-red-50 text-red-600">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-60"
              >
                {creating ? "Création…" : "Créer l'administrateur"}
              </button>
            </form>
          </section>
        )}

        <section className="rounded-2xl bg-white border border-slate-100 px-5 py-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-8 w-8 rounded-full bg-rose-50 text-rose-500 inline-flex items-center justify-center">
              <ShieldCheckIcon className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-semibold text-slate-900">
              Liste des administrateurs
            </h2>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400">Chargement…</p>
          ) : admins.length === 0 ? (
            <p className="text-xs text-slate-400">Aucun administrateur.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 uppercase tracking-wide">
                    <th className="pb-3 pr-4">Nom</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">Rôle</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td className="py-3 pr-4 font-medium text-slate-900">
                        {admin.fullName}
                        {Number(admin.id) === Number(selfId) && (
                          <span className="ml-2 text-[10px] uppercase text-slate-400">
                            (vous)
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-slate-600">{admin.email}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                            admin.isSuperAdmin
                              ? "bg-rose-50 text-rose-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {admin.isSuperAdmin ? "Super admin" : "Admin"}
                        </span>
                      </td>
                      <td className="py-3">
                        {Number(admin.id) === Number(selfId) ? (
                          <span className="text-xs text-slate-400">—</span>
                        ) : (
                          <button
                            onClick={() => toggleSuperAdmin(admin)}
                            className="text-xs font-medium text-rose-600 hover:text-rose-700"
                          >
                            {admin.isSuperAdmin ? "Rétrograder" : "Nommer super admin"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
