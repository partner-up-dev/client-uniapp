import type { PropType } from "vue";
import { makeStringProp } from "@/utils/props";
import type { ValibotFormClass } from "@/business";
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

/**
 * ValibotFormClass instance with validate method
 */
export interface ValibotFormInstance {
  validate(): Promise<{ success: boolean; errors: Record<string, string[]> }>;
  [key: string]: any;
}

// ==================== 组件 Props 定义 ====================
export const puFormProps = {
  /**
   * ValibotFormClass instance for form validation
   * Must be an instance created via ValibotFormClass.parse() with validate() method
   */
  schema: {
    type: Object as PropType<ValibotFormInstance>,
    required: true,
  },
  /**
   * Padding for form items (cells)
   */
  cellPadding: makeStringProp(`var(--pu-form-cell-padding, 12px 16px)`),
};

// ==================== 组件 Emits 定义 ====================
export const puFormEmits = {};
