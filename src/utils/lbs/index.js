// Location Based Services

// constant
import { TENCENT_LBS } from "@/data/const";

// LBS lib
import sdk_module from "./qqmap-wx-jssdk.js";

// const QQMapWX = module.exports;
export const QQMapSDK = new sdk_module({
  key: TENCENT_LBS.key,
});

/**
 * 解压返回的多段线数据
 *
 * @param {number[]} raw
 * @returns {Coord[]}
 */
export function decompressPolyline(raw) {
  const result = [];
  const raw_copy = raw.slice();

  for (let i = 2; i < raw_copy.length; i++) {
    raw_copy[i] = Number(raw_copy[i - 2]) + Number(raw_copy[i]) / 1000000;
  }
  for (let j = 0; j < raw_copy.length; j += 2) {
    result.push({ latitude: raw_copy[j], longitude: raw_copy[j + 1] });
  }

  return result;
}

export function getTencentLBSPluginCredentialString(
  key = TENCENT_LBS.key,
  referer = TENCENT_LBS.referer
) {
  return "key=" + key + "&referer=" + referer;
}
