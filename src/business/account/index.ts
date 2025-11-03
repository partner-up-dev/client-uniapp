import * as v from 'valibot';


export type AccountRef = string;
export const AccountRefV = v.pipe(v.string(), v.uuid());

export interface AccountSimple {
  id: AccountRef;
  nickname: string;
  avatar?: string | null;
}
