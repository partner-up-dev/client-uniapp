import { nullable, V } from "..";
import * as v from "valibot";

/**
 * 出行目的
 */
export type TripPurpose =
  | "airport_dropoff"
  | "airport_pickup"
  | "common"
  | "commute"
  | "railway_dropoff"
  | "railway_pickup";

/**
 * 出行偏好
 */
export class TripPreference extends V.class(v.object({
  purpose: nullable(v.picklist([
    "airport_dropoff",
    "airport_pickup",
    "common",
    "commute",
    "railway_dropoff",
    "railway_pickup",
  ])),
  passengers: nullable(v.number()),
  luggage: nullable(v.number()),
  flight: nullable(v.string()),
  railway: nullable(v.string()),
})) {

}
