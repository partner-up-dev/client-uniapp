import type { ExtractPropTypes } from "vue";
import { baseProps, makeBooleanProp, makeStringProp } from "@/utils/props";

// ==================== 组件 Props 定义 ====================
export const puTabProps = {
  ...baseProps,
  text: makeStringProp<string>("Tab"),
  showDot: makeBooleanProp(true),
  // follow uppercase in doc but use lowercase values for class mapping
  size: makeStringProp<"Large" | "Medium" | "Small">("Large"),
  // allow external custom class
  customClass: makeStringProp<string>("")
} as const;

export type PUTabProps = ExtractPropTypes<typeof puTabProps>;

export const puTabEmits = {} as const;
