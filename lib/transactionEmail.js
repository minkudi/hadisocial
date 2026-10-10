// lib/transactionEmail.js
// Emails transactionnels (crédit, débit, virement) en 16 langues.
// Nouveaux champs supportés : senderName, senderAccount, beneficiaryName, beneficiaryAccount.

function normalizeLocale(locale) {
  if (!locale || typeof locale !== "string") return "fr";
  const base = locale.toLowerCase().split("-")[0];
  const supported = [
    "fr", "en", "de", "nl", "fi", "es", "pt", "pl",
    "sk", "bg", "el", "sl", "lt", "lv", "it", "cs",
  ];
  return supported.includes(base) ? base : "fr";
}

const i18n = {
  fr: {
    opCredit: "CRÉDIT", opDebit: "DÉBIT",
    greeting: (n) => `Bonjour ${n},`,
    intro: (op) => `Nous vous informons qu'une opération de <strong>${op}</strong> a été enregistrée sur votre compte SCAP BEN.`,
    amountLabel: (op) => `Montant ${op.toLowerCase()}`,
    sender: "Expéditeur", senderAccount: "Compte expéditeur",
    beneficiary: "Bénéficiaire", beneficiaryAccount: "Compte bénéficiaire",
    amount: "Montant", account: "Compte", label: "Libellé", reference: "Référence", date: "Date",
    warning: "Si vous n'êtes pas à l'origine de cette opération, veuillez contacter immédiatement votre conseiller ou notre service client.",
    regards: "Cordialement,", company: "SCAP BEN",
    auto: "Ce message est généré automatiquement, merci de ne pas y répondre.",
    rights: "Tous droits réservés.",
  },
  en: {
    opCredit: "CREDIT", opDebit: "DEBIT",
    greeting: (n) => `Hello ${n},`,
    intro: (op) => `We inform you that a <strong>${op}</strong> operation has been recorded on your SCAP BEN account.`,
    amountLabel: (op) => `${op.toLowerCase()} amount`,
    sender: "Sender", senderAccount: "Sender account",
    beneficiary: "Beneficiary", beneficiaryAccount: "Beneficiary account",
    amount: "Amount", account: "Account", label: "Label", reference: "Reference", date: "Date",
    warning: "If you did not initiate this operation, please contact your advisor or our customer support immediately.",
    regards: "Best regards,", company: "SCAP BEN",
    auto: "This message is automatically generated, please do not reply to it.",
    rights: "All rights reserved.",
  },
  de: {
    opCredit: "GUTSCHRIFT", opDebit: "BELASTUNG",
    greeting: (n) => `Guten Tag ${n},`,
    intro: (op) => `Wir informieren Sie, dass eine <strong>${op}</strong>-Buchung auf Ihrem SCAP BEN-Konto vorgenommen wurde.`,
    amountLabel: (op) => `Betrag der ${op.toLowerCase()}`,
    sender: "Auftraggeber", senderAccount: "Konto Auftraggeber",
    beneficiary: "Begünstigter", beneficiaryAccount: "Konto Begünstigter",
    amount: "Betrag", account: "Konto", label: "Verwendungszweck", reference: "Referenz", date: "Datum",
    warning: "Wenn Sie diese Transaktion nicht veranlasst haben, kontaktieren Sie bitte umgehend Ihren Berater oder unseren Kundenservice.",
    regards: "Mit freundlichen Grüßen,", company: "SCAP BEN",
    auto: "Diese Nachricht wurde automatisch erstellt, bitte antworten Sie nicht darauf.",
    rights: "Alle Rechte vorbehalten.",
  },
  nl: {
    opCredit: "CREDIT", opDebit: "DEBET",
    greeting: (n) => `Beste ${n},`,
    intro: (op) => `Wij informeren u dat een <strong>${op}</strong>-transactie is geregistreerd op uw SCAP BEN-rekening.`,
    amountLabel: (op) => `${op.toLowerCase()} bedrag`,
    sender: "Afzender", senderAccount: "Rekening afzender",
    beneficiary: "Begunstigde", beneficiaryAccount: "Rekening begunstigde",
    amount: "Bedrag", account: "Rekening", label: "Omschrijving", reference: "Referentie", date: "Datum",
    warning: "Als u deze transactie niet zelf heeft uitgevoerd, neem dan onmiddellijk contact op met uw adviseur of de klantendienst.",
    regards: "Met vriendelijke groet,", company: "SCAP BEN",
    auto: "Dit bericht is automatisch gegenereerd, reageer er niet op.",
    rights: "Alle rechten voorbehouden.",
  },
  fi: {
    opCredit: "HYVITYS", opDebit: "VÄHENNYS",
    greeting: (n) => `Hei ${n},`,
    intro: (op) => `Ilmoitamme, että <strong>${op}</strong>-tapahtuma on kirjattu SCAP BEN -tilillesi.`,
    amountLabel: (op) => `${op.toLowerCase()} määrä`,
    sender: "Lähettäjä", senderAccount: "Lähettäjän tili",
    beneficiary: "Edunsaaja", beneficiaryAccount: "Edunsaajan tili",
    amount: "Määrä", account: "Tili", label: "Selite", reference: "Viite", date: "Päivämäärä",
    warning: "Jos et ole tehnyt tätä tapahtumaa, ota välittömästi yhteyttä neuvonantajaasi tai asiakaspalveluumme.",
    regards: "Ystävällisin terveisin,", company: "SCAP BEN",
    auto: "Tämä viesti on luotu automaattisesti, älä vastaa siihen.",
    rights: "Kaikki oikeudet pidätetään.",
  },
  es: {
    opCredit: "ABONO", opDebit: "CARGO",
    greeting: (n) => `Hola ${n},`,
    intro: (op) => `Le informamos de que se ha registrado una operación de <strong>${op}</strong> en su cuenta SCAP BEN.`,
    amountLabel: (op) => `Importe del ${op.toLowerCase()}`,
    sender: "Ordenante", senderAccount: "Cuenta ordenante",
    beneficiary: "Beneficiario", beneficiaryAccount: "Cuenta beneficiario",
    amount: "Importe", account: "Cuenta", label: "Concepto", reference: "Referencia", date: "Fecha",
    warning: "Si no es usted el autor de esta operación, póngase en contacto inmediatamente con su asesor o nuestro servicio de atención al cliente.",
    regards: "Un saludo,", company: "SCAP BEN",
    auto: "Este mensaje se ha generado automáticamente, por favor no responda a él.",
    rights: "Todos los derechos reservados.",
  },
  pt: {
    opCredit: "CRÉDITO", opDebit: "DÉBITO",
    greeting: (n) => `Olá ${n},`,
    intro: (op) => `Informamos que uma operação de <strong>${op}</strong> foi registada na sua conta SCAP BEN.`,
    amountLabel: (op) => `Montante do ${op.toLowerCase()}`,
    sender: "Remetente", senderAccount: "Conta remetente",
    beneficiary: "Beneficiário", beneficiaryAccount: "Conta beneficiária",
    amount: "Montante", account: "Conta", label: "Descrição", reference: "Referência", date: "Data",
    warning: "Se não foi o autor desta operação, contacte imediatamente o seu assessor ou o nosso apoio ao cliente.",
    regards: "Com os melhores cumprimentos,", company: "SCAP BEN",
    auto: "Esta mensagem foi gerada automaticamente, por favor não responda.",
    rights: "Todos os direitos reservados.",
  },
  pl: {
    opCredit: "UZNANIE", opDebit: "OBCIĄŻENIE",
    greeting: (n) => `Dzień dobry ${n},`,
    intro: (op) => `Informujemy, że na Państwa koncie SCAP BEN zarejestrowano operację <strong>${op}</strong>.`,
    amountLabel: (op) => `Kwota ${op.toLowerCase()}`,
    sender: "Zleceniodawca", senderAccount: "Konto zleceniodawcy",
    beneficiary: "Beneficjent", beneficiaryAccount: "Konto beneficjenta",
    amount: "Kwota", account: "Konto", label: "Tytuł", reference: "Referencja", date: "Data",
    warning: "Jeśli nie jesteś autorem tej operacji, natychmiast skontaktuj się z doradcą lub obsługą klienta.",
    regards: "Z poważaniem,", company: "SCAP BEN",
    auto: "Ta wiadomość została wygenerowana automatycznie, prosimy na nią nie odpowiadać.",
    rights: "Wszelkie prawa zastrzeżone.",
  },
  sk: {
    opCredit: "ÚVER", opDebit: "DEBET",
    greeting: (n) => `Dobrý deň ${n},`,
    intro: (op) => `Informujeme vás, že na váš účet SCAP BEN bola zaznamenaná operácia <strong>${op}</strong>.`,
    amountLabel: (op) => `Suma ${op.toLowerCase()}`,
    sender: "Odosielateľ", senderAccount: "Účet odosielateľa",
    beneficiary: "Príjemca", beneficiaryAccount: "Účet príjemcu",
    amount: "Suma", account: "Účet", label: "Poznámka", reference: "Referencia", date: "Dátum",
    warning: "Ak ste autorom tejto operácie nie ste vy, okamžite kontaktujte svojho poradcu alebo zákaznícku podporu.",
    regards: "S pozdravom,", company: "SCAP BEN",
    auto: "Táto správa bola vygenerovaná automaticky, prosím neodpovedajte na ňu.",
    rights: "Všetky práva vyhradené.",
  },
  bg: {
    opCredit: "КРЕДИТ", opDebit: "ДЕБИТ",
    greeting: (n) => `Здравейте ${n},`,
    intro: (op) => `Информираме Ви, че по сметката Ви в SCAP BEN е регистрирана операция <strong>${op}</strong>.`,
    amountLabel: (op) => `Сума ${op.toLowerCase()}`,
    sender: "Подател", senderAccount: "Сметка на подателя",
    beneficiary: "Получател", beneficiaryAccount: "Сметка на получателя",
    amount: "Сума", account: "Сметка", label: "Основание", reference: "Референция", date: "Дата",
    warning: "Ако не сте инициирали тази операция, моля незабавно се свържете с вашия съветник или обслужването на клиенти.",
    regards: "Поздрави,", company: "SCAP BEN",
    auto: "Това съобщение е генерирано автоматично, моля не отговаряйте на него.",
    rights: "Всички права запазени.",
  },
  el: {
    opCredit: "ΠΙΣΤΩΣΗ", opDebit: "ΧΡΕΩΣΗ",
    greeting: (n) => `Γεια σας ${n},`,
    intro: (op) => `Σας ενημερώνουμε ότι καταχωρήθηκε μια συναλλαγή <strong>${op}</strong> στον λογαριασμό σας SCAP BEN.`,
    amountLabel: (op) => `Ποσό ${op.toLowerCase()}`,
    sender: "Αποστολέας", senderAccount: "Λογαριασμός αποστολέα",
    beneficiary: "Δικαιούχος", beneficiaryAccount: "Λογαριασμός δικαιούχου",
    amount: "Ποσό", account: "Λογαριασμός", label: "Αιτιολογία", reference: "Αναφορά", date: "Ημερομηνία",
    warning: "Εάν δεν είστε εσείς ο υπεύθυνος αυτής της συναλλαγής, επικοινωνήστε αμέσως με τον σύμβουλό σας ή την εξυπηρέτηση πελατών μας.",
    regards: "Με εκτίμηση,", company: "SCAP BEN",
    auto: "Αυτό το μήνυμα δημιουργήθηκε αυτόματα, παρακαλούμε μην απαντήσετε.",
    rights: "Με επιφύλαξη παντός δικαιώματος.",
  },
  sl: {
    opCredit: "DOBROPOIS", opDebit: "BREMENITEV",
    greeting: (n) => `Pozdravljeni ${n},`,
    intro: (op) => `Obveščamo vas, da je bila na vašem računu SCAP BEN zabeležena operacija <strong>${op}</strong>.`,
    amountLabel: (op) => `Znesek ${op.toLowerCase()}`,
    sender: "Pošiljatelj", senderAccount: "Račun pošiljatelja",
    beneficiary: "Prejemnik", beneficiaryAccount: "Račun prejemnika",
    amount: "Znesek", account: "Račun", label: "Namen", reference: "Referenca", date: "Datum",
    warning: "Če niste avtor te operacije, takoj kontaktirajte svojega svetovalca ali našo službo za stranke.",
    regards: "Lep pozdrav,", company: "SCAP BEN",
    auto: "To sporočilo je bilo ustvarjeno samodejno, nanj prosimo ne odgovarjajte.",
    rights: "Vse pravice pridržane.",
  },
  lt: {
    opCredit: "KREDITAS", opDebit: "DEBETAS",
    greeting: (n) => `Sveiki ${n},`,
    intro: (op) => `Informuojame, kad jūsų SCAP BEN sąskaitoje užregistruota <strong>${op}</strong> operacija.`,
    amountLabel: (op) => `${op.toLowerCase()} suma`,
    sender: "Siuntėjas", senderAccount: "Siuntėjo sąskaita",
    beneficiary: "Gavėjas", beneficiaryAccount: "Gavėjo sąskaita",
    amount: "Suma", account: "Sąskaita", label: "Paskirtis", reference: "Nuoroda", date: "Data",
    warning: "Jei ne jūs inicijavote šią operaciją, nedelsdami susisiekite su savo patarėju arba klientų aptarnavimo tarnyba.",
    regards: "Pagarbiai,", company: "SCAP BEN",
    auto: "Šis pranešimas sugeneruotas automatiškai, prašome į jį neatsakyti.",
    rights: "Visos teisės saugomos.",
  },
  lv: {
    opCredit: "KREDĪTS", opDebit: "DEBETS",
    greeting: (n) => `Sveiki ${n},`,
    intro: (op) => `Informējam, ka jūsu SCAP BEN kontā reģistrēta <strong>${op}</strong> operācija.`,
    amountLabel: (op) => `${op.toLowerCase()} summa`,
    sender: "Sūtītājs", senderAccount: "Sūtītāja konts",
    beneficiary: "Saņēmējs", beneficiaryAccount: "Saņēmēja konts",
    amount: "Summa", account: "Konts", label: "Mērķis", reference: "Reference", date: "Datums",
    warning: "Ja neesat šīs operācijas iniciators, nekavējoties sazinieties ar savu konsultantu vai klientu apkalpošanas dienestu.",
    regards: "Ar cieņu,", company: "SCAP BEN",
    auto: "Šis ziņojums ģenerēts automātiski, lūdzu neatbildiet uz to.",
    rights: "Visas tiesības aizsargātas.",
  },
  it: {
    opCredit: "ACCREDITO", opDebit: "ADDEBITO",
    greeting: (n) => `Buongiorno ${n},`,
    intro: (op) => `La informiamo che è stata registrata un'operazione di <strong>${op}</strong> sul suo conto SCAP BEN.`,
    amountLabel: (op) => `Importo ${op.toLowerCase()}`,
    sender: "Mittente", senderAccount: "Conto mittente",
    beneficiary: "Beneficiario", beneficiaryAccount: "Conto beneficiario",
    amount: "Importo", account: "Conto", label: "Causale", reference: "Riferimento", date: "Data",
    warning: "Se non è lei l'autore di questa operazione, contatti immediatamente il suo consulente o il nostro servizio clienti.",
    regards: "Cordiali saluti,", company: "SCAP BEN",
    auto: "Questo messaggio è generato automaticamente, si prega di non rispondere.",
    rights: "Tutti i diritti riservati.",
  },
  cs: {
    opCredit: "ÚVĚR", opDebit: "DEBET",
    greeting: (n) => `Dobrý den ${n},`,
    intro: (op) => `Informujeme vás, že na vašem účtu SCAP BEN byla zaznamenána operace <strong>${op}</strong>.`,
    amountLabel: (op) => `Částka ${op.toLowerCase()}`,
    sender: "Odesílatel", senderAccount: "Účet odesílatele",
    beneficiary: "Příjemce", beneficiaryAccount: "Účet příjemce",
    amount: "Částka", account: "Účet", label: "Účel", reference: "Reference", date: "Datum",
    warning: "Pokud nejste autorem této operace, okamžitě kontaktujte svého poradce nebo zákaznickou podporu.",
    regards: "S pozdravem,", company: "SCAP BEN",
    auto: "Tato zpráva byla vygenerována automaticky, prosím neodpovídejte na ni.",
    rights: "Všechna práva vyhrazena.",
  },
};

