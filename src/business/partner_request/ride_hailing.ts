import { APIClient } from '../api';
import { useTranslate } from '@/locale/use';
import { instance } from '..';
import * as v from 'valibot';
import { type PRRef } from '.';
import { nullable } from '..';
import { PartnerRequest } from './base';
import { Route } from '../base/route';

// Type definitions
export type RideHailingOrderRef = number;
export const RideHailingOrderRefV = v.number();

/**
 * 网约车搭子请求
 */
export class RideHailingPR extends PartnerRequest.extend(v.object({
  route: instance(Route),
  trip_preference: v.any(),
  ride_hailing_preference: v.any(),
  ride_hailing_order: nullable(v.number()),
})) {

  static api = new APIClient({
    modulePrefix: '/partner_request/ride_hailing',
    dt: useTranslate('partner_request').dt,
    fallbackSchema: RideHailingPR,
  });

  static get(pr_id: PRRef): Promise<RideHailingPR> {
    return this.api.requestHTTP({
      method: 'GET',
      endpoint: `/${pr_id}`,
      operation_id: 'RideHailingPartnerRequestGet',
    }).then(res => res.body.parsed);
  }

  public create(): Promise<RideHailingPR> {
    return RideHailingPR.api.requestHTTP({
      method: 'POST',
      endpoint: '/',
      data: this,
      operation_id: 'PRV1CreateRideHailing',
    }).then(res => res.body.parsed);
  }

  public edit(): Promise<RideHailingPR> {
    return RideHailingPR.api.requestHTTP({
      method: 'PUT',
      endpoint: `/${this._id}`,
      data: this,
      operation_id: 'PRV2EditRideHailing',
    }).then(res => res.body.parsed);
  }

  get typeText() {
    return RideHailingPR.api.dt(`type.${this.type}`);
  }
}
