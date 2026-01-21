<script lang="ts">
export default {
  name: "RouteItemDatetime",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { computed } from "vue";
import {
  routeItemDatetimeProps,
  routeItemDatetimeEmits,
  localMessages,
} from "./routeItemDatetime";
import { useI18n } from "vue-i18n";

const { t: lt } = useI18n({ inheritLocale: true, messages: localMessages });

const props = defineProps(routeItemDatetimeProps);
defineEmits(routeItemDatetimeEmits);
if (!props.datetime)
  throw new Error("RouteItemDatetime: datetime prop is required");
</script>

<template>
  <view class="ri-datetime">
    <view class="time-range">
      <text>{{ props.datetime.timeRange.start }}</text>
      <text v-if="props.datetime.timeRange.end != props.datetime.timeRange.start">
        ~{{ props.datetime.timeRange.end }}
      </text>
    </view>
    <view class="no-bring-ahead" v-if="props.datetime.bring_ahead === 0">{{
      lt("no_bring_ahead")
    }}</view>
    <view class="no-put-off" v-if="props.datetime.put_off === 0">{{
      lt("no_put_off")
    }}</view>
  </view>
</template>

<style lang="scss" scoped src="./routeItemDatetime.scss"></style>
