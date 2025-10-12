import type { PropType } from "vue";
import { makeRequiredProp } from "@/utils/props";
import { Message } from "@/business/communication/message";

// ==================== 组件相关类型定义 ====================

// ==================== 组件常量定义 ====================

/** 默认最大宽度 */
export const DEFAULT_MAX_WIDTH = "70%";

/** 默认最小宽度 */
export const DEFAULT_MIN_WIDTH = "50%";

// ==================== 组件 Props 定义 ====================
export const messageProps = {
  /** 消息对象 */
  message: makeRequiredProp(Message),
};

// ==================== 组件 Emits 定义 ====================
export const messageEmits = {
};

// ==================== 组件工具函数 ====================