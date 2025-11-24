// Types of Component:Common:PUPicker

import type { PropType } from "vue";
import { makeArrayProp, makeBooleanProp, makeNumberProp, makeStringProp } from "@/utils/props";

// ==================== 组件相关类型定义 ====================

/**
 * 选择器列项
 */
export interface PickerColumnItem {
  /** 选项值 */
  value: string | number;
  /** 选项标签 */
  label: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 子选项（用于级联选择） */
  children?: PickerColumnItem[];
  [key: string]: any;
}

/**
 * 选择器列类型
 */
export type PickerColumn = (string | number | PickerColumnItem)[];

/**
 * 选择器列数组
 */
export type PickerColumns = PickerColumn | PickerColumn[];

/**
 * 选择器值类型
 */
export type PickerValue = string | number | (string | number)[];

/**
 * 展示格式化函数
 */
export type PickerDisplayFormat = (
  items: PickerColumnItem | PickerColumnItem[],
  config: { valueKey: string; labelKey: string }
) => string;

/**
 * 确认前回调函数
 */
export type PickerBeforeConfirm = (
  value: PickerValue,
  resolve: (isPass: boolean) => void
) => void;

/**
 * 列变更回调函数
 */
export type PickerColumnChange = (options: {
  selectedIndex: number[];
  selectedItems: PickerColumnItem[];
  columnIndex: number;
  resolve: (columns: PickerColumns) => void;
}) => void;

/**
 * 确认事件参数
 */
export interface PickerConfirmEvent {
  value: PickerValue;
  selectedItems: PickerColumnItem | PickerColumnItem[];
}

// ==================== 组件常量定义 ====================

/**
 * 默认展示格式化函数
 */
export const defaultDisplayFormat: PickerDisplayFormat = (items, { labelKey }) => {
  if (Array.isArray(items)) {
    return items.map((item) => item[labelKey]).join(" / ");
  }
  return items[labelKey];
};

// ==================== 组件 Props 定义 ====================

export const puPickerProps = {
  /** 选中值，单列为 string | number，多列为数组 */
  modelValue: {
    type: [String, Number, Array] as PropType<PickerValue>,
    default: "",
  },

  /** 选择器数据，可以为字符串/数字数组，也可以为对象数组，如果为二维数组，则为多列选择器 */
  columns: {
    type: Array as PropType<PickerColumns>,
    default: () => [],
  },

  /** 选项值对应的键名 */
  valueKey: makeStringProp("value"),

  /** 选项标签对应的键名 */
  labelKey: makeStringProp("label"),

  /** 选择器左侧文案 */
  label: makeStringProp(""),

  /** 选择器占位符 */
  placeholder: makeStringProp(""),

  /** 是否禁用 */
  disabled: makeBooleanProp(false),

  /** 是否只读 */
  readonly: makeBooleanProp(false),

  /** 是否显示清空按钮 */
  clearable: makeBooleanProp(false),

  /** 是否必填 */
  required: makeBooleanProp(false),

  /** 是否显示错误状态 */
  error: makeBooleanProp(false),

  /** 尺寸 */
  size: makeStringProp<"small" | "medium" | "large">("medium"),

  /** 设置左侧标题宽度 */
  labelWidth: makeStringProp("33%"),

  /** 是否右对齐 */
  alignRight: makeBooleanProp(false),

  /** 确定前校验函数 */
  beforeConfirm: Function as PropType<PickerBeforeConfirm>,

  /** 自定义展示文案的格式化函数 */
  displayFormat: Function as PropType<PickerDisplayFormat>,

  /** 列变更回调（仅多列选择器） */
  columnChange: Function as PropType<PickerColumnChange>,

  /** 自定义根节点样式类 */
  customClass: makeStringProp(""),

  /** 自定义根节点样式 */
  customStyle: makeStringProp(""),

  /** 自定义 label 样式类 */
  customLabelClass: makeStringProp(""),

  /** 自定义 value 样式类 */
  customValueClass: makeStringProp(""),

  /** 必填标记位置，可选值：before、after */
  markerSide: makeStringProp<"before" | "after">("before"),
};

// ==================== 组件 Emits 定义 ====================

export const puPickerEmits = {
  /** 更新选中值 */
  "update:modelValue": (value: PickerValue) => true,

  /** 确认选择 */
  confirm: (event: PickerConfirmEvent) => true,

  /** 取消选择 */
  cancel: () => true,

  /** 清空选择 */
  clear: () => true,

  /** 值变化 */
  change: (event: { value: PickerValue }) => true,
};

// ==================== 组件工具函数 ====================

/**
 * 格式化列数据为标准格式
 */
export function formatColumns(
  columns: PickerColumns,
  valueKey: string,
  labelKey: string
): PickerColumnItem[][] {
  if (!Array.isArray(columns) || columns.length === 0) {
    return [];
  }

  // 判断是否为多列
  const isMultiple = Array.isArray(columns[0]);

  if (isMultiple) {
    return (columns as PickerColumn[]).map((column) =>
      formatColumn(column, valueKey, labelKey)
    );
  }

  return [formatColumn(columns as PickerColumn, valueKey, labelKey)];
}

/**
 * 格式化单列数据
 */
function formatColumn(
  column: PickerColumn,
  valueKey: string,
  labelKey: string
): PickerColumnItem[] {
  return column.map((item) => {
    if (typeof item === "object" && item !== null) {
      return item as PickerColumnItem;
    }
    return {
      [valueKey]: item,
      [labelKey]: String(item),
    } as PickerColumnItem;
  });
}

/**
 * 获取选中项的索引
 */
export function getSelectedIndex(
  value: PickerValue,
  columns: PickerColumnItem[][],
  valueKey: string
): number[] {
  if (!columns.length) return [];

  const values = Array.isArray(value) ? value : [value];
  const result: number[] = [];

  values.forEach((val, colIndex) => {
    if (colIndex >= columns.length) return;

    const index = columns[colIndex].findIndex(
      (item) => item[valueKey] === val
    );
    result.push(index === -1 ? 0 : index);
  });

  // 如果值的数量少于列数，补充默认索引 0
  while (result.length < columns.length) {
    result.push(0);
  }

  return result;
}

/**
 * 根据索引获取选中项
 */
export function getSelectedItems(
  selectedIndex: number[],
  columns: PickerColumnItem[][]
): PickerColumnItem[] {
  return selectedIndex.map((index, colIndex) => {
    if (colIndex >= columns.length) return {} as PickerColumnItem;
    const column = columns[colIndex];
    return column[index] || column[0] || ({} as PickerColumnItem);
  });
}

/**
 * 根据索引获取选中值
 */
export function getSelectedValues(
  selectedIndex: number[],
  columns: PickerColumnItem[][],
  valueKey: string
): PickerValue {
  const items = getSelectedItems(selectedIndex, columns);
  const values = items.map((item) => item[valueKey]);

  return values.length === 1 ? values[0] : values;
}
