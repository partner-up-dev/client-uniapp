import type { PropType } from "vue";
import {
  baseProps,
  makeBooleanProp,
  makeNumberProp,
  makeStringProp,
  numericProp,
} from "@/utils/props";

// ==================== 组件 Props 定义 ====================
export const puTextareaProps = {
  ...baseProps,
  // v-model value
  modelValue: makeStringProp(""),

  // Display
  placeholder: makeStringProp("请输入..."),
  // -1 表示不限制（遵循 uni-app 规则）；否则展示计数时会使用该值
  maxlength: { type: numericProp as PropType<number | string>, default: -1 },
  showCount: makeBooleanProp(false),

  // Behavior & states
  autoHeight: makeBooleanProp(false),
  disabled: makeBooleanProp(false),
  readonly: makeBooleanProp(false),
  focus: makeBooleanProp(false),

  // Keyboard/IME (uni-app 原生 textarea 属性)
  confirmType: makeStringProp<
    "send" | "search" | "next" | "go" | "done"
  >("done"),
  showConfirmBar: makeBooleanProp(true),
  holdKeyboard: makeBooleanProp(false),
  cursorSpacing: makeNumberProp(16),
  adjustPosition: makeBooleanProp(true),
  fixed: makeBooleanProp(false),
  disableDefaultPadding: makeBooleanProp(false),

  // Visual
  // 组件默认高度
  height: makeNumberProp(80),
  // 聚焦时最小高度，未设置则与 height 保持一致
  focusHeight: { type: Number as PropType<number | undefined>, default: undefined },
};

// ==================== 组件 Emits 定义 ====================
export const puTextareaEmits = {
  "update:modelValue": (value: string) => true,
  input: (value: string) => true,
  focus: (e: any) => true,
  blur: (e: any) => true,
  confirm: (e: any) => true,
  linechange: (e: any) => true,
};

// ==================== 组件内部类型/工具 ====================
export type PuTextareaConfirmType = "send" | "search" | "next" | "go" | "done";
