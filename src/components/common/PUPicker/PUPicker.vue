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
import { computed, ref, watch, nextTick } from "vue";
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

/** 弹出层显示状态 */
const popupShow = ref(false);

/** 展示的文本值 */
const showValue = ref("");

/** 内部选中值 */
const innerValue = ref<PickerValue>(props.modelValue);

/** 格式化后的列数据 */
const formattedColumns = ref<PickerColumnItem[][]>([]);

/** 选中项索引 */
const selectedIndex = ref<number[]>([]);

/** 内部加载状态 */
const innerLoading = ref(false);

/** 是否正在滚动 */
const isPicking = ref(false);

/** 用户是否已点击确认 */
const hasConfirmed = ref(false);

// ==================== 计算属性 ====================

/** 是否显示加载状态 */
const isLoading = computed(() => props.loading || innerLoading.value);

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

// ==================== 方法 ====================

/**
 * 打开选择器
 */
function open() {
  if (props.disabled || props.readonly) return;

  emit("open");
  popupShow.value = true;
  innerValue.value = props.modelValue;
  updateSelectedIndex(innerValue.value);
}

/**
 * 关闭选择器
 */
function close() {
  popupShow.value = false;
}

/**
 * 取消选择
 */
function onCancel() {
  popupShow.value = false;
  emit("cancel");
}

/**
 * 确认选择
 */
function onConfirm() {
  if (isLoading.value) return;

  // 如果正在滚动，等待滚动结束
  if (isPicking.value) {
    hasConfirmed.value = true;
    return;
  }

  const { beforeConfirm } = props;
  if (beforeConfirm && typeof beforeConfirm === "function") {
    beforeConfirm(innerValue.value, (isPass: boolean) => {
      if (isPass) handleConfirm();
    });
  } else {
    handleConfirm();
  }
}

/**
 * 处理确认逻辑
 */
function handleConfirm() {
  if (isLoading.value || props.disabled) {
    popupShow.value = false;
    return;
  }

  const items = getSelectedItems(selectedIndex.value, formattedColumns.value);
  const values = getSelectedValues(
    selectedIndex.value,
    formattedColumns.value,
    props.valueKey
  );

  popupShow.value = false;

  emit("update:modelValue", values);
  updateShowValue(items);
  emit("confirm", {
    value: values,
    selectedItems: items.length === 1 ? items[0] : items,
  });
}

/**
 * 清空选择
 */
function handleClear() {
  const clearValue: PickerValue = Array.isArray(innerValue.value) ? [] : "";
  emit("update:modelValue", clearValue);
  emit("clear");
  showValue.value = "";
}

/**
 * 列变化事件
 */
function onPickerChange(event: { detail: { value: number[] } }) {
  selectedIndex.value = event.detail.value;

  const values = getSelectedValues(
    selectedIndex.value,
    formattedColumns.value,
    props.valueKey
  );
  innerValue.value = values;

  emit("change", { value: values });

  // 触发列变更回调
  if (props.columnChange && typeof props.columnChange === "function") {
    const items = getSelectedItems(selectedIndex.value, formattedColumns.value);
    // 简化版本：假设最后变化的列是最后一个
    const columnIndex = selectedIndex.value.length - 1;

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
 * 开始滚动
 */
function onPickStart() {
  isPicking.value = true;
}

/**
 * 滚动结束
 */
function onPickEnd() {
  isPicking.value = false;

  if (hasConfirmed.value) {
    hasConfirmed.value = false;
    onConfirm();
  }
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

/**
 * 设置加载状态
 */
function setLoading(loading: boolean) {
  innerLoading.value = loading;
}

// ==================== 监听器 ====================

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = newValue;
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
      innerValue.value = Array.isArray(props.modelValue) ? [] : "";
      showValue.value = "";
    } else {
      handleValueUpdate(props.modelValue);
    }
  },
  { deep: true, immediate: true }
);

// ==================== 暴露方法 ====================

defineExpose({
  open,
  close,
  setLoading,
});
</script>

<template>
  <view :class="rootClass" :style="customStyle">
    <!-- 默认触发器：使用 Cell 样式 -->
    <view v-if="!$slots.default" :class="cellClass" @click="open">
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
    <view v-else @click="open">
      <slot></slot>
    </view>

    <!-- 弹出层 -->
    <view v-if="popupShow" class="pu-picker__popup" :style="{ zIndex }">
      <view class="pu-picker__mask" @click="closeOnClickModal && onCancel"></view>
      <view
        class="pu-picker__container"
        :style="{
          paddingBottom: safeAreaInsetBottom
            ? 'env(safe-area-inset-bottom)'
            : '0',
        }"
      >
        <!-- 工具栏 -->
        <view class="pu-picker__toolbar" @touchmove.stop.prevent>
          <view
            class="pu-picker__action pu-picker__action--cancel"
            @click="onCancel"
          >
            {{ cancelButtonText }}
          </view>
          <view v-if="title" class="pu-picker__title">{{ title }}</view>
          <view
            :class="['pu-picker__action', { 'is-loading': isLoading }]"
            @click="onConfirm"
          >
            {{ confirmButtonText }}
          </view>
        </view>

        <!-- 选择器视图 -->
        <picker-view
          v-if="formattedColumns.length > 0"
          class="pu-picker__view"
          :value="selectedIndex"
          :indicator-style="`height: 44px;`"
          :style="{ height: columnsHeight + 'px' }"
          @change="onPickerChange"
          @pickstart="onPickStart"
          @pickend="onPickEnd"
          :immediate-change="immediateChange"
        >
          <picker-view-column
            v-for="(column, colIndex) in formattedColumns"
            :key="colIndex"
          >
            <view
              v-for="(item, itemIndex) in column"
              :key="itemIndex"
              class="pu-picker__item"
              :class="{ 'is-disabled': item.disabled }"
            >
              {{ item[labelKey] }}
            </view>
          </picker-view-column>
        </picker-view>

        <!-- 加载状态 -->
        <view v-if="isLoading" class="pu-picker__loading">
          <view
            class="pu-picker__loading-icon"
            :style="{ borderTopColor: loadingColor }"
          ></view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped src="./PUPicker.scss"></style>
