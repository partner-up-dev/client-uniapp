import { createI18n } from 'vue-i18n';

import enUs from '@/locale/en-US';
import zhHans from '@/locale/zh-Hans';
import type { Locale, MessageSchema } from '@/locale/schema';

const messages = {
    'zh-Hans': zhHans,
    'en-US': enUs
} as const;

const resolveLocale = (rawLocale: string | undefined): Locale => {
    if (!rawLocale) {
        return 'zh-Hans';
    }

    const isEnglishLocale = rawLocale === 'en-US' || rawLocale === 'en';
    return isEnglishLocale ? 'en-US' : 'zh-Hans';
};

const locale = resolveLocale(uni.getLocale());

const i18n = createI18n<{ message: MessageSchema }, Locale>({
    legacy: false,
    globalInjection: true,
    locale,
    fallbackLocale: 'zh-Hans',
    messages
});

export default i18n;
