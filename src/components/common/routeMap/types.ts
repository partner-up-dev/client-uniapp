// RoutePlanMap Vue SFC Types

import type { PropType } from "vue";
import { QQMapDirectionMode as PlanMode } from '@/utils/lbs/types';
import { type DriverLocation, navigation_info_default, type Coord, type NavigationInfo, type Route } from "@/types/partner_request/trip";
import { route_default } from "@/types/partner_request/trip/edit";
import { makeArrayProp, makeBooleanProp, makeNumberProp, makeStringProp } from "@/utils/props";

export const RouteMapProps = {
    /**
     * @name 路线信息
     */
    route: {
        type: Object as PropType<Route>,
        default: () => route_default()
    },
    /**
     * @name 线路规划模式
     */
    planMode: {
        type: String as PropType<PlanMode>,
        default: PlanMode.Driving
    },
    /**
     * @name 是否自动进行路线规划
     */
    planRoute: makeBooleanProp(true),
    /**
     * @name 是否显示气泡
     * @description
     * 包括路线标记点气泡和汽车位置气泡
     */
    showCallout: makeBooleanProp(false),
    /**
     * @name 自定义多段线点列表
     */
    customPolylinePoints: {
        type: Array as PropType<Coord[]>,
    },
    /**
     * @name 动态行驶信息
     */
    dynamicDrivenInfo: {
        type: Object as PropType<NavigationInfo>,
    },
    /**
     * @name 汽车位置
     */
    carPosition: {
        type: Object as PropType<DriverLocation>,
    },
    /**
     * @name 紧贴多段线移动汽车
     */
    stickCarToPolyline: makeBooleanProp(true),
    /**
     * @name 是否开启惯性跑动
     */
    carAutoplay: makeBooleanProp(false),
    /**
     * @name 是否显示汽车行驶历史路径
     */
    showCarHistory: makeBooleanProp(false),
    /**
     * @name 汽车标记点气泡文本
     */
    carCalloutText: makeStringProp(""),
    /**
     * @name 是否显示静态行驶信息
     */
    showStaticDrivenInfo: makeBooleanProp(true),
    /**
     * @name 中心点模式
     * @description
     * 100: 用户位置
     * 99: 路线起点与终点的中心
     * 98：车辆位置
     * 其它：路线点
     */
    centerMode: makeNumberProp(99),
    /**
     * @name 可视区域
     * @description
     * [top, right, bottom, left]
     * 
     * 是可视区域的四边距离地图组件的四边的距离
     */
    visibleRect: {
        type: Object as PropType<[top: number, right: number, bottom: number, left: number]>,
        default: [0, 0, 0, 0]
    },
}

export const RouteMapEmits = {
    /**
     * 气泡被点击
     * 
     * @param index routeItem在route中对应的索引
     */
    callout_tap: (index: number) => index,
}

/** 路线标记点的尺寸 */
export const ROUTE_MARKER_SIZE = {
    width: 24,
    height: 24
}
/** 汽车标记点的尺寸 */
export const CAR_MARKER_SIZE = {
    width: 38,
    height: 38
}
/** 标记点经纬度锚点 */
export const MARKER_ANCHOR = {
    x: 0.5,
    y: 0.5
}
/** 多段线颜色；有主要色彩、次要色彩和无效色彩 */
export const POLYLINE_COLOR = {
    primary: "#85976eFF",
    secondary: "#dbe7c8FF",
    invalid: "#abaca5"
}
/** 多段线边框颜色；和多段线颜色对应 */
export const POLYLINE_BORDER_COLOR = {
    primary: "#ffffff",
    secondary: "#ffffff",
    invalid: "#5e5f59"
};
export const POLYLINE_WIDTH = 7;
/** 车辆标记点ID */
export const CAR_MARKER_ID = 98;
/** 包含点的Padding */
export const INCLUDE_POINTS_PADDING_DEFAULT: [top: number, right: number, bottom: number, left: number] = [
    120, 60, 180, 60
];
/** 自动跑动速度；几个坐标点/s */
export const CAR_AUTOPLAY_SPEED = 5;
/** 偏离路线判断阈值；米 */
export const CAR_OFF_TRACT_THRESHOLD = 50;
/** 旋转阈值 */
export const CAR_ROTATE_THRESHOLD = 5;

/**
 * @name 多段线
 * 
 * @docs
 * https://uniapp.dcloud.net.cn/component/map.html#polyline
 */
export interface Polyline {
    points: Coord[];
    /**
     * 8位十六进制表示，后两位表示alpha值，如：#0000AA
     */
    color?: string; 
    width?: number;
    borderColor?: string;
    borderWidth?: number;
    arrowLine?: boolean;
}


/**
 * @name 标记点
 * @docs
 * https://uniapp.dcloud.net.cn/component/map.html#marker
 */
export interface Marker {
    id: number;
    latitude: number;
    longitude: number;
    /** 使用callout会被忽略 */
    title?: string;
    iconPath: string;
    alpha?: number;  // 0-1 透明度
    width?: number;
    height?: number;
    anchor?: {
        x: number; y: number
    };
    rotate?: number,
    /** 气泡；使用customCallout会被忽略 */
    callout?: {
        content: string;
        color?: string;
        fontSize?: number;
        borderRadius?: number;
        borderWidth?: number;
        borderColor?: string;
        bgColor?: string;
        padding?: number;
        display: string;
        anchorY?: number;
        anchorX?: number;
    },
    customCallout?: {
        display: string;
        anchorY?: number;
        anchorX?: number;
    }
}
