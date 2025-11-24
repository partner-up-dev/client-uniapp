import { makeStringProp, makeBooleanProp, makeArrayProp } from "@/utils/props";
import type { PropType } from "vue";

// ==================== 组件相关类型定义 ====================

export type NoticeBarDirection = "horizontal" | "vertical";

// ==================== 组件常量定义 ====================

// ==================== 组件 Props 定义 ====================
export const puNoticeBarProps = {
  text: {
    type: [String, Array] as PropType<string | string[]>,
    default: "",
  },
  prefix: makeStringProp(""),
  backgroundColor: makeStringProp("#fef0f0"),
  color: makeStringProp("#f56c6c"),
  direction: makeStringProp<NoticeBarDirection>("horizontal"),
  scrollable: makeBooleanProp(true),
  closeable: makeBooleanProp(false),
  wrapable: makeBooleanProp(false),
};

// ==================== 组件 Emits 定义 ====================
export const puNoticeBarEmits = {
  close: () => true,
  click: () => true,
};

// ==================== 组件工具函数 ====================
