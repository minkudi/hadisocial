import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import nodemailer from "nodemailer";
import { autoCreditFromLoanBot } from "../../../lib/loanBot";

const emailTemplates = {
  fr: {
    subject: "Bienvenue sur OLAKRED",
    text: (fullName, accountNumber) => {
      const name = fullName || "Cher client";
      return [
        `Bonjour ${name},`,``,`Bienvenue sur OLAKRED.`,``,
        `Votre espace bancaire en ligne a été créé avec succès.`,
        `Numéro de compte : ${accountNumber}`,``,
        `Vous pouvez dès à présent vous connecter pour :`,
        `- consulter le solde de vos comptes,`,
        `- suivre vos transactions en temps réel,`,
        `- effectuer vos opérations courantes en toute sécurité.`,``,
        `Pour votre sécurité, ne partagez jamais vos identifiants ou codes de connexion.`,``,
        `Cordialement,`,`L'équipe OLAKRED`,
      ].join("\n");
    },
    html: (fullName, accountNumber) => {
      const name = fullName || "Cher client";
      const baseUrl = process.env.APP_BASE_URL || "https://hadisocial.vercel.app";
      return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Bienvenue sur OLAKRED</title></head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:24px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
<tr><td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#fff;">
<table width="100%"><tr><td style="font-size:20px;font-weight:700;">OLAKRED</td>
<td align="right" style="font-size:12px;opacity:0.9;">Confirmation de création de compte</td></tr></table></td></tr>
<tr><td style="padding:24px;">
<p style="margin:0 0 12px 0;font-size:14px;color:#111827;">Bonjour ${name},</p>
<p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">Nous avons le plaisir de vous confirmer la création de votre compte OLAKRED.</p>
<table width="100%" style="margin:16px 0 20px 0;"><tr><td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background:#F9FAFB;">
<div style="font-size:11px;text-transform:uppercase;color:#6B7280;margin-bottom:4px;">Numéro de compte</div>
<div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">${accountNumber}</div></td></tr></table>
<p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;line-height:1.5;">Vous pouvez dès maintenant vous connecter à votre espace sécurisé pour :</p>
<ul style="margin:0 0 16px 20px;font-size:13px;color:#4B5563;line-height:1.6;">
<li>consulter le solde de vos comptes,</li><li>suivre vos transactions en temps réel,</li>
<li>effectuer vos virements et opérations courantes,</li><li>mettre à jour vos informations personnelles.</li></ul>
<table cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;"><tr><td>
<a href="${baseUrl}/login" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0F766E;color:#fff;font-size:13px;font-weight:600;text-decoration:none;">Accéder à mon espace</a>
</td></tr></table>
<p style="margin:0;font-size:12px;color:#6B7280;">En cas de doute, contactez immédiatement votre service client.</p>
</td></tr>
<tr><td style="padding:16px 24px;border-top:1px solid #E5E7EB;background:#F9FAFB;">
<p style="margin:0;font-size:11px;color:#9CA3AF;">OLAKRED – Plateforme de services bancaires en ligne.</p></td></tr></table>
<p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">&copy; ${new Date().getFullYear()} OLAKRED. Tous droits réservés.</p>
</td></tr></table></body></html>`;
    },
  },
  en: {
    subject: "Welcome to OLAKRED",
    text: (fullName, accountNumber) => {
      const name = fullName || "Dear customer";
      return [
        `Hello ${name},`,``,`Welcome to OLAKRED.`,``,
        `Your online banking profile has been successfully created.`,
        `Account number: ${accountNumber}`,``,`You can now log in to:`,
        `- check your account balances,`,`- monitor your transactions in real time,`,
        `- perform your everyday banking operations securely.`,``,
        `For your security, never share your login details or security codes with anyone.`,``,
        `Best regards,`,`The OLAKRED Team`,
      ].join("\n");
    },
    html: (fullName, accountNumber) => {
      const name = fullName || "Dear customer";
      const baseUrl = process.env.APP_BASE_URL || "https://hadisocial.vercel.app";
      return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Welcome to OLAKRED</title></head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:24px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
<tr><td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#fff;">
<table width="100%"><tr><td style="font-size:20px;font-weight:700;">OLAKRED</td>
<td align="right" style="font-size:12px;opacity:0.9;">Account creation confirmation</td></tr></table></td></tr>
<tr><td style="padding:24px;">
<p style="margin:0 0 12px 0;font-size:14px;color:#111827;">Hello ${name},</p>
<p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;">We are pleased to confirm that your OLAKRED account has been created.</p>
<table width="100%" style="margin:16px 0 20px 0;"><tr><td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background:#F9FAFB;">
<div style="font-size:11px;text-transform:uppercase;color:#6B7280;margin-bottom:4px;">Account number</div>
<div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">${accountNumber}</div></td></tr></table>
<table cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;"><tr><td>
<a href="${baseUrl}/login" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0F766E;color:#fff;font-size:13px;font-weight:600;text-decoration:none;">Log in to my account</a>
</td></tr></table>
<p style="margin:0;font-size:12px;color:#6B7280;">If you ever have any doubts, please contact customer support immediately.</p>
</td></tr>
<tr><td style="padding:16px 24px;border-top:1px solid #E5E7EB;background:#F9FAFB;">
<p style="margin:0;font-size:11px;color:#9CA3AF;">OLAKRED – Online banking services platform.</p></td></tr></table>
<p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">&copy; ${new Date().getFullYear()} OLAKRED. All rights reserved.</p>
</td></tr></table></body></html>`;
    },
  },
  de: {
    subject: "Willkommen bei OLAKRED",
    text: (fullName, accountNumber) => {
      const name = fullName || "Sehr geehrte Kundin, sehr geehrter Kunde";
      return [
        `Hallo ${name},`,``,`Willkommen bei OLAKRED.`,``,
        `Ihr Online-Banking-Zugang wurde erfolgreich eingerichtet.`,
        `Kontonummer: ${accountNumber}`,``,`Sie können sich jetzt anmelden, um:`,
        `- Ihre Kontostände zu prüfen,`,`- Ihre Umsätze in Echtzeit zu verfolgen,`,
        `- Ihre täglichen Bankgeschäfte sicher durchzuführen.`,``,
        `Zu Ihrer Sicherheit geben Sie Ihre Zugangsdaten niemals an Dritte weiter.`,``,
        `Mit freundlichen Grüßen`,`Ihr OLAKRED Team`,
      ].join("\n");
    },
    html: (fullName, accountNumber) => {
      const name = fullName || "Sehr geehrte Kundin, sehr geehrter Kunde";
      const baseUrl = process.env.APP_BASE_URL || "https://hadisocial.vercel.app";
      return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Willkommen bei OLAKRED</title></head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:24px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
<tr><td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#fff;">
<table width="100%"><tr><td style="font-size:20px;font-weight:700;">OLAKRED</td>
<td align="right" style="font-size:12px;opacity:0.9;">Bestätigung der Kontoeröffnung</td></tr></table></td></tr>
<tr><td style="padding:24px;">
<p style="margin:0 0 12px 0;font-size:14px;color:#111827;">Hallo ${name},</p>
<p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;">Wir freuen uns, Ihnen die Einrichtung Ihres OLAKRED-Kontos zu bestätigen.</p>
<table width="100%" style="margin:16px 0 20px 0;"><tr><td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background:#F9FAFB;">
<div style="font-size:11px;text-transform:uppercase;color:#6B7280;margin-bottom:4px;">Kontonummer</div>
<div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">${accountNumber}</div></td></tr></table>
<table cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;"><tr><td>
<a href="${baseUrl}/login" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0F766E;color:#fff;font-size:13px;font-weight:600;text-decoration:none;">Zum Online-Banking anmelden</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:16px 24px;border-top:1px solid #E5E7EB;background:#F9FAFB;">
<p style="margin:0;font-size:11px;color:#9CA3AF;">OLAKRED – Plattform für digitales Bankwesen.</p></td></tr></table>
<p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">&copy; ${new Date().getFullYear()} OLAKRED. Alle Rechte vorbehalten.</p>
</td></tr></table></body></html>`;
    },
  },
  nl: {
    subject: "Welkom bij OLAKRED",
    text: (fullName, accountNumber) => {
      const name = fullName || "Beste klant";
      return [
        `Hallo ${name},`,``,`Welkom bij OLAKRED.`,``,
        `Uw online bankomgeving is succesvol aangemaakt.`,
        `Rekeningnummer: ${accountNumber}`,``,`U kunt nu inloggen om:`,
        `- uw rekeningsaldi te bekijken,`,`- uw transacties in real time te volgen,`,
        `- uw dagelijkse bankzaken veilig uit te voeren.`,``,
        `Deel uw inloggegevens of beveiligingscodes nooit met iemand anders.`,``,
        `Met vriendelijke groet,`,`Het OLAKRED team`,
      ].join("\n");
    },
    html: (fullName, accountNumber) => {
      const name = fullName || "Beste klant";
      const baseUrl = process.env.APP_BASE_URL || "https://hadisocial.vercel.app";
      return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>Welkom bij OLAKRED</title></head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:24px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
<tr><td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#fff;">
<table width="100%"><tr><td style="font-size:20px;font-weight:700;">OLAKRED</td>
<td align="right" style="font-size:12px;opacity:0.9;">Bevestiging van rekeningopening</td></tr></table></td></tr>
<tr><td style="padding:24px;">
<p style="margin:0 0 12px 0;font-size:14px;color:#111827;">Hallo ${name},</p>
<p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;">We bevestigen dat uw OLAKRED account succesvol is aangemaakt.</p>
<table width="100%" style="margin:16px 0 20px 0;"><tr><td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background:#F9FAFB;">
<div style="font-size:11px;text-transform:uppercase;color:#6B7280;margin-bottom:4px;">Rekeningnummer</div>
<div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">${accountNumber}</div></td></tr></table>
<table cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;"><tr><td>
<a href="${baseUrl}/login" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0F766E;color:#fff;font-size:13px;font-weight:600;text-decoration:none;">Inloggen op mijn account</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:16px 24px;border-top:1px solid #E5E7EB;background:#F9FAFB;">
<p style="margin:0;font-size:11px;color:#9CA3AF;">OLAKRED – Platform voor online bankdiensten.</p></td></tr></table>
<p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">&copy; ${new Date().getFullYear()} OLAKRED. Alle rechten voorbehouden.</p>
</td></tr></table></body></html>`;
    },
  },
  fi: {
    subject: "Tervetuloa OLAKREDiin",
    text: (fullName, accountNumber) => {
      const name = fullName || "Hyvä asiakas";
      return [
        `Hei ${name},`,``,`Tervetuloa OLAKREDiin.`,``,
        `Verkkopankkitilisi on luotu onnistuneesti.`,
        `Tilinumero: ${accountNumber}`,``,`Voit nyt kirjautua sisään ja:`,
        `- tarkastella tiliesi saldoja,`,`- seurata tapahtumia reaaliajassa,`,
        `- hoitaa päivittäiset pankkiasiasi turvallisesti.`,``,
        `Älä koskaan jaa kirjautumistietojasi muiden kanssa.`,``,
        `Ystävällisin terveisin,`,`OLAKRED-tiimi`,
      ].join("\n");
    },
    html: (fullName, accountNumber) => {
      const name = fullName || "Hyvä asiakas";
      const baseUrl = process.env.APP_BASE_URL || "https://hadisocial.vercel.app";
      return `<!doctype html><html lang="fi"><head><meta charset="utf-8"><title>Tervetuloa OLAKREDiin</title></head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:24px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
<tr><td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#fff;">
<table width="100%"><tr><td style="font-size:20px;font-weight:700;">OLAKRED</td>
<td align="right" style="font-size:12px;opacity:0.9;">Tilin avaamisen vahvistus</td></tr></table></td></tr>
<tr><td style="padding:24px;">
<p style="margin:0 0 12px 0;font-size:14px;color:#111827;">Hei ${name},</p>
<p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;">Meillä on ilo vahvistaa, että OLAKRED-tilisi on luotu onnistuneesti.</p>
<table width="100%" style="margin:16px 0 20px 0;"><tr><td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background:#F9FAFB;">
<div style="font-size:11px;text-transform:uppercase;color:#6B7280;margin-bottom:4px;">Tilinumero</div>
<div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">${accountNumber}</div></td></tr></table>
<table cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;"><tr><td>
<a href="${baseUrl}/login" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0F766E;color:#fff;font-size:13px;font-weight:600;text-decoration:none;">Kirjaudu verkkopankkiin</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:16px 24px;border-top:1px solid #E5E7EB;background:#F9FAFB;">
<p style="margin:0;font-size:11px;color:#9CA3AF;">OLAKRED – Verkkopankkipalvelualusta.</p></td></tr></table>
<p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">&copy; ${new Date().getFullYear()} OLAKRED. Kaikki oikeudet pidätetään.</p>
</td></tr></table></body></html>`;
    },
  },


    es: {
    subject: "Bienvenido a OLAKRED",
    text: (fullName, accountNumber) => {
      const name = fullName || "Estimado cliente";
      return [
        `Hola ${name},`,``,`Bienvenido a OLAKRED.`,``,
        `Su banca en línea se ha creado correctamente.`,
        `Número de cuenta: ${accountNumber}`,``,`Ahora puede iniciar sesión para:`,
        `- consultar los saldos de sus cuentas,`,`- seguir sus movimientos en tiempo real,`,
        `- realizar sus operaciones diarias de forma segura.`,``,
        `Por su seguridad, no comparta nunca sus credenciales con nadie.`,``,
        `Atentamente,`,`El equipo de OLAKRED`,
      ].join("\n");
    },
    html: (fullName, accountNumber) => {
      const name = fullName || "Estimado cliente";
      const baseUrl = process.env.APP_BASE_URL || "https://hadisocial.vercel.app";
      return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Bienvenido a OLAKRED</title></head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:24px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
<tr><td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#fff;">
<table width="100%"><tr><td style="font-size:20px;font-weight:700;">OLAKRED</td>
<td align="right" style="font-size:12px;opacity:0.9;">Confirmación de apertura de cuenta</td></tr></table></td></tr>
<tr><td style="padding:24px;">
<p style="margin:0 0 12px 0;font-size:14px;color:#111827;">Hola ${name},</p>
<p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;">Nos complace confirmar que su cuenta de OLAKRED se ha creado correctamente.</p>
<table width="100%" style="margin:16px 0 20px 0;"><tr><td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background:#F9FAFB;">
<div style="font-size:11px;text-transform:uppercase;color:#6B7280;margin-bottom:4px;">Número de cuenta</div>
<div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">${accountNumber}</div></td></tr></table>
<table cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;"><tr><td>
<a href="${baseUrl}/login" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0F766E;color:#fff;font-size:13px;font-weight:600;text-decoration:none;">Acceder a mi cuenta</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:16px 24px;border-top:1px solid #E5E7EB;background:#F9FAFB;">
<p style="margin:0;font-size:11px;color:#9CA3AF;">OLAKRED – Plataforma de servicios bancarios en línea.</p></td></tr></table>
<p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">&copy; ${new Date().getFullYear()} OLAKRED. Todos los derechos reservados.</p>
</td></tr></table></body></html>`;
    },
  },
  pl: {
    subject: "Witamy w OLAKRED",
    text: (fullName, accountNumber) => {
      const name = fullName || "Drogi Kliencie";
      return [
        `Witaj ${name},`,``,`Witamy w OLAKRED.`,``,
        `Twoje konto bankowości internetowej zostało pomyślnie utworzone.`,
        `Numer konta: ${accountNumber}`,``,`Możesz teraz zalogować się, aby:`,
        `- sprawdzać salda swoich rachunków,`,`- śledzić transakcje w czasie rzeczywistym,`,
        `- bezpiecznie wykonywać codzienne operacje bankowe.`,``,
        `Ze względów bezpieczeństwa nigdy nie udostępniaj swoich danych logowania.`,``,
        `Z poważaniem,`,`Zespół OLAKRED`,
      ].join("\n");
    },
    html: (fullName, accountNumber) => {
      const name = fullName || "Drogi Kliencie";
      const baseUrl = process.env.APP_BASE_URL || "https://hadisocial.vercel.app";
      return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>Witamy w OLAKRED</title></head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:24px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
<tr><td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#fff;">
<table width="100%"><tr><td style="font-size:20px;font-weight:700;">OLAKRED</td>
<td align="right" style="font-size:12px;opacity:0.9;">Potwierdzenie utworzenia konta</td></tr></table></td></tr>
<tr><td style="padding:24px;">
<p style="margin:0 0 12px 0;font-size:14px;color:#111827;">Witaj ${name},</p>
<p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;">Z przyjemnością potwierdzamy, że Twoje konto OLAKRED zostało pomyślnie utworzone.</p>
<table width="100%" style="margin:16px 0 20px 0;"><tr><td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background:#F9FAFB;">
<div style="font-size:11px;text-transform:uppercase;color:#6B7280;margin-bottom:4px;">Numer konta</div>
<div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">${accountNumber}</div></td></tr></table>
<table cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;"><tr><td>
<a href="${baseUrl}/login" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0F766E;color:#fff;font-size:13px;font-weight:600;text-decoration:none;">Zaloguj się do mojego konta</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:16px 24px;border-top:1px solid #E5E7EB;background:#F9FAFB;">
<p style="margin:0;font-size:11px;color:#9CA3AF;">OLAKRED – Platforma bankowości internetowej.</p></td></tr></table>
<p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">&copy; ${new Date().getFullYear()} OLAKRED. Wszystkie prawa zastrzeżone.</p>
</td></tr></table></body></html>`;
    },
  },
  pt: {
    subject: "Bem-vindo ao OLAKRED",
    text: (fullName, accountNumber) => {
      const name = fullName || "Caro cliente";
      return [
        `Olá ${name},`,``,`Bem-vindo ao OLAKRED.`,``,
        `A sua conta de banca online foi criada com sucesso.`,
        `Número da conta: ${accountNumber}`,``,`Agora pode iniciar sessão para:`,
        `- consultar os saldos das suas contas,`,`- acompanhar as suas movimentações em tempo real,`,
        `- realizar as suas operações diárias em segurança.`,``,
        `Nunca partilhe as suas credenciais ou códigos de segurança com terceiros.`,``,
        `Com os melhores cumprimentos,`,`Equipa OLAKRED`,
      ].join("\n");
    },
    html: (fullName, accountNumber) => {
      const name = fullName || "Caro cliente";
      const baseUrl = process.env.APP_BASE_URL || "https://hadisocial.vercel.app";
      return `<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>Bem-vindo ao OLAKRED</title></head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:24px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
<tr><td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#fff;">
<table width="100%"><tr><td style="font-size:20px;font-weight:700;">OLAKRED</td>
<td align="right" style="font-size:12px;opacity:0.9;">Confirmação de criação de conta</td></tr></table></td></tr>
<tr><td style="padding:24px;">
<p style="margin:0 0 12px 0;font-size:14px;color:#111827;">Olá ${name},</p>
<p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;">Temos o prazer de confirmar que a sua conta OLAKRED foi criada com sucesso.</p>
<table width="100%" style="margin:16px 0 20px 0;"><tr><td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background:#F9FAFB;">
<div style="font-size:11px;text-transform:uppercase;color:#6B7280;margin-bottom:4px;">Número da conta</div>
<div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">${accountNumber}</div></td></tr></table>
<table cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;"><tr><td>
<a href="${baseUrl}/login" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0F766E;color:#fff;font-size:13px;font-weight:600;text-decoration:none;">Aceder à minha conta</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:16px 24px;border-top:1px solid #E5E7EB;background:#F9FAFB;">
<p style="margin:0;font-size:11px;color:#9CA3AF;">OLAKRED – Plataforma de serviços bancários online.</p></td></tr></table>
<p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">&copy; ${new Date().getFullYear()} OLAKRED. Todos os direitos reservados.</p>
</td></tr></table></body></html>`;
    },
  },
  sk: {
    subject: "Vitajte v OLAKRED",
    text: (fullName, accountNumber) => {
      const name = fullName || "Vážený klient";
      return [
        `Ahoj ${name},`,``,`Vitajte v OLAKRED.`,``,
        `Váš účet internetového bankovníctva bol úspešne vytvorený.`,
        `Číslo účtu: ${accountNumber}`,``,`Teraz sa môžete prihlásiť a:`,
        `- kontrolovať zostatky na svojich účtoch,`,`- sledovať transakcie v reálnom čase,`,
        `- bezpečne vykonávať bankové operácie.`,``,
        `Z bezpečnostných dôvodov nikdy nezdieľajte svoje prihlasovacie údaje.`,``,
        `S pozdravom,`,`Tím OLAKRED`,
      ].join("\n");
    },
    html: (fullName, accountNumber) => {
      const name = fullName || "Vážený klient";
      const baseUrl = process.env.APP_BASE_URL || "https://hadisocial.vercel.app";
      return `<!doctype html><html lang="sk"><head><meta charset="utf-8"><title>Vitajte v OLAKRED</title></head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:24px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
<tr><td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#fff;">
<table width="100%"><tr><td style="font-size:20px;font-weight:700;">OLAKRED</td>
<td align="right" style="font-size:12px;opacity:0.9;">Potvrdenie vytvorenia účtu</td></tr></table></td></tr>
<tr><td style="padding:24px;">
<p style="margin:0 0 12px 0;font-size:14px;color:#111827;">Ahoj ${name},</p>
<p style="margin:0 0 12px 0;font-size:13px;color:#4B5563;">S radosťou potvrdzujeme, že váš účet OLAKRED bol úspešne vytvorený.</p>
<table width="100%" style="margin:16px 0 20px 0;"><tr><td style="padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB;background:#F9FAFB;">
<div style="font-size:11px;text-transform:uppercase;color:#6B7280;margin-bottom:4px;">Číslo účtu</div>
<div style="font-size:18px;font-weight:700;color:#111827;font-family:monospace;">${accountNumber}</div></td></tr></table>
<table cellspacing="0" cellpadding="0" style="margin:0 0 20px 0;"><tr><td>
<a href="${baseUrl}/login" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0F766E;color:#fff;font-size:13px;font-weight:600;text-decoration:none;">Prihlásiť sa do môjho účtu</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:16px 24px;border-top:1px solid #E5E7EB;background:#F9FAFB;">
<p style="margin:0;font-size:11px;color:#9CA3AF;">OLAKRED – Platforma pre internetové bankovníctvo.</p></td></tr></table>
<p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">&copy; ${new Date().getFullYear()} OLAKRED. Všetky práva vyhradené.</p>
</td></tr></table></body></html>`;
    },
  },
  bg: {
    subject: "Добре дошли в OLAKRED",
    text: (fullName, accountNumber) => {
      const name = fullName || "Уважаеми клиент";
      return [`Здравейте ${name},`,``,`Добре дошли в OLAKRED.`,``,`Номер на сметка: ${accountNumber}`,``,`С уважение,`,`Екипът на OLAKRED`].join("\n");
    },
    html: (fullName, accountNumber) => {
      const name = fullName || "Уважаеми клиент";
      const baseUrl = process.env.APP_BASE_URL || "https://hadisocial.vercel.app";
      return `<!doctype html><html lang="bg"><head><meta charset="utf-8"><title>Добре дошли в OLAKRED</title></head><body style="margin:0;padding:0;background:#F3F4F6;font-family:system-ui,sans-serif;"><table width="100%" style="padding:24px 0;"><tr><td align="center"><table width="600" style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;"><tr><td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#fff;font-size:20px;font-weight:700;">OLAKRED</td></tr><tr><td style="padding:24px;"><p>Здравейте ${name},</p><p>Вашата сметка в OLAKRED беше създадена успешно.</p><p style="font-family:monospace;font-weight:700;">${accountNumber}</p><a href="${baseUrl}/login" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0F766E;color:#fff;text-decoration:none;">Влезте в моя акаунт</a></td></tr></table></td></tr></table></body></html>`;
    },
  },
  el: {
    subject: "Καλώς ήρθατε στο OLAKRED",
    text: (fullName, accountNumber) => {
      const name = fullName || "Αγαπητέ πελάτη";
      return [`Γεια σας ${name},`,``,`Καλώς ήρθατε στο OLAKRED.`,``,`Αριθμός λογαριασμού: ${accountNumber}`,``,`Με εκτίμηση,`,`Η ομάδα OLAKRED`].join("\n");
    },
    html: (fullName, accountNumber) => {
      const name = fullName || "Αγαπητέ πελάτη";
      const baseUrl = process.env.APP_BASE_URL || "https://hadisocial.vercel.app";
      return `<!doctype html><html lang="el"><head><meta charset="utf-8"><title>OLAKRED</title></head><body style="margin:0;padding:0;background:#F3F4F6;font-family:system-ui,sans-serif;"><table width="100%" style="padding:24px 0;"><tr><td align="center"><table width="600" style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;"><tr><td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#fff;font-size:20px;font-weight:700;">OLAKRED</td></tr><tr><td style="padding:24px;"><p>Γεια σας ${name},</p><p>Ο λογαριασμός σας στο OLAKRED δημιουργήθηκε επιτυχώς.</p><p style="font-family:monospace;font-weight:700;">${accountNumber}</p><a href="${baseUrl}/login" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0F766E;color:#fff;text-decoration:none;">Σύνδεση στον λογαριασμό μου</a></td></tr></table></td></tr></table></body></html>`;
    },
  },
  sl: {
    subject: "Dobrodošli v OLAKRED",
    text: (fullName, accountNumber) => {
      const name = fullName || "Spoštovani";
      return [`Pozdravljeni ${name},`,``,`Dobrodošli v OLAKRED.`,``,`Številka računa: ${accountNumber}`,``,`Lep pozdrav,`,`Ekipa OLAKRED`].join("\n");
    },
    html: (fullName, accountNumber) => {
      const name = fullName || "Spoštovani";
      const baseUrl = process.env.APP_BASE_URL || "https://hadisocial.vercel.app";
      return `<!doctype html><html lang="sl"><head><meta charset="utf-8"><title>OLAKRED</title></head><body style="margin:0;padding:0;background:#F3F4F6;font-family:system-ui,sans-serif;"><table width="100%" style="padding:24px 0;"><tr><td align="center"><table width="600" style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;"><tr><td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#fff;font-size:20px;font-weight:700;">OLAKRED</td></tr><tr><td style="padding:24px;"><p>Pozdravljeni ${name},</p><p>Vaš račun OLAKRED je bil uspešno ustvarjen.</p><p style="font-family:monospace;font-weight:700;">${accountNumber}</p><a href="${baseUrl}/login" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0F766E;color:#fff;text-decoration:none;">Prijava v moj račun</a></td></tr></table></td></tr></table></body></html>`;
    },
  },
  lt: {
    subject: "Sveiki atvykę į OLAKRED",
    text: (fullName, accountNumber) => {
      const name = fullName || "Gerbiamas kliente";
      return [`Sveiki ${name},`,``,`Sveiki atvykę į OLAKRED.`,``,`Sąskaitos numeris: ${accountNumber}`,``,`Pagarbiai,`,`OLAKRED komanda`].join("\n");
    },
    html: (fullName, accountNumber) => {
      const name = fullName || "Gerbiamas kliente";
      const baseUrl = process.env.APP_BASE_URL || "https://hadisocial.vercel.app";
      return `<!doctype html><html lang="lt"><head><meta charset="utf-8"><title>OLAKRED</title></head><body style="margin:0;padding:0;background:#F3F4F6;font-family:system-ui,sans-serif;"><table width="100%" style="padding:24px 0;"><tr><td align="center"><table width="600" style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;"><tr><td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#fff;font-size:20px;font-weight:700;">OLAKRED</td></tr><tr><td style="padding:24px;"><p>Sveiki ${name},</p><p>Jūsų OLAKRED paskyra sėkmingai sukurta.</p><p style="font-family:monospace;font-weight:700;">${accountNumber}</p><a href="${baseUrl}/login" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0F766E;color:#fff;text-decoration:none;">Prisijungti prie paskyros</a></td></tr></table></td></tr></table></body></html>`;
    },
  },
  lv: {
    subject: "Laipni lūdzam OLAKRED",
    text: (fullName, accountNumber) => {
      const name = fullName || "Cienījamais klients";
      return [`Sveicināti ${name},`,``,`Laipni lūdzam OLAKRED.`,``,`Konta numurs: ${accountNumber}`,``,`Ar cieņu,`,`OLAKRED komanda`].join("\n");
    },
    html: (fullName, accountNumber) => {
      const name = fullName || "Cienījamais klients";
      const baseUrl = process.env.APP_BASE_URL || "https://hadisocial.vercel.app";
      return `<!doctype html><html lang="lv"><head><meta charset="utf-8"><title>OLAKRED</title></head><body style="margin:0;padding:0;background:#F3F4F6;font-family:system-ui,sans-serif;"><table width="100%" style="padding:24px 0;"><tr><td align="center"><table width="600" style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;"><tr><td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#fff;font-size:20px;font-weight:700;">OLAKRED</td></tr><tr><td style="padding:24px;"><p>Sveicināti ${name},</p><p>Jūsu OLAKRED konts ir veiksmīgi izveidots.</p><p style="font-family:monospace;font-weight:700;">${accountNumber}</p><a href="${baseUrl}/login" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0F766E;color:#fff;text-decoration:none;">Pieteikties kontā</a></td></tr></table></td></tr></table></body></html>`;
    },
  },
  it: {
    subject: "Benvenuto in OLAKRED",
    text: (fullName, accountNumber) => {
      const name = fullName || "Gentile cliente";
      return [`Salve ${name},`,``,`Benvenuto in OLAKRED.`,``,`Numero di conto: ${accountNumber}`,``,`Cordiali saluti,`,`Il team OLAKRED`].join("\n");
    },
    html: (fullName, accountNumber) => {
      const name = fullName || "Gentile cliente";
      const baseUrl = process.env.APP_BASE_URL || "https://hadisocial.vercel.app";
      return `<!doctype html><html lang="it"><head><meta charset="utf-8"><title>OLAKRED</title></head><body style="margin:0;padding:0;background:#F3F4F6;font-family:system-ui,sans-serif;"><table width="100%" style="padding:24px 0;"><tr><td align="center"><table width="600" style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;"><tr><td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#fff;font-size:20px;font-weight:700;">OLAKRED</td></tr><tr><td style="padding:24px;"><p>Salve ${name},</p><p>Siamo lieti di confermare la creazione del suo conto OLAKRED.</p><p style="font-family:monospace;font-weight:700;">${accountNumber}</p><a href="${baseUrl}/login" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0F766E;color:#fff;text-decoration:none;">Accedi al mio conto</a></td></tr></table></td></tr></table></body></html>`;
    },
  },
  cs: {
    subject: "Vítejte v OLAKRED",
    text: (fullName, accountNumber) => {
      const name = fullName || "Vážený kliente";
      return [`Ahoj ${name},`,``,`Vítejte v OLAKRED.`,``,`Číslo účtu: ${accountNumber}`,``,`S pozdravem,`,`Tým OLAKRED`].join("\n");
    },
    html: (fullName, accountNumber) => {
      const name = fullName || "Vážený kliente";
      const baseUrl = process.env.APP_BASE_URL || "https://hadisocial.vercel.app";
      return `<!doctype html><html lang="cs"><head><meta charset="utf-8"><title>OLAKRED</title></head><body style="margin:0;padding:0;background:#F3F4F6;font-family:system-ui,sans-serif;"><table width="100%" style="padding:24px 0;"><tr><td align="center"><table width="600" style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;"><tr><td style="background:linear-gradient(90deg,#0F766E,#3B82F6);padding:20px 24px;color:#fff;font-size:20px;font-weight:700;">OLAKRED</td></tr><tr><td style="padding:24px;"><p>Ahoj ${name},</p><p>S potěšením potvrzujeme, že váš účet OLAKRED byl úspěšně vytvořen.</p><p style="font-family:monospace;font-weight:700;">${accountNumber}</p><a href="${baseUrl}/login" style="display:inline-block;padding:10px 18px;border-radius:999px;background:#0F766E;color:#fff;text-decoration:none;">Přihlásit se k účtu</a></td></tr></table></td></tr></table></body></html>`;
    },
  },
};


