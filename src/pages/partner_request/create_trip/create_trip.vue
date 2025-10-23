<script lang="ts">
/**
 * @name 创建出行搭子请求页面
 * @doc https://git.hadream.ltd/anana/application/uniapp/-/wikis/PartnerRequest/Pages/Create/Trip
 */
import { BasicComponentOptions } from "@/utils/vue";
export default {
  name: "CreateTripPartnerRequest",
  options: BasicComponentOptions,
};
</script>
<script setup lang="ts">
import { PRL1Type, PRType } from "@/business/partner_request";
import PartnerRequestImmersiveCreate from "../../components/partnerRequestImmersiveCreate/partnerRequestImmersiveCreate.vue";
import { nextTick, ref } from "vue";
import ImmersiveRouteEditor from "@/components/base/immersiveRouteEditor/immersiveRouteEditor.vue";
import {
  type Route,
  Transportation,
  TripPurpose,
} from "@/types/partner_request/trip";
import { route_default } from "@/types/partner_request/trip/edit";
import { onShow, onLoad } from "@dcloudio/uni-app";
import { EVENT } from "@/data/enum";
import RouteItemDatetimeEditor from "@/components/partner_request/trip/edit/routeItemDatetimeEditor.vue";
import { useTranslate } from "@/locale/use";
import TripPurposePicker from "@/components/base/tripPurposePicker/tripPurposePicker.vue";
import {
  ride_hailing_preference_default,
  type RideHailingPreference,
} from "@/types/partner_request/ride_hailing";
import TransportationPicker from "@/components/base/transportationPicker/transportationPicker.vue";
import * as v from "valibot";

const { dt: domain_t } = useTranslate("partner_request.create_trip");

// Define props schema with valibot
const propsSchema = v.object({
  l1_type: v.optional(v.picklist(Object.values(PRL1Type))),
});

const props = ref<v.InferOutput<typeof propsSchema>>({});

// types
type ImmersiveCreateStep = "route" | "tripPurpose" | "transportation";

// data
const l2_type = ref<PRType | undefined>(undefined);
/**
 * @name （出行）搭子请求表单
 * @todo
 * - 内容没有被正确地传递到创建收尾页面
 * - 通勤目的则删除路线中的出发时间信�?
 */
const form = ref<{
  route: Route;
  ride_hailing_preference: RideHailingPreference;
  transportation: Transportation;
}>({
  route: route_default(true),
  ride_hailing_preference: ride_hailing_preference_default(),
  transportation: Transportation.RideHailing,
});
const immersiveCreateRef = ref<null | InstanceType<
  typeof PartnerRequestImmersiveCreate
>>(null);

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
/**
 * @name 处理“出行目的”完�?
 * @description
 * 选择了“通勤”，则为通勤搭子，其它为网约车搭�?
 */
function onTripPurposeComplete(go_next: boolean = true) {
  const purpose = form.value.ride_hailing_preference.purpose;
  if (purpose === TripPurpose.Commute) {
    l2_type.value = PRType.Commute;
  } else {
    l2_type.value = PRType.RideHailing;
  }

  if (go_next) {
    nextTick(() => {
      immersiveCreateRef.value?.nextStep();
    });
  }
}
/**
 * @name 处理“出行方式”完�?
 * @description
 * 如果并未判定为通勤搭子：电�?-> 电驴搭子；私家车 -> 便车搭子
 */
function onTransportationComplete(go_next: boolean = true) {
  if (l2_type.value !== PRType.Commute) {
    const transportation = form.value.transportation;
    if (transportation === Transportation.Moped) {
      l2_type.value = PRType.Moped;
    } else if (transportation === Transportation.SelfDriveAutomobile) {
      l2_type.value = PRType.Hitchhiking;
    } else if (transportation === Transportation.RideHailing) {
      l2_type.value = PRType.RideHailing;
    }
  }

  if (go_next) {
    nextTick(() => {
      immersiveCreateRef.value?.nextStep();
    });
  }
}

// lifecycle
onLoad((query?: { l1_type?: string }) => {
  // parse and validate params with valibot
  props.value = v.parse(propsSchema, query || {});
});

onShow(() => {
  uni.$emit(EVENT.ROUTE_EDITOR_PAGE_SHOWED);
});
</script>

<template>
  <PartnerRequestImmersiveCreate
    ref="immersiveCreateRef"
    :l1-type="props.l1_type || PRL1Type.Trip"
    :l2-type="l2_type"
    @update:l2-type="l2_type = $event"
    :pr-form="form"
    :steps="['route', 'tripPurpose', 'transportation']"
    @next="onImmersiveCreateNext"
  >
    <template v-slot:route>
      <ImmersiveRouteEditor
        ref="routeEditorRef"
        :model-value="form.route"
        :use-dep-datetime-editor="false"
        @edit_dep_time="dep_datetime_editor_popup = true"
        @complete="immersiveCreateRef?.nextStep"
      />
    </template>
    <template #tripPurpose>
      <view class="tp__title">
        {{ domain_t("trip_purpose.title") }}
      </view>
      <TripPurposePicker
        class="tp__picker"
        blend-to-background="right"
        v-model="form.ride_hailing_preference.purpose"
        @complete="onTripPurposeComplete"
      />
    </template>
    <template #transportation>
      <view class="trpn__title">
        {{ domain_t("transportation.title") }}
      </view>
      <TransportationPicker
        class="trpn__picker"
        blend-to-background="right"
        v-model="form.transportation"
        @complete="onTransportationComplete"
      />
    </template>
  </PartnerRequestImmersiveCreate>

  <wd-popup
    custom-class="popup"
    v-model="dep_datetime_editor_popup"
    close-on-click-modal
    safe-area-inset-bottom
    position="bottom"
    @close="
      depDatetimeEditorRef?.save();
      dep_datetime_editor_popup = false;
    "
  >
    <RouteItemDatetimeEditor
      class="dep-datetime-editor"
      ref="depDatetimeEditorRef"
      :modelValue="form.route[0].datetime"
      @confirm="dep_datetime_editor_popup = false"
      @cancel="dep_datetime_editor_popup = false"
    />
  </wd-popup>
</template>

<style lang="scss" scoped src="./create_trip.scss"></style>

<style lang="scss">
@use "@/styles/main.scss" as *;

:deep(.popup) {
  background: $pu-color-surface !important;

  overflow-x: hidden;

  @include pu-radius-top-medium;
}
</style>
