import type { PropType } from "vue";
import {
  makeArrayProp,
  makeBooleanProp,
  makeNumberProp,
  makeNumericProp,
  makeStringProp,
} from "@/utils/props";
import { type Size } from "@/utils/style";

// ==================== 组件相关类型定义 ====================

export type InputClearTrigger = "focus" | "always";

export type InputType =
  | "text"
  | "number"
  | "digit"
  | "idcard"
  | "safe-password"
  | "nickname"
  | "tel";

export type InputConfirmType = "send" | "search" | "next" | "go" | "done";

export interface FormItemRule {
  required?: boolean;
  message?: string;
  validator?: (value: any) => boolean | Promise<boolean>;
}

// ==================== 组件 Props 定义 ====================

export const puInputProps = {
  // v-model
  modelValue: makeStringProp(""),

  // 自定义样式类
  customInputClass: makeStringProp(""),
  customLabelClass: makeStringProp(""),

  // 原生属性
  placeholder: makeStringProp(""),
  placeholderStyle: makeStringProp(""),
  placeholderClass: makeStringProp(""),
  cursorSpacing: makeNumberProp(0),
  adjustPosition: makeBooleanProp(true),
  cursor: makeNumberProp(-1),
  selectionStart: makeNumberProp(-1),
  selectionEnd: makeNumberProp(-1),
  confirmType: makeStringProp<InputConfirmType>("done"),
  confirmHold: makeBooleanProp(false),
  holdKeyboard: makeBooleanProp(false),
  focus: makeBooleanProp(false),
  alwaysEmbed: makeBooleanProp(false),

  // Input 类型
  type: makeStringProp<InputType>("text"),
  password: makeBooleanProp(false),
  disabled: makeBooleanProp(false),
  readonly: makeBooleanProp(false),
  maxlength: makeNumberProp(-1),

  // 标签
  label: makeStringProp(""),
  labelWidth: makeStringProp(""),

  // 图标
  prefixIcon: makeStringProp(""),
  suffixIcon: makeStringProp(""),

  // 显示相关
  showPassword: makeBooleanProp(false),
  showWordLimit: makeBooleanProp(false),
  clearable: makeBooleanProp(false),
  clearTrigger: makeStringProp<InputClearTrigger>("focus"),

  // 样式
  height: makeNumberProp(28),
  center: makeBooleanProp(false),
  alignRight: makeBooleanProp(false),
  noBorder: makeBooleanProp(false),

  // 验证
  required: makeBooleanProp(false),
  rules: makeArrayProp<FormItemRule>([]),
  prop: makeStringProp(""),
  error: makeBooleanProp(false),
  errorMessage: makeStringProp(""),

  // 清空时聚焦
  focusWhenClear: makeBooleanProp(true),

  // 必填标记位置
  markerSide: makeStringProp<"before" | "after">("before"),
};

export type PUInputProps = typeof puInputProps;

// ==================== 组件 Emits 定义 ====================

export const puInputEmits = {
  "update:modelValue": (value: string | number) => true,
  input: (detail: { value: string | number }) => true,
  focus: (detail: { value: string | number; height: number }) => true,
  blur: (detail: { value: string | number; cursor: number }) => true,
  clear: () => true,
  confirm: (detail: { value: string | number }) => true,
  keyboardheightchange: (detail: { height: number; duration: number }) => true,
  clickPrefixIcon: () => true,
  clickSuffixIcon: () => true,
  click: () => true,
};

export type PUInputEmits = typeof puInputEmits;
