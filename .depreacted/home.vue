<script lang="ts">
const MY_PAGE_ID = TABBAR_PAGE_ID.HOME;
export default {
  name: "home",
};
</script>
<script setup lang="ts">
import { useTranslate } from "@/locale/use";
// import PartnerRequestTypePicker from "@/components/partner_request/partnerRequestTypePicker/partnerRequestTypePicker.vue";
import { computed, ref } from "vue";
import { useAccountStore } from "@/store/account";
import { PRL1Type } from "@/business/partner_request";
import { PAGE_PATH, TABBAR_INDEX } from "@/data/mapper";
import { PAGE_ID, TABBAR_PAGE_ID } from "@/data/enum";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { setTabBarIndex, updateTabBarAvatar } from "@/utils/tabbar";
// import { V1OnboardingGetChallenges } from "@/api/main/onboarding";
// import { PartnerRequestListType } from "@/api/main/partner_request/types";
import { navigate } from "@/utils/vendor";
import { AccountBaseProfile } from "@/business/account";

const { dt } = useTranslate(MY_PAGE_ID);
const { baseProfile } = AccountBaseProfile.use();

// data
/** 是否未进行新用户引导 */
const need_new_user_onboarding = ref(false);

// methods
function onL1TypeSelect(l1_type: PRL1Type) {
  navigate({
    path: PAGE_ID.pr_create_typed + `/${l1_type}`,
  });
  uni.navigateTo({
    url: `${PAGE_PATH.pr_create_typed}/${l1_type}`,
  });
}
function onCheckJoinablePRClick() {
  navigate({
    page_id: PAGE_ID.my_prs,
    params: { type: PartnerRequestListType.Ongoing },
  });
}
function onExploreClick() {
  navigate({ page_id: TABBAR_PAGE_ID.explore });
}
function onWelcomeNicknameClick() {
  navigate({
    page_id: PAGE_ID.me,
  });
}
function onGuideClick() {
  navigate({
    page_id: PAGE_ID.onboarding_new_user,
  });
}

// computed
const greetingPeriod = computed(() => {
  const hour = new Date().getHours();

  if (hour >= 7 && hour < 11) return "morning";
  if (hour >= 11 && hour < 13) return "noon";
  if (hour >= 13 && hour < 18) return "afternoon";
  return "evening";
});

const isOngoingPR = computed((): boolean => {
  return true;
  // return useAccountStore().myOngoingPRs.length > 0;
});

// lifecycle
onLoad(() => {
  // account.login(false).then(() => {
  //   V1OnboardingGetChallenges(["new_user_onboarding"]).then(({ data }) => {
  //     need_new_user_onboarding.value = data[0].isCompleted();
  //   });
  // });
});
onShow(() => {
  // setTabBarIndex(TABBAR_INDEX[MY_PAGE_ID]);
  updateTabBarAvatar();
});
</script>

<template>
  <view class="page-bg"></view>

  <view class="main">
    <view class="header">
      <!-- Welcome Section -->
      <view class="welcome">
        <view class="welcome__text">
          <text class="welcome__text__greet">
            {{ dt(`welcome.greet.${greetingPeriod}`) }}
          </text>
          <text class="welcome__text__nickname" @click="onWelcomeNicknameClick">
            {{ baseProfile?.nickname || dt("welcome.nickname") }}
          </text>
        </view>
        <view class="welcome__emoji">{{ dt("welcome.emoji") }}</view>
      </view>

      <!-- New User Guide Section -->
      <view
        class="to-guide line-card"
        v-if="need_new_user_onboarding"
        @click="onGuideClick"
      >
        <view>{{ dt("to_guide.title") }}</view>
        <wd-icon name="arrow-right" custom-class="line-card__icon" />
      </view>
    </view>

    <!-- Create Partner Request Section -->
    <view class="cpr">
      <view class="cpr__title">
        {{ dt("cpr.title") }}
      </view>
      <view
        class="cpr__waiting line-card"
        v-if="isOngoingPR"
        @click="onCheckJoinablePRClick"
      >
        <view>{{ dt("cpr.waiting.title") }}</view>
        <wd-icon name="arrow-right" custom-class="line-card__icon" />
      </view>
      <PartnerRequestTypePicker
        class="cpr__type-picker"
        mode="horizontal-card"
        blend-to-background="right"
        @select="onL1TypeSelect"
      />
    </view>

    <!-- Discover Partner Requests Section -->
    <view class="prd" @click="onExploreClick">
      <view class="prd__title">
        {{ dt("prd.title") }}
      </view>
      <wd-icon name="arrow-right1" custom-class="prd__icon" />
    </view>
  </view>
</template>

<style lang="scss" scoped src="./home.scss"></style>
