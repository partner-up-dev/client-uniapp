import type { PropType } from "vue";
import type { RouteItem } from "@/business/base/route";

export type RouteItemType = "start" | "waypoint" | "end";
export type RouteItemLayout = "default" | "2rows";

// ==================== 组件 Props 定义 ====================
export const routeItemProps = {
  item: {
    type: Object as PropType<RouteItem>,
    required: true,
  },
  type: {
    type: String as PropType<RouteItemType>,
    default: "start",
  },
  layout: {
    type: String as PropType<RouteItemLayout>,
    default: "default",
  },
  showDash: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  showDatetime: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
};

// ==================== 组件 Emits 定义 ====================
export const routeItemEmits = {
  // click: (item: RouteItem) => true,
};
