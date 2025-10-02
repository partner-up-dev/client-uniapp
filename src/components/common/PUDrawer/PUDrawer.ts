import { makeStringProp } from "@/utils/props";

// ==================== 组件 Props 定义 ====================
export const puDrawerProps = {
  title: makeStringProp(""),
  visible: {
    type: Boolean,
    default: false,
  },
  height: makeStringProp("60vh"),
};

// ==================== 组件 Emits 定义 ====================
export const puDrawerEmits = {
  "update:visible": (value: boolean) => true,
};