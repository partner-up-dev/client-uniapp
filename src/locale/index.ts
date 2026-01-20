import { createI18n } from 'vue-i18n';

import zh_cnm_Hans from '@/locale/zh-Hans';
import en_us from '@/locale/en-US';

let i18nConfig = {
    locale: uni.getLocale(),
    fallbackLocale: 'zh-Hans',
    messages: {
        'zh-Hans': zh_cnm_Hans,
        'en-US': en_us
    }
};

export default createI18n(i18nConfig);
