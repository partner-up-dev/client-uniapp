import { makeBooleanProp, makeStringProp } from "@/utils/props";

// ==================== 组件 Props 定义 ====================
export const puDrawerProps = {
  title: makeStringProp(""),
  visible: makeBooleanProp(false),
  height: makeStringProp("60vh"),
  fullCustom: makeBooleanProp(false),
  /**
   * 是否锁定背景滚动，防止滚动穿透
   */
  lockScroll: makeBooleanProp(true),
};

// ==================== 组件 Emits 定义 ====================
export const puDrawerEmits = {
  "update:visible": (value: boolean) => true,
};