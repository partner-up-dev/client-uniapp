import { createI18n } from 'vue-i18n';
import type { Composer } from 'vue-i18n';
import type { Locale, MessageSchema } from '@/locale/schema';
import enUs from '@/locale/en-US';
import zhHans from '@/locale/zh-Hans';

const resolveLocale = (rawLocale: string | undefined): Locale => {
    if (!rawLocale) {
        return 'zh-Hans';
    }

    const isEnglishLocale = rawLocale === 'en-US' || rawLocale === 'en';
    return isEnglishLocale ? 'en-US' : 'zh-Hans';
};

const locale = resolveLocale(uni.getLocale());

const messages = {
    'zh-Hans': zhHans,
    'en-US': enUs
} as const satisfies Record<Locale, MessageSchema>;

const i18n = createI18n<{ message: MessageSchema }, Locale>({
    legacy: false,
    globalInjection: true,
    locale,
    fallbackLocale: 'zh-Hans',
    messages
});

export default i18n;

export const t = (i18n.global as Composer).t;
export const tm = (i18n.global as Composer).tm;

