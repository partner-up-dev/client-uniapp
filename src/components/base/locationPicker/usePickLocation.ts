// 封装选择地点功能，参阅文档：https://git.hadream.ltd/anana/uniapp/base/wikis/Base/Composables/SelectLocation

import { Location, LocationForm } from "@/business/base/route";
import { EVENT } from "@/data/enum";
import { useTranslate } from "@/locale/use";
import store from "@/store";
import { useBaseLocationStore } from "@/store/base/location";
import type { LocationRef, LocationWithoutId } from "@/types/partner_request/trip";
import { errorReport } from "@/utils/vendor";
import { getTencentLBSPluginCredentialString } from "@/utils/lbs";

const { dt } = useTranslate("base.use_select_location");

// @ts-ignore
const chooseLocationPlugin = requirePlugin('chooseLocation');  // 全局只需要注册一次

const SCHOOL_POI_CATEGORY: string[] = ["241000", "241100", "241600"];
const RAILWAY_POI_CATEGORY: string[] = ["271016", "271017", "271400"];
const AIRPORT_POI_CATEGORY: string[] = ["271020", "271300"];
const RESIDENTIAL_POI_CATEGORY: string[] = ["280000", "240000"];

/**
 * @name 选择地点
 * @description
 * 当前实现基于腾讯地图插件
 * 
 * @param locationSetter 保存地点数据的函数
 * @param init_current_location 初始地点
 */
export function usePickLocation(
  locationSetter: (location: Location) => void,
) {
  // methods
  /**
   * @name 处理“选择地点”被点击
   * @description
   * - 跳转到选择地点页面
   * - 注册回调器
   * 
   * @param category 展示分类;POI分类列表
   * 
   * @exception
   * - 如果current_location不在本地缓存中，则地点选择页面不显示在当前地点
   * 
   */
  function selectLocation(
    current_location?: LocationRef,
    category: string[] = []
  ) {
    // 清除之前选择的结果
    chooseLocationPlugin.setLocation(null);

    uni.$once(EVENT.ROUTE_EDITOR_PAGE_SHOWED, locationSelected);

    // FIXMEs
    const location_string = current_location ? "&location=" + JSON.stringify({
      latitude: Location.getById(current_location)?.lat,
      longitude: Location.getById(current_location)?.lng
    }) : '';
    uni.navigateTo({
      url: `plugin://chooseLocation/index?${getTencentLBSPluginCredentialString()}${location_string}`
    });
  }

  /**
   * @name 处理“选择地点”插件的回调
   */
  function locationSelected() {
    const selected_location = chooseLocationPlugin.getLocation();
    if (!selected_location) return;

    let address = '';
    if (typeof selected_location.address === 'string') {
      address = selected_location.address.replace(
        selected_location.province, '').replace(
          selected_location.city, '').replace(
            selected_location.district, '')
    }
    else {
      address = selected_location.address.join('|');
    }

    const locationForm = new LocationForm({
      lat: selected_location.latitude,
      lng: selected_location.longitude,
      address: [
        selected_location.province,
        selected_location.city,
        selected_location.district,
        address
      ],
      friendly_address: selected_location.name
    });

    locationForm.put().then(location => {
      locationSetter(location);
    }).catch(() => {
      errorReport(dt('report.v1_base_get_location_failed'))
    });
  }

  return {
    selectLocation
  }

}


/**
 * 在页面的onShow回调中调用该函数以读取地点选择插件的结果
 */
export function onShowCallback() {
  uni.$emit(EVENT.ROUTE_EDITOR_PAGE_SHOWED);
}
