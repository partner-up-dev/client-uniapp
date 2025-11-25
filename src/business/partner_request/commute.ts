import { HTTPApiClient } from '../http-api';
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
import { PartnerForm } from './partner';

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

  static api = new HTTPApiClient({
    modulePrefix: '/partner_request/commute',
    dt: useTranslate('partner_request').dt,
    fallbackSchema: CommutePR,
  });

  get typeText() {
    return CommutePR.api.dt(`type.${this.type}`);
  }
}

export class CommutePRForm extends PartnerRequestForm.extend(v.object({
  partners: v.optional(
    v.pipe(v.array(instance(PartnerForm)), v.minLength(2, "至少两名搭子"), v.maxLength(5, "最多五名搭子")),
    () => {
      return [
        new PartnerForm({
          role: 1  // 打车
        }),
        new PartnerForm({
          role: 2  // 乘客
        }),
        new PartnerForm({
          role: 2  // 乘客
        }),
      ]
    },
  ),
  route: v.optional(instance(RouteForm), () => new RouteForm(undefined)),
  trip_preference: v.optional(instance(TripPreference), () => new TripPreference({})),
  on_at: nullable(v.string()),
  off_at: nullable(v.string()),
  workdays: v.optional(v.array(WeekdayV), () => []),
  transportation: nullable(TransportationV),
})) {

  public async update(): Promise<CommutePR> {
    return CommutePR.api.request({
      method: 'PUT',
      endpoint: `/${this._id}`,
      data: this,
      operation_id: 'PRV2EditCommute',
    }).then(res => res.body.parsed);
  }

  public async create(): Promise<CommutePR> {
    return CommutePR.api.request({
      method: 'POST',
      endpoint: '',
      data: this,
      operation_id: 'PRV1CreateCommute',
    }).then(res => res.body.parsed);
  }

}
