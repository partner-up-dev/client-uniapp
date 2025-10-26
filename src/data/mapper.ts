import { TABBAR_PAGE_ID, PAGE_ID } from './enum';
export const PAGE_PATH: Record<PAGE_ID, string> = {
    // mainPackage
    [PAGE_ID.HOME]: '/pages/home/home',
    [PAGE_ID.EXPLORE]: '/pages/explore/explore',
    [PAGE_ID.NOTIFICATION]: '/pages/notification/notification',
    [PAGE_ID.ME]: '/pages/me/me',

    [PAGE_ID.PR_DETAIL]: '/pages/partner_request/detail/detail',
    [PAGE_ID.PR_CREATE_TRIP]: '/pages/partner_request/create_trip/create_trip',
    [PAGE_ID.PR_CREATE_END]: '/pages/partner_request/create_end/create_end',
    [PAGE_ID.CHAT]: '/pages/communication/chat',
}

export const TABBAR_INDEX: Record<TABBAR_PAGE_ID, number> = {
    [PAGE_ID.HOME]: 0,
    [PAGE_ID.EXPLORE]: 1,
    [PAGE_ID.NOTIFICATION]: 2,
    [PAGE_ID.ME]: 3,
}


export const ride_hailing_mp_list = {
    'didi': "wxaf35009675aa0b2a",
    "didi_carpool": "wxdda4c7baff6748d1",
    "hello": "wxda591e289442a50d"
}


import { type FileExtension, type MIMETypes } from './enum';
export const content_type_mapper: Record<FileExtension, MIMETypes> = {
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "pdf": "application/pdf",
    "binary": "application/octet-stream",
};