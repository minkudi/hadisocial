// Liste complète des langues disponibles dans l'application.
// Chaque langue possède un fichier messages/<code>.json.
// flagCode : code du pays pour flagcdn.com (images de drapeaux,
// car Windows n'affiche pas les emojis drapeaux).
export const ALL_LOCALES = [
  { code: "fr", label: "Français", flagCode: "fr" },
  { code: "en", label: "English", flagCode: "gb" },
  { code: "sk", label: "Slovenčina", flagCode: "sk" },
  { code: "de", label: "Deutsch", flagCode: "de" },
  { code: "nl", label: "Nederlands", flagCode: "nl" },
  { code: "fi", label: "Suomi", flagCode: "fi" },
  { code: "es", label: "Español", flagCode: "es" },
  { code: "pl", label: "Polski", flagCode: "pl" },
  { code: "pt", label: "Português", flagCode: "pt" },
  { code: "bg", label: "Български", flagCode: "bg" },
  { code: "el", label: "Ελληνικά", flagCode: "gr" },
  { code: "sl", label: "Slovenščina", flagCode: "si" },
  { code: "lt", label: "Lietuvių", flagCode: "lt" },
  { code: "lv", label: "Latviešu", flagCode: "lv" },
  { code: "it", label: "Italiano", flagCode: "it" },
  { code: "cs", label: "Čeština", flagCode: "cz" },
];

export function flagUrl(flagCode, size = "w20") {
  return `https://flagcdn.com/${size}/${flagCode}.png`;
}

export const DEFAULT_ENABLED_LOCALES = ["fr", "en", "sk", "de"];

export const DEFAULT_LOCALE = "fr";
