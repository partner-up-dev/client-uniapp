// Types of component:partner_request:commute:commuteDatetimeForm

import { useTranslate } from "@/locale/use";
import type { Weekday } from "@/business/base";
import { CommutePRForm } from "@/business/partner_request/commute";
import type { PropType } from "vue";

export const { dt: domain_t, t } = useTranslate('partner_request.commute.specific_content_editor');

// ==================== 组件 Props 定义 ====================
export const commuteDatetimeFormProps = {
  form: {
    type: Object as PropType<CommutePRForm>,
    default: () => new CommutePRForm({}),
  }
};

// ==================== 组件 Emits 定义 ====================
export const commuteDatetimeFormEmits = {
  change(field_name: string) {
    return true;
  }
};

// ==================== 组件 Expose 定义 ====================
export interface CommuteDatetimeFormExpose {
  /**
   * Validate the form
   * @returns Promise with validation result
   */
  validate(): Promise<{ valid: boolean; message?: string }>;
}
