import type { PropType } from "vue";
import { makeRequiredProp } from "@/utils/props";
import type { PRType } from "@/business/partner_request";
import { PartnerForm } from "@/business/partner_request/partner";

// ==================== 组件 Props 定义 ====================
export const partnersEditorProps = {
  /**
   * 搭子请求类型，用于获取可用角色列表
   */
  prType: makeRequiredProp(String as PropType<PRType>),

  /**
   * 搭子列表数据
   */
  modelValue: {
    type: Array as PropType<PartnerForm[]>,
    required: true,
  },
} as const;

// ==================== 组件 Emits 定义 ====================
export const partnersEditorEmits = {
  /**
   * 搭子列表更新
   */
  "update:modelValue": (partners: PartnerForm[]) => true,
};
