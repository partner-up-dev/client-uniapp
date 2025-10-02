import { makeBooleanProp } from "@/utils/props";
import type { PropType } from "vue";
import type { Partner, PartnerRole } from "@/business/partner_request/partner";

// ==================== 组件 Props 定义 ====================
export const partnerProps = {
  /** 业务实体：搭子（包含 _id/role/player 等） */
  partner: {
    type: Object as PropType<Partner>,
    required: true,
  },
  /** 业务实体：角色（可选；若不传则根据 partner.role 自动获取） */
  partnerRole: {
    type: Object as PropType<PartnerRole>,
    required: false,
  },
  expand: makeBooleanProp(false),
  /** 默认视图或编辑视图 */
  type: {
    type: String as PropType<"Default" | "Editor">,
    default: "Default",
  },
} as const;

// ==================== 组件 Emits 定义 ====================
export const partnerEmits = {
  'update:expand': (value: boolean) => true,
  'delete': (partner: Partner) => true,
};
