import type { PropType } from "vue";
import { PRType } from "@/business/partner_request";

// ==================== 组件 Props 定义 ====================
export const prTypeFilterProps = {
  /** 选中的搭子类型（多选） */
  modelValue: {
    type: Array as PropType<PRType[]>,
    default: () => [],
  },
};

// ==================== 组件 Emits 定义 ====================
export const prTypeFilterEmits = {
  /** v-model 更新 */
  "update:modelValue": (value: PRType[]) => Array.isArray(value),
  /** 类型变更通知（无载荷） */
  change: () => true,
};

// ==================== 常量/工具 ====================
/** 可供筛选的类型列表（不含 Undefined） */
export const ALL_PR_TYPES: PRType[] = [
  PRType.Commute,
  PRType.RideHailing,
  PRType.Hitchhiking,
  PRType.Moped,
  PRType.Travel,
];
