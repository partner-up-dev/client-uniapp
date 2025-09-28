import { LOCAL_STORAGE_KEY, TABBAR_PAGE_ID } from "@/data/enum"
import { TABBAR_INDEX } from "@/data/mapper";

let avatar_t = 0;

export function syncTabBarIndex(pageId: TABBAR_PAGE_ID) {
  setTabBarIndex(TABBAR_INDEX[pageId]);
}

export function setTabBarIndex(index: number) {
  // @ts-ignore
  if (typeof getCurrentPages()[0].getTabBar === 'function') {
    // @ts-ignore
    getCurrentPages()[0].getTabBar().setData({
      selected: index
    })
  }
}

export function hideTabBar() {
  // @ts-ignore
  if (typeof getCurrentPages()[0].getTabBar === 'function') {
    // @ts-ignore
    getCurrentPages()[0].getTabBar().setData({
      show: false
    })
  }
}

export function showTabBar() {
  // @ts-ignore
  if (typeof getCurrentPages()[0].getTabBar === 'function') {
    // @ts-ignore
    getCurrentPages()[0].getTabBar().setData({
      show: true
    })
  }
}

export function updateTabBarAvatar(new_url?: string) {
  let avatarUrl = "";
  if (new_url) {
    uni.setStorage({
      key: LOCAL_STORAGE_KEY.USER_AVATAR_URL,
      data: new_url,
    });
    avatarUrl = new_url;
  }
  else {
    avatarUrl = uni.getStorageSync(LOCAL_STORAGE_KEY.USER_AVATAR_URL)
  }

  avatar_t += 1;

  // @ts-ignore
  if (typeof getCurrentPages()[0].getTabBar === 'function') {
    // @ts-ignore
    const ins = getCurrentPages()[0].getTabBar()

    if (avatarUrl) {
      ins.setData({
        'list[3].iconPath': `${avatarUrl}?t=${avatar_t}`,
        'list[3].round': true
      })
    }
    else {
      ins.setData({
        'list[3].iconPath': "/static/icon/me-selected.png",
        'list[3].round': false
      })
    }
  }
}
