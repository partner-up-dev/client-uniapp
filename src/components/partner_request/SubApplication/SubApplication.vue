<template>
  <view
    class="sub-application"
    :class="{ 'sub-application--readonly': !editable }"
  >
    <!-- Header -->
    <view class="header">
      <view class="left">
        <view class="id">
          <text class="id-text">#{{ props.subApplication.role }}</text>
        </view>
        <text class="role-name">{{ roleName }}</text>
      </view>

      <view class="right">
        <PUButton
          v-if="editable"
          theme="Plain"
          type="OnlyIcon"
          size="xSmall"
          prefix-icon="i-mdi-delete-outline"
          @click.stop="onDeleteClick"
        />
        <PUButton
          v-else
          theme="Plain"
          type="OnlyIcon"
          size="xSmall"
          prefix-icon="i-mdi-chevron-right"
          @click.stop="onExpandClick"
        />
      </view>
    </view>

    <view class="rule" v-if="editable">{{ roleRule }}</view>

    <PUTextarea
      v-if="editable"
      v-model="rationale"
      :placeholder="dt('rationale_editor.placeholder')"
      :height="28"
      :focusHeight="56"
    />
  </view>

  <root-portal :enable="true" :style="{ position: 'absolute' }">
    <PUDrawer
      v-model:visible="drawerVisible"
      :title="`#${roleId} ${roleName}`"
      height="30vh"
    >
      <view class="drawer-content">
        <text class="rule">{{ roleRule }}</text>
        <text class="rationale">
          {{ rationale || "你没有填写" }}
        </text>
      </view>
    </PUDrawer>
  </root-portal>
</template>

<script lang="ts">
export default {
  name: "SubApplication",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { subApplicationProps, subApplicationEmits } from "./SubApplication";
import { useTranslate } from "@/locale/use";
import { PartnerRole } from "@/business/partner_request/partner";
import PUTextarea from "@/components/common/PUTextarea/PUTextarea.vue";
import PUButton from "@/components/common/PUButton/PUButton.vue";
import PUDrawer from "@/components/common/PUDrawer/PUDrawer.vue";

const props = defineProps(subApplicationProps);
const emit = defineEmits(subApplicationEmits);

const { dt } = useTranslate("partner_request.partner");
const { partnerRole } = PartnerRole.use(props.subApplication.role);
const role = computed((): PartnerRole | undefined => {
  return partnerRole.value;
});

const roleName = computed(() => role.value?.name ?? "角色名称");
const roleId = computed(() => role.value?.id ?? "00");
const roleRule = computed(() => role.value?.rule ?? "角色的权利与义务明细");

const rationale = computed(() => props.subApplication.rationale || "");

const drawerVisible = ref(false);

// Handlers
const onDeleteClick = () => {
  emit("delete", props.subApplication);
};

const onExpandClick = () => {
  drawerVisible.value = true;
};
</script>

<style lang="scss" scoped src="./SubApplication.scss"></style>
