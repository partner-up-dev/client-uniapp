import type { PropType } from "vue";
import { Route, POI } from "@/business/base/route";

export type GeoElement = Route | POI;

// ==================== 组件 Props 定义 ====================
export const geoElementProps = {
  element: {
    type: Object as PropType<GeoElement>,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
};

// ==================== 组件 Emits 定义 ====================
export const geoElementEmits = {
};

