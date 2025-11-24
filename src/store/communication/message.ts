// Notification/Message's Store Module

// store
import { defineStore } from "pinia";
import { useNotificationChatStore } from "./chat";
import { useAccountStore } from "../account";

// types
import type { Message, MessageContentType, MessageContentUnion } from "@/types/chat/message";
import type { V1ChatGetStateOfReadResponseBody } from "@/types/chat/response";

// constant
import { EVENT } from "@/data/enum";
import { V1ChatGetMessages, V1ChatGetNewMessages, V1ChatGetStateOfRead, V1ChatMessageRead } from "@/api/main/chat";
// import { V1ChatGetHistoryMessages } from "@/api/main/chat";



export interface NotificationMessageState {
    messages: {
        [key: number]: Message<MessageContentType>
    },
    /**
     * @abstract 历史消息列表
     * @description
     * 索引是chat_id, 值是该聊天的历史消息id列表
     * 
     * 就是该聊天拥有的所有消息，与是否已读无关
     */
    history_messages: {
        [key: number]: number[]
    },
    /**
     * @abstract 未读消息列表
     * @description
     * 索引是chat_id, 值是未读消息数量
     */
    unreads: {
        [key: number]: number
    }
}

export const useNotificationMessageStore = defineStore('notification/message', {

    unistorage: true,
    
    state(): NotificationMessageState {
        return {
            messages: {},
            history_messages: {},
            unreads: {}
        }
    },

    getters: {
        message: (state) => 
            <CT extends MessageContentType>(message_id: number, refresh: boolean = false): Message<CT> | null => {
            const data = state.messages[message_id] || null;
            if (!data && refresh) {
                V1ChatGetMessages([message_id], () => {});
            }
            return data;
        },
        /**
         * 
         * @returns number[] | null
         * \ null代表没有记录，应当从后端获取
         */
        unread: (state) => (chat_id: number) => {
            return state.unreads[chat_id] || null;
        },
        totalUnread: (state) => {
            return Object.values(state.unreads).reduce((acc, cur) => acc + cur, 0);
        },
        unreadList: (state) => {
            return state.unreads;
        },
        /**
         * @abstract 获取最新消息
         * @description
         * 最新消息就是historyMessages的第一个元素
         * 
         */
        lastMessage(state) { 
            return (chat_id: number): Message | null => {
                return this.lastMessageId(chat_id) ? this.message(this.lastMessageId(chat_id)!) : null;
            }
        },
        lastMessageId: (state) => (chat_id: number): number | null => {
            const history_messages = state.history_messages[chat_id];
            if (history_messages) {
                return history_messages[0];
            }
            else {
                return null;
            }
        },
        /**
         * @description
         * 累加型分页
         * 
         * @param page
         * 从0开始
         * 
         * @returns number[] | null
         * \ null代表没有记录，应当从后端获取
         */
        historyMessages: (state) => (chat_id: number, page: number = 0, page_size: number = 12, acc: boolean = true): number[] | null => {
            const history_messages = state.history_messages[chat_id];
            if (history_messages) {
                if (!acc) {
                    return history_messages.slice(page * page_size, (page+1) * page_size);
                }
                return history_messages.slice(0, (page+1) * page_size);
            }
            else {
                return null;
            }
        },
        /**
         * @abstract 获取聊天所有消息数量
         * @description
         * 包括子群聊的消息数量
         */
        totalMessageCount(state) {
            return (chat_id: number, acc: number = 0): number => {
                const history_messages = state.history_messages[chat_id];
                if (history_messages) {
                    const chat = useNotificationChatStore().chat(chat_id);
                    if (chat) {
                        for (const thread_id of chat.threads) {
                            acc = this.totalMessageCount(thread_id, acc);
                        }
                    }

                    return acc + history_messages.length;
                }
                else {
                    return acc;
                }
            }
        }
    },
    
    actions: {
        /**
         * @abstract 标记消息为已读
         * @description
         * 该message_id必然是已经缓存在messages列表中的 \
         * 所以可以获取到其所在的chat id
         * 
         * 1. 从对应chat的unread中移除
         * 2. 上报给后端
         */
        async read(message_id: number) {
            const my_id = useAccountStore().myId;
            if (my_id) {
                const message = this.messages[message_id];
                if (!message) return;

                if (message.viewed.includes(my_id)) return;

                // 更新unread
                const chat_id = message.chat;
                if (this.unreads[chat_id] > 0) {
                    this.unreads[chat_id] -= 1;
                }

                // 上报给后端
                V1ChatMessageRead(
                    message_id, 
                    () => {
                        // 更新viewed
                        message.viewed.push(my_id);
                    },
                    () => {
                        // rollback
                        if (this.unreads[chat_id] >= 0) {
                            this.unreads[chat_id] += 1;
                        }
                    }
                )
            }
        },
        /**
         * @abstract 未读消息处理器
         * @description
         * 未读的定义是用户没有阅读，判定标准是messageDisplay展示该消息；\
         * 未读不等于有新消息，新消息是本地历史消息列表中没有收取的消息
         * 
         * @param chat_id single模式下需要提供
         * 
         * @deprecated
         * 
         */
        async unreadHandler<MODE extends 'single' | 'all' = 'all'>(data: V1ChatGetStateOfReadResponseBody<MODE>, chat_id: number = 0, mode?: MODE) {
            const chat_ids = [];

            if (!mode) mode = 'all' as MODE;

            if (mode === 'all') {
                for (const list_type in data) {
                    const chat_id_read_state: Record<number, [number, number]> = data[list_type]; // [unread, read]
                    for (const chat_id_str in chat_id_read_state) {
                        const chat_id = parseInt(chat_id_str);
                        chat_ids.push(chat_id);

                        // if chat not exist in MyList locally, add to it
                        if (!useNotificationChatStore().isChatInMyList(chat_id)) {
                            useAccountStore().pushToChatList(chat_id, list_type);
                        }

                        this.unreadHandler(chat_id_read_state[chat_id], chat_id, 'single');
                    }
                }
            }
            else if (mode === 'single') {
                // set unreads
                this.unreads[chat_id] = data[0];

                if (this.unreads[chat_id] <= 0) return;

                // get new messages
                const total_messages_length = data[0] + data[1];
                const local_messages_length = this.totalMessageCount(chat_id);
                if (total_messages_length > local_messages_length) {
                    // there's new messages
                    // BACKEND get new messages
                    this.loadNewMessages(chat_id);

                    // process thread(sub chat)
                    // BACKEND get new messages (thread)
                    const chat = useNotificationChatStore().chat(chat_id, true);
                    if (chat) {
                        for (const thread_id of chat.threads) {
                            V1ChatGetStateOfRead(thread_id, ({data}) => {
                                this.unreadHandler<'single'>(data, thread_id, 'single');
                            })
                        }
                    }
                }
            }

            // EVENT:NEW_MESSAGE
            uni.$emit(EVENT.NEW_MESSAGE, chat_ids);
        },
        /**
         * @abstract 更新消息数据
         * @description
         * 不存在会创建
         */
        async upsertMessage<ContentType extends MessageContentType>(message: Message<ContentType>) {
            this.messages[message._id] = message;
        },
        /**
         * @abstract 更新消息内容(MessageContent)数据
         * @description
         * 不存在不会创建，将导致无法更新
         */
        async updateMessageContent<ContentType extends MessageContentType>(
            message_id: number, content: MessageContentUnion<ContentType>
        ) {
            const message = this.messages[message_id];
            if (!message) return;

            message.content = content;
        },
        /**
         * @abstract 更新历史消息列表
         * @description
         * 更新到列表中对应的位置（message_ids可能不完全满足页面大小）\
         * 列表头部是第0页，也就是最新数据
         */
        async upsertHistoryMessages(chat_id: number, message_ids: number[], page: number, page_size: number) {
            if (!this.history_messages[chat_id]) {
                this.history_messages[chat_id] = [];
            }

            const history_messages = this.history_messages[chat_id];
            const start = page * page_size;
            const end = (page + 1) * page_size;
            history_messages.splice(start, 0, ...message_ids);
            // might be bug here
        },
        loadNewMessages(chat_id: number) {
            const last_message_id = this.lastMessageId(chat_id) || 0;
            V1ChatGetNewMessages(
                chat_id, last_message_id,
                ({data}) => {
                    // load messages
                    V1ChatGetMessages(
                        data, () => {
                            // upsert history messages to local
                            this.upsertHistoryMessages(chat_id, data, 0, data.length);
                        }
                    );
                },
                () => {}
            );
        }
    }

});
