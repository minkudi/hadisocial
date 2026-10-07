// lib/smsTemplates.js

export function buildDebitSms({ locale, amount, currency, accountNumber, transactionId }) {
  const amt = Number(amount).toFixed(2);
  const ref = transactionId;
  const acct = accountNumber;

  const templates = {
    fr: `[HADI SOCIAL] Debit: -${amt} ${currency} | Cpte: ${acct} | Ref: ${ref}`,
    en: `[HADI SOCIAL] Debit: -${amt} ${currency} | Acct: ${acct} | Ref: ${ref}`,
    de: `[HADI SOCIAL] Lastschrift: -${amt} ${currency} | Kto: ${acct} | Ref: ${ref}`,
    nl: `[HADI SOCIAL] Debet: -${amt} ${currency} | Rek: ${acct} | Ref: ${ref}`,
    fi: `[HADI SOCIAL] Debet: -${amt} ${currency} | Tili: ${acct} | Ref: ${ref}`,
    es: `[HADI SOCIAL] Debito: -${amt} ${currency} | Cta: ${acct} | Ref: ${ref}`,
    pt: `[HADI SOCIAL] Debito: -${amt} ${currency} | Cta: ${acct} | Ref: ${ref}`,
    pl: `[HADI SOCIAL] Debet: -${amt} ${currency} | Kto: ${acct} | Ref: ${ref}`,
    sk: `[HADI SOCIAL] Debet: -${amt} ${currency} | Ucet: ${acct} | Ref: ${ref}`,
    bg: `[HADI SOCIAL] Debit: -${amt} ${currency} | Smt: ${acct} | Ref: ${ref}`,
    el: `[HADI SOCIAL] Xrewsh: -${amt} ${currency} | Log: ${acct} | Ref: ${ref}`,
    sl: `[HADI SOCIAL] Bremenitev: -${amt} ${currency} | Racun: ${acct} | Ref: ${ref}`,
    lt: `[HADI SOCIAL] Debetas: -${amt} ${currency} | Sask: ${acct} | Ref: ${ref}`,
    lv: `[HADI SOCIAL] Debets: -${amt} ${currency} | Konts: ${acct} | Ref: ${ref}`,
    it: `[HADI SOCIAL] Addebito: -${amt} ${currency} | Conto: ${acct} | Ref: ${ref}`,
    cs: `[HADI SOCIAL] Debet: -${amt} ${currency} | Ucet: ${acct} | Ref: ${ref}`,
  };

  return templates[locale] || templates.fr;
}

export function buildCreditSms({ locale, amount, currency, accountNumber, transactionId }) {
  const amt = Number(amount).toFixed(2);
  const ref = transactionId;
  const acct = accountNumber;

  const templates = {
    fr: `[HADI SOCIAL] Credit: +${amt} ${currency} | Cpte: ${acct} | Ref: ${ref}`,
    en: `[HADI SOCIAL] Credit: +${amt} ${currency} | Acct: ${acct} | Ref: ${ref}`,
    de: `[HADI SOCIAL] Gutschrift: +${amt} ${currency} | Kto: ${acct} | Ref: ${ref}`,
    nl: `[HADI SOCIAL] Credit: +${amt} ${currency} | Rek: ${acct} | Ref: ${ref}`,
    fi: `[HADI SOCIAL] Krediitti: +${amt} ${currency} | Tili: ${acct} | Ref: ${ref}`,
    es: `[HADI SOCIAL] Credito: +${amt} ${currency} | Cta: ${acct} | Ref: ${ref}`,
    pt: `[HADI SOCIAL] Credito: +${amt} ${currency} | Cta: ${acct} | Ref: ${ref}`,
    pl: `[HADI SOCIAL] Uznanie: +${amt} ${currency} | Kto: ${acct} | Ref: ${ref}`,
    sk: `[HADI SOCIAL] Kredit: +${amt} ${currency} | Ucet: ${acct} | Ref: ${ref}`,
    bg: `[HADI SOCIAL] Kredit: +${amt} ${currency} | Smt: ${acct} | Ref: ${ref}`,
    el: `[HADI SOCIAL] Pistwsh: +${amt} ${currency} | Log: ${acct} | Ref: ${ref}`,
    sl: `[HADI SOCIAL] Dobropis: +${amt} ${currency} | Racun: ${acct} | Ref: ${ref}`,
    lt: `[HADI SOCIAL] Kreditas: +${amt} ${currency} | Sask: ${acct} | Ref: ${ref}`,
    lv: `[HADI SOCIAL] Kredits: +${amt} ${currency} | Konts: ${acct} | Ref: ${ref}`,
    it: `[HADI SOCIAL] Accredito: +${amt} ${currency} | Conto: ${acct} | Ref: ${ref}`,
    cs: `[HADI SOCIAL] Kredit: +${amt} ${currency} | Ucet: ${acct} | Ref: ${ref}`,
  };

  return templates[locale] || templates.fr;
}
