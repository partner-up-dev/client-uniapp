import { APIClient } from '../api';
import { useTranslate } from '@/locale/use';
import { instance } from '..';
import * as v from 'valibot';
import { V } from '..';
import { type PRRef } from '.';
import { nullable } from '..';
import { PartnerRequest, PartnerRequestForm } from './base';
import { Route, RouteForm } from '../base/route';
import { TripPreference } from './trip';

export type RideHailingOrderRef = number;
export const RideHailingOrderRefV = v.number();

export class RideHailingPreference extends V.class(v.object({
  ride_types: v.optional(v.array(v.string()), () => [])
})) {

}

/**
 * 网约车搭子请求
 */
export class RideHailingPR extends PartnerRequest.extend(v.object({
  route: instance(Route),
  trip_preference: instance(TripPreference),
  ride_hailing_preference: instance(RideHailingPreference),
  ride_hailing_order: nullable(v.number()),
})) {

  static api = new APIClient({
    modulePrefix: '/partner_request/ride_hailing',
    dt: useTranslate('partner_request').dt,
    fallbackSchema: RideHailingPR,
  });

  get typeText() {
    return RideHailingPR.api.dt(`type.${this.type}`);
  }
}

export class RideHailingPRForm extends PartnerRequestForm.extend(v.object({
  route: v.optional(instance(RouteForm), () => new RouteForm({})),
  trip_preference: v.optional(instance(TripPreference), () => new TripPreference({})),
  ride_hailing_preference: v.optional(instance(RideHailingPreference), () => new RideHailingPreference({})),
})) {

  public create(): Promise<RideHailingPR> {
    return RideHailingPR.api.requestHTTP({
      method: 'POST',
      endpoint: '/',
      data: this,
      operation_id: 'PRV1CreateRideHailing',
    }).then(res => res.body.parsed);
  }

  public update(): Promise<RideHailingPR> {
    return RideHailingPR.api.requestHTTP({
      method: 'PUT',
      endpoint: `/${this._id}`,
      data: this,
      operation_id: 'PRV2EditRideHailing',
    }).then(res => res.body.parsed);
  }

}
