<script lang="ts">
/**
 * @name 沉浸式路线编辑器
 * @doc https://git.hadream.ltd/anana/application/uniapp/-/wikis/Base/Components/ImmersiveRouteEditor
 */
export default {
  name: 'ImmersiveRouteEditor',
  options: BasicComponentOptions
};
</script>
<script setup lang="ts">
import { BasicComponentOptions } from '@/utils/vue';
import { ImmersiveRouteEditorEmits, ImmersiveRouteEditorProps } from './types';
import { useTranslate } from '@/locale/use';
import { useBaseLocationStore } from '@/store/base/location';
import { useBaseRoute } from '../useRoute';
import { ref, watch } from 'vue';
import RouteItemDatetimeEditor from '@/components/partner_request/trip/edit/routeItemDatetimeEditor.vue';
import { type LocationWithoutId, route_item_default } from '@/types/partner_request/trip';
import { EVENT } from '@/data/enum';
import { errorReport, getTencentLBSPluginCredentialString, noneUniToast } from '@/utils';
import { V1BaseGetLocation } from '@/api/main/base';

const { domain_t } = useTranslate('base.immersive_route_editor');
const props = defineProps(ImmersiveRouteEditorProps);
const emit = defineEmits(ImmersiveRouteEditorEmits);
const { route, departureLoc, waypointLocs, arrivalLoc, locFromIndex } = useBaseRoute();

route.value = props.modelValue;

// data
const dep_datetime_editor_popup = ref(false);
const select_location_to = ref(0);
const depDatetimeEditorRef = ref<null | InstanceType<typeof RouteItemDatetimeEditor>>(null);
// @ts-ignore
const chooseLocationPlugin = requirePlugin('chooseLocation');

// methods
/**
 * @name 处理“出发时间”点�?
 */
function onDepartureTimeClick() {
  if (props.useDepDatetimeEditor) dep_datetime_editor_popup.value = true;
  else emit('edit_dep_time');
}
/**
 * @name 添加途径�?
 * @description
 * 添加到目的地之前；数量限制为4
 */
function addWaypoint() {
  if (props.modelValue.length >= 6) {
    noneUniToast(domain_t('add_waypoint.limit_reached'));
    return;
  }

  props.modelValue.splice(props.modelValue.length - 1, 0, route_item_default(false));
}
/**
 * @name 移除途径�?
 * @param index 去除起点和终点后的列表的索引
 */
function removeWaypoint(index: number) {
  if (props.modelValue.length <= 2) return;

  props.modelValue.splice(index + 1, 1);
}
/**
 * @name 处理“时间编辑器弹窗”关�?
 * @description
 * 保存时间编辑器的�?
 */
function onDepDatetimeEditorPopupClose() {
  depDatetimeEditorRef.value?.save();
  dep_datetime_editor_popup.value = false;
}
/**
 * @name 处理“地点”被点击
 * @param index 地点所属的路线条目的索�?
 */
function selectLocation(index: number) {
  chooseLocationPlugin.setLocation(null);

  select_location_to.value = index;

  uni.$once(EVENT.ROUTE_EDITOR_PAGE_SHOWED, locationSelected);

  const location_string = props.modelValue[index].location
    ? '&location=' +
      JSON.stringify({
        latitude: locFromIndex(index).lat,
        longitude: locFromIndex(index).lng
      })
    : '';
  uni.navigateTo({
    url: `plugin://chooseLocation/index?${getTencentLBSPluginCredentialString()}${location_string}`
  });
}
/**
 * @name 处理“地点选择”完�?
 */
function locationSelected() {
  const selected_location = chooseLocationPlugin.getLocation();
  if (!selected_location) return;

  let address = '';
  if (typeof selected_location.address === 'string') {
    address = selected_location.address
      .replace(selected_location.province, '')
      .replace(selected_location.city, '')
      .replace(selected_location.district, '');
  } else {
    address = selected_location.address.join('|');
  }

  const location_without_id: LocationWithoutId = {
    lat: selected_location.latitude,
    lng: selected_location.longitude,
    address: [
      selected_location.province,
      selected_location.city,
      selected_location.district,
      address
    ],
    friendly_address: selected_location.name
  };

  V1BaseGetLocation(location_without_id)
    .then(({ data }) => {
      props.modelValue[select_location_to.value].location = data;

      // 如果所有地点都已经选择，则发出完成事件
      setTimeout(() => {
        if (props.modelValue.every((item) => item.location)) {
          emit('complete');
        }
      }, 500);
    })
    .catch(() => {
      errorReport(domain_t('select_location.get_location_failed'));
    });
}
/**
 * @name 在地图上展示路线
 * @description
 * 暂时只支持从起点到终点，不支持途径�?
 */
