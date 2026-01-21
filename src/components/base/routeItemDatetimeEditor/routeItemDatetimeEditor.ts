// Types of Component:Base:RouteItemDatetimeEditor

import dayjs from "dayjs";
import type { PropType } from "vue";
import type { RouteItemDatetimeForm } from "@/business/base/route";
import { makeNumberProp } from "@/utils/props";
import enUs from "./routeItemDatetimeEditor.en-US.jsonc";
import zhHans from "./routeItemDatetimeEditor.zh-Hans.jsonc";

export const localMessages = {
  "zh-Hans": zhHans,
  "en-US": enUs,
} as const;

// ==================== 组件相关类型定义 ====================

/**
 * 时间误差选项
 */
export interface TimeLossOption {
  value: number;
  label: string;
}

// ==================== 组件常量定义 ====================

const TIME_LOSS_VALUES = [0, 5, 10, 15, 30, 60] as const;
const DATETIME_FORMAT = "YYYY年MM月DD日 HH:mm";

export function buildTimeLossOptions(t: (key: string, params?: Record<string, unknown>) => string): TimeLossOption[] {
  return TIME_LOSS_VALUES.map((value) => ({
    value,
    label: `${value} ${t("dynamic_driven_info.duration.unit")}`,
  }));
}

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
export function formatTimeLoss(
  bringAhead: number | null | undefined,
  putOff: number | null | undefined,
  t: (key: string, params?: Record<string, unknown>) => string,
): string {
  const ahead = bringAhead ?? 0;
  const off = putOff ?? 0;

  if (ahead === 0 && off === 0) {
    return t("time_loss.on_time");
  }

  const parts: string[] = [];
  if (ahead > 0) {
    parts.push(t("time_loss.bring_ahead", { minutes: ahead }));
  }
  if (off > 0) {
    parts.push(t("time_loss.put_off", { minutes: off }));
  }

  return parts.join(t("time_loss.separator"));
}

/**
 * 获取日期时间的显示文本
 */
export function formatDatetimeDisplay(
  datetime: Date | null | undefined,
  time: string | null | undefined,
  t: (key: string) => string,
): string {
  if (datetime) {
    return dayjs(datetime).format(DATETIME_FORMAT);
  }

  if (time) {
    return `${t("datetime.time_prefix")}${time}`;
  }

  return t("datetime.unset");
}
