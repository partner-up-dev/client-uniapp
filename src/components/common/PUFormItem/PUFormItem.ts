import { makeStringProp, makeBooleanProp } from "@/utils/props";
import type { Size } from "@/utils/style";
import type { CellType } from "@/components/common/cell/cell";

// ==================== 组件相关类型定义 ====================

// ==================== 组件常量定义 ====================

// ==================== 组件 Props 定义 ====================
export const puFormItemProps = {
  /**
   * 表单字段属性名，用于关联 PUForm 验证错误
   */
  prop: makeStringProp<string | undefined>(undefined),
  /**
   * 标签文本
   */
  label: makeStringProp(""),
  /**
   * 布局类型
   */
  type: makeStringProp<CellType>("vertical"),
  /**
   * 是否必填（显示红色星号）
   */
  required: makeBooleanProp(false),
  /**
   * 前缀图标
   */
  prefixIcon: makeStringProp<string | undefined>(undefined),
  /**
   * 后缀图标
   */
  suffixIcon: makeStringProp<string | undefined>(undefined),
  /**
   * 尺寸
   */
  size: makeStringProp<Size>("small"),
};

// ==================== 组件 Emits 定义 ====================
export const puFormItemEmits = {
  click: () => true,
};

// ==================== 组件工具函数 ====================
