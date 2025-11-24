// use of locale module

import { snakeCase } from '@/utils';
import i18n from './index';

export const t = i18n.global.t;
export const tm = i18n.global.tm;

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

