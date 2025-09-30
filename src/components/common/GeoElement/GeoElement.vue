<script lang="ts">
  export default {
    name: "GeoElement",
    options: BasicComponentOptions,
  };
</script>

<script setup lang="ts">
  import { BasicComponentOptions } from "@/utils/vue";
  import { geoElementProps, geoElementEmits } from "./GeoElement";
  import RoutePreview from "@/components/common/routePreview/routePreview.vue";
  import { POI, Route } from "@/business/base/route";

  const props = defineProps(geoElementProps);
  const emit = defineEmits(geoElementEmits);
</script>

<template>
  <view v-if="element" class="geo-element">
    <!-- 地理元素预览 -->
    <view class="preview">
      <RoutePreview v-if="!!(element instanceof Route)" :route="element" />

      <template v-else-if="!!(element instanceof POI)">
        <!-- POI 预览 -->
        <view class="poi-item">
          <view class="type-indicator">
            <text class="i-mdi-map-marker type-icon"></text>
          </view>
          <text class="address">POI 地址显示</text>
        </view>
      </template>
    </view>

    <!-- 类型图标 -->
    <view class="item-type">
      <text
        v-if="!!(element instanceof Route)"
        class="i-mdi-directions item-type-icon"
      ></text>
      <text
        v-else-if="!!(element instanceof POI)"
        class="i-mdi-map-marker item-type-icon"
      ></text>
    </view>
  </view>
</template>

<style lang="scss" scoped src="./GeoElement.scss"></style>
