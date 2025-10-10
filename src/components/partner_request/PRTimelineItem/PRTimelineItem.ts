import type { PropType } from "vue";
import { makeBooleanProp, makeRequiredProp } from "@/utils/props";
import { PRStatus } from "@/business/partner_request";

// ==================== 组件相关类型定义 ====================

export type PRTimelineItemState = 'future' | 'current' | 'past';

export interface PRTimelineItemContent {
  title: string;
  description: string;
  actions: { [key: string]: string };
}

// ==================== 组件常量定义 ====================

export const PR_TIMELINE_ITEM_STATES = ['future', 'current', 'past'] as const;

// ==================== 组件 Props 定义 ====================

export const prTimelineItemProps = {
  type: makeRequiredProp(String as PropType<PRStatus>),
  state: makeRequiredProp(String as PropType<PRTimelineItemState>),
  expand: makeBooleanProp<boolean | undefined>(undefined),
};

// ==================== 组件 Emits 定义 ====================

export const prTimelineItemEmits = {
  'update:expand': (value: boolean) => true,
};

// ==================== 组件工具函数 ====================

export function getTimelineItemContent(type: PRStatus): PRTimelineItemContent {
  // For now, return basic structure - the actual locale lookup would be done in the component
  return {
    title: `Timeline Item ${type}`,
    description: `Description for ${type} status`,
    actions: {},
  };
}