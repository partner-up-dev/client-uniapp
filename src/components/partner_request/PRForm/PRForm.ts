import { PRType } from "@/business/partner_request";
import { PartnerRequestForm } from "@/business/partner_request/form";
import { makeBooleanProp, makeStringProp } from "@/utils/props";
import type { PropType } from "vue";

// ==================== 组件相关类型定义 ====================

// ==================== 组件常量定义 ====================

// ==================== 组件 Props 定义 ====================
export const prFormProps = {
  modelValue: {
    type: Object as PropType<PartnerRequestForm>,
    default: () => PartnerRequestForm.parse({}),
  },
  type: makeStringProp<PRType | undefined>(undefined),
  showSaveToDraft: makeBooleanProp(true),
  showConfirm: makeBooleanProp(true)
};

// ==================== 组件 Emits 定义 ====================
export const prFormEmits = {
  confirm: (partnerRequestId: number) => true,
  "update:modelValue": (value: PartnerRequestForm) => true,
};

// ==================== 组件工具函数 ====================