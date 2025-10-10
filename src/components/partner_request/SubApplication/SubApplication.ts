import type { PropType } from "vue";
import type { PartnerSubApplication } from "@/business/partner_request/application";
import { makeBooleanProp } from "@/utils/props";

// ==================== 组件 Props 定义 ====================
export const subApplicationProps = {
  /** 子申请实体 */
  subApplication: {
    type: Object as PropType<PartnerSubApplication>,
    required: true,
  },
  /** 是否可编辑 */
  editable: makeBooleanProp(false),
} as const;

// ==================== 组件 Emits 定义 ====================
export const subApplicationEmits = {
  'delete': (subApplication: PartnerSubApplication) => true,
};
