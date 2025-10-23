import { PartnerRequestForm } from "@/business/partner_request/base";
import { makeBooleanProp } from "@/utils/props";
import type { PropType } from "vue";

// ==================== 组件相关类型定义 ====================

// ==================== 组件常量定义 ====================

// ==================== 组件 Props 定义 ====================
export const prFormProps = {
  baseForm: {
    type: Object as PropType<PartnerRequestForm>,
    default: () => PartnerRequestForm.parse({}),
  },
  showSaveToDraft: makeBooleanProp(true),
  showConfirm: makeBooleanProp(true)
};

// ==================== 组件 Emits 定义 ====================
export const prFormEmits = {
  confirm: (partnerRequestId: number) => true,
};

// ==================== 组件工具函数 ====================