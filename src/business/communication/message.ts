import * as v from "valibot";
import { V, nullable } from "../index";
import { useAccountStore } from "@/store/account";
import store from "@/store";
import { AccountRefV } from "../account";
import { APIClient } from "../api";
import { useTranslate } from "@/locale/use";
import { DatetimeV } from "../base";
import { ChatRefV } from ".";

export type MessageRef = number;
export const MessageRefV = v.number();

export enum MessageType {
  Plain = "plain",
  Rich = "rich",
  Image = "image",
  PartnerApplication = "partner_application",
  ThreadEntry = "thread_entry",
  Approval = "approval",
  NewMember = "new_member",
  SplitBill = "split_bill",
}

export class Message extends V.class(v.object({
  _id: MessageRefV,
  chat: ChatRefV,
  created_at: DatetimeV,
  created_by: AccountRefV,
  viewed: v.array(AccountRefV),
  type: v.enum(MessageType),
  content: v.any(),
  replied_to: nullable(MessageRefV),
  forwarded_from: nullable(MessageRefV),
})) {

  get byMe(): boolean {
    const currentUserId = useAccountStore(store).myId;
    return this.created_by === currentUserId;
  }

  // API client for Message-related endpoints
  static api = new APIClient({
    modulePrefix: '/chat',
    dt: useTranslate('chat.message').dt,
    fallbackSchema: Message,
  });

  static async get(id: MessageRef): Promise<Message> {
    return this.api.requestHTTP({
      method: 'GET',
      endpoint: `/messages/${id}`,
    }).then(res => res.body.parsed);
  }
}

export type PlainMessageContent = string;
export const PlainMessageContentV = v.string();
