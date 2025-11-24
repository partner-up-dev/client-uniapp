import type { PropType } from "vue";
import { makeRequiredProp } from "@/utils/props";
import type { ChatRef } from "@/business/communication";
import { ChatType } from "@/business/communication/chat";

// ==================== 组件 Props 定义 ====================
export const chatEntryProps = {
  chatId: makeRequiredProp(Number as PropType<ChatRef>),
};

// ==================== 组件 Emits 定义 ====================
export const chatEntryEmits = {
  click: () => true,
};

// ==================== 工具函数 ====================
