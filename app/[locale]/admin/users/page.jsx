"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function AdminUsersPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/users");
        if (res.status === 401 || res.status === 403) {
          router.push(`/${locale}/login`);
          return;
        }
        const json = await res.json();
        setUsers(json.users || []);
        setFiltered(json.users || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router, locale]);

  useEffect(() => {
    const q = search.toLowerCase().trim();
    if (!q) {
      setFiltered(users);
      return;
    }
    setFiltered(
      users.filter((u) => {
        return (
          (u.fullName || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q) ||
          (u.accountNumber || "").toLowerCase().includes(q)
        );
      })
    );
  }, [search, users]);

  function openUser(id) {
    router.push(`/${locale}/admin/users/${id}`);
  }

  async function confirmDelete() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/admin/users/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeleteError(json.error || "Erreur lors de la suppression.");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (e) {
      console.error(e);
      setDeleteError("Erreur réseau lors de la suppression.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {/* Header (le sidebar vient du layout admin) */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-rose-50 text-rose-500 inline-flex items-center justify-center">
            <UserGroupIcon className="h-4 w-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              Utilisateurs
            </span>
            <span className="text-xs text-slate-400">
              Gestion des comptes clients et des rôles.
            </span>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <div className="flex-1 px-4 lg:px-8 py-6 space-y-4">
        {/* Barre de recherche */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative w-full max-w-md">
            <MagnifyingGlassIcon className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email, compte…"
              className="w-full rounded-full border border-slate-200 pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 bg-white"
            />
          </div>
          <p className="text-xs text-slate-400">
            {filtered.length} utilisateur(s)
          </p>
        </div>

        {/* Tableau */}
        <div className="rounded-2xl bg-white border border-slate-100 px-4 py-4">
          {loading ? (
            <p className="text-xs text-slate-400">Chargement…</p>
          ) : filtered.length === 0 ? (
            <p className="text-xs text-slate-400">
              Aucun utilisateur trouvé.
            </p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] text-slate-400 border-b border-slate-100">
                    <th className="py-2 pr-4 font-medium">Utilisateur</th>
                    <th className="py-2 pr-4 font-medium">Contact</th>
                    <th className="py-2 pr-4 font-medium">Compte principal</th>
                    <th className="py-2 pr-4 font-medium text-right">Solde</th>
                    <th className="py-2 pr-4 font-medium">Rôle</th>
                    <th className="py-2 pl-4 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/80 cursor-pointer"
                      onClick={() => openUser(u.id)}
                    >
                      <td className="py-2 pr-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[11px] font-medium">
                            {u.fullName?.charAt(0) || "?"}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-slate-900">
                              {u.fullName || "—"}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              ID #{u.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-slate-500">
                            {u.email || "—"}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {u.phone || "—"}{" "}
                            {u.country ? `• ${u.country}` : ""}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap text-[11px] text-slate-500 font-mono">
                        {u.accountNumber || "—"}
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap text-right font-semibold text-slate-900">
                        {u.balance != null
                          ? `${Number(u.balance).toFixed(2)} EUR`
                          : "—"}
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            u.isAdmin
                              ? "bg-rose-50 text-rose-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {u.isAdmin ? "Admin" : "Client"}
                        </span>
                      </td>
<td className="py-2 pl-4 whitespace-nowrap text-right">
  <div className="inline-flex items-center gap-2">
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openUser(u.id);
      }}
      className="inline-flex items-center rounded-full bg-rose-500 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/60 focus:ring-offset-1"
    >
      Gérer
    </button>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openUser(u.id);
      }}
      className="hidden sm:inline-flex items-center rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-1"
    >
      Créditer
    </button>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setDeleteError("");
        setDeleteTarget(u);
      }}
      className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-medium text-rose-600 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-1"
    >
      Supp
    </button>
  </div>
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 animate-fade-in"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-slate-900 mb-2">
              Supprimer cet utilisateur ?
            </h2>
            <p className="text-sm text-slate-500 mb-1">
              Vous êtes sur le point de supprimer définitivement le compte de{" "}
              <span className="font-medium text-slate-700">
                {deleteTarget.fullName || deleteTarget.email}
              </span>{" "}
              (ID #{deleteTarget.id}
              {deleteTarget.accountNumber ? `, compte ${deleteTarget.accountNumber}` : ""}).
            </p>
            <p className="text-xs text-rose-500 mb-4">
              Cette action est irréversible : le solde, les cartes et l&apos;historique
              des transactions seront supprimés.
            </p>

            {deleteError && (
              <p className="mb-4 rounded-lg bg-rose-50 border border-rose-100 px-3 py-2 text-xs text-rose-600">
                {deleteError}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-medium text-white hover:bg-rose-700 disabled:opacity-60 cursor-pointer"
              >
                {deleting ? "Suppression…" : "Supprimer définitivement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
  