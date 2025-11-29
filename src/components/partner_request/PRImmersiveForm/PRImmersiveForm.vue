<script lang="ts">
/**
 * @name 沉浸式搭子请求表单组件
 * @description
 * 提供多步骤沉浸式填写搭子请求表单的体验
 */
import { BasicComponentOptions } from "@/utils/vue";
export default {
  name: "PRImmersiveForm",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { ref } from "vue";
import { useTranslate } from "@/locale/use";
import { getSafeArea } from "@/utils/vendor";
import { prImmersiveFormProps, prImmersiveFormEmits } from "./PRImmersiveForm";
import { usePartnerRequestStore } from "@/store/partner_request";
import PRTypePicker from "@/components/partner_request/PRTypePicker/PRTypePicker.vue";
import { PUDrawer } from "@partner-up-dev/design-uniapp";
import type { PRType } from "@/business/partner_request";

const { dt } = useTranslate("partner_request.immersive_create");

const props = defineProps(prImmersiveFormProps);
const emit = defineEmits(prImmersiveFormEmits);

// data
const currentStepIndex = ref(0);
const showL2TypePicker = ref(false);

// methods
/**
 * 处理 swiper 切换
 * @description
 * 当用户滑动 swiper 时触发，需要更新当前步骤索引
 * 如果是向下滑动，触发下一步事件
 */
function onSwiperChange(e: any) {
  const rawIndex = currentStepIndex.value;
  currentStepIndex.value = e.detail.current;

  if (e.detail.current > rawIndex) {
    const nextStepId = e.detail.currentItemId || props.steps[e.detail.current];
    emit("next", "user", props.steps[rawIndex], nextStepId);
  }
}

/**
 * 处理"下一步"点击
 */
function onNextClick(source: "user" | "parent" = "user") {
  emit(
    "next",
    source,
    props.steps[currentStepIndex.value],
    props.steps[currentStepIndex.value + 1]
  );
  currentStepIndex.value += 1;
}

/**
 * 处理"直接填表"点击
 * @description
 * 保存为草稿并跳转到表单编辑页面
 */
function onSkipAllClick() {
  if (props.l2Type) {
    // save as cache
    usePartnerRequestStore()
      .saveDraft(props.l2Type, props.prForm)
      .then(() => {
        uni.navigateTo({
          url: `/pages/partner_request/create_end/create_end?type=${props.l2Type}&immersive=true`,
        });
      });
  } else {
    // pop a picker to select l2type
    showL2TypePicker.value = true;
  }
}

/**
 * 处理"检查并发布"点击
 * @description
 * 完成所有步骤，保存为草稿并跳转到表单编辑页面
 */
function onFinishClick(source: "user" | "parent" = "user") {
  emit("next", source, props.steps[currentStepIndex.value]);

  if (props.l2Type) {
    // save as cache
    usePartnerRequestStore()
      .saveDraft(props.l2Type, props.prForm)
      .then(() => {
        uni.navigateTo({
          url: `/pages/partner_request/create_end/create_end?type=${props.l2Type}&immersive=true`,
        });
      });
  } else {
    // pop a picker to select l2type
    showL2TypePicker.value = true;
  }
}

/**
 * 处理二级类型选择
 */
function onL2TypeSelect(l2Type: any) {
  showL2TypePicker.value = false;
  emit("update:l2Type", l2Type as PRType);
  onSkipAllClick();
}

/**
 * 下一步（暴露给父组件调用）
 * @description
 * 无下一步时相当于完成
 */
function nextStep() {
  if (currentStepIndex.value === props.steps.length - 1) {
    onFinishClick("parent");
  } else {
    onNextClick("parent");
  }
}

defineExpose({
  nextStep,
});
</script>

<template>
  <swiper
    class="swiper"
    :current="currentStepIndex"
    vertical
    easingFunction="easeOutCubic"
    @change="onSwiperChange"
  >
    <swiper-item v-for="(slot, index) in steps" :item-id="slot" :key="slot">
      <view
        class="cont"
        :style="{
          marginBottom: getSafeArea().bottom + 'px',
          marginTop: getSafeArea().top + 'px',
          height: `calc(100% - ${getSafeArea().top + getSafeArea().bottom}px)`,
        }"
      >
        <view class="progress-indicator">
          <text>{{ index + 1 }}/{{ steps.length }}</text>
        </view>

        <view class="main">
          <slot :name="slot" :complete="nextStep" />
        </view>

        <view class="operations">
          <view
            v-if="index === steps.length - 1"
            class="item finish"
            @click="onFinishClick"
          >
            <text>{{ dt("operations.finish.text") }}</text>
            <text class="i-mdi-arrow-right finish__icon" />
          </view>
          <view
            v-if="index < steps.length - 1"
            class="item next"
            @click="onNextClick"
          >
            <text>{{ dt("operations.next.text") }}</text>
            <text class="i-mdi-arrow-right next__icon" />
          </view>
          <view
            v-if="index < steps.length - 1"
            class="skip-all item"
            @click="onSkipAllClick"
          >
            <text>{{ dt("operations.skip_all.text") }}</text>
            <text class="i-mdi-arrow-right skip-all__icon" />
          </view>
        </view>
      </view>
    </swiper-item>
  </swiper>

  <PUDrawer
    v-model:visible="showL2TypePicker"
    :title="dt('l2type_picker.title')"
    height="360px"
  >
    <PRTypePicker
      style="height: 260px"
      option-mode="l2"
      :l1-type="props.l1Type"
      blend-to-background="bottom"
      @select="onL2TypeSelect"
    />
  </PUDrawer>
</template>

<style lang="scss" scoped src="./PRImmersiveForm.scss"></style>
