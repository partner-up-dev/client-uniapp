
import { hideLoading, showLoading } from "@/utils/vendor";
import { API } from "../api";
import { computed, ref } from "vue";
import { useAccountStore } from "@/store/account";
import { Business } from "../index";

/** UUID */
export type AccountRef = string;


export class Account extends API {

  static MODULE_PREFIX = '/account';

  static login(show_loading: boolean): Promise<AccountBaseProfile> {
    if (show_loading) {
      showLoading();
    }

    // #ifdef MP-WEIXIN
    return this.V2WXMPLogin()
      .finally(hideLoading);
    // #endif
  }

  /** https://app.apifox.com/link/project/4406548/apis/api-180181847?branchId=5433542 */
  static V2WXMPLogin(): Promise<AccountBaseProfile> {
    const that = this;

    return new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success(res) {
          that.requestAPI({
            method: 'POST',
            endpoint: '/wxmp/wxmp_mp/login',
            data: {
              code: res.code
            }
          }
          ).then(({ data }) => {
            const baseProfile = AccountBaseProfile.parse(data);
            useAccountStore().$patch({
              account_id: baseProfile._id
            })
            resolve(baseProfile);
          }).catch(reject);
        },
        fail() {
          errorReport(dt('login_from_weixin.uni_login_fail'))
          reject();
        }
      })
    });
  }
}


export class AccountBaseProfile extends Business {
  constructor(
    public _id: string = '',
    public created_at: Date = new Date(),
    public nickname: string = '',
    public bio: string | null = null,
    public wallpaper: string | null = null,
    public avatar: string | null = null,
    public age_range: number | null = null,
    public gender: string | null = null,
    public mbti: string | null = null
  ) {
    super();
  }

  static use() {

    const loading = ref(false);
    const _baseProfile = ref<AccountBaseProfile>();

    const baseProfile = computed(() => {
      if (!_baseProfile.value) {
        loading.value = true
        this.get().then(profile => {
          _baseProfile.value = profile;
          loading.value = false;
        });
        return undefined;
      }
      return _baseProfile.value;
    })

    return {
      loading,
      baseProfile
    }
  }

  static get(accountId?: AccountRef): Promise<AccountBaseProfile> {
    if (!accountId) {
      accountId = useAccountStore().account_id;
      if (!accountId) {
        return Promise.reject();
      }
    }
    return Account.requestAPI({
      method: 'GET',
      endpoint: `/profile/base/${accountId}`
    }).then(({ data }) => {
      return AccountBaseProfile.parse(data);
    })
  }

}
