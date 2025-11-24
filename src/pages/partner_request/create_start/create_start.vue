<script lang="ts">
export default {
  name: "PRCreateStartPage",
};
</script>
<script setup lang="ts">
import NavBar from "@/components/common/navBar/navBar.vue";
import { useTranslate } from "@/locale/use";
import { usePartnerRequestStore } from "@/store/partner_request";
import type { PRL1Type, PRRef } from "@/business/partner_request";
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { Account } from "@/business/account/base";
import * as v from "valibot";
import PRDraftPicker from "@/components/partner_request/PRDraftPicker/PRDraftPicker.vue";
import PRTypePicker from "@/components/partner_request/PRTypePicker/PRTypePicker.vue";

const { dt: domain_t } = useTranslate("partner_request.create_start");

// Define props schema with valibot (no parameters for this page)
const propsSchema = v.object({});

const props = ref<v.InferOutput<typeof propsSchema>>({});

// computed
const isCacheAvailable = computed(() => {
  return usePartnerRequestStore().draftContent ? true : false;
});

// method
function onDraftSelect(pr_id: PRRef) {
  uni.navigateTo({
    url: `/pages/partner_request/create_end/create_end?id=${pr_id}`,
  });
}
function onContinueFromCache() {
  uni.navigateTo({
    url: `/pages/partner_request/create_end/create_end?cache=true`,
  });
}
function onL1TypeSelect(l1_type: PRL1Type) {
  // TEMP
  // uni.navigateTo({
  //     url: `${page_id_path_mapper.partner_request_create_end}?type=commute`
  // })
  uni.navigateTo({
    url: `/pages/partner_request/create_trip/create_trip?l1_type=${l1_type}`,
  });
}

// lifecycle
onLoad(() => {
  // auto login
  Account.login(false);
});
</script>

<template>
  <view class="bg"></view>

  <NavBar mode="custom" />

  <view class="headline">
    <view class="headline__fir">
      <text>{{ domain_t("headline.1") }}</text>
    </view>
    <view class="headline__sec">
      {{ domain_t("headline.2") }}
    </view>
  </view>

  <view class="cont">
    <view class="l1-type-picker">
      <view class="l1-type-picker__title">
        {{ domain_t("l1_type_picker.title") }}
      </view>

      <PRTypePicker
        custom-class="l1-type-picker__picker"
        :fade="true"
        option-mode="l1"
        @select="onL1TypeSelect"
      />
    </view>
    <view class="con-from-draft">
      <view class="con-from-draft__title">
        {{ domain_t("continue_from_draft.title") }}
      </view>

      <PRDraftPicker
        custom-class="con-from-draft__picker"
        :fade="true"
        @select="onDraftSelect"
      />
    </view>
    <view
      class="con-from-cache"
      v-if="isCacheAvailable"
      @click="onContinueFromCache"
    >
      <text class="con-from-cache__title">
        {{ domain_t("continue_from_cache.title") }}
      </text>
      <wd-icon name="arrow-right" custom-class="con-from-cache__icon" />
    </view>
  </view>
</template>

<style lang="scss" scoped src="./create_start.scss"></style>
