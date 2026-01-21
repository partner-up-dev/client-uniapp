import * as v from "valibot";
import { V, nullable } from "../index";
import { useAccountStore } from "@/store/account";
import store from "@/store";
import { AccountRefV } from "../account";
import { HTTPApiClient } from "../http-api";
import { DBApiClient } from "../db-api";
import { useTranslate } from "@/locale";
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

  /**
   * 获取消息内容（文本标识）
   */
  get contentAsText(): string {
    if (this.type === MessageType.Plain) {
      return this.content as string;
    }
    return `[${this.type}]消息，点击查看`;
  }

  // API client for Message-related endpoints
  static mainClient = new HTTPApiClient({
    modulePrefix: '/chat',
    dt: useTranslate('chat.message').dt,
    fallbackSchema: Message,
  });

  static dbClient = new DBApiClient({
    tableName: 'message',
    schema: 'communication',
    tableSchema: Message,
  });

  static async get(id: MessageRef): Promise<Message> {
    return this.dbClient
      .select('*')
      .eq('_id', id)
      .single()
      .then(({ data }) => Message.parse(data.parsed));
  }

  /**
   * Send a plain text message to a chat
   * @param chatId The target chat ID
   * @param content The message content (1-120 characters)
   * @returns The created Message instance
   */
  static async send(chatId: number, content: string): Promise<Message> {
    return this.mainClient.request({
      method: 'POST',
      endpoint: `/message/plain?to_chat=${chatId}`,
      data: content,
      operation_id: 'ChatV2SendMessage',
      schema: Message,
    }).then(res => res.body.parsed);
  }
}

export type PlainMessageContent = string;
export const PlainMessageContentV = v.string();
