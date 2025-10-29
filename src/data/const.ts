import { PAGE_ID } from "./enum";

export const MP_WX_ID = "wx7674f72ff1eb49e6";
export const CURRENT_VERSION = {
    "mp-weixin": "0.0.3",
}

export const TENCENT_LBS = {
    key: import.meta.env.VITE_TENCENT_LBS_KEY,
    referer: 'mp-weixin'
}

export const CACHE_KEY_PARTNER_REQUEST_FORM = "cache_partner_request_form";
export const CACHE_KEY_CHAT_INFO = "cache_chat_info";

export const LOCAL_STORAGE_IS_LOGGED_IN = "is_logged_in";
export const LOCAL_STORAGE_MY_PROFILE = "my_profile";
export const LOCAL_STORAGE_MY_IDENTITY = "my_identity";
export const LOCAL_STORAGE_MY_PARTNER_REQUESTS = "my_partner_requests";
export const LOCAL_STORAGE_MY_CHATS = "my_chats";

export const LOCAL_STORAGE_HISTORY_MESSAGES = "history_messages";
export const LOCAL_STORAGE_UNREAD = "unread";
export const LOCAL_STORAGE_CHAT_INFO = "chat_info";

export const TERMS_OF_SERVICE_LIST = {
    'user_agreement': 'https://docs.partner-up.cn/user_agreement.html',
    'child_privacy_policy': 'https://docs.partner-up.cn/child_privacy_policy.html',
    // 'service_terms': 'https://docs.partner-up.cn/service_terms.html'
}

export const DEFAULT_ACCOUNT_AVATAR = "https://img.js.design/assets/img/65f308972009b771bbecf84f.jpg";
export const DEFAULT_ACCOUNT_WALLPAPER = "https://img.js.design/assets/img/67d78317fa2b17b5f8a7b252.jpg"

export const DEFAULT_LABEL_BG_COLOR = "#CFCFCF";

/**
 * 微信小程序订阅消息模板ID
 */
export const WXMP_SUBMESSAGE_TID = {
    newPartnerApplication: "TkUpSdWNjdsqspxKwKxKLFfsW8PifmSpuCwf0RAf140",
    partner_application_result: "YbFPy_xB-4MRJ2gWXBU69Z8DjwB-h0IKBy_CjAI0siw",
    newMessage: "LdicRa405zPaQbYGnHwg0vvrMKxE-ygPi_gcne0V0bo",
    new_approval: "TkUpSdWNjdsqspxKwKxKLFfsW8PifmSpuCwf0RAf140",
    ride_hailing_order_activity: "0JefB30HZGm_M1J161HsNCkMD5py4Yu_1GsYIyNnK1Q",
}

export const TABBAR_HEIGHT = 65;

// Gender options for picker
export const GENDER_OPTIONS = [
    { label: "男性", value: "male" },
    { label: "女性", value: "female" },
    { label: "不愿透露", value: "unknown" }
];

// MBTI types for picker
export const MBTI_OPTIONS = [
    { label: "INTJ", value: "INTJ" },
    { label: "INTP", value: "INTP" },
    { label: "ENTJ", value: "ENTJ" },
    { label: "ENTP", value: "ENTP" },
    { label: "INFJ", value: "INFJ" },
    { label: "INFP", value: "INFP" },
    { label: "ENFJ", value: "ENFJ" },
    { label: "ENFP", value: "ENFP" },
    { label: "ISTJ", value: "ISTJ" },
    { label: "ISFJ", value: "ISFJ" },
    { label: "ESTJ", value: "ESTJ" },
    { label: "ESFJ", value: "ESFJ" },
    { label: "ISTP", value: "ISTP" },
    { label: "ISFP", value: "ISFP" },
    { label: "ESTP", value: "ESTP" },
    { label: "ESFP", value: "ESFP" }
];

