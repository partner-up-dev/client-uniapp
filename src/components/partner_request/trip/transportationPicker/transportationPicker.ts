// Types of Component:PartnerRequest:Trip:TransportationPicker

import type { Transportation } from "@/business/partner_request/trip";
import { makeBooleanProp, makeStringProp } from "@/utils/props";
import type { PropType } from "vue";

// ==================== 组件相关类型定义 ====================

/**
 * 交通方式图标映射
 */
export const TRANSPORTATION_ICONS: Record<Transportation, string> = {
  self_drive_automobile: "i-mdi-car",
  ride_hailing: "i-mdi-taxi",
  moped: "i-mdi-moped",
};

// ==================== 组件常量定义 ====================

/**
 * 可用的交通方式列表
 */
export const TRANSPORTATION_OPTIONS: Transportation[] = [
  "self_drive_automobile",
  "ride_hailing",
  "moped",
];

// ==================== 组件 Props 定义 ====================

export const transportationPickerProps = {
  /**
   * 当前选中的交通方式
   */
  modelValue: {
    type: String as PropType<Transportation | null>,
    default: null,
  },
  /**
   * 是否与背景融合（右侧渐变）
   */
  fade: makeBooleanProp(true)
};

// ==================== 组件 Emits 定义 ====================

export const transportationPickerEmits = {
  /**
   * 更新v-model值
   */
  "update:modelValue": (value: Transportation) => true,
  /**
   * 选择了一个交通方式
   */
  select: (value: Transportation) => true,
  /**
   * 完成选择
   */
  complete: () => true,
};
