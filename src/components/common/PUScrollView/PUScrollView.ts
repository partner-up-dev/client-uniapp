import { baseProps, makeStringProp } from "@/utils/props";
import type { PropType } from "vue";

// ==================== 组件相关类型定义 ====================

export type ScrollDirection = "x" | "y";
export type EdgeFadePosition = "start" | "end" | "both" | "auto";

// ==================== 组件常量定义 ====================

export const SCROLL_DIRECTIONS: ScrollDirection[] = ["x", "y"];
export const EDGE_FADE_POSITIONS: EdgeFadePosition[] = ["start", "end", "both", "auto"];

// ==================== 组件 Props 定义 ====================

export const puScrollViewProps = {
  /**
   * 滚动方向
   * - x: 横向滚动
   * - y: 纵向滚动
   */
  direction: makeStringProp<ScrollDirection>("y"),

  /**
   * 边缘渐变位置
   * - start: 起始位置渐变（左侧或顶部）
   * - end: 结束位置渐变（右侧或底部）
   * - both: 两端都渐变
   * - auto: 根据滚动方向自动选择（纵向滚动时为 end，横向滚动时为 end）
   * - undefined: 不渐变
   */
  edgeFade: makeStringProp<EdgeFadePosition | undefined>(undefined),

  /**
   * 下拉刷新函数（仅 direction="y" 时有效）
   * 传入此函数后将自动启用下拉刷新功能
   */
  onRefresh: {
    type: Function as PropType<() => Promise<void>>,
    required: false,
  },

  ...baseProps,
};

// ==================== 组件 Emits 定义 ====================

export const puScrollViewEmits = {
  scroll: (event: any) => true,
};
