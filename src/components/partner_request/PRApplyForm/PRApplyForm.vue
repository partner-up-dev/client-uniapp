<template>
  <view class="pr-apply-form">
    <view class="title">
      <text class="title-text">{{ dt("title") }}</text>
      <text class="subtitle">
        {{ dt("subtitle") }}
      </text>
    </view>

    <view class="applying-roles">
      <Partner
        v-for="(partner, index) in selectedPartners"
        :key="partner._id"
        :ref="setPartnerRef"
        :partner="partner"
        type="Editor"
        :expand="true"
        @delete="onDeleteRole(index)"
      />
    </view>

    <!-- Operations: add role + submit -->
    <view class="ops" v-if="!props.externalOps">
      <PUButton
        theme="SurfaceOutlined"
        text="添加角色"
        @click="showRoleDrawer = true"
      />
      <PUButton theme="Primary" :text="dt('submit')" @click="submit" />
    </view>

    <!-- Available roles drawer -->
    <root-portal :enable="true">
      <PUDrawer title="空闲角色" v-model:visible="showRoleDrawer" height="30vh">
        <view v-if="availableRoles.length === 0" class="empty">
          <text>无更多可用角色</text>
        </view>
        <view v-else class="roles">
          <PartnerRoleComp
            v-for="role in availableRoles"
            :key="role"
            :roleId="role"
            @click="onSelectRole(role)"
          />
        </view>
      </PUDrawer>
    </root-portal>
  </view>
</template>

<script lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
export default {
  name: "PRApplyForm",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed, onBeforeUpdate, onMounted, ref, watch } from "vue";
import { useTranslate } from "@/locale/use";
import PUButton from "@/components/common/PUButton/PUButton.vue";
import Partner from "@/components/partner_request/Partner/Partner.vue";
import PUDrawer from "@/components/common/PUDrawer/PUDrawer.vue";
import PartnerRoleComp from "../PartnerRole/PartnerRole.vue";
import { PartnerRole } from "@/business/partner_request/partner";
import { PartnerRequest } from "@/business/partner_request/base";
import {
  PartnerApplicationForm,
  PartnerSubApplication,
} from "@/business/partner_request/application";
import type { PartnerRoleRef } from "@/business/partner_request/partner";
import { prApplyFormProps, prApplyFormEmits } from "./PRApplyForm";

const props = defineProps(prApplyFormProps);
const emit = defineEmits(prApplyFormEmits);

const { dt } = useTranslate("partner_request.apply_form");

// 获取该 PR 的角色（搭子）列表
const { partners, bindPRId } = PartnerRequest.usePartners(props.PRId);
bindPRId(() => props.PRId);

// 表单选择的子申请项（角色 + 理由）
const applyingPartners = ref<PartnerSubApplication[]>([]);
watch(
  partners,
  () => {
    applyingPartners.value = [];
    partners.value.forEach((p) => {
      if (p.isApplicable && applyingPartners.value.length < 1) {
        applyingPartners.value.push(new PartnerSubApplication({ role: p.role }));
      }
    });
  },
  { immediate: true }
);
// 选中的角色 ID 列表
const selectedRoles = computed<PartnerRoleRef[]>(() =>
  applyingPartners.value.map((i) => i.role)
);

// 可用的角色（未被选择且可申请）
const availableRoles = computed<PartnerRoleRef[]>(() => {
  return partners.value
    .filter((p) => p.isApplicable && !selectedRoles.value.includes(p.role))
    .map((p) => p.role);
});

// 已选中的 Partner 实体，用于渲染编辑器（按选择顺序）
const selectedPartners = computed(() => {
  const map = new Map(partners.value.map((p) => [p.role, p] as const));
  return selectedRoles.value
    .map((role) => map.get(role))
    .filter((p): p is NonNullable<typeof p> => !!p);
});

const partnerRefs = ref<InstanceType<typeof Partner>[]>([]);
onBeforeUpdate(() => {
  partnerRefs.value.length = 0;
});

function setPartnerRef(el: any) {
  if (el && typeof el.getForm === "function") {
    partnerRefs.value.push(el as InstanceType<typeof Partner>);
  }
}

function onDeleteRole(index: number) {
  applyingPartners.value.splice(index, 1);
  emit("change", selectedRoles.value);
}

// Drawer
const showRoleDrawer = ref(false);

function onSelectRole(roleId: PartnerRoleRef) {
  // 添加子申请项
  applyingPartners.value.push(
    new PartnerSubApplication({ role: roleId, rationale: null })
  );
  emit("change", selectedRoles.value);
  showRoleDrawer.value = false;
}

function submit() {
  new PartnerApplicationForm({
    partner_request: props.PRId,
    sub_applications: partnerRefs.value.map((ref) => ref.getForm()),
  })
    .submit()
    .then((app) => {
      emit("submitted", app);
      return app;
    })
    .catch((err) => {
      emit("error", err);
      throw err;
    });
}

defineExpose({
  submit,
  toggleRoleDrawer: () => (showRoleDrawer.value = !showRoleDrawer.value),
});
</script>

<style scoped lang="scss" src="./PRApplyForm.scss"></style>
