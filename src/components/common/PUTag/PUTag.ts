import type { ExtractPropTypes } from "vue";
import { baseProps, makeBooleanProp, makeStringProp } from "@/utils/props";

// ==================== 组件 Props 定义 ====================
export const puTagProps = {
  ...baseProps,
  text: makeStringProp<string>(""),
  rounded: makeBooleanProp(false),
  outlined: makeBooleanProp(true),
  theme: makeStringProp<"SurfaceContainer">("SurfaceContainer"),
  size: makeStringProp<"Small" | "Medium">("Medium"),
} as const;

export type PUTagProps = ExtractPropTypes<typeof puTagProps>;

// ==================== 组件 Emits 定义 ====================
export const puTagEmits = {} as const;
