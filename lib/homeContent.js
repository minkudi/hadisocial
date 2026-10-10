// Contenus de la page d'accueil publique (One Page).
// Structure : fr complet ; les autres langues traduisent les mêmes clés.
export const HOME_CONTENT = {
  fr: {
    nav: { services: "Services", security: "Sécurité", faq: "FAQ", login: "Se connecter", openAccount: "Ouvrir un compte" },
    hero: {
      badge: "Banque en ligne européenne",
      title: "Votre banque, sans compromis.",
      subtitle: "Compte courant, carte de paiement et virements internationaux : gérez votre argent en toute sécurité, où que vous soyez.",
      ctaPrimary: "Ouvrir votre compte",
      ctaSecondary: "Se connecter",
      trust1: "Fonds ségréés",
      trust2: "IBAN européen",
      trust3: "Support multilingue",
      photoAlt: "Un conseiller SCAP BEN accueille deux clients venus ouvrir un compte",
    },
    stats: [
      { value: "27", label: "Pays desservis" },
      { value: "16", label: "Langues disponibles" },
      { value: "50 000+", label: "Clients actifs" },
      { value: "99,9 %", label: "Disponibilité" },
    ],
    services: {
      title: "Des services complets",
      subtitle: "Tout le quotidien d'une banque moderne, dans un espace clair et sécurisé.",
      cards: [
        { title: "Compte courant", desc: "Ouverture simple, IBAN européen et gestion intégrale depuis votre espace." },
        { title: "Cartes de paiement", desc: "Cartes de débit sécurisées, contrôle et blocage instantanés en ligne." },
        { title: "Virements", desc: "Virements SEPA et internationaux avec suivi en temps réel." },
        { title: "Crédits", desc: "Demandes de prêt accompagnées et créditées après signature du contrat." },
        { title: "Relevés PDF", desc: "Historique complet de vos opérations, exportable à tout moment." },
        { title: "Support 7j/7", desc: "Une équipe multilingue joignable par email et par téléphone." },
      ],
    },
    product: {
      title: "Votre argent, sous vos yeux",
      subtitle: "Un tableau de bord clair : solde, graphiques et historique en un coup d'œil.",
      bullets: [
        { title: "Suivi en temps réel", desc: "Chaque opération est visible immédiatement avec sa référence." },
        { title: "Virements en 3 clics", desc: "IBAN, montant, motif : vos virements partent en quelques secondes." },
        { title: "Historique exportable", desc: "Relevés mensuels en PDF, prêts pour vos comptabilités." },
      ],
    },
    cardSection: {
      title: "La carte SCAP BEN",
      subtitle: "Une carte de débit sobre et sécurisée, acceptée partout dans le monde.",
      bullets: [
        "Paiements sans contact et retraits internationaux",
        "Blocage et déblocage instantanés depuis votre espace",
        "Notifications à chaque utilisation",
      ],
    },
    advisor: {
      title: "L'humain reste au centre",
      text: "Derrière l'écran, une vraie équipe : nos conseillers vous accompagnent à l'ouverture de votre compte comme dans vos opérations quotidiennes, dans votre langue.",
    },
    security: {
      title: "La sécurité, notre priorité",
      subtitle: "Des protections concrètes, activées par défaut.",
      items: [
        { title: "Sessions protégées", desc: "Connexion chiffrée et contrôle d'accès strict à votre espace." },
        { title: "Alertes temps réel", desc: "Email et SMS à chaque opération sur votre compte." },
        { title: "Vérification anti-fraude", desc: "Analyse des opérations sensibles avant validation." },
        { title: "Fonds ségréés", desc: "Les fonds des clients sont conservés séparément des fonds de la banque." },
      ],
    },
    faq: {
      title: "Questions fréquentes",
      items: [
        { q: "Comment ouvrir un compte ?", a: "Cliquez sur « Ouvrir un compte », remplissez le formulaire d'inscription et choisissez votre langue. Votre compte est créé immédiatement avec votre IBAN." },
        { q: "Quels documents sont nécessaires ?", a: "Une pièce d'identité en cours de validité et vos coordonnées. Aucun document physique n'est requis pour l'ouverture en ligne." },
        { q: "Combien de temps prend un virement ?", a: "Les virements SEPA sont généralement exécutés sous un jour ouvré. Les virements internationaux dépendent du pays de destination." },
        { q: "Dans quelles langues le service est-il disponible ?", a: "L'interface et les notifications sont disponibles en 16 langues, dont le français, l'anglais, le slovaque et l'allemand." },
        { q: "Comment contacter un conseiller ?", a: "Écrivez à contact@scap-ben.com ou utilisez votre espace client : notre équipe répond 7 jours sur 7." },
      ],
    },
    cta: { title: "Prêt à rejoindre SCAP BEN ?", subtitle: "Ouvrez votre compte en quelques minutes, depuis n'importe où.", button: "Ouvrir votre compte" },
    footer: {
      legal: "Mentions légales",
      privacy: "Politique de confidentialité",
      terms: "Conditions générales",
      rights: "Tous droits réservés.",
    },
  },

  en: {
    nav: { services: "Services", security: "Security", faq: "FAQ", login: "Log in", openAccount: "Open an account" },
    hero: {
      badge: "European online bank",
      title: "Your bank, without compromise.",
      subtitle: "Current account, payment card and international transfers: manage your money securely, wherever you are.",
      ctaPrimary: "Open your account",
      ctaSecondary: "Log in",
      trust1: "Segregated funds",
      trust2: "European IBAN",
      trust3: "Multilingual support",
      photoAlt: "A SCAP BEN advisor welcomes two clients who have come to open an account",
    },
    stats: [
      { value: "27", label: "Countries served" },
      { value: "16", label: "Languages available" },
      { value: "50,000+", label: "Active clients" },
      { value: "99.9%", label: "Availability" },
    ],
    services: {
      title: "Comprehensive services",
      subtitle: "Everything a modern bank offers, in a clear and secure space.",
      cards: [
        { title: "Current account", desc: "Simple opening, European IBAN and full management from your dashboard." },
        { title: "Payment cards", desc: "Secure debit cards with instant online control and blocking." },
        { title: "Transfers", desc: "SEPA and international transfers with real-time tracking." },
        { title: "Loans", desc: "Assisted loan requests, credited after contract signature." },
        { title: "PDF statements", desc: "Complete transaction history, exportable at any time." },
        { title: "Support 7 days a week", desc: "A multilingual team reachable by email and phone." },
      ],
    },
    product: {
      title: "Your money, at a glance",
      subtitle: "A clear dashboard: balance, charts and history in one look.",
      bullets: [
        { title: "Real-time tracking", desc: "Every transaction is visible immediately with its reference." },
        { title: "Transfers in 3 clicks", desc: "IBAN, amount, label: your transfers are sent in seconds." },
        { title: "Exportable history", desc: "Monthly PDF statements, ready for your accounting." },
      ],
    },
    cardSection: {
      title: "The SCAP BEN card",
      subtitle: "A sober, secure debit card, accepted all over the world.",
      bullets: [
        "Contactless payments and international withdrawals",
        "Instant blocking and unblocking from your dashboard",
        "Notifications on every use",
      ],
    },
    advisor: {
      title: "People stay at the center",
      text: "Behind the screen, a real team: our advisors support you when opening your account as well as in your daily operations, in your language.",
    },
    security: {
      title: "Security is our priority",
      subtitle: "Concrete protections, enabled by default.",
      items: [
        { title: "Protected sessions", desc: "Encrypted connection and strict access control to your account." },
        { title: "Real-time alerts", desc: "Email and SMS for every transaction on your account." },
        { title: "Anti-fraud checks", desc: "Sensitive transactions are analyzed before validation." },
        { title: "Segregated funds", desc: "Client funds are kept separate from the bank's own funds." },
      ],
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        { q: "How do I open an account?", a: "Click on “Open an account”, fill in the registration form and choose your language. Your account is created immediately with your IBAN." },
        { q: "Which documents are required?", a: "A valid ID and your contact details. No physical documents are required for online opening." },
        { q: "How long does a transfer take?", a: "SEPA transfers are usually executed within one business day. International transfers depend on the destination country." },
        { q: "Which languages are available?", a: "The interface and notifications are available in 16 languages, including French, English, Slovak and German." },
        { q: "How do I contact an advisor?", a: "Write to contact@scap-ben.com or use your client area: our team answers 7 days a week." },
      ],
    },
    cta: { title: "Ready to join SCAP BEN?", subtitle: "Open your account in minutes, from anywhere.", button: "Open your account" },
    footer: { legal: "Legal notice", privacy: "Privacy policy", terms: "Terms and conditions", rights: "All rights reserved." },
  },

  de: {
    nav: { services: "Dienstleistungen", security: "Sicherheit", faq: "FAQ", login: "Anmelden", openAccount: "Konto eröffnen" },
    hero: {
      badge: "Europäische Online-Bank",
      title: "Ihre Bank, ohne Kompromisse.",
      subtitle: "Girokonto, Zahlungskarte und internationale Überweisungen: Verwalten Sie Ihr Geld sicher, wo auch immer Sie sind.",
      ctaPrimary: "Konto eröffnen",
      ctaSecondary: "Anmelden",
      trust1: "Getrennt verwahrte Mittel",
      trust2: "Europäische IBAN",
      trust3: "Mehrsprachiger Support",
      photoAlt: "Ein SCAP BEN-Berater begrüßt zwei Kunden, die ein Konto eröffnen möchten",
    },
    stats: [
      { value: "27", label: "Betreute Länder" },
      { value: "16", label: "Verfügbare Sprachen" },
      { value: "50.000+", label: "Aktive Kunden" },
      { value: "99,9 %", label: "Verfügbarkeit" },
    ],
    services: {
      title: "Umfassende Dienstleistungen",
      subtitle: "Alles, was eine moderne Bank bietet, in einem klaren und sicheren Bereich.",
      cards: [
        { title: "Girokonto", desc: "Einfache Eröffnung, europäische IBAN und komplette Verwaltung aus Ihrem Bereich." },
        { title: "Zahlungskarten", desc: "Sichere Debitkarten mit sofortiger Online-Kontrolle und Sperre." },
        { title: "Überweisungen", desc: "SEPA- und internationale Überweisungen mit Echtzeitverfolgung." },
        { title: "Kredite", desc: "Begleitete Kreditanträge, Auszahlung nach Vertragsunterzeichnung." },
        { title: "PDF-Auszüge", desc: "Vollständiger Transaktionsverlauf, jederzeit exportierbar." },
        { title: "Support 7 Tage/Woche", desc: "Ein mehrsprachiges Team per E-Mail und Telefon erreichbar." },
      ],
    },
    product: {
      title: "Ihr Geld, im Blick",
      subtitle: "Ein klares Dashboard: Guthaben, Grafiken und Verlauf auf einen Blick.",
      bullets: [
        { title: "Echtzeitverfolgung", desc: "Jede Transaktion ist sofort mit ihrer Referenz sichtbar." },
        { title: "Überweisungen in 3 Klicks", desc: "IBAN, Betrag, Verwendungszweck: In Sekunden verschickt." },
        { title: "Exportierbarer Verlauf", desc: "Monatliche PDF-Auszüge, bereit für Ihre Buchhaltung." },
      ],
    },
    cardSection: {
      title: "Die SCAP BEN-Karte",
      subtitle: "Eine schlichte, sichere Debitkarte, weltweit akzeptiert.",
      bullets: [
        "Kontaktlose Zahlungen und internationale Abhebungen",
        "Sofortiges Sperren und Entsperren aus Ihrem Bereich",
        "Benachrichtigungen bei jeder Nutzung",
      ],
    },
    advisor: {
      title: "Der Mensch bleibt im Mittelpunkt",
      text: "Hinter dem Bildschirm steht ein echtes Team: Unsere Berater begleiten Sie bei der Kontoeröffnung wie bei Ihren täglichen Vorgängen, in Ihrer Sprache.",
    },
    security: {
      title: "Sicherheit hat Priorität",
      subtitle: "Konkrete Schutzmaßnahmen, standardmäßig aktiv.",
      items: [
        { title: "Geschützte Sitzungen", desc: "Verschlüsselte Verbindung und strenge Zugangskontrolle." },
        { title: "Echtzeit-Warnungen", desc: "E-Mail und SMS bei jeder Transaktion auf Ihrem Konto." },
        { title: "Betrugskontrolle", desc: "Sensible Transaktionen werden vor der Validierung geprüft." },
        { title: "Getrennte Mittel", desc: "Kundengelder werden getrennt von den Bankmitteln verwahrt." },
      ],
    },
    faq: {
      title: "Häufige Fragen",
      items: [
        { q: "Wie eröffne ich ein Konto?", a: "Klicken Sie auf „Konto eröffnen“, füllen Sie das Anmeldeformular aus und wählen Sie Ihre Sprache. Ihr Konto wird sofort mit Ihrer IBAN erstellt." },
        { q: "Welche Unterlagen sind nötig?", a: "Ein gültiger Ausweis und Ihre Kontaktdaten. Für die Online-Eröffnung sind keine physischen Dokumente erforderlich." },
        { q: "Wie lange dauert eine Überweisung?", a: "SEPA-Überweisungen werden in der Regel innerhalb eines Werktags ausgeführt. Internationale Überweisungen hängen vom Zielland ab." },
        { q: "In welchen Sprachen ist der Service verfügbar?", a: "Die Oberfläche und die Benachrichtigungen sind in 16 Sprachen verfügbar, darunter Französisch, Englisch, Slowakisch und Deutsch." },
        { q: "Wie erreiche ich einen Berater?", a: "Schreiben Sie an contact@scap-ben.com oder nutzen Sie Ihren Kundenbereich: Unser Team antwortet 7 Tage pro Woche." },
      ],
    },
    cta: { title: "Bereit für SCAP BEN?", subtitle: "Eröffnen Sie Ihr Konto in wenigen Minuten, von überall.", button: "Konto eröffnen" },
    footer: { legal: "Impressum", privacy: "Datenschutz", terms: "Allgemeine Geschäftsbedingungen", rights: "Alle Rechte vorbehalten." },
  },

  sk: {
    nav: { services: "Služby", security: "Zabezpečenie", faq: "FAQ", login: "Prihlásiť sa", openAccount: "Otvoriť účet" },
    hero: {
      badge: "Európska internetová banka",
      title: "Vaša banka bez kompromisov.",
      subtitle: "Bežný účet, platobná karta a medzinárodné prevody: spravujte svoje peniaze bezpečne, kdekoľvek ste.",
      ctaPrimary: "Otvoriť účet",
      ctaSecondary: "Prihlásiť sa",
      trust1: "Oddelené prostriedky",
      trust2: "Európska IBAN",
      trust3: "Viacjazyčná podpora",
      photoAlt: "Poradca SCAP BEN víta dvoch klientov, ktorí prídu otvoriť účet",
    },
    stats: [
      { value: "27", label: "Obsluhovaných krajín" },
      { value: "16", label: "Dostupných jazykov" },
      { value: "50 000+", label: "Aktívnych klientov" },
      { value: "99,9 %", label: "Dostupnosť" },
    ],
    services: {
      title: "Kompletné služby",
      subtitle: "Všetko, čo ponúka moderná banka, v prehľadnom a bezpečnom priestore.",
      cards: [
        { title: "Bežný účet", desc: "Jednoduché otvorenie, európska IBAN a úplná správa z vášho priestoru." },
        { title: "Platobné karty", desc: "Bezpečné debetné karty s okamžitým ovládaním a blokovaním online." },
        { title: "Prevody", desc: "SEPA a medzinárodné prevody so sledovaním v reálnom čase." },
        { title: "Úvery", desc: "Sprevádzané žiadosti o pôžičky, pripísané po podpise zmluvy." },
        { title: "Výpisy PDF", desc: "Úplná história operácií, ktorú kedykoľvek vyexportujete." },
        { title: "Podpora 7 dní v týždni", desc: "Viacjazyčný tím dostupný e-mailom a telefónom." },
      ],
    },
    product: {
      title: "Vaše peniaze na prvý pohľad",
      subtitle: "Prehľadný dashboard: zostatok, grafy a história na jeden pohľad.",
      bullets: [
        { title: "Sledovanie v reálnom čase", desc: "Každá operácia je okamžite viditeľná so svojou referenciou." },
        { title: "Prevody na 3 kliknutia", desc: "IBAN, suma, poznámka: prevody odchádzajú v pár sekundách." },
        { title: "Exportovateľná história", desc: "Mesačné výpisy v PDF, pripravené pre vaše účtovníctvo." },
      ],
    },
    cardSection: {
      title: "Karta SCAP BEN",
      subtitle: "Strojová, bezpečná debetná karta prijímaná po celom svete.",
      bullets: [
        "Bezkontaktné platby a medzinárodné výbery",
        "Okamžité zablokovanie a odblokovanie z vášho priestoru",
        "Upozornenia pri každom použití",
      ],
    },
    advisor: {
      title: "Človek ostáva v strede",
      text: "Za obrazovkou stojí skutočný tím: naši poradcovia vás sprevádzajú pri otvorení účtu aj pri každodenných operáciách, vo vašom jazyku.",
    },
    security: {
      title: "Zabezpečenie je našou prioritou",
      subtitle: "Konkrétne ochrany, aktívne v predvolenom nastavení.",
      items: [
        { title: "Chránené relácie", desc: "Šifrované pripojenie a prísna kontrola prístupu do vášho priestoru." },
        { title: "Upozornenia v reálnom čase", desc: "E-mail a SMS pri každej operácii na vašom účte." },
        { title: "Kontrola proti podvodom", desc: "Citlivé operácie sa pred schválením analyzujú." },
        { title: "Oddelené prostriedky", desc: "Prostriedky klientov sú uložené oddelene od prostriedkov banky." },
      ],
    },
    faq: {
      title: "Časté otázky",
      items: [
        { q: "Ako si otvorím účet?", a: "Kliknite na „Otvoriť účet“, vyplňte registračný formulár a vyberte si jazyk. Váš účet sa vytvorí okamžite s vašou IBAN." },
        { q: "Aké dokumenty sú potrebné?", a: "Platný doklad totožnosti a vaše kontaktné údaje. Na online otvorenie nie sú potrebné žiadne fyzické dokumenty." },
        { q: "Ako dlho trvá prevod?", a: "SEPA prevody sa zvyčajne uskutočnia do jedného pracovného dňa. Medzinárodné prevody závisia od krajiny určenia." },
        { q: "V akých jazykoch je služba dostupná?", a: "Rozhranie a upozornenia sú dostupné v 16 jazykoch, vrátane francúzštiny, angličtiny, slovenčiny a nemčiny." },
        { q: "Ako kontaktujem poradcu?", a: "Napíšte na contact@scap-ben.com alebo využite klientsku zónu: náš tím odpovedá 7 dní v týždni." },
      ],
    },
    cta: { title: "Pripravení pripojiť sa k SCAP BEN?", subtitle: "Otvorte si účet za pár minút, odkiaľkoľvek.", button: "Otvoriť účet" },
    footer: { legal: "Právne informácie", privacy: "Zásady ochrany súkromia", terms: "Všeobecné podmienky", rights: "Všetky práva vyhradené." },
  },
};

// Fallbacks sobres pour les autres langues activables (texte anglais).
const EN = HOME_CONTENT.en;
for (const code of ["nl", "fi", "es", "pl", "pt", "bg", "el", "sl", "lt", "lv", "it", "cs"]) {
  if (!HOME_CONTENT[code]) HOME_CONTENT[code] = EN;
}

export function getHomeContent(locale) {
  return HOME_CONTENT[locale] || HOME_CONTENT.fr;
}
