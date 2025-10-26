import { PartnerRequestForm } from "@/business/partner_request/base";
import { makeBooleanProp, makeStringProp } from "@/utils/props";
import type { PropType } from "vue";
import { PRType } from "@/business/partner_request";
import { Route } from "@/business/base/route";
import { TripPreference } from "@/business/partner_request/trip";

// ==================== 组件相关类型定义 ====================

// ==================== 组件常量定义 ====================

// ==================== 组件 Props 定义 ====================
export const prFormProps = {
  baseForm: {
    type: Object as PropType<PartnerRequestForm>,
    default: () => PartnerRequestForm.parse({}),
  },
  type: {
    type: String as PropType<PRType>,
    default: undefined,
  },
  route: {
    type: Object as PropType<Route>,
    default: undefined,
  },
  tripPreference: {
    type: Object as PropType<TripPreference>,
    default: undefined,
  },
  showSaveToDraft: makeBooleanProp(true),
  showConfirm: makeBooleanProp(true)
};

// ==================== 组件 Emits 定义 ====================
export const prFormEmits = {
  confirm: (partnerRequestId: number) => true,
  "update:route": (value: Route) => true,
  "update:tripPreference": (value: TripPreference) => true,
};

// ==================== 组件工具函数 ====================