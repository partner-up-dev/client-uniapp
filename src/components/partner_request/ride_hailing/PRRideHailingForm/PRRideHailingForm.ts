// Types of component:partner_request:ride_hailing:PRRideHailingForm

import type { RideHailingPRForm } from "@/business/partner_request/ride_hailing";
import type { PropType } from "vue";
import enUs from "./PRRideHailingForm.en-US.jsonc";
import zhHans from "./PRRideHailingForm.zh-Hans.jsonc";

export const localMessages = {
  "zh-Hans": zhHans,
  "en-US": enUs,
} as const;

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
