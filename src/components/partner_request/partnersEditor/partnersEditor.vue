<template>
  <view class="partners-editor">
    <!-- Partners List -->
    <view class="partners-editor__list">
      <PartnerEditor
        v-for="(partner, index) in internalPartners"
        :key="index"
        v-model:role="partner.role"
        v-model:player="partner.player"
        @select-role="onSelectRole(index)"
        @remove="onRemovePartner(index)"
      />
    </view>

    <!-- Add Button -->
    <view class="partners-editor__add-button">
      <PuButton
        :text="dt('add_partner')"
        theme="Surface"
        type="WithText"
        prefix-icon="i-mdi-plus"
        @click="onAddButtonClick"
      />
    </view>

    <!-- Partner Role Picker -->
    <PartnerPicker
      v-model:visible="pickerVisible"
      v-model="selectedRoleId"
      :pr-type="props.prType"
      mode="single"
      @select="onRoleSelected"
    />
  </view>
</template>

<script lang="ts">
export default {
  name: "PartnersEditor",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { useOptionalVModel } from "@/composables/props";
import { partnersEditorProps, partnersEditorEmits } from "./partnersEditor";
import { useTranslate } from "@/locale";
import PartnerEditor from "../PartnerEditor/PartnerEditor.vue";
import PartnerPicker from "../partnerPicker/partnerPicker.vue";
import PuButton from "@partner-up-dev/design-uniapp/components/puButton/puButton.vue";
import {
  PartnerForm,
  type PartnerRole,
} from "@/business/partner_request/partner";

const props = defineProps(partnersEditorProps);
const emit = defineEmits(partnersEditorEmits);

const { dt } = useTranslate("partner_request.partners_editor");

// ==================== V-Models ====================

const partners = useOptionalVModel<PartnerForm[]>({
  props,
  emit,
  modelName: "modelValue",
  defaultValue: [],
});

// ==================== State ====================

const pickerVisible = ref(false);
const editingIndex = ref<number | null>(null);
const selectedRoleId = ref<number | undefined>(undefined);

// ==================== Computed ====================

/**
 * 内部搭子列表，用于编辑
 */
const internalPartners = computed<PartnerForm[]>({
  get: () => props.modelValue,
  set: (value: PartnerForm[]) => {
    partners.value = value;
  },
});

/**
 * 是否可以删除搭子（至少保留 2 个）
 */
const canDelete = computed(() => {
  return internalPartners.value.length > 2;
});

/**
 * 已使用的角色 ID 列表
 */
const usedRoleIds = computed(() => {
  return internalPartners.value.map((p) => p.role);
});

// ==================== Methods ====================

/**
 * 处理选择角色事件
 */
function onSelectRole(index: number) {
  editingIndex.value = index;
  selectedRoleId.value = internalPartners.value[index].role;
  pickerVisible.value = true;
}

/**
 * 处理角色选中事件
 */
function onRoleSelected(role: PartnerRole) {
  if (editingIndex.value !== null) {
    // 编辑现有搭子的角色
    const newPartners = [...internalPartners.value];
    newPartners[editingIndex.value].role = role.id;
    partners.value = newPartners;
  } else {
    // 添加新搭子
    const newPartner = new PartnerForm({
      role: role.id,
      player: null,
    });
    partners.value = [...internalPartners.value, newPartner];
  }

  editingIndex.value = null;
  selectedRoleId.value = undefined;
}

/**
 * 处理删除搭子事件
 */
function onRemovePartner(index: number) {
  const newPartners = [...internalPartners.value];
  newPartners.splice(index, 1);
  partners.value = newPartners;
}

/**
 * 处理添加按钮点击
 */
function onAddButtonClick() {
  editingIndex.value = null;
  selectedRoleId.value = undefined;
  pickerVisible.value = true;
}
</script>

<style lang="scss" scoped src="./partnersEditor.scss"></style>
