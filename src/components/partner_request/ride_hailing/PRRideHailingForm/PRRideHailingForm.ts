// Types of component:partner_request:ride_hailing:PRRideHailingForm

import { useTranslate } from "@/locale";
import type { RideHailingPRForm } from "@/business/partner_request/ride_hailing";
import type { PropType } from "vue";

export const { dt: domain_t, t } = useTranslate('partner_request.ride_hailing.specific_content_editor');

// ==================== 组件 Props 定义 ====================
export const rideHailingFormProps = {
  form: {
    type: Object as PropType<RideHailingPRForm>,
    default: () => ({
      route: undefined,
      trip_preference: undefined,
      ride_hailing_preference: {
        ride_types: []
      }
    })
  }
};

// ==================== 组件 Emits 定义 ====================
export const rideHailingFormEmits = {
  change(field_name: string) {
    return true;
  }
};

// ==================== 组件 Expose 定义 ====================
export interface RideHailingFormExpose {
  /**
   * Validate the form
   * @returns Promise with validation result
   */
  validate(): Promise<{ valid: boolean; message?: string }>;
}
