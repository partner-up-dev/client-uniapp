import type { PropType } from "vue";
import { makeBooleanProp, makeStringProp } from "@/utils/props";

// ==================== 组件 Props 定义 ====================
export const cardProps = {
  title: makeStringProp(""),
  description: makeStringProp(""),
  icon: makeStringProp("i-mdi-chevron-right"),
  type: makeStringProp<"default" | "expandable">("default"),
  expand: makeBooleanProp(false),
  reverse: makeBooleanProp(false),
};

// ==================== 组件 Emits 定义 ====================
export const cardEmits = {
  "update:expand": (value: boolean) => true,
};

// ==================== 组件工具函数 ====================
/**
 * 格式化卡片标题显示
 * @param title 原始标题
 * @returns 格式化后的标题
 */
export function formatCardTitle(title: string): string {
  return title.trim();
}

/**
 * 格式化卡片描述显示
 * @param description 原始描述
 * @returns 格式化后的描述
 */
export function formatCardDescription(description: string): string {
  return description.trim();
}