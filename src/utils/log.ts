// The log util integrate WXRealtimeLogManager and WXLogManager

import type { BackendMainAPIOperationId } from "@/types/api";

let wx_realtime_log = null;
let wx_log = null;
try {
    wx_realtime_log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null;
    wx_log = wx.getLogManager ? wx.getLogManager() : null;
}
catch (e) {
    console.log("no logger obtained")
}

export enum GlobalEventId {

}

export default {
    async debug(...args: any[]) {
        // only console
        console.log(...args);  
    },
    async info(...args: any[]) {
        if (!wx_realtime_log) return;
        console.log(...args);  
        wx_realtime_log.info(...args);
    },
    async warn(...args: any[]) {
        if (!wx_realtime_log) return;
        console.log(...args);  
        wx_realtime_log.warn(...args);
    },
    async error(...args: any[]) {
        // console, realtime, local
        if (wx_realtime_log) wx_realtime_log.error(...args);
        if (wx_log) wx_log.warn(...args);
    },
    setFilterMsg(msg: string) { // Supported from base library version 2.7.3
        if (!wx_realtime_log || !wx_realtime_log.setFilterMsg) return;
        if (typeof msg !== 'string') return;
        wx_realtime_log.setFilterMsg(msg);
    },
    addFilterMsg(msg: string) { // Supported from base library version 2.8.1
        if (!wx_realtime_log || !wx_realtime_log.addFilterMsg) return;
        if (typeof msg !== 'string') return;
        wx_realtime_log.addFilterMsg(msg);
    },
    reportEvent(
        monitor_id: GlobalEventId | BackendMainAPIOperationId,
        errmsg: string,
        level: number = 0,  // 0 is least important
        errcode: number = 0,  // 0 is normal
        cost: number = 1000,  // in ms
        extra_info: object = {}
    ) {
        this.info('reportEvent', ...arguments);

        wx.reportEvent("wxdata_perf_monitor", {
            "wxdata_perf_monitor_id": monitor_id,
            "wxdata_perf_monitor_level": level,
            "wxdata_perf_error_code": errcode,
            "wxdata_perf_error_msg": errmsg,
            "wxdata_perf_cost_time": cost,
            ...extra_info
        })
    }
};
