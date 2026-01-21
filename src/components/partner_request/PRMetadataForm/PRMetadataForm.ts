// Types of component:partner_request:PRMetadataForm

import { useTranslate } from "@/locale";
import { PartnerRequestForm } from "@/business/partner_request/form";
import type { PropType } from "vue";

export const { dt: domain_t } = useTranslate('partner_request.common_editor');

// ==================== 组件 Props 定义 ====================
export const prMetadataFormProps = {
  form: {
    type: Object as PropType<PartnerRequestForm>,
    required: true,
  }
};

// ==================== 组件 Emits 定义 ====================
export const prMetadataFormEmits = {
  change(field_name: string) {
    return true;
  }
};
