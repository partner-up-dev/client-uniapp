import { createI18n } from 'vue-i18n';

import zh_cnm_Hans from '@/locale/uni-app.zh-Hans';
import zh_yue_Hant from '@/locale/uni-app.zh-yue-Hant';
import en_us from '@/locale/uni-app.en-US';

const messages = {
    'zh-Hans': zh_cnm_Hans,
    'zh-Hant': zh_yue_Hant,
    'en-US': en_us
};
let i18nConfig = {
    locale: uni.getLocale(),
    fallbackLocale: 'zh-Hans',
    messages
};

export default createI18n(i18nConfig);
