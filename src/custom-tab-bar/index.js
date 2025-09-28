// References
// https://developers.weixin.qq.com/community/develop/article/doc/0000047ece8448712589b28525b413
// https://blog.csdn.net/m0_66956057/article/details/137405401

import { LOCAL_STORAGE_KEY } from "../data/enum";

Component({
  properties: {},
  data: {
    selected: 0,
    show: true,
    badges: [0, 0, 0, 0],
    list: [
      {
        pagePath: "/pages/home/home",
        iconPath: "/static/icon/home-selected.png",
        noticeIconPath: "/static/icon/home-notice.png",
        text: "首页",
        round: false,
      },
      {
        pagePath: "/pages/explore/explore",
        iconPath: "/static/icon/discover-selected.png",
        noticeIconPath: "/static/icon/discover-notice.png",
        text: "发现",
        round: false,
      },
      {
        pagePath: "/pages/notification/notification",
        iconPath: "/static/icon/notification-selected.png",
        noticeIconPath: "/static/icon/notification-notice.png",
        text: "通知",
        round: false,
      },
      {
        pagePath: "/pages/me/me",
        iconPath: "/static/icon/me-selected.png",
        noticeIconPath: "/static/icon/me-notice.png",
        text: "你的",
        round: false,
      },
    ],
  },
  attached() {
    try {
      const avatarUrl = wx.getStorageSync(LOCAL_STORAGE_KEY.USER_AVATAR_URL);
      if (avatarUrl) {
        this.setData({
          "list[3].iconPath": avatarUrl,
          "list[3].round": true,
        });
      }
    } catch (e) {}
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      const index = this.data.list.findIndex(
        (item) => item.pagePath === data.index
      );
      wx.switchTab({ url });
      this.setData({
        selected: index,
      });
    },
    setBadge(index, badge) {
      const new_badges = this.data.badges.slice();
      new_badges[index] = badge;

      this.setData({
        badges: new_badges,
      });
    },
    removeBadge(index) {
      const new_badges = this.data.badges.slice();
      new_badges[index] = 0;

      this.setData({
        badges: new_badges,
      });
    },
  },
});
