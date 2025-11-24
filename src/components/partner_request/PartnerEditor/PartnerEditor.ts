import type { PropType } from "vue";
import type { PartnerRoleRef } from "@/business/partner_request/partner";
import type { AccountRef } from "@/business/account";

// ==================== 组件 Props 定义 ====================
export const partnerEditorProps = {
  /** 搭子角色 ID，null 表示未选择 */
  role: {
    type: [Number, null] as PropType<PartnerRoleRef | null>,
    default: null,
  },
  /** 扮演此角色的账户 ID，null 表示无人扮演 */
  player: {
    type: [String, null] as PropType<AccountRef | null>,
    default: null,
  },
} as const;

// ==================== 组件 Emits 定义 ====================
export const partnerEditorEmits = {
  /** 角色更改 */
  "update:role": (roleId: PartnerRoleRef | null) => true,
  /** 扮演者更改 */
  "update:player": (accountId: AccountRef | null) => true,
  /** 点击左侧文本区域（用于触发角色选择器） */
  selectRole: () => true,
  /** 点击删除按钮 */
  remove: () => true,
};
