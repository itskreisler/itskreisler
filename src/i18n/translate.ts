// Utilidad para parsear astroUrl a URL en minúsculas
function parseAstroUrl(astroUrl: URL): URL {
    return new URL(astroUrl.toString().toLowerCase());
}
import { createI18n } from '@kreisler/i18n'
import { es } from '@/i18n/langs/es'
import { en } from '@/i18n/langs/en'
import { z } from 'astro:schema'

export const translations: any = {
    es,
    en
}

export const i18n = createI18n({
    defaultLocale: 'es',
    messages: translations
})

export const { getAvailableLocales, getDefaultLocale } = i18n

// Custom useTranslations to support nested objects and arrays
export const useTranslations = (lang: string) => {
    return (key: string) => {
        const keys = key.split('.');
        let value = translations[lang];
        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) break;
        }
        return value !== undefined ? value : key;
    }
}

export const defaultLang = getDefaultLocale()
export const languagesKeys = getAvailableLocales()
export const SchemaLang = z.enum(languagesKeys as any, { message: 'Invalid lang' })
export const SchemaParamsLang = z.object({ lang: SchemaLang }, { message: 'Invalid param lang' })
export type UILanguageKeys = z.infer<typeof SchemaLang>
export type Lang = z.infer<typeof SchemaParamsLang>
export type Languages = z.infer<typeof SchemaLang>

export function getStaticPathsLang(): {
    params: {
        lang: UILanguageKeys;
    };
}[] {
    return (languagesKeys as string[]).map(lang => ({ params: { lang: lang as UILanguageKeys } }))
}

export const getLangFromUrl = (astroUrl: URL): UILanguageKeys => {
    const url = parseAstroUrl(astroUrl);
    const [, lang] = url.pathname.split('/');
    return lang in translations ? lang as UILanguageKeys : getDefaultLocale() as UILanguageKeys;
}

export const t18n = (astroUrl: URL) => {
    const url = parseAstroUrl(astroUrl);
    const lang = getLangFromUrl(url);
    return useTranslations(lang);
}
