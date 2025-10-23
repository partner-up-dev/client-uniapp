import { computed, ref } from "vue";
import { useAccountStore } from "@/store/account";
import { V, nullable } from "..";
import * as v from "valibot";
import { hideLoading, showLoading, errorReport } from "@/utils/vendor";
import { APIClient } from "../api";
import { useTranslate } from "@/locale/use";
import { Chat } from "../communication/chat";
import { useChatStore } from "@/store/communication/chat";

const { dt } = useTranslate("account");

export class AccountBaseProfile extends V.class(v.object({
  id: v.string(),
  created_at: v.fallback(v.date(), new Date()),
  nickname: v.string(),
  bio: nullable(v.string()),
  wallpaper: nullable(v.string()),
  avatar: nullable(v.string()),
  age_range: nullable(v.number()),
  gender: nullable(v.string()),
  mbti: nullable(v.string()),
})) {

  static NICKNAME_MAX_LENGTH = 12;

  static use(accountId?: string) {

    const loading = ref(false);
    const _accountId = ref<string | undefined>(accountId);
    const _baseProfile = ref<AccountBaseProfile>();

    const baseProfile = computed(() => {
      if (!_baseProfile.value) {
        loading.value = true;
        this.get(_accountId.value).then((profile) => {
          _baseProfile.value = profile;
          loading.value = false;
        });
        return undefined;
      }
      return _baseProfile.value;
    });

    return {
      loading,
      baseProfile,
    };
  }

  static get(accountId?: string): Promise<AccountBaseProfile> {
    if (!accountId) {
      accountId = useAccountStore().account_id;
      if (!accountId) {
        return Promise.reject();
      }
    }
    return Account.api.requestHTTP({
      method: "GET",
      endpoint: `/profile/base/${accountId}`,
      schema: AccountBaseProfile,
    }).then(({ body }) => body.parsed as AccountBaseProfile);
  }

  public put(): Promise<void> {
    return Account.api.requestHTTP({
      method: "PUT",
      endpoint: `/profile/base/${this.id}`,
      data: this
    }).then(() => void 0);
  }

}

export class Account {

  static api = new APIClient({
    modulePrefix: "/account",
    dt: useTranslate("account").dt,
  });

  static login(show_loading: boolean): Promise<AccountBaseProfile> {
    if (show_loading) {
      showLoading();
    }

    // #ifdef MP-WEIXIN
    return this.V2WXMPLogin().finally(hideLoading);
    // #endif
  }

  /** https://app.apifox.com/link/project/4406548/apis/api-180181847?branchId=5433542 */
  static V2WXMPLogin(): Promise<AccountBaseProfile> {
    const that = this;

    return new Promise((resolve, reject) => {
      uni.login({
        provider: "weixin",
        success(res) {
          that.api.requestHTTP({
            method: "POST",
            endpoint: "/wxmp/wxmp_mp/login",
            data: {
              code: res.code,
            },
            schema: AccountBaseProfile,
          }).then(({ body }) => {
            const baseProfile = body.parsed;
            useAccountStore().$patch({
              account_id: baseProfile.id,
            });
            // After login, fetch user's chats
            Chat.get_mine().then((chats) => {
              useChatStore().setMyChats(chats);
            }).catch((error) => {
              console.error("Failed to fetch chats after login:", error);
            });
            resolve(baseProfile);
          }).catch(reject);
        },
        fail() {
          errorReport(dt("login_from_weixin.uni_login_fail"));
          reject();
        },
      });
    });
  }
}
