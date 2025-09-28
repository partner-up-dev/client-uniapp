import { TABBAR_PAGE_ID, PAGE_ID } from './enum';
export const PAGE_PATH: Record<PAGE_ID, string> = {
    // mainPackage
    [PAGE_ID.HOME]: '/pages/home/home',
    [PAGE_ID.EXPLORE]: '/pages/explore/explore',
    [PAGE_ID.PR_DETAIL]: '/pages/partner_request/detail/detail',
}

export const TABBAR_INDEX: Record<TABBAR_PAGE_ID, number> = {
    [PAGE_ID.HOME]: 0,
    [PAGE_ID.EXPLORE]: 1,
}


export const ride_hailing_mp_list = {
    'didi': "wxaf35009675aa0b2a",
    "didi_carpool": "wxdda4c7baff6748d1",
    "hello": "wxda591e289442a50d"
}


import { FileExtension, MIMETypes } from './enum';
export const content_type_mapper: Record<FileExtension, MIMETypes> = {
    [FileExtension.JPEG]: MIMETypes.JPEG,
    [FileExtension.JPG]: MIMETypes.JPG,
    [FileExtension.PNG]: MIMETypes.PNG,
    [FileExtension.PDF]: MIMETypes.PDF,
    [FileExtension.BINARY]: MIMETypes.BINARY,
};