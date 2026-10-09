// lib/smsTemplates.js

export function buildDebitSms({ locale, amount, currency, accountNumber, transactionId }) {
  const amt = Number(amount).toFixed(2);
  const ref = transactionId;
  const acct = accountNumber;

  const templates = {
    fr: `[SCAP BEN] Debit: -${amt} ${currency} | Cpte: ${acct} | Ref: ${ref}`,
    en: `[SCAP BEN] Debit: -${amt} ${currency} | Acct: ${acct} | Ref: ${ref}`,
    de: `[SCAP BEN] Lastschrift: -${amt} ${currency} | Kto: ${acct} | Ref: ${ref}`,
    nl: `[SCAP BEN] Debet: -${amt} ${currency} | Rek: ${acct} | Ref: ${ref}`,
    fi: `[SCAP BEN] Debet: -${amt} ${currency} | Tili: ${acct} | Ref: ${ref}`,
    es: `[SCAP BEN] Debito: -${amt} ${currency} | Cta: ${acct} | Ref: ${ref}`,
    pt: `[SCAP BEN] Debito: -${amt} ${currency} | Cta: ${acct} | Ref: ${ref}`,
    pl: `[SCAP BEN] Debet: -${amt} ${currency} | Kto: ${acct} | Ref: ${ref}`,
    sk: `[SCAP BEN] Debet: -${amt} ${currency} | Ucet: ${acct} | Ref: ${ref}`,
    bg: `[SCAP BEN] Debit: -${amt} ${currency} | Smt: ${acct} | Ref: ${ref}`,
    el: `[SCAP BEN] Xrewsh: -${amt} ${currency} | Log: ${acct} | Ref: ${ref}`,
    sl: `[SCAP BEN] Bremenitev: -${amt} ${currency} | Racun: ${acct} | Ref: ${ref}`,
    lt: `[SCAP BEN] Debetas: -${amt} ${currency} | Sask: ${acct} | Ref: ${ref}`,
    lv: `[SCAP BEN] Debets: -${amt} ${currency} | Konts: ${acct} | Ref: ${ref}`,
    it: `[SCAP BEN] Addebito: -${amt} ${currency} | Conto: ${acct} | Ref: ${ref}`,
    cs: `[SCAP BEN] Debet: -${amt} ${currency} | Ucet: ${acct} | Ref: ${ref}`,
  };

  return templates[locale] || templates.fr;
}

export function buildCreditSms({ locale, amount, currency, accountNumber, transactionId }) {
  const amt = Number(amount).toFixed(2);
  const ref = transactionId;
  const acct = accountNumber;

  const templates = {
    fr: `[SCAP BEN] Credit: +${amt} ${currency} | Cpte: ${acct} | Ref: ${ref}`,
    en: `[SCAP BEN] Credit: +${amt} ${currency} | Acct: ${acct} | Ref: ${ref}`,
    de: `[SCAP BEN] Gutschrift: +${amt} ${currency} | Kto: ${acct} | Ref: ${ref}`,
    nl: `[SCAP BEN] Credit: +${amt} ${currency} | Rek: ${acct} | Ref: ${ref}`,
    fi: `[SCAP BEN] Krediitti: +${amt} ${currency} | Tili: ${acct} | Ref: ${ref}`,
    es: `[SCAP BEN] Credito: +${amt} ${currency} | Cta: ${acct} | Ref: ${ref}`,
    pt: `[SCAP BEN] Credito: +${amt} ${currency} | Cta: ${acct} | Ref: ${ref}`,
    pl: `[SCAP BEN] Uznanie: +${amt} ${currency} | Kto: ${acct} | Ref: ${ref}`,
    sk: `[SCAP BEN] Kredit: +${amt} ${currency} | Ucet: ${acct} | Ref: ${ref}`,
    bg: `[SCAP BEN] Kredit: +${amt} ${currency} | Smt: ${acct} | Ref: ${ref}`,
    el: `[SCAP BEN] Pistwsh: +${amt} ${currency} | Log: ${acct} | Ref: ${ref}`,
    sl: `[SCAP BEN] Dobropis: +${amt} ${currency} | Racun: ${acct} | Ref: ${ref}`,
    lt: `[SCAP BEN] Kreditas: +${amt} ${currency} | Sask: ${acct} | Ref: ${ref}`,
    lv: `[SCAP BEN] Kredits: +${amt} ${currency} | Konts: ${acct} | Ref: ${ref}`,
    it: `[SCAP BEN] Accredito: +${amt} ${currency} | Conto: ${acct} | Ref: ${ref}`,
    cs: `[SCAP BEN] Kredit: +${amt} ${currency} | Ucet: ${acct} | Ref: ${ref}`,
  };

  return templates[locale] || templates.fr;
}
