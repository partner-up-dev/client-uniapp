<script lang="ts">
export default {
  name: "Cell",
  options: BasicComponentOptions,
};
</script>
<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { CellEmits, CellProps, type CellValueType } from "./cell";
import PUPicker from "@/components/common/PUPicker/PUPicker.vue";
import LocationPicker from "@/components/base/locationPicker/locationPicker.vue";
import { withFallback } from "@/utils";
import type { LocationRef } from "@/business/base/route";
import { useBaseLocationStore } from "@/store/base/location";
import { computed, ref, watch } from "vue";
import { useTranslate } from "@/locale/use";
// import GetPhoneNumber from "@/components/account/getPhoneNumber/getPhoneNumber.vue";

const { dt } = useTranslate("common.cell");
const props = defineProps(CellProps);
const emit = defineEmits(CellEmits);

// data
const innner_value = ref<CellValueType>(props.value);
/** 处于编辑态或激活状态 */
const editor_activating = ref(false);

// computed
const inValuePlaceholder = computed((): string => {
  if (!props.valuePlaceholder) {
    if (["common_picker", "location_picker"].includes(props.editorType)) {
      return dt("placeholder.picker");
    } else if (props.editorType === "common_input") {
      return dt("placeholder.input");
    }
    return dt("placeholder.empty");
  }
  return props.valuePlaceholder;
});

// methods
/**
 * @name 激活编辑器
 * @description
 * 仅用于无法自激活的编辑器（触发器在组件外部�?
 */
function activateEditor() {
  editor_activating.value = true;
  emit("editing");
}
function deactivateEditor() {
  editor_activating.value = false;
  emit("cancel");
}
function onPickerEditorConfirm() {
  emit("confirm", innner_value.value);
}
function onInputEditorConfirm() {
  editor_activating.value = false;

  // TODO validate form

  emit("confirm", innner_value.value);
}

// watch
watch(editor_activating, (new_val, old_val) => {
  if (old_val === false && new_val === true) {
    emit("editing");
  }
});
</script>

<template>
  <view :class="['cell', `is-${size}`, `is-${type}`]">
    <!-- Default type: horizontal layout -->
    <template v-if="type === 'default'">
      <view class="cell__left">
        <!-- FIXME use prop:prefixIcon -->
        <!-- <view class="cell__icon">
          <slot name="icon"></slot>
        </view> -->
        <view class="cell__main">
          <view class="cell__title">
            <slot name="title">
              {{ title }}
            </slot>
          </view>
          <view v-if="subtitle" class="cell__subtitle">
            <slot name="subtitle">
              {{ subtitle }}
            </slot>
          </view>
        </view>
      </view>
      <view class="cell__right">
        <PUPicker
          v-if="editorType === 'common_picker'"
          v-model="innner_value"
          :columns="editorData"
          @confirm="onPickerEditorConfirm"
          @open="activateEditor"
          @cancel="deactivateEditor"
        >
          <view :class="['cell__value']">
            {{
              withFallback(
                value,
                valueFormmater || ((val) => val),
                inValuePlaceholder
              )
            }}
          </view>
        </PUPicker>
        <LocationPicker
          v-else-if="editorType === 'location_picker'"
          :modelValue="(innner_value as LocationRef)"
          @confirm="onPickerEditorConfirm"
        >
          <view :class="['cell__value']">
            {{
              withFallback(
                value as LocationRef,
                useBaseLocationStore().friendlyAddress,
                inValuePlaceholder
              )
            }}
          </view>
        </LocationPicker>
        <view
          :class="['cell__value']"
          v-else-if="editorType === 'common_input'"
          @click="activateEditor"
        >
          <input
            :class="['cell__input-value']"
            v-if="editor_activating"
            :value="innner_value?.toString()"
            :placeholder="inValuePlaceholder"
            @confirm="onInputEditorConfirm"
            @blur="deactivateEditor"
            @input="innner_value = $event.detail.value"
          />
          <view v-if="!editor_activating">
            {{
              withFallback(
                value,
                valueFormmater || ((val) => val),
                inValuePlaceholder
              )
            }}
          </view>
        </view>
        <view
          :class="['cell__value']"
          v-else-if="editorType === 'get_phone_number'"
        >
          <GetPhoneNumber
            v-model:show="editor_activating"
            @success="onPickerEditorConfirm"
            @cancel="deactivateEditor"
          />
          <view @click="activateEditor">
            {{
              withFallback(
                value,
                valueFormmater || ((val) => val),
                inValuePlaceholder
              )
            }}
          </view>
        </view>
        <text v-if="showArrow" class="cell__arrow i-mdi-chevron-right"></text>
      </view>
    </template>

    <!-- Vertical type: original vertical layout -->
    <template v-else>
      <view class="cell__title">
        <slot name="title">
          {{ title }}
        </slot>
      </view>
      <PUPicker
        v-if="editorType === 'common_picker'"
        v-model="innner_value"
        :columns="editorData"
        @confirm="onPickerEditorConfirm"
        @open="activateEditor"
        @cancel="deactivateEditor"
      >
        <view :class="['cell__value']">
          {{
            withFallback(
              value,
              valueFormmater || ((val) => val),
              inValuePlaceholder
            )
          }}
        </view>
      </PUPicker>
      <LocationPicker
        v-else-if="editorType === 'location_picker'"
        :modelValue="(innner_value as LocationRef)"
        @confirm="onPickerEditorConfirm"
      >
        <view :class="['cell__value']">
          {{
            withFallback(
              value as LocationRef,
              useBaseLocationStore().friendlyAddress,
              inValuePlaceholder
            )
          }}
        </view>
      </LocationPicker>
      <view
        :class="['cell__value']"
        v-if="editorType === 'common_input'"
        @click="activateEditor"
      >
        <input
          :class="['cell__input-value']"
          v-if="editor_activating"
          :value="innner_value?.toString()"
          :placeholder="inValuePlaceholder"
          @confirm="onInputEditorConfirm"
          @blur="deactivateEditor"
          @input="innner_value = $event.detail.value"
        />
        <view v-if="!editor_activating">
          {{
            withFallback(
              value,
              valueFormmater || ((val) => val),
              inValuePlaceholder
            )
          }}
        </view>
      </view>
      <view :class="['cell__value']" v-if="editorType === 'get_phone_number'">
        <GetPhoneNumber
          v-model:show="editor_activating"
          @success="onPickerEditorConfirm"
          @cancel="deactivateEditor"
        />
        <view @click="activateEditor">
          {{
            withFallback(
              value,
              valueFormmater || ((val) => val),
              inValuePlaceholder
            )
          }}
        </view>
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped src="./cell.scss"></style>
