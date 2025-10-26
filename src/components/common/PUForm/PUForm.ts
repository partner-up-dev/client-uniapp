import type { PropType } from "vue";
import { makeStringProp } from "@/utils/props";
import type { ValibotClass } from "@/business";
import type * as v from "valibot";

// ==================== 组件相关类型定义 ====================

/**
 * Form validation result
 */
export interface FormValidationResult<T = any> {
  success: boolean;
  validatedForm?: T;
  errors?: Record<string, string>;
}

/**
 * Form error state provided to child cells
 */
export interface FormErrorState {
  errors: Record<string, string>;
}

// ==================== 组件 Props 定义 ====================
export const puFormProps = {
  /**
   * Valibot schema class instance for form validation
   */
  schema: {
    type: Object as PropType<ValibotClass>,
    required: true,
  },
  /**
   * Padding for form items (cells)
   */
  cellPadding: makeStringProp(`var(--pu-form-cell-padding, 12px 16px)`),
};

// ==================== 组件 Emits 定义 ====================
export const puFormEmits = {};
