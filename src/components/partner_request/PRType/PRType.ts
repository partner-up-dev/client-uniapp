import type { PropType } from "vue";
import { PartnerRequest } from "@/business/partner_request/base";

// ==================== 组件 Props 定义 ====================
export const prTypeProps = {
  pr: {
    type: Object as PropType<PartnerRequest>,
    required: true,
  },
};

// ==================== 组件 Emits 定义 ====================
export const prTypeEmits = {};
