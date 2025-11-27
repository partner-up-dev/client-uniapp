<script lang="ts">
export default {
  name: "RouteItemDatetimeEditor",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { ref, computed } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { deepcopy } from "@/utils/object";
import {
  routeItemDatetimeEditorProps,
  routeItemDatetimeEditorEmits,
  TIME_LOSS_OPTIONS,
  formatDatetimeDisplay,
  formatTimeLoss,
} from "./routeItemDatetimeEditor";
import { RouteItemDatetime } from "@/business/base/route";
import Cell from "@/components/common/cell/cell.vue";
import { PUButton, PUPicker } from "@partner-up-dev/design-uniapp";
import { useTranslate } from "@/locale/use";
import dayjs from "dayjs";

const props = defineProps(routeItemDatetimeEditorProps);
const emit = defineEmits(routeItemDatetimeEditorEmits);

const { dt } = useTranslate("common");

// ==================== 状态管理 ====================

/** 内部状态 - 允许取消更改 */
const internalData = ref<RouteItemDatetime>(
  RouteItemDatetime.parse(deepcopy(props.modelValue))
);

/** 日期选择器显示的日期（转换为 Date 对象用于 picker） */
const pickerDate = computed({
  get: () => {
    if (internalData.value.datetime) {
      return internalData.value.datetime;
    }
    return new Date(props.minDatetime);
  },
  set: (val: Date) => {
    internalData.value.datetime = val;
  },
});

/** 提前时间（分钟） */
const bringAhead = computed({
  get: () => internalData.value.bring_ahead ?? 0,
  set: (val: number) => {
    internalData.value.bring_ahead = val;
  },
});

/** 推迟时间（分钟） */
const putOff = computed({
  get: () => internalData.value.put_off ?? 0,
  set: (val: number) => {
    internalData.value.put_off = val;
  },
});

/** 当前时间显示文本 */
const currentDisplay = computed(() => {
  const datetimeStr = formatDatetimeDisplay(
    internalData.value.datetime,
    internalData.value.time
  );
  const timeLossStr = formatTimeLoss(
    internalData.value.bring_ahead,
    internalData.value.put_off
  );
  return `${datetimeStr} - ${timeLossStr}`;
});

// ==================== 方法 ====================

/**
 * 日期选择器变更
 */
function onDatetimeChange(event: any) {
  const dateStr = event.detail.value;
  const newDate = new Date(dateStr);

  // 保持原有的时间部分
  if (internalData.value.datetime) {
    newDate.setHours(internalData.value.datetime.getHours());
    newDate.setMinutes(internalData.value.datetime.getMinutes());
  }

  internalData.value.datetime = newDate;
  emit("change", internalData.value);
}

/**
 * 时间选择器变更
 */
function onTimeChange(event: any) {
  const timeStr = event.detail.value;
  const [hours, minutes] = timeStr.split(":");
  const newDate = new Date(pickerDate.value);
  newDate.setHours(parseInt(hours));
  newDate.setMinutes(parseInt(minutes));
  pickerDate.value = newDate;
  emit("change", internalData.value);
}

/**
 * 验证表单
 */
function validate(): boolean {
  // 检查是否设置了时间
  if (!internalData.value.datetime && !internalData.value.time) {
    uni.showToast({
      title: "请选择时间",
      icon: "none",
    });
    return false;
  }

  // 检查时间是否晚于最小时间
  if (
    internalData.value.datetime &&
    internalData.value.datetime.getTime() < props.minDatetime
  ) {
    uni.showToast({
      title: "时间不能早于最小时间",
      icon: "none",
    });
    return false;
  }

  return true;
}

/**
 * 处理确认按钮点击
 */
function onConfirmButtonClick() {
  if (!validate()) {
    return;
  }

  emit("confirm", internalData.value);
}

/**
 * 处理取消按钮点击
 */
function onCancelButtonClick() {
  emit("cancel");
}

/**
 * 保存 - 暴露给父组件调用
 */
function save() {
  onConfirmButtonClick();
}

// ==================== 暴露方法 ====================

defineExpose({
  save,
});
</script>

<template>
  <view class="route-item-datetime-editor">
    <!-- 当前选择显示 -->
    <view class="route-item-datetime-editor__current">
      {{ currentDisplay }}
    </view>

    <!-- 表单区域 -->
    <view class="route-item-datetime-editor__form">
      <!-- 日期时间选择 -->
      <picker
        mode="date"
        :value="pickerDate.toISOString().split('T')[0]"
        :start="new Date(minDatetime).toISOString().split('T')[0]"
        @change="onDatetimeChange"
      >
        <Cell
          title="日期"
          :value="
            pickerDate ? dayjs(pickerDate).format('YYYY年MM月DD日') : '请选择'
          "
          suffix-icon="i-mdi-chevron-right"
        />
      </picker>

      <picker
        mode="time"
        :value="
          pickerDate
            ? `${String(pickerDate.getHours()).padStart(2, '0')}:${String(
                pickerDate.getMinutes()
              ).padStart(2, '0')}`
            : '00:00'
        "
        @change="onTimeChange"
      >
        <Cell
          title="时间"
          :value="pickerDate ? dayjs(pickerDate).format('HH:mm') : '请选择'"
          suffix-icon="i-mdi-chevron-right"
        />
      </picker>

      <!-- 可提前时间 -->
      <PUPicker
        v-model="bringAhead"
        :columns="TIME_LOSS_OPTIONS"
        label="可提前"
        placeholder="请选择"
        value-key="value"
        label-key="label"
        @confirm="emit('change', internalData)"
      />

      <!-- 可推迟时间 -->
      <PUPicker
        v-model="putOff"
        :columns="TIME_LOSS_OPTIONS"
        label="可推迟"
        placeholder="请选择"
        value-key="value"
        label-key="label"
        @confirm="emit('change', internalData)"
      />
    </view>

    <!-- 操作按钮 -->
    <view class="route-item-datetime-editor__operations">
      <PUButton
        :text="dt('button.cancel')"
        theme="Surface"
        @click="onCancelButtonClick"
      />
      <PUButton
        :text="dt('button.save')"
        theme="Primary"
        @click="onConfirmButtonClick"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped src="./routeItemDatetimeEditor.scss"></style>
