<template>
  <view class="pr-geo-element-filter">
    <!-- 地图预览组件 -->
    <PuMap
      v-model:center="mapCenter"
      v-model:activeElement="activeElement"
      :elements="elements"
      :map-id="'pr-geo-filter-map'"
      :height="props.mapHeight"
    >
      <view class="pu-map-operation" @tap="onReset">
        <text class="i-mdi-filter-off"></text>
      </view>
    </PuMap>
    <!-- 所有元素预览：使用 swiper；当前展示的元素即 activeElement -->
    <swiper
      class="geo-elements"
      v-if="swiperCurrent !== undefined"
      :current="swiperCurrent"
      circular
      @change="onSwiperChange"
    >
      <swiper-item
        v-for="(el, idx) in elements"
        :key="idx"
        class="geo-elements item"
      >
        <GeoElementPreview :element="el" />
      </swiper-item>
    </swiper>
    <view class="geo-elements placeholder" v-else>
      {{ dt("select_an_element") }}
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: "PRGeoElementFilter",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { ref, computed } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import PuMap from "@/components/common/PUMap/PUMap.vue";
import type { GeoElementWithIndex } from "@/components/common/PUMap/PUMap";
import GeoElementPreview from "@/components/common/GeoElement/GeoElement.vue";
import { type GeoElement } from "@/components/common/GeoElement/GeoElement";
import { type Coord } from "@/business/base/route";
import { mockElements } from "./PRGeoElementFilter";
import { makeStringProp } from "@/utils/props";
import { useTranslate } from "@/locale";

const { dt } = useTranslate("partner_request.geo_filter");

const props = defineProps({
  mapHeight: makeStringProp("200px"),
});

// Refs

// mock data
const elements = ref<GeoElement[]>(mockElements);

const mapCenter = ref<Coord>();
const activeElement = ref<GeoElementWithIndex | undefined | null>();

// swiper 与 activeElement 双向同步
const swiperCurrent = computed<number | undefined>(
  () => activeElement.value?.index,
);

function onSwiperChange(e: any) {
  const idx = e?.detail?.current ?? 0;
  const el = elements.value[idx];
  if (el) {
    activeElement.value = { index: idx, value: el };
  }
}

// Methods
function onReset() {
  activeElement.value = null;
}
</script>

<style lang="scss" scoped src="./PRGeoElementFilter.scss"></style>
