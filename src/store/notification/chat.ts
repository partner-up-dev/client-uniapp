// Notification/Chat's Store Module

// store
import { defineStore } from "pinia";
import { useNotificationMessageStore } from "./message";
import { useAccountStore } from "../account";

// types
import { ChatType, type Chat } from "@/types/chat";
import type { BarChatEntryDisplay, ChatDetail, ChatEntryDisplay, CircleChatEntryDisplay } from "@/types/chat/display";
import type { PartnerRequestType } from "@/types/partner_request";

// constant
import { DEFAULT_ACCOUNT_SIMPLE_DISPLAY, DEFAULT_CHAT_INFO, DEFAULT_MESSAGE_INFO } from "@/data/default_data";

// utils
import { deepcopy } from "@/utils";
import { messageContentToString } from "@/utils/chat";
import i18n from "@/locale";

// api
import { V1ChatGet } from "@/api/main/chat";
import { SupportedV1ChatGetUsage } from "@/types/chat/request";
import { usePartnerRequestStore } from "../partner_request";
import { useAccountProfileStore } from "../account/profile";


export type LocalStoredChatInfo = Chat & {partner_reqeust_type?: PartnerRequestType | null}

export interface NotificationChatState {
    chats: {
        [key: number]: LocalStoredChatInfo
    },
};


export const useNotificationChatStore = defineStore('notification/chat', {

    unistorage: true,
    state(): NotificationChatState {
        return {
            chats: {}
        }
    },

    getters: {
        /**
         * 
         * @param refresh
         * 指定即可刷新，稍后再获取则是新值
         */
        chat: (state: NotificationChatState) => (chat_id: number, refresh: boolean = false): LocalStoredChatInfo | null => {
            const chat = state.chats[chat_id];
            if (refresh) V1ChatGet(chat_id, SupportedV1ChatGetUsage.Raw, () => {});
            return chat || null;
        },
        /**
         * @abstract 获取聊天的circleChatEntryDisplay
         * @description
         * unread相关数据从NotificationMessage中获取
         * 
         * 如果类型为DirectMessage，需要set_default出avatar, title
         * 
         */
        circleEntry: (state: NotificationChatState) => (chat_id: number): CircleChatEntryDisplay | null => {
            const chat = state.chats[chat_id];
            if (!chat) return null;

            let title = chat.title || '';
            let avatar = chat.avatar || '';
            if (!title || !avatar) {
                if (chat.members.length > 1) {
                    const to_account_id = chat.members.find(member => member !== useAccountStore().myId);
                    if (to_account_id) {
                        const to_account_simple_display = useAccountProfileStore().accountSimpleDisplay(to_account_id) || DEFAULT_ACCOUNT_SIMPLE_DISPLAY;
                        title = to_account_simple_display.nickname || i18n.global.t('chat.title.direct_messsage');
                        avatar = to_account_simple_display.avatar || '';
                    }
                }
            }

            return {
                _id: chat._id,
                type: chat.type,
                title,
                avatar,
                unread: useNotificationMessageStore().unread(chat_id) || 0,
            };
        },
        /**
         * 
         * @abstract 获取聊天的barChatEntryDisplay
         * @description
         * 如果是PartnerRequest类型，需要获取partner_request_type \
         * 如果有partner_request_type字段缓存，则直接使用，否则通过partner_request获取
         * 
         * 仅用作展示，不要直接修改这里面的数据！
         * 
         */
        barEntry: (state: NotificationChatState) => (chat_id: number): BarChatEntryDisplay | null => {
            const chat = state.chats[chat_id];
            if (!chat) return null;

            // [last_message]
            const last_message = useNotificationMessageStore().lastMessage(chat_id) || DEFAULT_MESSAGE_INFO;

            // [partner_request_type]
            let partner_request_type: PartnerRequestType | null = null;
            if (chat.type === ChatType.PartnerRequest) {
                partner_request_type = chat.partner_reqeust_type || null;
                if (!partner_request_type) {
                    if (chat.partner_request) {
                        const partner_request_types = usePartnerRequestStore().partnerRequestType(chat.partner_request);
                        if (partner_request_types) {
                            partner_request_type = partner_request_types[0];
                            chat.partner_reqeust_type = partner_request_type;
                        }
                    } 
                }
            }

            return {
                _id: chat._id,
                type: chat.type,
                title: chat.title || '',
                avatar: chat.avatar,
                partner_request_type,
                unread: useNotificationMessageStore().unread(chat_id) || 0, 
                last_message: messageContentToString(last_message),  // TODO from NotificationMessage
                last_message_at: last_message.created_at,  // TODO from NotificationMessage
                
            }
        },
        /**
         * @abstract 判断该聊天是否在当前账号聊天列表中
         * @description
         * 在DM或者PR Chats中都被判定为存在
         */
        isChatInMyList: (state) => (chat_id: number) => {
            return useAccountStore().myDMChats.includes(chat_id) || useAccountStore().myPRChats.includes(chat_id);
        }
    },

    actions: {
        async upsertChat(chat: Chat) {
            this.chats[chat._id] = {
                ...this.chats[chat._id],
                ...chat
            };
        },
        async upsertChatFromDetail(chat: ChatDetail) {
            throw new Error("Method not implemented.");
        },
        /**
         * @abstract 通过ChatEntryDisplay更新Chat
         * @description
         * 不会更新unread，这由NotificationMessage管理，如果进行干涉，可能导致数据错误
         */
        async upsertChatFromEntryDisplay(display: ChatEntryDisplay) {
            const chat = this.chats[display._id] || deepcopy(DEFAULT_CHAT_INFO);

            chat._id = display._id;
            chat.type = display.type;
            chat.title = display.title;
            chat.avatar = display.avatar;
            
            this.upsertChat(chat);
        },
        /**
         * @description
         * 因为barChatEntryDisplay可能有特殊属性，需要单独处理
         * 
         * 如果类型是PartnerRequest，则保存partner_request_type属性
         */
        async upsertChatFromBarEntryDisplay(display: BarChatEntryDisplay) {
            await this.upsertChatFromEntryDisplay(display);
            const chat = this.chat(display._id);
            if (chat) {
                if (chat.type === ChatType.PartnerRequest) {
                    chat.partner_reqeust_type = display.partner_request_type;
                }
            }
        }
    }

})
