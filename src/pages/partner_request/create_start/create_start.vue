<script lang="ts">
/**
 * @name 搭子请求创建开始页�?
 * @docs https://git.hadream.ltd/anana/application/uniapp/-/wikis/PartnerRequest/Pages/Create/Start
 */
import { BasicComponentOptions } from "@/utils/vue";
export default {
  name: "PartnerRequestCreateStart",
  options: BasicComponentOptions,
};
</script>
<script setup lang="ts">
import NavBar from "@/components/common/navBar/navBar.vue";
import PartnerRequestDraftPicker from "@/components/partner_request/partnerRequestDraftPicker/partnerRequestDraftPicker.vue";
import { PAGE_PATH } from "@/data/mapper";
import { PAGE_ID } from "@/data/enum";
import { useTranslate } from "@/locale/use";
import { usePartnerRequestStore } from "@/store/partner_request";
import type { PRL1Type, PRRef, PRType } from "@/business/partner_request";
import { computed, ref } from "vue";
import PartnerRequestTypePicker from "@/components/partner_request/partnerRequestTypePicker/partnerRequestTypePicker.vue";
import { onLoad } from "@dcloudio/uni-app";
import { Account } from "@/business/account/base";
import * as v from "valibot";

const { dt: domain_t } = useTranslate("partner_request.create_start");

// Define props schema with valibot (no parameters for this page)
const propsSchema = v.object({});

const props = ref<v.InferOutput<typeof propsSchema>>({});

// computed
/**
 * @name 是否有缓�?
 */
const isCacheAvailable = computed(() => {
  return usePartnerRequestStore().draftContent ? true : false;
});

// method
/**
 * @name 处理“草稿被选择�?
 * @description
 * 跳转到创建结束页面，传递被选中的草稿的id和类�?
 */
function onDraftSelect(pr_id: PRRef) {
  uni.navigateTo({
    url: `/pages/partner_request/create_end/create_end?id=${pr_id}`,
  });
}
/**
 * @name 处理“从缓存中继续�?
 */
function onContinueFromCache() {
  uni.navigateTo({
    url: `/pages/partner_request/create_end/create_end?cache=true`,
  });
}
/**
 * @name 处理“选择一级类型�?
 * @description
 * 跳转到该一级类型对应的沉浸式引导页�?
 */
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
      <!-- <wd-icon classPrefix="partnerup-iconfont" name="partner_request-filled" custom-class="headline__fir__icon" /> -->
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

      <PartnerRequestTypePicker
        custom-class="l1-type-picker__picker"
        blend-to-background="bottom"
        option-mode="l1"
        @select="onL1TypeSelect"
      />
    </view>
    <view class="con-from-draft">
      <view class="con-from-draft__title">
        {{ domain_t("continue_from_draft.title") }}
      </view>

      <PartnerRequestDraftPicker
        custom-class="con-from-draft__picker"
        blend-to-background="bottom"
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

<style lang="scss" scoped src="./start.scss"></style>
