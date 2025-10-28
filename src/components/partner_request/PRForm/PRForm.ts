import { PRType, type PRRef } from "@/business/partner_request";
import { PartnerRequestForm } from "@/business/partner_request/form";
import { CommutePRForm, type CommutePR } from "@/business/partner_request/commute";
import { RideHailingPRForm, type RideHailingPR } from "@/business/partner_request/ride_hailing";

// ==================== 组件相关类型定义 ====================

/**
 * 根据 PR 类型获取对应的表单类型
 */
export type GetFormTypeByPRType<T extends PRType> = T extends PRType.Commute ?
  CommutePRForm : T extends PRType.RideHailing ?
  RideHailingPRForm :
  PartnerRequestForm;

// ==================== 组件工具函数 ====================

/**
 * 根据 PR 类型创建初始表单数据
 */
export function createFormByType<T extends PRType>(type: T): GetFormTypeByPRType<T> {
  switch (type) {
    case PRType.Commute:
      return new CommutePRForm({}) as GetFormTypeByPRType<T>;
    case PRType.RideHailing:
      return new RideHailingPRForm({}) as GetFormTypeByPRType<T>;
    default:
      return new PartnerRequestForm({}) as GetFormTypeByPRType<T>;
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