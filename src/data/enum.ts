/**
 * @description
 * 全局枚举
 * 
 */


/**
 * @abstract
 * 本地缓存KEY枚举
 */
export enum LOCAL_STORAGE_KEY {
    IS_LOGGED_IN = "is_logged_in",
    MY_PROFILE = "my_profile",
    MY_IDENTITY = "my_identity",
    MY_PARTNER_REQUESTS = "my_partner_requests",
    MY_CHATS = "my_chats",
    OTHER_PROFILES = "other_profiles",
    HISTORY_MESSAGES = "history_messages",
    UNREAD = "unread",
    CHAT_INFO = "chat_info",
    SETTING = "setting",
    ALIYUN_STS = "aliyun_sts",
    LABELS = "labels",
    REQUIREMENTS = "requirements",
    LOCATIONS = "locations",
    PARTNER_REQUESTS = "partner_requests",

    PARTNER_REQUEST_EDIT_FORM = "partner_request_edit_form",

    CONTINUE_APPROVAL_AFTER_OEPRATION = "continue_approval_after_operation",

    USER_AVATAR_URL = "user_avatar_url",
}


/**
 * @abstract
 * 全局事件枚举
 */
export enum EVENT {
    ACCOUNT_LOGGED_IN = "account_logged_in",  // current: string
    ACCOUNT_LOGGED_OUT = "account_logged_out",
    // ACCOUNT_PROFILE_UPDATED = "account_profile_updated",
    /** 路线编辑器所在页面展现（从路线选择页面切回） */
    ROUTE_EDITOR_PAGE_SHOWED = "route_editor_page_showed",
    CHANGE_BACKGROUND_TASK_INTERVAL = "change_background_task_interval",
    NEW_MESSAGE = "new_message",
    MESSAGE_READ = "message_read",  // message_ids: number[]
    APPROVAL_BEFORE_OEPRATION_BACK = "approval_before_operation_back",
}


/**
 * @abstract
 * 页面ID枚举
 * @description
 * 用于from, id_path_mapping
 */
export enum PAGE_ID {
    // mainPackage
    HOME = "home",
    EXPLORE = "explore",
    PR_DETAIL = "partner_request_detail"
}

export enum TABBAR_PAGE_ID {
    HOME = "home",
    EXPLORE = "explore"
}


/**
 * @abstract 文件类型枚举
 */
export enum FileExtension {
    PDF = "pdf",
    PNG = "png",
    JPG = "jpg",
    JPEG = "jpeg",
    BINARY = "binary"
}

/**
 * @abstract MIMETypes
 */
export enum MIMETypes {
    PDF = "application/pdf",
    PNG = "image/png",
    JPG = "image/jpeg",
    JPEG = "image/jpeg",
    BINARY = "application/octet-stream"
}