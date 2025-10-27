import { PRType } from "@/business/partner_request";
import { PartnerRequestForm } from "@/business/partner_request/form";
import { CommutePRForm } from "@/business/partner_request/commute";
import { RideHailingPRForm } from "@/business/partner_request/ride_hailing";

// ==================== 组件相关类型定义 ====================

/**
 * PR 类型与表单类型的映射
 */
export type PRTypeToFormMap = {
  [PRType.Commute]: CommutePRForm;
  [PRType.RideHailing]: RideHailingPRForm;
  [PRType.Undefined]: PartnerRequestForm;
};

/**
 * 根据 PR 类型获取对应的表单类型
 */
export type GetFormTypeByPRType<T extends PRType> = T extends keyof PRTypeToFormMap
  ? PRTypeToFormMap[T]
  : PartnerRequestForm;

// ==================== 组件工具函数 ====================

/**
 * 根据 PR 类型创建初始表单数据
 */
export function createFormByType<T extends PRType>(type: T): GetFormTypeByPRType<T> {
  switch (type) {
    case PRType.Commute:
      return CommutePRForm.parse({}) as GetFormTypeByPRType<T>;
    case PRType.RideHailing:
      return RideHailingPRForm.parse({}) as GetFormTypeByPRType<T>;
    default:
      return PartnerRequestForm.parse({}) as GetFormTypeByPRType<T>;
  }
}

export function getFormSchemaByType<T extends PRType>(type: T) {
  switch (type) {
    case PRType.Commute:
      return CommutePRForm;
    case PRType.RideHailing:
      return RideHailingPRForm;
    default:
      return PartnerRequestForm;
  }
}