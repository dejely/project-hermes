/**
 * Supported locale codes for resident-facing bot messages.
 *
 * Update this list when adding or removing locale support.
 */
export const SUPPORTED_LOCALES = ['eng', 'fil', 'hil'] as const;

export type ResidentLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Global default locale used as fallback in translation resolution.
 */
export const DEFAULT_LOCALE: ResidentLocale = 'eng';

/**
 * Human-readable locale labels for onboarding language selection.
 */
export const LOCALE_LABELS: Record<ResidentLocale, string> = {
  eng: 'English',
  fil: 'Filipino',
  hil: 'Hiligaynon',
};

/**
 * Runtime guard for locale values.
 */
export function isSupportedLocale(value: unknown): value is ResidentLocale {
  return (
    typeof value === 'string' &&
    SUPPORTED_LOCALES.includes(value as ResidentLocale)
  );
}

/**
 * Resolve display label for a locale code.
 */
export function getLocaleLabel(locale: ResidentLocale): string {
  return LOCALE_LABELS[locale] ?? locale;
}
