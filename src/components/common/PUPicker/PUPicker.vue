<script lang="ts">
/**
 * @name 选择器组件
 * @description 提供单列或多列选择器，支持级联选择
 */
export default {
  name: "PUPicker",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import {
  puPickerProps,
  puPickerEmits,
  formatColumns,
  getSelectedIndex,
  getSelectedItems,
  getSelectedValues,
  defaultDisplayFormat,
  type PickerColumnItem,
  type PickerValue,
} from "./PUPicker";

const props = defineProps(puPickerProps);
const emit = defineEmits(puPickerEmits);

// ==================== 状态管理 ====================

/** 展示的文本值 */
const showValue = ref("");

/** 格式化后的列数据 */
const formattedColumns = ref<PickerColumnItem[][]>([]);

/** 选中项索引 */
const selectedIndex = ref<number[]>([]);

// ==================== 计算属性 ====================

/** 是否显示清空按钮 */
const showClear = computed(
  () =>
    props.clearable &&
    !props.disabled &&
    !props.readonly &&
    showValue.value.length > 0
);

/** 是否显示箭头 */
const showArrow = computed(
  () => !props.disabled && !props.readonly && !showClear.value
);

/** Cell 样式类 */
const cellClass = computed(() => {
  const classes = ["pu-picker__cell"];
  if (props.disabled) classes.push("is-disabled");
  if (props.readonly) classes.push("is-readonly");
  if (props.error) classes.push("is-error");
  if (!showValue.value) classes.push("pu-picker__cell--placeholder");
  return classes.join(" ");
});

/** 根容器样式类 */
const rootClass = computed(() => {
  const classes = ["pu-picker"];
  if (props.disabled) classes.push("is-disabled");
  if (props.size) classes.push(`is-${props.size}`);
  if (props.alignRight) classes.push("is-align-right");
  if (props.error) classes.push("is-error");
  if (props.customClass) classes.push(props.customClass);
  return classes.join(" ");
});

/** picker mode */
const pickerMode = computed(() => {
  return formattedColumns.value.length > 1 ? "multiSelector" : "selector";
});

/** picker range */
const pickerRange = computed(() => {
  if (pickerMode.value === "multiSelector") {
    return formattedColumns.value.map((column) =>
      column.map((item) => item[props.labelKey])
    );
  }
  return formattedColumns.value[0]?.map((item) => item[props.labelKey]) || [];
});

// ==================== 方法 ====================

/**
 * picker change 事件 - 确认选择
 */
function onPickerChange(event: any) {
  const detail = event.detail;
  let newIndex: number[];

  if (pickerMode.value === "multiSelector") {
    newIndex = detail.value;
  } else {
    newIndex = [detail.value];
  }

  selectedIndex.value = newIndex;

  const values = getSelectedValues(
    selectedIndex.value,
    formattedColumns.value,
    props.valueKey
  );

  const { beforeConfirm } = props;
  if (beforeConfirm && typeof beforeConfirm === "function") {
    beforeConfirm(values, (isPass: boolean) => {
      if (isPass) handleConfirm(values);
    });
  } else {
    handleConfirm(values);
  }
}

/**
 * 处理确认逻辑
 */
function handleConfirm(values: PickerValue) {
  if (props.disabled) return;

  const items = getSelectedItems(selectedIndex.value, formattedColumns.value);

  emit("update:modelValue", values);
  updateShowValue(items);
  emit("confirm", {
    value: values,
    selectedItems: items.length === 1 ? items[0] : items,
  });
  emit("change", { value: values });
}

/**
 * 列变化事件（多列选择器）
 */
function onPickerColumnChange(event: any) {
  const columnIndex = event.detail.column;
  const value = event.detail.value;

  selectedIndex.value[columnIndex] = value;

  if (props.columnChange && typeof props.columnChange === "function") {
    const items = getSelectedItems(selectedIndex.value, formattedColumns.value);
    props.columnChange({
      selectedIndex: selectedIndex.value,
      selectedItems: items,
      columnIndex,
      resolve: (newColumns) => {
        formattedColumns.value = formatColumns(
          newColumns,
          props.valueKey,
          props.labelKey
        );
      },
    });
  }
}

/**
 * 清空选择
 */
function handleClear() {
  const clearValue: PickerValue = Array.isArray(props.modelValue) ? [] : "";
  emit("update:modelValue", clearValue);
  emit("clear");
  showValue.value = "";
}

/**
 * picker cancel 事件
 */
function onPickerCancel() {
  emit("cancel");
}

/**
 * 更新选中索引
 */
function updateSelectedIndex(value: PickerValue) {
  selectedIndex.value = getSelectedIndex(
    value,
    formattedColumns.value,
    props.valueKey
  );
}

/**
 * 更新展示值
 */
function updateShowValue(items: PickerColumnItem | PickerColumnItem[]) {
  if (
    (Array.isArray(items) && items.length === 0) ||
    !items ||
    (typeof items === "object" && Object.keys(items).length === 0)
  ) {
    return;
  }

  const formatter = props.displayFormat || defaultDisplayFormat;
  showValue.value = formatter(items, {
    valueKey: props.valueKey,
    labelKey: props.labelKey,
  });
}

/**
 * 处理值变化时更新展示文本
 */
function handleValueUpdate(value: PickerValue) {
  if (
    (Array.isArray(value) && value.length > 0) ||
    (value !== "" && value !== undefined && !Array.isArray(value))
  ) {
    updateSelectedIndex(value);
    const items = getSelectedItems(selectedIndex.value, formattedColumns.value);
    updateShowValue(items);
  } else {
    showValue.value = "";
  }
}

// ==================== 监听器 ====================

watch(
  () => props.modelValue,
  (newValue) => {
    handleValueUpdate(newValue);
  },
  { deep: true, immediate: true }
);

watch(
  () => props.columns,
  (newValue) => {
    formattedColumns.value = formatColumns(
      newValue,
      props.valueKey,
      props.labelKey
    );

    if (newValue.length === 0) {
      showValue.value = "";
    } else {
      handleValueUpdate(props.modelValue);
    }
  },
  { deep: true, immediate: true }
);

// ==================== 暴露方法 ====================

defineExpose({
  // Native picker doesn't need manual open/close
});
</script>

<template>
  <view :class="rootClass" :style="customStyle">
    <!-- 使用原生 picker 组件 -->
    <picker
      :mode="pickerMode"
      :range="pickerRange"
      :value="
        pickerMode === 'multiSelector' ? selectedIndex : selectedIndex[0] || 0
      "
      :disabled="disabled || readonly"
      @change="onPickerChange"
      @cancel="onPickerCancel"
      @columnchange="onPickerColumnChange"
    >
      <!-- 默认触发器：使用 Cell 样式 -->
      <view v-if="!$slots.default" :class="cellClass">
        <view class="pu-picker__cell-content">
          <view v-if="label" class="pu-picker__label" :class="customLabelClass">
            <text
              v-if="required && markerSide === 'before'"
              class="pu-picker__required"
              >*</text
            >
            {{ label }}
            <text
              v-if="required && markerSide === 'after'"
              class="pu-picker__required"
              >*</text
            >
          </view>
          <view
            class="pu-picker__value"
            :class="[customValueClass, alignRight ? 'is-align-right' : '']"
          >
            {{ showValue || placeholder }}
          </view>
          <view v-if="showArrow" class="pu-picker__arrow">
            <text class="i-mdi-chevron-right icon"></text>
          </view>
          <view
            v-else-if="showClear"
            class="pu-picker__clear"
            @click.stop="handleClear"
          >
            <text class="i-mdi-close-circle icon"></text>
          </view>
        </view>
      </view>

      <!-- 自定义触发器 -->
      <view v-else>
        <slot></slot>
      </view>
    </picker>
  </view>
</template>

<style lang="scss" scoped src="./PUPicker.scss"></style>
