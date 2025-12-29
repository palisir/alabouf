import { headers } from 'next/headers';

export const SUPPORTED_LOCALES = ['fr', 'en-US'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];
export const DEFAULT_LOCALE: SupportedLocale = 'en-US';

// Lingui uses simpler locale codes
export const LINGUI_LOCALES = ['fr', 'en'] as const;
export type LinguiLocale = typeof LINGUI_LOCALES[number];

/**
 * Maps Contentful locale to Lingui locale.
 * Contentful uses 'en-US', Lingui uses 'en'.
 */
export function toLinguiLocale(contentfulLocale: SupportedLocale): LinguiLocale {
  return contentfulLocale === 'en-US' ? 'en' : contentfulLocale;
}

/**
 * Detects the user's preferred locale from Accept-Language header.
 * Falls back to French if no supported language is found.
 */
export async function getPreferredLocale(): Promise<SupportedLocale> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');

  if (!acceptLanguage) return DEFAULT_LOCALE;

  // Parse Accept-Language (e.g., "en-US,en;q=0.9,fr;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map(lang => lang.trim().split(';')[0].split('-')[0].toLowerCase());

  for (const lang of languages) {
    if (lang === 'en') return 'en-US';
    if (lang === 'fr') return 'fr';
  }

  return DEFAULT_LOCALE;
}

/**
 * Extracts a localized field value with French fallback.
 * Used when fetching with locale: '*'.
 */
export function getLocalizedField<T>(
  field: Record<string, T | undefined> | undefined,
  locale: SupportedLocale
): T | undefined {
  if (!field) return undefined;
  return field[locale] ?? field[DEFAULT_LOCALE];
}

