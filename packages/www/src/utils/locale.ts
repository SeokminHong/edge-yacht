export const locales = ['en', 'ko'] as const;
export type Locale = typeof locales[number];
export const defaultLocale = locales[0] as Locale;

export function isLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}
