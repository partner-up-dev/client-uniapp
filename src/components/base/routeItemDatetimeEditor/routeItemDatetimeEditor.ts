// Types of Component:Base:RouteItemDatetimeEditor

import dayjs from "dayjs";
import type { PropType } from "vue";
import type { RouteItemDatetimeForm } from "@/business/base/route";
import { makeNumberProp } from "@/utils/props";

// ==================== 组件相关类型定义 ====================

/**
 * 时间误差选项
 */
export interface TimeLossOption {
  value: number;
  label: string;
}

// ==================== 组件常量定义 ====================

/**
 * 时间误差选项列表（单位：分钟）
 */
export const TIME_LOSS_OPTIONS: TimeLossOption[] = [
  { value: 0, label: "0 分钟" },
  { value: 5, label: "5 分钟" },
  { value: 10, label: "10 分钟" },
  { value: 15, label: "15 分钟" },
  { value: 30, label: "30 分钟" },
  { value: 60, label: "60 分钟" },
];

// ==================== 组件 Props 定义 ====================

export const routeItemDatetimeEditorProps = {
  /** 路线节点时间数据 */
  modelValue: {
    type: Object as PropType<RouteItemDatetimeForm>,
    required: true,
  },

  /** 最小可选时间（时间戳，单位：毫秒） */
  minDatetime: makeNumberProp(Date.now()),
};

// ==================== 组件 Emits 定义 ====================

export const routeItemDatetimeEditorEmits = {
  /** 值变化事件 */
  change: (datetime: RouteItemDatetimeForm) => true,

  /** 确认事件 */
  confirm: (datetime: RouteItemDatetimeForm) => true,

  /** 取消事件 */
  cancel: () => true,
};

// ==================== 组件工具函数 ====================

/**
 * 格式化时间误差选项为字符串
 */
export function formatTimeLoss(bringAhead?: number | null, putOff?: number | null): string {
  const ahead = bringAhead ?? 0;
  const off = putOff ?? 0;

  if (ahead === 0 && off === 0) {
    return "准时";
  }

  const parts: string[] = [];
  if (ahead > 0) {
    parts.push(`可提前 ${ahead} 分钟`);
  }
  if (off > 0) {
    parts.push(`可推迟 ${off} 分钟`);
  }

  return parts.join("，");
}

/**
 * 获取日期时间的显示文本
 */
export function formatDatetimeDisplay(datetime?: Date | null, time?: string | null): string {
  if (datetime) {
    return dayjs(datetime).format('YYYY年MM月DD日 HH:mm');
  }

  if (time) {
    return `时间：${time}`;
  }

  return "未设置";
}
