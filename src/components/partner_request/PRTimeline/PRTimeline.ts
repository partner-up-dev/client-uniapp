import type { PropType } from "vue";
import { PRStatus } from "@/business/partner_request";

// ==================== 组件 Props 定义 ====================
export const prTimelineProps = {
  currentStatus: {
    type: String as PropType<PRStatus>,
    required: true,
  }
};

// ==================== 组件 Emits 定义 ====================
export const prTimelineEmits = {
};