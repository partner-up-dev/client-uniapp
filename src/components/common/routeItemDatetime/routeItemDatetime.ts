import type { PropType } from "vue";
import type { RouteItemDatetime } from "@/business/base/route";

// ==================== 组件 Props 定义 ====================
export const routeItemDatetimeProps = {
  datetime: {
    type: Object as PropType<RouteItemDatetime>,
    required: true,
  },
  placeholder: {
    // 当没有可用时间时是否显示占位符“HH:MM ~ HH:MM”
    type: Boolean as PropType<boolean>,
    default: false,
  },
};

// ==================== 组件 Emits 定义 ====================
export const routeItemDatetimeEmits = {
  // no-op
};
