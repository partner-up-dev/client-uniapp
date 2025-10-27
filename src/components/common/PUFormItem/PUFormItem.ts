import { makeStringProp } from "@/utils/props";

// ==================== 组件相关类型定义 ====================

// ==================== 组件常量定义 ====================

// ==================== 组件 Props 定义 ====================
export const puFormItemProps = {
  /**
   * 表单字段属性名，用于关联 PUForm 验证错误
   */
  prop: makeStringProp<string | undefined>(undefined),
};

// ==================== 组件 Emits 定义 ====================
export const puFormItemEmits = {};

// ==================== 组件工具函数 ====================
