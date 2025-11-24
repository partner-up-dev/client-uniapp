import type { PropType } from "vue";
import { makeStringProp, makeBooleanProp } from "@/utils/props";

// ==================== 组件相关类型定义 ====================

export type ButtonTheme =
  | "Primary"
  | "PrimaryContainer"
  | "Tertiary"
  | "Surface"
  | "SurfaceOutlined"
  | "Plain";

export type ButtonType = "WithText" | "OnlyIcon" | "Bar";

export type ButtonSize = "xSmall" | "Small" | "Medium" | "Large";

// ==================== 组件 Props 定义 ====================

export const puButtonProps = {
  // Button content
  text: makeStringProp("Button"),
  prefixIcon: makeStringProp(""),
  suffixIcon: makeStringProp(""),

  // Display controls
  showDot: makeBooleanProp(false),

  // State controls
  toggled: makeBooleanProp(false),
  active: makeBooleanProp(false),

  // Button variants
  theme: makeStringProp<ButtonTheme>("PrimaryContainer"),
  type: makeStringProp<ButtonType>("WithText"),
  size: makeStringProp<ButtonSize>("Small"),
  rounded: makeBooleanProp(false),

  // Interaction
  disabled: makeBooleanProp(false),
  loading: makeBooleanProp(false),

  // Custom styling
  customStyle: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
};

// ==================== 组件 Emits 定义 ====================

export const puButtonEmits = {
  click: (event: any) => true,
};
