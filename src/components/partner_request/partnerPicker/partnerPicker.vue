<template>
  <PUDrawer
    v-model:visible="drawerVisible"
    :title="dt('title')"
    :height="props.height"
  >
    <view class="partner-picker">
      <!-- Partner Role List -->
      <view class="partner-picker__list">
        <PartnerRoleComp
          v-for="role in availableRoles"
          :key="role.id"
          :role="role"
          :class="[
            'partner-picker__item',
            { 'is-selected': isSelected(role.id) },
          ]"
          @click="onPartnerRoleClick(role)"
        />
      </view>

      <!-- Confirm Button for Multiple Mode -->
      <view v-if="props.mode === 'multiple'" class="partner-picker__footer">
        <PUButton theme="Primary" :text="dt('confirm')" @click="onConfirmClick" />
      </view>
    </view>
  </PUDrawer>
</template>

<script lang="ts">
export default {
  name: "PartnerPicker",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { useOptionalVModel } from "@/composables/props";
import {
  partnerPickerProps,
  partnerPickerEmits,
  getAvailablePartnerRoles,
} from "./partnerPicker";
import PUDrawer from "@/components/common/PUDrawer/PUDrawer.vue";
import PUButton from "@/components/common/PUButton/PUButton.vue";
import PartnerRoleComp from "../PartnerRole/PartnerRole.vue";
import {
  PartnerRole,
  type PartnerRoleRef,
} from "@/business/partner_request/partner";
import { useTranslate } from "@/locale/use";

const props = defineProps(partnerPickerProps);
const emit = defineEmits(partnerPickerEmits);

const { dt } = useTranslate("partner_request.partner_picker");

// ==================== V-Models ====================

const drawerVisible = useOptionalVModel<boolean>({
  props,
  emit,
  modelName: "visible",
});

const selectedValue = useOptionalVModel<PartnerRoleRef | PartnerRoleRef[]>({
  props,
  emit,
  modelName: "modelValue",
});

// ==================== Computed ====================

const { availableRoles, bindPRType } = PartnerRole.useAvailableRoles(
  props.prType
);
bindPRType(() => props.prType);

/**
 * 内部选中状态（多选模式）
 */
const internalSelectedIds = ref<PartnerRoleRef[]>([]);

/**
 * 初始化内部选中状态
 */
watch(
  [() => props.modelValue, drawerVisible],
  () => {
    if (drawerVisible.value && props.mode === "multiple") {
      if (Array.isArray(props.modelValue)) {
        internalSelectedIds.value = [...props.modelValue];
      } else if (props.modelValue !== undefined) {
        internalSelectedIds.value = [props.modelValue];
      } else {
        internalSelectedIds.value = [];
      }
    }
  },
  { immediate: true }
);

// ==================== Methods ====================

/**
 * 判断角色是否已选中
 */
function isSelected(roleId: PartnerRoleRef): boolean {
  if (props.mode === "single") {
    return props.modelValue === roleId;
  } else {
    return internalSelectedIds.value.includes(roleId);
  }
}

/**
 * 处理角色点击事件
 */
function onPartnerRoleClick(role: PartnerRole) {
  if (props.mode === "single") {
    // 单选模式：立即选中并触发事件
    selectedValue.value = role.id;
    emit("select", role);
    drawerVisible.value = false;
  } else {
    // 多选模式：切换选中状态
    const index = internalSelectedIds.value.indexOf(role.id);
    if (index > -1) {
      internalSelectedIds.value.splice(index, 1);
    } else {
      internalSelectedIds.value.push(role.id);
    }
  }
}

/**
 * 处理确认按钮点击（多选模式）
 */
function onConfirmClick() {
  selectedValue.value = [...internalSelectedIds.value];
  const selectedRoles = availableRoles.value.filter((role) =>
    internalSelectedIds.value.includes(role.id)
  );
  emit("confirm", selectedRoles);
  drawerVisible.value = false;
}
</script>

<style lang="scss" scoped src="./partnerPicker.scss"></style>
