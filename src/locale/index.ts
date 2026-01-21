import { createI18n } from 'vue-i18n';
import { snakeCase } from '@/utils';
import type { Composer } from 'vue-i18n';
import type { Locale, MessageSchema } from '@/locale/schema';
// messages
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

const i18n = createI18n<{ message: MessageSchema }, Locale>({
    legacy: false,
    globalInjection: true,
    locale,
    fallbackLocale: 'zh-Hans',
    messages: {
        'zh-Hans': zhHans,
        'en-US': enUs
    }
});

export default i18n;

export const t = (i18n.global as Composer).t;
export const tm = (i18n.global as Composer).tm;

export const useTranslate = (name?: string) => {
    const prefix = name ? snakeCase(name) + '.' : '';
    const dt = (key: string, ...args: unknown[]) => {
        return t(prefix + key, ...args);
    }
    /**
     * 
     * @description
     * 键的正常翻译结果不可以是`undefined`，否则会返回`missing`的值
     * 
     * @param key 
     * @param missing 
     */
    const domain_miss_t = (key: string, missing: string | (() => string)) => {
        const res = t(prefix + key, { missing: undefined });
        if (!res) {
            return typeof missing === 'string' ? missing : missing();
        }
    }
    const dtm = (key: string, ...args: unknown[]) => {
        return tm(prefix + key, ...args);
    }
    const miss_t = (key: string, missing: string | (() => string)) => {
        const res = t(key);
        if (!res) {
            return typeof missing === 'string' ? missing : missing();
        }
    }

    return {
        dt,
        dtm,
        domain_miss_t,
        t,
        miss_t
    }
}

