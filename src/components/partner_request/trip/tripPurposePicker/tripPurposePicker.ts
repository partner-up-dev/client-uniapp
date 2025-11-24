import { baseProps, makeStringProp } from "@/utils/props";
import type { TripPurpose } from "@/business/partner_request/trip";

// ==================== 组件相关类型定义 ====================

export type EdgeFadePosition = "start" | "end" | "both";

// ==================== 组件常量定义 ====================

/**
 * @name 出行目的图标映射
 * @description 每个出行目的对应的图标类名
 */
export const TRIP_PURPOSE_ICONS: Record<TripPurpose, string> = {
  airport_pickup: "i-mdi-airplane-landing",
  airport_dropoff: "i-mdi-airplane-takeoff",
  railway_dropoff: "i-mdi-train",
  railway_pickup: "i-mdi-train-variant",
  common: "i-mdi-car",
  commute: "i-mdi-briefcase",
};

/**
 * @name 出行目的列表
 * @description 按照展示顺序排列的出行目的
 */
export const TRIP_PURPOSES: TripPurpose[] = [
  "airport_dropoff",
  "airport_pickup",
  "railway_dropoff",
  "railway_pickup",
  "common",
  "commute",
];

// ==================== 组件 Props 定义 ====================

export const tripPurposePickerProps = {
  /**
   * 当前选中的出行目的
   */
  modelValue: makeStringProp<TripPurpose | null>(null),

  /**
   * 边缘渐变效果位置
   * - start: 左侧渐变
   * - end: 右侧渐变
   * - both: 两侧渐变
   * - undefined: 不渐变
   */
  edgeFade: makeStringProp<EdgeFadePosition | undefined>("end"),

  ...baseProps,
} as const;

// ==================== 组件 Emits 定义 ====================

export const tripPurposePickerEmits = {
  /**
   * v-model 更新事件
   */
  "update:modelValue": (purpose: TripPurpose) => true,

  /**
   * 选择事件
   */
  select: (purpose: TripPurpose) => true,

  /**
   * 完成选择事件
   */
  complete: () => true,
} as const;
