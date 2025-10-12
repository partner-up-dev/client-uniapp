import type { PropType } from "vue";
import { makeRequiredProp, makeStringProp } from "@/utils/props";
import { type ChatRef } from "@/business/communication";

// ==================== 组件相关类型定义 ====================

// ==================== 组件常量定义 ====================

/** 默认消息加载数量 */
export const DEFAULT_MESSAGE_OFFSET = 20;

/** 默认起始位置 */
export const DEFAULT_START_POSITION = 0;

// ==================== 组件 Props 定义 ====================
export const chatContentProps = {
  /** 聊天会话ID */
  chatId: makeRequiredProp(Number as PropType<ChatRef>),
  /** 渲染模式 */
  mode: makeStringProp<'scroll-view' | 'flex'>('scroll-view'),
};

// ==================== 组件 Emits 定义 ====================
export const chatContentEmits = {
  /** 消息加载完成 */
  messagesLoaded: (messageCount: number) => true,
};

// ==================== 组件工具函数 ====================