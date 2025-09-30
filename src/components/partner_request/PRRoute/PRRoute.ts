import type { PropType } from "vue";
import type { Route } from "@/business/base/route";

// ==================== 组件 Props 定义 ====================
export const PRRouteProps = {
  route: {
    type: Object as PropType<Route>,
    required: true,
  },
};

// ==================== 组件 Emits 定义 ====================
export const PRRouteEmits = {
  // no-op
};
