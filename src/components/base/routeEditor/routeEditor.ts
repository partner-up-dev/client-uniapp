import type { PropType } from "vue";
import { makeStringProp, makeBooleanProp, makeNumberProp } from "@/utils/props";
import { Route, RouteForm } from "@/business/base/route";

// ==================== 组件相关类型定义 ====================

/**
 * 路线编辑器类型
 * - normal: 普通编辑器（垂直列表布局）
 * - immersive: 沉浸式编辑器（卡片式布局）
 */
export type RouteEditorType = "normal" | "immersive";

/**
 * 路线项类型
 */
export type RouteItemType = "departure" | "arrival" | "waypoint";

/**
 * 验证模式
 * - basic: 基础验证（地点必填、时间顺序）
 * - strict: 严格验证（基础验证 + 出发时间必填）
 */
export type RouteEditorRuleMode = "basic" | "strict";

// ==================== 组件 Props 定义 ====================

export const routeEditorProps = {
  modelValue: {
    type: Object as PropType<RouteForm>,
    required: false,
    default: undefined,
  },
  /**
   * 编辑器类型
   * - normal: 普通编辑器（垂直列表布局，带操作按钮）
   * - immersive: 沉浸式编辑器（卡片式布局，更简洁）
   */
  type: makeStringProp<RouteEditorType>("normal"),
  /**
   * 最大路线节点数（包括起点和终点）
   */
  max: makeNumberProp(6),
  /**
   * 是否禁用时间编辑
   */
  disableDatetime: makeBooleanProp(false),
  /**
   * 验证规则模式
   */
  ruleMode: makeStringProp<RouteEditorRuleMode>("basic"),
  /**
   * 是否使用内置的出发时间编辑器（仅 immersive 类型有效）
   */
  useDepDatetimeEditor: makeBooleanProp(true),
};

// ==================== 组件 Emits 定义 ====================

export const routeEditorEmits = {
  /**
   * v-model 更新事件
   */
  "update:modelValue": (value: RouteForm) => true,
  /**
   * 路线数据变更事件
   */
  change: () => true,
  /**
   * 完成事件（所有必要数据已填写，仅 immersive 类型触发）
   */
  complete: () => true,
  /**
   * 编辑出发时间事件（仅 immersive 类型且 useDepDatetimeEditor=false 时触发）
   */
  edit_dep_time: () => true,
};

// ==================== 组件工具函数 ====================

/**
 * 获取路线项类型
 */
export function getRouteItemType(index: number, total: number): RouteItemType {
  if (index === 0) return "departure";
  if (index === total - 1) return "arrival";
  return "waypoint";
}

/**
 * 判断路线项是否可移除
 */
export function isRouteItemRemovable(index: number, total: number): boolean {
  // 起点和终点不可移除
  if (index === 0 || index === total - 1) return false;
  // 至少保留起点和终点
  return total > 2;
}

/**
 * 验证路线数据
 */
export interface RouteValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateRoute(
  route: Route,
  mode: RouteEditorRuleMode = "basic"
): RouteValidationResult {
  const errors: string[] = [];

  // 基础验证
  if (!route.items || route.items.length === 0) {
    errors.push("路线不能为空");
    return { valid: false, errors };
  }

  // 地点必填
  for (let i = 0; i < route.items.length; i++) {
    if (!route.items[i].location) {
      errors.push(`第 ${i + 1} 个地点未填写`);
    }
  }

  // 时间不能早于当前时间
  if (route.items[0].datetime.datetime) {
    const now = new Date();
    if (route.items[0].datetime.datetime < now) {
      errors.push("出发时间不能早于当前时间");
    }
  }

  // 时间顺序验证
  let lastDatetime = route.items[0].datetime.datetime;
  for (let i = 1; i < route.items.length; i++) {
    const currentDatetime = route.items[i].datetime.datetime;
    if (currentDatetime && lastDatetime) {
      if (currentDatetime < lastDatetime) {
        errors.push(`第 ${i + 1} 个时间不能早于前一个时间`);
      }
    }
    if (currentDatetime) {
      lastDatetime = currentDatetime;
    }
  }

  // 严格模式：出发时间必填
  if (mode === "strict") {
    if (!route.items[0].datetime.datetime) {
      errors.push("出发时间必须填写");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
