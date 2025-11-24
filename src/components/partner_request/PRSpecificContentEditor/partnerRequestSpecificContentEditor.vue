<script lang="ts">
export default {
  name: "partner-request-specific-content-editor",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import {
  partnerRequestSpecificContentEditorProps,
  partnerRequestSpecificContentEditorEmits,
} from "./partnerRequestSpecificContentEditor";

const props = defineProps(partnerRequestSpecificContentEditorProps);
const emit = defineEmits(partnerRequestSpecificContentEditorEmits);
</script>

<template>
  <view>
    <rideHailingSpecificContentEditor
      v-if="type === 'RideHailing'"
      :form="form"
      @change="$emit('change', $event)"
    />
    <commuteSpecificContentEditor
      v-if="type === 'Commute'"
      :form="form"
      @change="$emit('change', $event)"
    />
    <travelSpecificContentEditor
      v-if="type === 'Travel'"
      :form="form"
      @change="$emit('change', $event)"
    />
  </view>
</template>

<style
  lang="scss"
  scoped
  src="./partnerRequestSpecificContentEditor.scss"
></style>
