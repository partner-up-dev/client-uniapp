import type { PropType } from "vue";
import type { AccountRef } from "@/business/account";

// ==================== 组件 Props 定义 ====================
export const partnersProps = {
  /** 参与者列表 */
  partners: {
    type: Array as PropType<AccountRef[]>,
    default: () => [],
  },
  /** 是否可加入 */
  joinable: {
    type: Boolean,
    default: false,
  },
  /** 左侧可加入人数显示，如 +1 */
  leftJoinable: {
    type: Number,
    default: 1,
  },
};

// ==================== 组件 Emits 定义 ====================
export const partnersEmits = {
  // 如果需要事件，可以在这里定义
};