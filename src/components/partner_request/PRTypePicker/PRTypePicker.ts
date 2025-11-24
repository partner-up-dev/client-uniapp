import type { PropType } from "vue";
import { baseProps, makeBooleanProp, makeStringProp } from "@/utils/props";
import { PRL1Type, PRL1Type2PRType, PRType } from "@/business/partner_request";

// ==================== 组件相关类型定义 ====================

/**
 * 选项模式类型
 * - l1: 显示一级类型（PRL1Type）
 * - l2: 显示二级类型（PRType），需要配合 l1Type 使用
 */
export type OptionMode = "l1" | "l2";

/**
 * 显示模式类型
 * - horizontal-card: 横向卡片滚动
 * - vertical-card: 纵向卡片滚动
 */
export type DisplayMode = "horizontal-card" | "vertical-card";

// ==================== 组件常量定义 ====================

/**
 * 可用的一级类型列表（排除 Undefined）
 */
export const AVAILABLE_L1_TYPES: PRL1Type[] = [PRL1Type.Trip, PRL1Type.Travel];

// ==================== 组件 Props 定义 ====================
export const prTypePickerProps = {
  /**
   * 显示模式
   * - horizontal-card: 横向卡片滚动
   * - vertical-card: 纵向卡片滚动
   */
  mode: makeStringProp<DisplayMode>("horizontal-card"),

  /**
   * 选项模式
   * - l1: 显示一级类型
   * - l2: 显示二级类型（需要配合 l1Type 使用）
   */
  optionMode: makeStringProp<OptionMode>("l1"),

  /**
   * 一级类型（当 optionMode 为 l2 时必填）
   */
  l1Type: {
    type: String as PropType<PRL1Type | undefined>,
    default: undefined,
  },

  /**
   * 是否启用边缘渐变效果
   */
  fade: makeBooleanProp(false),

  ...baseProps,
};

// ==================== 组件 Emits 定义 ====================
// Emits 通过泛型组件在 .vue 文件中定义，以实现类型安全
// select 事件的类型会根据 optionMode prop 自动推断

// ==================== 组件工具函数 ====================

/**
 * 根据一级类型获取对应的二级类型列表
 * @param l1Type 一级类型
 * @returns 二级类型列表
 */
export function getL2TypesByL1Type(l1Type: PRL1Type): PRType[] {
  return PRL1Type2PRType[l1Type] || [];
}
