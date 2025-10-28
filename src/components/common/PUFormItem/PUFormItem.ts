import { makeStringProp, makeBooleanProp } from "@/utils/props";

// ==================== 组件相关类型定义 ====================

// ==================== 组件常量定义 ====================

// ==================== 组件 Props 定义 ====================
export const puFormItemProps = {
  /**
   * 表单字段属性名，用于关联 PUForm 验证错误
   */
  prop: makeStringProp<string | undefined>(undefined),
  /**
   * 是否包含子错误
   * 启用时，将显示给定 prop 及其子字段的所有错误
   * 例如: prop 为 "route" 时，会包含 "route.items[0].location" 等子错误
   */
  includeSub: makeBooleanProp(false),
};

// ==================== 组件 Emits 定义 ====================
export const puFormItemEmits = {};

// ==================== 组件工具函数 ====================
