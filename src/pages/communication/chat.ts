import type { PropType } from "vue";
import type { ChatRef } from "@/business/communication";

// ==================== 页面参数类型定义 ====================

// TODO use valibot
export interface ChatPageParams {
  /** 聊天会话ID */
  id: ChatRef;
}

// ==================== 页面常量定义 ====================

/** 默认消息加载数量 */
export const DEFAULT_MESSAGE_OFFSET = 20;

/** 消息内容最大长度 */
export const MAX_MESSAGE_LENGTH = 120;

/** 消息内容最小长度 */
export const MIN_MESSAGE_LENGTH = 1;
