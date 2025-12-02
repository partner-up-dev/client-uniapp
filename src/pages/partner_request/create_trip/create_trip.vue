<script lang="ts">
export default {
  name: "CreateTripPartnerRequest",
};
</script>
<script setup lang="ts">
import { PRL1Type, PRType } from "@/business/partner_request";
import { nextTick, ref, watch } from "vue";
import PRImmersiveForm from "@/components/partner_request/PRImmersiveForm/PRImmersiveForm.vue";
import RouteEditor from "@/components/base/routeEditor/routeEditor.vue";
import RouteItemDatetimeEditor from "@/components/base/routeItemDatetimeEditor/routeItemDatetimeEditor.vue";
import {
  TripPreference,
} from "@/business/partner_request/trip";
import { type Transportation } from "@/business/base";
import { RouteForm } from "@/business/base/route";
import { onShow, onLoad } from "@dcloudio/uni-app";
import { EVENT } from "@/data/enum";
import { useTranslate } from "@/locale/use";
import TripPurposePicker from "@/components/partner_request/trip/tripPurposePicker/tripPurposePicker.vue";
import { RideHailingPreference } from "@/business/partner_request/ride_hailing";
import TransportationPicker from "@/components/partner_request/trip/transportationPicker/transportationPicker.vue";
import PuDrawer from "@partner-up-dev/design-uniapp/components/puDrawer/puDrawer.vue";
import * as v from "valibot";

const { dt: domain_t } = useTranslate("partner_request.create_trip");

// Define props schema with valibot
const propsSchema = v.object({
});

const props = ref<v.InferOutput<typeof propsSchema>>({});

// types
type ImmersiveCreateStep = "route" | "tripPurpose" | "transportation";

// data
const l2_type = ref<PRType | undefined>(undefined);

const form = ref<{
  route: RouteForm;
  trip_preference: TripPreference;
  ride_hailing_preference: RideHailingPreference;
  transportation: Transportation;
}>({
  route: new RouteForm(undefined),
  trip_preference: new TripPreference({}),
  ride_hailing_preference: new RideHailingPreference({}),
  transportation: "ride_hailing",
});
const immersiveCreateRef = ref<null | InstanceType<typeof PRImmersiveForm>>(null);

// data for route
const depDatetimeEditorRef = ref<null | InstanceType<
  typeof RouteItemDatetimeEditor
>>(null);
const dep_datetime_editor_popup = ref(false);

// methods
/**
 * @name 处理沉浸式创建搭子请求“下一步�?
 * @description
 * 为了处理用户直接“下一步”而没有操作步骤中的组件而失去“完成”的情况
 */
function onImmersiveCreateNext(
  source: "parent" | "user",
  current: string | ImmersiveCreateStep
) {
  if (source === "user") {
    if (current === "tripPurpose") {
      onTripPurposeComplete(false);
    } else if (current === "transportation") {
      onTransportationComplete(false);
    }
  }
}
function onTripPurposeComplete(go_next: boolean = true) {
  const purpose = form.value.trip_preference.purpose;
  if (purpose === "commute") {
    l2_type.value = PRType.Commute;
  } else {
    l2_type.value = PRType.RideHailing;
  }

  if (go_next) {
    setTimeout(() => {
      immersiveCreateRef.value?.nextStep();
    }, 500);
  }
}
function onTransportationComplete(go_next: boolean = true) {
  if (l2_type.value !== PRType.Commute) {
    const transportation = form.value.transportation;
    if (transportation === "moped") {
      l2_type.value = PRType.Moped;
    } else if (transportation === "self_drive_automobile") {
      l2_type.value = PRType.Hitchhiking;
    } else if (transportation === "ride_hailing") {
      l2_type.value = PRType.RideHailing;
    }
  }

  if (go_next) {
    setTimeout(() => {
      immersiveCreateRef.value?.nextStep();
    }, 500);
  }
}

// lifecycle
onLoad((query) => {
  // parse and validate params with valibot
  props.value = v.parse(propsSchema, query || {});
});

onShow(() => {
  uni.$emit(EVENT.ROUTE_EDITOR_PAGE_SHOWED);
});

// watch for drawer close to save
watch(dep_datetime_editor_popup, (newVal, oldVal) => {
  if (oldVal && !newVal) {
    depDatetimeEditorRef.value?.save();
  }
});
</script>

<template>
  <page-meta :page-style="`overflow:${dep_datetime_editor_popup ? 'hidden' : 'visible'};`"></page-meta>
  <PRImmersiveForm ref="immersiveCreateRef" :l1-type="PRL1Type.Trip" :l2-type="l2_type"
    @update:l2-type="l2_type = $event" :pr-form="form" :steps="['route', 'tripPurpose', 'transportation']"
    @next="onImmersiveCreateNext">
    <template v-slot:route>
      <RouteEditor ref="routeEditorRef" type="immersive" :model-value="form.route" :use-dep-datetime-editor="false"
        @edit_dep_time="dep_datetime_editor_popup = true" @complete="immersiveCreateRef?.nextStep" />
    </template>
    <template #tripPurpose>
      <view class="tp__title">
        {{ domain_t("trip_purpose.title") }}
      </view>
      <TripPurposePicker class="tp__picker" blend-to-background="right" v-model="form.trip_preference.purpose"
        @complete="onTripPurposeComplete" />
    </template>
    <template #transportation>
      <view class="trpn__title">
        {{ domain_t("transportation.title") }}
      </view>
      <TransportationPicker class="trpn__picker" v-model="form.transportation" @complete="onTransportationComplete" />
    </template>
  </PRImmersiveForm>

  <PuDrawer v-model:visible="dep_datetime_editor_popup" height="60vh" :full-custom="true">
    <template #full>
      <RouteItemDatetimeEditor class="dep-datetime-editor" ref="depDatetimeEditorRef"
        :modelValue="form.route[0].datetime" @confirm="dep_datetime_editor_popup = false"
        @cancel="dep_datetime_editor_popup = false" />
    </template>
  </PuDrawer>
</template>

<style lang="scss" scoped src="./create_trip.scss"></style>
