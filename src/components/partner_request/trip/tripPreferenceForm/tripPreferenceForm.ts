import type { PropType } from "vue";
import { TripPreference } from "@/business/partner_request/trip";

// ==================== 组件相关类型定义 ====================

// ==================== 组件常量定义 ====================

// ==================== 组件 Props 定义 ====================
export const tripPreferenceFormProps = {
  modelValue: {
    type: Object as PropType<TripPreference>,
    required: true,
  },
};

// ==================== 组件 Emits 定义 ====================
export const tripPreferenceFormEmits = {
  "update:modelValue": (value: TripPreference) => true,
  change: () => true,
};

// ==================== 组件工具函数 ====================
