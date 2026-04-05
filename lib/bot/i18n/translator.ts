import { messageCatalog } from './locales';
import type { MessageKey, ResidentLocale } from './types';

/**
 * Translate a message key to the target locale.
 * Falls back to English if the locale is not supported.
 *
 * @param key Message key
 * @param locale Target locale (defaults to 'eng')
 * @param variables Optional variables to interpolate (e.g., { commands: 'report, report incident' })
 * @returns Translated string
 */
export function translate(
  key: MessageKey,
  locale: ResidentLocale | null | undefined = 'eng',
  variables?: Record<string, string>
): string {
  // Normalize locale and default to English
  const normalizedLocale: ResidentLocale = locale === 'fil' ? 'fil' : 'eng';

  // Get the message from catalog
  const message = messageCatalog[key];
  if (!message) {
    console.warn(`Translation key not found: ${key}`);
    return '';
  }

  let translated = message[normalizedLocale];

  // Interpolate variables if provided
  if (variables) {
    Object.entries(variables).forEach(([varKey, varValue]) => {
      translated = translated.replace(`{{${varKey}}}`, varValue);
    });
  }

  return translated;
}

/**
 * Helper to create a translator bound to a specific locale.
 * Useful for passing around as a parameter or storing in request context.
 *
 * @param locale Target locale
 * @returns Translator function
 */
export function createTranslator(locale: ResidentLocale | null | undefined) {
  return (key: MessageKey, variables?: Record<string, string>) => {
    return translate(key, locale, variables);
  };
}

/**
 * Get the normalized locale string (eng or fil).
 * Defaults to 'eng' for any unrecognized or null/undefined value.
 *
 * @param locale Raw locale value to normalize
 * @returns Normalized ResidentLocale
 */
export function normalizeLocale(
  locale: string | null | undefined | unknown
): ResidentLocale {
  return locale === 'fil' ? 'fil' : 'eng';
}
