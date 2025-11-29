<script lang="ts">
export default {
  name: "PRCommuteForm",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import {
  commuteDatetimeFormProps,
  commuteDatetimeFormEmits,
  domain_t,
  t,
  type CommuteDatetimeFormExpose,
} from "./PRCommuteForm";
import type { Weekday } from "@/business/base";
import { ref } from "vue";
import { PUAccordion, PUAccordionItem, PUCheckbox, PUCheckboxGroup, PUDrawer, PUFormItem } from "@partner-up-dev/design-uniapp";
import Cell from "@/components/common/cell/cell.vue";
import TransportationPicker from "@/components/partner_request/trip/transportationPicker/transportationPicker.vue";
import RouteEditor from "@/components/base/routeEditor/routeEditor.vue";

const props = defineProps(commuteDatetimeFormProps);
const emit = defineEmits(commuteDatetimeFormEmits);

// data
const activeNames = ref<string[]>(["route", "time"]);
const errorMessage = ref<string>("");
const transPickerVisible = ref<boolean>(false);

// refs
const routeEditorRef = ref<InstanceType<typeof RouteEditor> | null>(null);

// methods
function onFormChange(key: string) {
  emit("change", key);
}

function handleOnAtChange(event: any) {
  props.form.on_at = event.detail.value;
  onFormChange("on_at");
}

function handleOffAtChange(event: any) {
  props.form.off_at = event.detail.value;
  onFormChange("off_at");
}

const weekdayOptions: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
</script>

<template>
  <view class="commute-datetime-form">
    <PUAccordion v-model="activeNames">
      <PUAccordionItem name="route" :title="domain_t('collapse_title.route')">
        <view class="space-p-y-med">
          <PUFormItem prop="route" :includeSub="true">
            <RouteEditor
              ref="routeEditorRef"
              :modelValue="props.form.route"
              type="normal"
              :disableDatetime="true"
            />
          </PUFormItem>
        </view>
      </PUAccordionItem>

      <PUAccordionItem name="time" :title="domain_t('collapse_title.time')">
        <!-- 上班时间 -->
        <picker mode="time" :value="form.on_at || ''" @change="handleOnAtChange">
          <Cell
            type="horizontal"
            size="large"
            :title="domain_t('on_at.title')"
            :value="form.on_at || domain_t('on_at.label')"
            suffix-icon="i-mdi-chevron-right"
          />
        </picker>

        <!-- 下班时间 -->
        <picker
          mode="time"
          :value="form.off_at || ''"
          @change="handleOffAtChange"
        >
          <Cell
            type="horizontal"
            size="large"
            :title="domain_t('off_at.title')"
            :value="form.off_at || domain_t('off_at.label')"
            suffix-icon="i-mdi-chevron-right"
          />
        </picker>

        <!-- 工作日 -->
        <Cell type="vertical" size="large" :title="domain_t('workdays.title')">
          <template #value>
            <PUCheckboxGroup
              v-model="form.workdays"
              :min="1"
              inline
              @change="onFormChange('workdays')"
            >
              <PUCheckbox
                v-for="day in weekdayOptions"
                :key="day"
                :model-value="day"
                shape="button"
                size="small"
              >
                {{ t(`base.weekday.${day}`) }}
              </PUCheckbox>
            </PUCheckboxGroup>
          </template>
        </Cell>
      </PUAccordionItem>

      <PUAccordionItem
        name="transportation"
        :title="domain_t('collapse_title.transportation')"
      >
        <Cell
          type="horizontal"
          size="large"
          :title="domain_t('transportation.title')"
          :value="
            form.transportation
              ? t(`base.transportation_picker.name.${form.transportation}`)
              : domain_t('transportation.placeholder')
          "
          suffix-icon="i-mdi-chevron-right"
          @click="transPickerVisible = true"
        />
      </PUAccordionItem>
    </PUAccordion>

    <!-- Error message -->
    <view v-if="errorMessage" class="commute-datetime-form__error">
      {{ errorMessage }}
    </view>

    <!-- Transportation Picker Drawer -->
    <PUDrawer v-model:visible="transPickerVisible" position="bottom">
      <TransportationPicker
        v-model="form.transportation"
        @select="
          onFormChange('transportation');
          transPickerVisible = false;
        "
      />
    </PUDrawer>
  </view>
</template>

<style lang="scss" scoped src="./PRCommuteForm.scss"></style>