export function buildTransactionEmail({
  type,
  fullName,
  email,
  accountNumber,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
  locale = "fr",
  senderName,
  senderAccount,
  beneficiaryName,
  beneficiaryAccount,
}) {
  const lang = i18n[normalizeLocale(locale)] || i18n.fr;
  const isCredit = type === "CREDIT";
  const opLabel = isCredit ? lang.opCredit : lang.opDebit;
  const color = isCredit ? "#059669" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  const amountStr = `${sign}${Number(amount).toFixed(2)} ${currency || "EUR"}`;
  const safeName = fullName || email || (lang === i18n.en ? "Dear customer" : "Cher client");

  // Pour un virement : si bénéficiaire non fourni, on reprend le client
  const finalSenderName = senderName || "SCAP BEN";
  const finalSenderAccount = senderAccount || "-";
  const finalBeneficiaryName = beneficiaryName || safeName;
  const finalBeneficiaryAccount = beneficiaryAccount || accountNumber || "-";

  const text = [
    lang.greeting(safeName),
    "",
    `Une opération de ${opLabel} a été effectuée sur votre compte.`,
    "",
    `${lang.sender} : ${finalSenderName}`,
    `${lang.senderAccount} : ${finalSenderAccount}`,
    `${lang.beneficiary} : ${finalBeneficiaryName}`,
    `${lang.beneficiaryAccount} : ${finalBeneficiaryAccount}`,
    `${lang.amount} : ${amountStr}`,
    `${lang.account} : ${accountNumber}`,
    `${lang.label} : ${label}`,
    `${lang.reference} : ${transactionId}`,
    `${lang.date} : ${createdAt}`,
    "",
    lang.warning,
    "",
    lang.regards,
    lang.company,
  ].join("\n");

  const rows = [
    { k: lang.sender, v: finalSenderName },
    { k: lang.senderAccount, v: finalSenderAccount },
    { k: lang.beneficiary, v: finalBeneficiaryName },
    { k: lang.beneficiaryAccount, v: finalBeneficiaryAccount, mono: true },
    { k: lang.amount, v: amountStr, bold: true, color },
    { k: lang.account, v: accountNumber, mono: true },
    { k: lang.label, v: label },
    { k: lang.reference, v: transactionId, mono: true },
    { k: lang.date, v: createdAt },
  ];

  const detailsHtml = rows
    .map(
      ({ k, v, mono, bold, color: c }) => `
                <tr>
                  <td style="padding:4px 0;width:160px;color:#6B7280;vertical-align:top;">${k}</td>
                  <td style="padding:4px 0;${bold ? `font-weight:700;color:${c};` : ""}${mono ? "font-family:monospace;" : ""}">${v}</td>
                </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html lang="${normalizeLocale(locale)}">
<head>
  <meta charset="utf-8" />
  <title>${opLabel} - SCAP BEN</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <tr>
            <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:20px;font-weight:700;">SCAP BEN</td>
                  <td align="right" style="font-size:12px;opacity:0.9;">${opLabel}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">${lang.greeting(safeName)}</p>
              <p style="margin:0 0 16px 0;font-size:13px;color:#4B5563;line-height:1.5;">${lang.intro(opLabel)}</p>

              <table role="presentation" width="100%" style="margin:0 0 16px 0;font-size:12px;color:#374151;">
                ${detailsHtml}
              </table>

              <p style="margin:12px 0 0 0;font-size:12px;color:#6B7280;line-height:1.5;">${lang.warning}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 20px 24px;border-top:1px solid #E5E7EB;background-color:#F9FAFB;">
              <p style="margin:0 0 4px 0;font-size:11px;color:#9CA3AF;">${lang.company}</p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;">${lang.auto}</p>
            </td>
          </tr>
        </table>
        <p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">&copy; ${new Date().getFullYear()} SCAP BEN. ${lang.rights}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: `${opLabel} - SCAP BEN`,
    text,
    html,
  };
}

// Email d'alerte admin pour les virements sortants
export function buildTransferAdminEmail({
  senderName,
  senderEmail,
  senderAccount,
  recipientName,
  recipientEmail,
  recipientAccount,
  amount,
  currency,
  label,
  transactionId,
  createdAt,
}) {
  const amountStr = `${Number(amount).toFixed(2)} ${currency || "EUR"}`;

  const rows = [
    ["Expéditeur", senderName],
    ["Email expéditeur", senderEmail],
    ["Compte expéditeur", senderAccount],
    ["Bénéficiaire", recipientName],
    ["Email bénéficiaire", recipientEmail],
    ["Compte bénéficiaire", recipientAccount],
    ["Montant", amountStr],
    ["Libellé", label],
    ["Référence", transactionId],
    ["Date", createdAt],
  ];

  const text = [
    "Nouveau virement effectué par un client.",
    "",
    ...rows.map(([k, v]) => `${k} : ${v}`),
  ].join("\n");

  const rowsHtml = rows
    .map(
      ([k, v]) => `
                <tr>
                  <td style="padding:4px 0;width:170px;color:#6B7280;vertical-align:top;">${k}</td>
                  <td style="padding:4px 0;font-family:monospace;">${v}</td>
                </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8" /><title>Virement client - SCAP BEN</title></head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F3F4F6;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
        <tr>
          <td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#FFFFFF;font-size:20px;font-weight:700;">
            SCAP BEN — Alerte virement
          </td>
        </tr>
        <tr>
          <td style="padding:24px;">
            <p style="margin:0 0 16px 0;font-size:14px;color:#111827;">Un client a effectué un virement :</p>
            <table role="presentation" width="100%" style="font-size:12px;color:#374151;">
              ${rowsHtml}
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return {
    subject: `Virement client ${amountStr} - ${senderName}`,
    text,
    html,
  };
}

export default buildTransactionEmail;