function navigate() {
  if (!(props.modelValue[0].location && props.modelValue[props.modelValue.length - 1].location)) {
    uni.showModal({
      title: domain_t('navigate.location_not_selected'),
      showCancel: false
    });
    return;
  }

  if (props.modelValue.length > 2) {
    uni.showModal({
      title: domain_t('navigate.waypoint_not_supported'),
      showCancel: false,
      complete(res) {
        toRoutePlanPage();
      }
    });
  } else {
    toRoutePlanPage();
  }
}
function toRoutePlanPage() {
  const start_point_str = JSON.stringify({
    latitude: locFromIndex(0).lat,
    longitude: locFromIndex(0).lng,
    name: locFromIndex(0).friendly_address
  });
  const end_point_str = JSON.stringify({
    latitude: locFromIndex(props.modelValue.length - 1).lat,
    longitude: locFromIndex(props.modelValue.length - 1).lng,
    name: locFromIndex(props.modelValue.length - 1).friendly_address
  });

  uni.navigateTo({
    url: `plugin://routePlan/index?${getTencentLBSPluginCredentialString()}&startPoint=${start_point_str}&endPoint=${end_point_str}`
  });
}

// watch
watch(
  () => props.modelValue,
  (newVal) => {
    route.value = newVal;
  }
);
</script>

<template>
  <view class="ire">
    <view class="ire__main">
      <view class="ire-item departure">
        <view class="ire-item__title">
          {{ domain_t('departure.title') }}
        </view>
        <view class="ire-item__main">
          <view class="ire-item__main__location" @click="selectLocation(0)">
            {{
              departureLoc.friendly_address === ''
                ? domain_t('departure.location.placeholder')
                : departureLoc.friendly_address
            }}
          </view>
          <view class="ire-item__main__text">
            {{ domain_t('departure.text') }}
          </view>
          <wd-icon
            name="time"
            custom-class="ire-item__main__action"
            @click="onDepartureTimeClick"
          />
        </view>
      </view>
      <view
        class="ire-item waypoint"
        v-if="props.modelValue.length > 2"
        v-for="(a, index) in Array(props.modelValue.length - 2)"
        :key="index"
      >
        <view class="ire-item__title">
          {{ domain_t('waypoint.title') }}
        </view>
        <view class="ire-item__main">
          <view class="ire-item__main__location" @click="selectLocation(index + 1)">
            {{
              waypointLocs[index].friendly_address === ''
                ? domain_t('waypoint.location.placeholder')
                : waypointLocs[index].friendly_address
            }}
          </view>
          <wd-icon
            name="minus-circle"
            custom-class="ire-item__main__action"
            @click="removeWaypoint(index)"
          />
        </view>
      </view>
      <view class="ire-item arrival">
        <view class="ire-item__title">
          {{ domain_t('arrival.title') }}
        </view>
        <view class="ire-item__main">
          <view
            class="ire-item__main__location"
            @click="selectLocation(props.modelValue.length - 1)"
          >
            {{
              arrivalLoc.friendly_address === ''
                ? domain_t('arrival.location.placeholder')
                : arrivalLoc.friendly_address
            }}
          </view>
        </view>
      </view>
    </view>

    <view class="ire__operations">
      <wd-button custom-class="ire__operations__item" type="info" plain @click="navigate">
        {{ domain_t('operations.navigate') }}
      </wd-button>
      <wd-button custom-class="ire__operations__item" type="success" @click="addWaypoint">
        {{ domain_t('operations.add_waypoint') }}
      </wd-button>
    </view>
  </view>

  <wd-popup
    custom-class="popup"
    v-model="dep_datetime_editor_popup"
    closeable
    safe-area-inset-bottom
    position="bottom"
    @close="onDepDatetimeEditorPopupClose"
  >
    <RouteItemDatetimeEditor
      class="dep-datetime-editor"
      ref="depDatetimeEditorRef"
      :modelValue="modelValue[0].datetime"
      @confirm="dep_datetime_editor_popup = false"
      @cancel="dep_datetime_editor_popup = false"
    />
  </wd-popup>
</template>

<style lang="scss" scoped src="./index.scss"></style>

<style lang="scss">
@use '@/static/style/main' as *;

:deep(.popup) {
  background: $-sys-color-surface !important;

  overflow-x: hidden;

  @include pu-radius-top-medium;
}
</style>
