import * as v from 'valibot';

export const DatetimeV = v.pipe(
  v.union([v.string(), v.date()]),
  v.transform((i) => i instanceof Date ? i : new Date(i))
);