import type { ExtractPropTypes } from "vue";
import { baseProps, makeArrayProp, makeNumberProp, makeStringProp } from "@/utils/props";

// ==================== 组件 Props 定义 ====================
export const puTabsProps = {
  tabs: makeArrayProp<{ text: string; showDot?: boolean }>([]),
  modelValue: makeNumberProp(0),
  size: makeStringProp<"Large" | "Medium" | "Small">("Medium"),
  ...baseProps,
} as const;

export type PUTabsProps = ExtractPropTypes<typeof puTabsProps>;

// ==================== 组件 Emits 定义 ====================
export const puTabsEmits = {
  "update:modelValue": (index: number) => true,
  change: (index: number) => true,
} as const;
