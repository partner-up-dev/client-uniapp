import * as v from 'valibot';

export const DatetimeV = v.pipe(
  v.union([v.string(), v.date()]),
  v.transform((i) => i instanceof Date ? i : new Date(i))
);

/**
 * 星期
 */
export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export const WeekdayV = v.picklist([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]);

/**
 * 交通方式
 */
export type Transportation =
  | 'self_drive_automobile'
  | 'moped'
  | 'ride_hailing';

export const TransportationV = v.picklist([
  'self_drive_automobile',
  'moped',
  'ride_hailing',
]);