import type { PropType } from "vue";
import { PartnerRole, type PartnerRoleRef } from "@/business/partner_request/partner";

// ==================== 组件 Props 定义 ====================
export const partnerRoleProps = {
  role: {
    type: Object as PropType<PartnerRole>
  },
  roleId: {
    type: Number as PropType<PartnerRoleRef>
  }
};

// ==================== 组件 Emits 定义 ====================
export const partnerRoleEmits = {
  'click': (role: PartnerRole) => true
};

// ==================== 组件工具函数 ====================
// 如果需要工具函数，可以在这里定义