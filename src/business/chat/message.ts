import * as v from "valibot";
import { V, nullable } from "../index";
import { useAccountStore } from "@/store/account";
import store from "@/store";
import { AccountRefV } from "../account";
import { APIClient } from "../api";
import { useTranslate } from "@/locale/use";

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
}

export class Message extends V.class(v.object({
  _id: MessageRefV,
  chat: v.number(),
  created_at: v.date(),
  created_by: AccountRefV,
  viewed: v.array(v.string()),
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

  /**
   * Fetch a message by id from backend. When `mock=true` this will include a
   * header hint to the backend/mock layer so the endpoint can return mocked data.
   */
  static async get(id: MessageRef, mock: boolean = true): Promise<Message> {
    const headers: Record<string, unknown> = {};
    if (mock) headers['x-mock'] = 'ChatV1GetMessage';

    const res = await this.api.requestHTTP({
      method: 'GET',
      endpoint: `/messages/${id}`,
      headers,
      // allow backend to return 200
    });

    const msg = res.body.parsed as unknown as Message;
    return msg;
  }
}

export type PlainMessageContent = string;
export const PlainMessageContentV = v.string();
