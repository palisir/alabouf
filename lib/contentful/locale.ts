import { headers } from 'next/headers';

export const SUPPORTED_LOCALES = ['fr', 'en-US', 'es', 'pt', 'zh', 'de', 'ja'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];
export const DEFAULT_LOCALE: SupportedLocale = 'en-US';

// Contentful stores content in only two locales: en-US (default) and fr,
// with fr falling back to en-US natively. Every other UI language reads en-US content.
export function toContentfulLocale(locale: SupportedLocale): 'en-US' | 'fr' {
  return locale === 'fr' ? 'fr' : 'en-US';
}

// Maps a base language code (from Accept-Language) to its Contentful locale.
const LANG_TO_LOCALE: Record<string, SupportedLocale> = {
  en: 'en-US', fr: 'fr', es: 'es', pt: 'pt', zh: 'zh', de: 'de', ja: 'ja',
};

/**
 * Detects the user's preferred locale from Accept-Language header.
 * Falls back to DEFAULT_LOCALE if no supported language is found.
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
    if (LANG_TO_LOCALE[lang]) return LANG_TO_LOCALE[lang];
  }

  return DEFAULT_LOCALE;
}

