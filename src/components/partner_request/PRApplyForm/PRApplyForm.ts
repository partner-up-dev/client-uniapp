import type { PartnerApplication } from "@/business/partner_request/application";
import { makeBooleanProp, makeRequiredProp } from "@/utils/props";
import { PRRefProp } from "@/business/partner_request";

// ==================== 组件 Props 定义 ====================
export const prApplyFormProps = {
  PRId: makeRequiredProp(PRRefProp),
  externalOps: makeBooleanProp(false),
} as const;

// ==================== 组件 Emits 定义 ====================
export const prApplyFormEmits = {
  /** 成功提交后触发 */
  submitted: (application: PartnerApplication) => true,
  /** 提交失败时触发（例如校验失败或接口异常） */
  error: (err: unknown) => true,
  /** 选择集变化（已选择的 roleId 列表） */
  change: (selectedRoles: number[]) => true,
} as const;

