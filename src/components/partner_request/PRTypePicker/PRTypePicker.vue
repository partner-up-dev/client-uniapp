<script lang="ts">
export default {
  name: "PRTypePicker",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts" generic="T extends 'l1' | 'l2' = 'l1'">
import { BasicComponentOptions } from "@/utils/vue";
import {
  prTypePickerProps,
  AVAILABLE_L1_TYPES,
  type OptionMode,
} from "./PRTypePicker";
import Card from "@/components/common/card/card.vue";
import PuScrollView from "@partner-up-dev/design-uniapp/components/puScrollView/puScrollView.vue";
import { computed } from "vue";
import { PRL1Type, PRL1Type2PRType, PRType } from "@/business/partner_request";
import { useTranslate } from "@/locale/use";

// 根据泛型 T 推断 select 事件的类型
type SelectType<Mode extends OptionMode> = Mode extends "l1"
  ? PRL1Type
  : Mode extends "l2"
  ? PRType
  : never;

const props = defineProps(prTypePickerProps);
const emit = defineEmits<{
  select: [type: SelectType<T>];
}>();

const { dt } = useTranslate("partner_request");

// ==================== 计算属性 ====================

/**
 * 类型选项列表
 */
const options = computed((): SelectType<T>[] => {
  if (props.optionMode === "l1") {
    return AVAILABLE_L1_TYPES as SelectType<T>[];
  } else if (props.optionMode === "l2" && props.l1Type) {
    return PRL1Type2PRType[props.l1Type] as SelectType<T>[];
  }
  return [];
});

/**
 * 滚动方向
 */
const scrollDirection = computed(() => {
  return props.mode === "horizontal-card" ? "x" : "y";
});

/**
 * 根类型选择器样式类
 */
const rootClass = computed(() => {
  return ["pr-type-picker", props.mode, props.customClass].filter(Boolean);
});

// ==================== 方法 ====================

/**
 * 获取类型对应的标题
 */
function getTypeTitle(type: SelectType<T>): string {
  return dt(`type_display.title.${type}`);
}

/**
 * 获取类型对应的描述
 */
function getTypeDescription(type: SelectType<T>): string {
  return dt(`type_display.description.${type}`);
}

/**
 * 判断是否为最后一个元素
 */
function isLastItem(index: number): boolean {
  return index === options.value.length - 1;
}

/**
 * 处理卡片点击事件
 */
function onCardClick(type: SelectType<T>) {
  emit("select", type);
}
</script>

<template>
  <view :class="rootClass" :style="customStyle">
    <PuScrollView :direction="scrollDirection" :edge-fade="fade ? 'auto' : undefined" class="pr-type-picker__scroll">
      <Card v-for="(type, index) in options" :key="type"
        :class="['pr-type-picker__item', isLastItem(index) ? 'last-child' : '']" :title="getTypeTitle(type)"
        :description="getTypeDescription(type)" @click="onCardClick(type)" />
    </PuScrollView>
  </view>
</template>

<style lang="scss" scoped src="./PRTypePicker.scss"></style>