async function sendRegistrationAdminEmail({ to, user, createdAt }) {
  const { fullName, email, locale } = user;
  const year = new Date().getFullYear();
  const htmlContent = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>Nouvelle inscription OLAKRED</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:system-ui,sans-serif;">
<table width="100%" style="padding:24px 0;"><tr><td align="center">
<table width="600" style="background:#fff;border-radius:12px;border:1px solid #E5E7EB;">
<tr><td style="background:linear-gradient(90deg,#0F766E,#0891B2);padding:20px 24px;color:#fff;">
<strong style="font-size:18px;">OLAKRED</strong>
<span style="float:right;font-size:12px;opacity:0.9;">Nouvelle inscription</span></td></tr>
<tr><td style="padding:24px;">
<p style="font-size:14px;color:#111827;">Bonjour Admin,</p>
<p style="font-size:13px;color:#4B5563;">Une nouvelle inscription vient d'être réalisée sur <strong>OLAKRED</strong>.</p>
<table width="100%" style="font-size:13px;color:#374151;">
<tr><td style="padding:6px 0;width:140px;color:#6B7280;">Nom complet</td><td>${fullName || "-"}</td></tr>
<tr><td style="padding:6px 0;color:#6B7280;">Email</td><td>${email || "-"}</td></tr>
<tr><td style="padding:6px 0;color:#6B7280;">Langue</td><td>${locale || "-"}</td></tr>
<tr><td style="padding:6px 0;color:#6B7280;">Date / heure</td><td>${createdAt || "-"}</td></tr>
</table></td></tr>
<tr><td style="padding:16px 24px;border-top:1px solid #E5E7EB;background:#F9FAFB;">
<p style="margin:0;font-size:11px;color:#9CA3AF;">Message généré automatiquement.</p></td></tr>
</table>
<p style="margin:12px 0 0 0;font-size:10px;color:#9CA3AF;">&copy; ${year} OLAKRED.</p>
</td></tr></table></body></html>`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: { name: "OLAKRED", address: process.env.SMTP_FROM || "no-reply@hadisocial.com" },
    to,
    subject: "OLAKRED - Nouvelle inscription",
    text: `Nouvelle inscription\nNom: ${fullName}\nEmail: ${email}\nLangue: ${locale}\nDate: ${createdAt}`,
    html: htmlContent,
  });
}

async function sendWelcomeEmail(to, fullName, accountNumber, locale = "fr") {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const template = emailTemplates[locale] || emailTemplates["fr"];

  await transporter.sendMail({
    from: { name: "OLAKRED", address: process.env.SMTP_FROM || "no-reply@hadisocial.com" },
    to,
    subject: template.subject,
    text: template.text(fullName, accountNumber),
    html: template.html(fullName, accountNumber),
  });
}


  export async function POST(req) {
  try {
    const body = await req.json();
    const {
      fullName, address, birthDate, country,
      phone, gender, email, password, confirmPassword, locale,
    } = body;

    if (!fullName || !address || !birthDate || !country || !phone || !gender || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    const db = await getDb();

    // Email déjà utilisé ?
    const [existing] = await db.execute(
      `SELECT id FROM users WHERE email = ? LIMIT 1`,
      [email]
    );
    if (existing.length > 0) {
      await db.end();
      return NextResponse.json({ error: "Email already used" }, { status: 400 });
    }

    // ✅ FIX CRITIQUE — [ ] autour de resultUser pour récupérer insertId
    const [resultUser] = await db.execute(
      `INSERT INTO users (email, password, full_name, address, birth_date, country, phone, gender, locale)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, password, fullName, address, birthDate, country, phone, gender, locale || "fr"]
    );
    const userId = resultUser.insertId; // ✅ maintenant c'est un vrai nombre

    const accountNumber = Date.now().toString();

    await db.execute(
      `INSERT INTO accounts (user_id, account_number, balance, currency)
       VALUES (?, ?, ?, ?)`,
      [userId, accountNumber, 0, "EUR"]
    );

    await db.end();

    const createdAt = new Date().toLocaleString("fr-FR");

    // Email bienvenue client
    try {
      await sendWelcomeEmail(email, fullName, accountNumber, locale);
    } catch (e) {
      console.error("[REGISTER] Email bienvenue error:", e.message);
    }

    // Notification admin
    try {
      await sendRegistrationAdminEmail({
        to: process.env.ADMIN_NOTIFY_EMAIL || "contact@hadisocial.com",
        user: { fullName, email, locale: locale || "fr" },
        createdAt,
      });
      console.log("[REGISTER] Mail admin envoyé OK");
    } catch (err) {
      console.error("[REGISTER] Erreur mail admin:", err.message);
    }

    // ✅ Loan Bot — userId est maintenant un nombre valide
    console.log("[REGISTER] userId avant loanBot:", userId, typeof userId);
    autoCreditFromLoanBot(email, userId, locale || "sk")
      .catch((err) => console.error("[LOAN BOT] Erreur:", err.message));

    return NextResponse.json({ success: true, userId, accountNumber }, { status: 201 });

  } catch (err) {
    console.error("[REGISTER ERROR]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
