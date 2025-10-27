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
import { WeekdayV, TransportationV } from '../base';

/**
 * 通勤搭子请求
 */
export class CommutePR extends PartnerRequest.extend(v.object({
  route: instance(Route),
  trip_preference: instance(TripPreference),
  on_at: nullable(v.string()),
  off_at: nullable(v.string()),
  workdays: v.array(WeekdayV),
  transportation: nullable(TransportationV),
  ride_hailing_orders: v.array(v.number()), // TODO reuse RideHailingOrderRefV
})) {

  static api = new APIClient({
    modulePrefix: '/partner_request/commute',
    dt: useTranslate('partner_request').dt,
    fallbackSchema: CommutePR,
  });

  get typeText() {
    return CommutePR.api.dt(`type.${this.type}`);
  }
}

export class CommutePRForm extends PartnerRequestForm.extend(v.object({
  route: v.optional(instance(RouteForm), () => new RouteForm({})),
  trip_preference: v.optional(instance(TripPreference), () => new TripPreference({})),
  on_at: nullable(v.string()),
  off_at: nullable(v.string()),
  workdays: v.optional(v.array(WeekdayV), () => []),
  transportation: nullable(TransportationV),
})) {

  public update(): Promise<CommutePR> {
    return CommutePR.api.requestHTTP({
      method: 'PUT',
      endpoint: `/${this._id}`,
      data: this,
      operation_id: 'PRV2EditCommute',
    }).then(res => res.body.parsed);
  }

  public create(): Promise<CommutePR> {
    return CommutePR.api.requestHTTP({
      method: 'POST',
      endpoint: '/',
      data: this,
      operation_id: 'PRV1CreateCommute',
    }).then(res => res.body.parsed);
  }

}
