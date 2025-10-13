import { computed, ref } from "vue";
import { useAccountStore } from "@/store/account";
import { V, nullable } from "..";
import * as v from 'valibot';
import { useTranslate } from "@/locale/use";


export type AccountRef = string;
export const AccountRefV = v.pipe(v.string(), v.uuid());

export interface AccountSimple {
  _id: AccountRef;
  nickname: string;
  avatar: string;
}
