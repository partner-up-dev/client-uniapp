import { PRType, type PRRef } from "@/business/partner_request";
import { PartnerRequestForm } from "@/business/partner_request/form";
import { CommutePRForm, type CommutePR } from "@/business/partner_request/commute";
import { RideHailingPRForm, type RideHailingPR } from "@/business/partner_request/ride_hailing";
import { makeNumberProp } from "@/utils/props";

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

/**
 * PR 类型与实例类型的映射
 */
export type PRTypeToInstanceMap = {
  [PRType.Commute]: CommutePR;
  [PRType.RideHailing]: RideHailingPR;
};

/**
 * 根据 PR 类型获取对应的实例类型
 */
export type GetInstanceTypeByPRType<T extends PRType> = T extends keyof PRTypeToInstanceMap
  ? PRTypeToInstanceMap[T]
  : never;

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

// ==================== 组件 Props 定义 ====================

export const prFormProps = {
  id: makeNumberProp<PRRef | undefined>(undefined),
};

// ==================== 组件 Emits 定义 ====================

export const prFormEmits = {
  created: (pr: CommutePR | RideHailingPR) => true,
  updated: (pr: CommutePR | RideHailingPR) => true,
  published: () => true,
  "update:id": (id: PRRef) => true,
};