// Types of component:partner_request:PRMetadataForm

import { PartnerRequestForm } from "@/business/partner_request/form";
import type { PropType } from "vue";
import enUs from "./PRMetadataForm.en-US.jsonc";
import zhHans from "./PRMetadataForm.zh-Hans.jsonc";

export const localMessages = {
  "zh-Hans": zhHans,
  "en-US": enUs,
} as const;

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
