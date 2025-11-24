import type { PropType } from "vue";
import { makeStringProp, makeBooleanProp } from "@/utils/props";

// ==================== 组件相关类型定义 ====================
export type NavBarTheme = "secondary" | "surface";

// ==================== 组件常量定义 ====================

// ==================== 组件 Props 定义 ====================
export const navBarProps = {
  title: makeStringProp(""),
  showRefresh: makeBooleanProp(true),
  showMore: makeBooleanProp(true),
  theme: makeStringProp<NavBarTheme>("secondary"),
};

// ==================== 组件 Emits 定义 ====================
export const navBarEmits = {
  refresh: () => true,
  more: () => true,
};

// ==================== 组件工具函数 ====================