// Vendor(Uniapp) API wrapper
// 进一步抹平不同平台之间API能力的差异

import { PAGE_ID, TABBAR_PAGE_ID } from "@/data/enum";
import { PAGE_PATH } from "@/data/mapper";
import { t } from "@/locale/use";
import { isInEnum } from ".";


export function getWindowInfo(): UniApp.GetWindowInfoResult {
    const window_info = uni.getWindowInfo();
    // #ifdef MP-ALIPAY
    window_info.safeAreaInsets = {
        bottom: 0, left: 0, right: 0, top: 0
    }
    // #endif
    return window_info;
}

export function getElementRect(selector: string, instance: any): Promise<UniApp.NodeInfo> {
    return new Promise((resolve, reject) => {
        uni.createSelectorQuery().in(instance).select(selector).boundingClientRect((data) => {
            if (data) {
                resolve(data as UniApp.NodeInfo);
            } else {
                reject(new Error(`Element with selector '${selector}' not found`));
            }
        }).exec();
    });
}

export function getWindowHeight(): number {
    return uni.getSystemInfoSync().windowHeight;
}

export function getSafeArea() {
    const data = uni.getSystemInfoSync().safeAreaInsets;
    if (!data) {
        return {
            'top': 0, 'bottom': 0, 'left': 0, 'right': 0
        }
    }
    else {
        return data;
    }
}

/**
 * @abstract 获取菜单胶囊位置（经典）
 * @description
 * uni返回的数据中,right,bottom,top等都是基于左上角的位置 \
 * 而在css中是指距离对应边的距离，所以需要转换
 */
export function getMenuButtonRect(): {
    top: number, right: number,
    bottom: number, left: number,
    height: number, width: number
} {
    const raw = uni.getMenuButtonBoundingClientRect();

    const top = raw.top;
    const right = uni.getSystemInfoSync().windowWidth - raw.right;
    const bottom = uni.getSystemInfoSync().windowHeight - raw.bottom;
    const left = raw.left;

    return {
        ...raw,
        ...{
            top, right, bottom, left
        }
    }
}

/**
 * @name 导航到指定页面
 * @description
 * 自动处理 tabbar 页面（使用 switchTab ）
 * @param page_id 预定义页面ID, 和 path 二选一
 * @param path 页面路径，和 page_id 二选一
 * @param params 页面参数
 */
export function navigate({ page_id, path, params }: { page_id?: PAGE_ID, path?: string, params?: Record<string, string> }) {
    const params_str = Object.entries(params || {}).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
    if (page_id) {
        path = PAGE_PATH[page_id];
    }
    if (page_id && isInEnum(page_id, TABBAR_PAGE_ID)) {
        uni.switchTab({ url: path + `?${params_str}` });
    }
    else {
        uni.navigateTo({ url: path + `?${params_str}` });
    }
}


export function showLoading(text?: string, mask: boolean = true) {
    uni.showLoading({
        'title': text || t('common.loading'),
        'mask': mask
    })
}

export function hideLoading() {
    uni.hideLoading()
}

export function defaultExceptionToast(errmsg: string, icon: 'error' | 'none' = 'error') {
    uni.showToast({
        title: errmsg,
        icon
    })
}

/** 无图标 UniToast */
export function noneUniToast(text: string) {
    uni.showToast({
        title: text,
        icon: 'none'
    })
}

/** 报告错误（用户提示 + 后续可扩展上报） */
export function errorReport(text: string) {
    uni.showToast({
        title: text,
        icon: 'error'
    })
    // TODO: report to maintainer
}

/** 成功 UniToast */
export function successUniToast(text: string) {
    uni.showToast({
        title: text,
        icon: 'success'
    })
}

import { ref } from "vue";

export function usePulldownRefresher(
    refresh: () => Promise<void>
) {
    const is_refreshing = ref(false);

    function onRefresherPulling(
        { detail }: { detail: { dy: number } }
    ) {
        if (detail.dy < 0) return;
        is_refreshing.value = true;
    }
    function onRefresherRestored() {
        is_refreshing.value = false;
    }
    function onRefresherRefresh() {
        refresh().finally(() => {
            setTimeout(() => {
                is_refreshing.value = false
            }, 1000);
        });
    }

    return {
        is_refreshing,
        onRefresherPulling,
        onRefresherRestored,
        onRefresherRefresh
    }
}
