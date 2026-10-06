"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useIbanValidation } from "../../../../lib/useIbanValidation";  
import { useTranslations } from "next-intl";

function SummaryModal({
  open,
  values,
  balance,
  onBack,
  onConfirm,
  loading,
  error,
}) {
  const t = useTranslations("transfer");

  if (!open) return null;

  const amountNumber = Number(values.amount || 0);
  const insufficient =
    isNaN(amountNumber) || amountNumber <= 0 || amountNumber > balance;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/75">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <p className="text-xs font-medium text-gray-700">
                {t("processing")}
              </p>
            </div>
          </div>
        )}

        <h2 className="mb-4 text-lg font-semibold">{t("summaryTitle")}</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">{t("holder")}</span>
            <span className="font-medium">{values.holder || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t("iban")}</span>
            <span className="font-medium break-all">
              {values.iban || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t("bic")}</span>
            <span className="font-medium">{values.bic || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t("bank")}</span>
            <span className="font-medium">{values.bankName || "—"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">{t("amount")}</span>
            <span className="font-medium">
              {values.amount ? `${values.amount} EUR` : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t("reason")}</span>
            <span className="font-medium">{values.reason || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t("country")}</span>
            <span className="font-medium">{values.country || "—"}</span>
          </div>
          <div className="mt-3 border-t pt-3 text-xs text-gray-500">
            {t("availableBalance")}:{" "}
            <span className="font-semibold text-gray-800">
              {balance.toFixed(2)} EUR
            </span>
          </div>
          {insufficient && (
            <p className="mt-2 text-xs text-red-600">
              {t("insufficientBalance")}
            </p>
          )}
          {error && (
            <p className="mt-2 text-xs text-red-600">{error}</p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            {t("back")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading || insufficient}
            className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600 active:bg-rose-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          >
            {loading ? t("validating") : t("confirmButton")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TransferPage() {
  const t = useTranslations("transfer");
  const params = useParams();
  const locale = params.locale || "fr";
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState("EUR");

  const [values, setValues] = useState({
    holder: "",
    iban: "",
    bic: "",
    amount: "",
    reason: "",
    country: "",
    bankName: "",
  });

  const [showSummary, setShowSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { status: ibanStatus, bankData } = useIbanValidation(values.iban);

  useEffect(() => {
    if (ibanStatus !== "valid" || !bankData) return;

    setValues((prev) => {
      const next = { ...prev };

      if (!prev.bic && bankData.bic) {
        next.bic = bankData.bic;
      }

      if (!prev.bankName && bankData.name) {
        next.bankName = bankData.name;
      }

      return next;
    });
  }, [ibanStatus, bankData]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) return;
        const data = await res.json();
        setBalance(Number(data.account.balance) || 0);
        setCurrency(data.account.currency || "EUR");
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (
      !values.holder ||
      !values.iban ||
      !values.bic ||
      !values.amount ||
      !values.country ||
      !values.bankName
    ) {
      setFormError(t("errorRequiredFields"));
      return;
    }

    const amountNumber = Number(values.amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setFormError(t("errorPositiveAmount"));
      return;
    }

    if (amountNumber > balance) {
      setFormError(t("errorInsufficient"));
      return;
    }

    setShowSummary(true);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setModalError(null);

    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || data?.message || t("errorUnknown")
        );
      }

      if (typeof data.newBalance === "number") {
        setBalance(data.newBalance);
      }

      setShowSummary(false);
      setSuccessMessage(data?.message || t("successMessage"));
      setValues({
        holder: "",
        iban: "",
        bic: "",
        amount: "",
        reason: "",
        country: "",
        bankName: "",
      });

      setTimeout(() => {
        window.location.href = `/${locale}/dashboard`;
      }, 1000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("errorNetwork");
      setModalError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header className="py-2">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {t("description")}
        </p>
        <p className="mt-2 text-xs text-gray-500">
          {t("availableBalance")}:{" "}
          <span className="font-semibold text-gray-800">
            {balance.toFixed(2)} {currency}
          </span>
        </p>
      </header>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl bg-white p-6 shadow-sm"
      >
        {formError && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {formError}
          </p>
        )}
        {successMessage && (
          <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
            {successMessage}
          </p>
        )}

        <div className="space-y-4">
          {/* Titulaire */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              {t("holder")}
            </label>
            <input
              type="text"
              value={values.holder}
              onChange={handleChange("holder")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
              placeholder=""
            />
          </div>

          {/* IBAN */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              {t("iban")}
            </label>
            <div className="relative">
              <input
                type="text"
                value={values.iban}
                onChange={handleChange("iban")}
                className={`w-full rounded-lg border px-3 py-2 pr-9 text-sm outline-none transition-colors
                  ${
                    ibanStatus === "valid"
                      ? "border-green-500 focus:border-green-500"
                      : ""
                  }
                  ${
                    ibanStatus === "invalid"
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                  ${
                    ibanStatus === "idle" || ibanStatus === "checking"
                      ? "border-gray-200 focus:border-black"
                      : ""
                  }
                `}
                placeholder="."
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-base">
                {ibanStatus === "checking" && (
                  <svg
                    className="h-4 w-4 animate-spin text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                )}
                {ibanStatus === "valid" && (
                  <span className="text-green-500">✅</span>
                )}
                {ibanStatus === "invalid" && (
                  <span className="text-red-500">✗</span>
                )}
              </span>
            </div>
            {ibanStatus === "invalid" && (
              <p className="mt-1 text-xs text-red-600">{t("ibanInvalid")}</p>
            )}
          </div>

          {/* BIC */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              {t("bic")}
            </label>
            <input
              type="text"
              value={values.bic}
              onChange={handleChange("bic")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
              placeholder=""
            />
          </div>

          {/* Bank name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              {t("bank")}
            </label>
            <input
              type="text"
              value={values.bankName}
              onChange={handleChange("bankName")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
              placeholder=""
            />
          </div>

          {/* Montant */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              {t("amount")}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={values.amount}
              onChange={handleChange("amount")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
              placeholder="0.00"
            />
          </div>

          {/* Motif */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              {t("reason")}
            </label>
            <input
              type="text"
              value={values.reason}
              onChange={handleChange("reason")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
              placeholder=""
            />
          </div>

          {/* Pays */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              {t("country")}
            </label>
            <input
              type="text"
              value={values.country}
              onChange={handleChange("country")}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
              placeholder=""
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={ibanStatus !== "valid"}
            className={`inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
              ${
                ibanStatus === "valid"
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {t("continue")}
          </button>
        </div>
      </form>

      <SummaryModal
        open={showSummary}
        values={values}
        balance={balance}
        onBack={() => setShowSummary(false)}
        onConfirm={handleConfirm}
        loading={submitting}
        error={modalError}
      />
    </main>
  );
}
