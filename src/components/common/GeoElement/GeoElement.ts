import type { PropType } from "vue";
import { Route, POI } from "@/business/base/route";

export enum GeoElementType {
  Route = 'route',
  POI = 'poi',
}

export interface GeoElement<T extends GeoElementType = GeoElementType> {
  type: T;
  value: T extends GeoElementType.Route ? Route : T extends GeoElementType.POI ? POI : never;
}

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

