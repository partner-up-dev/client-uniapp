<script lang="ts">
export default {
  name: "LocationPicker",
  options: BasicComponentOptions,
};
</script>
<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { LocationPickerEmits, LocationPickerProps } from "./locationPicker";
import { usePickLocation } from "./usePickLocation";
import { useTranslate } from "@/locale/use";
import { Location } from "@/business/base/route";

const { dt } = useTranslate("base.location_picker");
const props = defineProps(LocationPickerProps);
const emit = defineEmits(LocationPickerEmits);
const { selectLocation } = usePickLocation((location) => {
  emit("update:modelValue", location._id);
  emit("confirm", location._id);
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
            : dt("value.placeholder")
        }}
      </view>
    </slot>
  </view>
</template>

<style lang="scss" scoped src="./locationPicker.scss"></style>
