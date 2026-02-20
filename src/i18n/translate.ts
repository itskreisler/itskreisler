// Utilidad para parsear astroUrl a URL en minúsculas
function parseAstroUrl(astroUrl: URL): URL {
    return new URL(astroUrl.toString().toLowerCase());
}
import { createI18n } from '@kreisler/i18n'
import { es } from '@/i18n/langs/es'
import { en } from '@/i18n/langs/en'
import { z } from 'astro:schema'
export const translations = {
    es,
    en
}
export const i18n = createI18n({
    defaultLocale: 'es',
    messages: {
        es,
        en
    }

})
export const { getAvailableLocales, getDefaultLocale, useTranslations } = i18n
export const defaultLang = getDefaultLocale()
export const languagesKeys = getAvailableLocales()
export const SchemaLang = z.enum(languagesKeys, { message: 'Invalid lang' })
export const SchemaParamsLang = z.object({ lang: SchemaLang }, { message: 'Invalid param lang' })
export type UILanguageKeys = z.infer<typeof SchemaLang>
export type Lang = z.infer<typeof SchemaParamsLang>
export type Languages = z.infer<typeof SchemaLang>
export function getStaticPathsLang(): {
    params: {
        lang: UILanguageKeys;
    };
}[] {
    return languagesKeys.map(lang => ({ params: { lang } }))
}
export const getLangFromUrl = (astroUrl: URL): UILanguageKeys => {
    const url = parseAstroUrl(astroUrl);
    const [, lang] = url.pathname.split('/');
    return lang in translations ? lang as UILanguageKeys : getDefaultLocale();
}
export const t18n = (astroUrl: URL) => {
    const url = parseAstroUrl(astroUrl);
    const lang = getLangFromUrl(url);
    return useTranslations(lang);
}