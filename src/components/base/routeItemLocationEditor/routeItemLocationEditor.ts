import type { PropType } from "vue";
import { makeStringProp, makeBooleanProp } from "@/utils/props";
import type { LocationRef } from "@/business/base/route";
import type { Location } from "@/business/base/route";

// ==================== 组件相关类型定义 ====================

/**
 * 地址昵称最大长度
 */
export const FRIENDLY_ADDRESS_MAX_LENGTH = 50;

// ==================== 组件 Props 定义 ====================
export const routeItemLocationEditorProps = {
  /**
   * v-model 绑定的地点引用 ID
   * 空字符串表示未选择地点
   */
  modelValue: makeStringProp<LocationRef>(""),

  /**
   * 是否在确认时自动保存
   * @default true
   */
  autoSave: makeBooleanProp(true),
};

// ==================== 组件 Emits 定义 ====================
export const routeItemLocationEditorEmits = {
  /**
   * 地点数据变更时触发
   * @param location 变更后的地点数据
   */
  change: (location: Location) => true,

  /**
   * 确认选择地点时触发
   * @param location 确认的地点数据
   */
  confirm: (location: Location) => true,

  /**
   * 取消操作时触发
   */
  cancel: () => true,

  /**
   * v-model 更新事件
   * @param locationRef 地点引用 ID
   */
  "update:modelValue": (locationRef: LocationRef) => true,
};

// ==================== 组件工具函数 ====================

/**
 * 验证地点数据是否完整有效
 * @param location 待验证的地点数据
 * @returns 错误信息，如果验证通过则返回空字符串
 */
export function validateLocation(location: Partial<Location>): string {
  // 检查经纬度是否有效
  if (location.lat === undefined || location.lng === undefined || location.lat === 0) {
    return "请选择地点";
  }

  // 检查地址数组是否为空
  if (!location.address || location.address.length === 0) {
    return "请选择地点";
  }

  // 检查地址昵称
  if (!location.friendly_address || location.friendly_address.trim() === "") {
    return "请输入地点名称";
  }

  return "";
}
