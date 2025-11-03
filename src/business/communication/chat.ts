import * as v from "valibot";
import { V, nullable, instance } from "../index";
import { APIClient } from "../api";
import { useTranslate } from "@/locale/use";
import { AccountRefV } from "../account";
import { Message } from "./message";
import { type ChatRef, ChatRefV } from ".";
import { DatetimeV } from "../base";
import { PartnerRequest } from "../partner_request/base";

export enum ChatType {
  PartnerRequest = "partner_request",
  DirectMessage = "direct_message",
  PartnerApplication = "partner_application",
}

export enum ChatStatus {
  Open = "open",
  Closed = "closed",
  Blocked = "blocked",
}

export class Chat extends V.class(v.object({
  _id: ChatRefV,
  created_at: DatetimeV,
  created_by: AccountRefV,
  type: v.enum(ChatType),
  status: v.enum(ChatStatus),
  title: nullable(v.string()),
  avatar: nullable(v.string()),
  members: nullable(v.array(AccountRefV)),
  parent: nullable(ChatRefV),
})) {

  // API client for Chat-related endpoints
  static api = new APIClient({
    modulePrefix: '/chat',
    dt: useTranslate('chat').dt,
    fallbackSchema: Chat,
  });

  static async get(chatId: ChatRef): Promise<Chat> {
    return this.api.requestHTTP({
      method: 'GET',
      endpoint: `/${chatId}`,
      operation_id: 'ChatV2Get',
    }).then(res => res.body.parsed);
  }

  static async get_mine(): Promise<Chat[]> {
    return this.api.requestHTTP({
      method: 'GET',
      endpoint: `/mine`,
      operation_id: 'ChatV2GetMine',
      schema: v.array(ChatRefV),
    }).then(({ body }) => {
      const myChatIds = body.parsed;
      return Promise.all(myChatIds.map(id => this.get(id)));
    });
  }

  /**
   * Get chat history messages
   * @param chatId The chat ID
   * @param start Starting position (optional, default 0)
   * @param offset Number of messages to fetch (optional, default 6, max 30)
   * @param desc Whether to sort in descending order (optional, default true)
   * @returns Array of Message objects
   */
  static async get_messages(
    chatId: ChatRef,
    start: number = 0,
    offset: number = 6,
    desc: boolean = true
  ): Promise<Message[]> {
    return this.api.requestHTTP({
      method: 'GET',
      endpoint: `/${chatId}/messages`,
      data: {
        start,
        offset: Math.min(offset, 30),
        desc,
      },
      operation_id: 'ChatV2GetHistory',
      schema: v.array(instance(Message)),
    }).then(res => res.body.parsed);
  }

  /**
   * Get PartnerRequest of this Chat
   */
  public getPartnerRequest(): Promise<PartnerRequest> {
    return Chat.api.requestHTTP({
      method: 'GET',
      endpoint: `/${this._id}/partner_request`,
      operation_id: 'ChatV2GetPR',
      schema: PartnerRequest,
    }).then(res => res.body.parsed);
  }

  /**
   * Get DM Chat
   */
  static getDMWith(accountId: string): Promise<Chat> {
    return this.api.requestHTTP({
      method: 'PUT',
      endpoint: `/direct_message/${accountId}`,
      operation_id: 'ChatV2PutDM',
    }).then(res => res.body.parsed);
  }
}
