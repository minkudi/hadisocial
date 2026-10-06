// Helpers côté serveur pour les langues activées (accès base de données).
import { getDb } from "./db";
import { DEFAULT_ENABLED_LOCALES } from "./availableLocales";

export async function getEnabledLocales() {
  try {
    const db = await getDb();
    const [rows] = await db.execute(
      "SELECT enabled_locales FROM settings WHERE id = 1 LIMIT 1"
    );
    await db.end();

    if (!rows.length || !rows[0].enabled_locales) {
      return DEFAULT_ENABLED_LOCALES;
    }

    try {
      const parsed = JSON.parse(rows[0].enabled_locales);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (_) {}

    return DEFAULT_ENABLED_LOCALES;
  } catch (err) {
    console.error("getEnabledLocales error:", err);
    return DEFAULT_ENABLED_LOCALES;
  }
}
