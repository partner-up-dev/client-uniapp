<script lang="ts">
export default {
  name: "LocationPicker",
  options: BasicComponentOptions,
};
</script>
<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import {
  LocationPickerEmits,
  LocationPickerProps,
  localMessages,
} from "./locationPicker";
import { usePickLocation } from "./usePickLocation";
import { Location } from "@/business/base/route";
import { useI18n } from "vue-i18n";

const props = defineProps(LocationPickerProps);
const emit = defineEmits(LocationPickerEmits);
const { t: lt } = useI18n({ inheritLocale: true, messages: localMessages });
const { selectLocation } = usePickLocation((location) => {
  emit("update:modelValue", location.id);
  emit("confirm", location.id);
});
const { location } = Location.use(props.modelValue);
</script>

<template>
  <view class="location-picker" @click="selectLocation(props.modelValue)">
    <slot>
      <view class="value">
        {{
          props.modelValue
            ? location?.friendly_address
            : props.placeholder
              ? props.placeholder
              : lt("value.placeholder")
        }}
      </view>
    </slot>
  </view>
</template>

<style lang="scss" scoped src="./locationPicker.scss"></style>
