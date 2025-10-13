import { defineStore } from "pinia";
import { ChatType, type Chat } from "@/business/communication/chat";
import type { ChatRef } from "@/business/communication";

export interface ChatState {
    my_chats: Chat[];
    chat_unreads: Record<ChatRef, number>;
}

export const useChatStore = defineStore('chat', {
    unistorage: true,
    state(): ChatState {
        return {
            my_chats: [],
            chat_unreads: {}
        };
    },

    getters: {
        getChatUnread: (state) => (chatId: ChatRef): number => {
            return state.chat_unreads[chatId] ?? 0;
        }
    },

    actions: {
        setMyChats(chats: Chat[]) {
            this.my_chats = chats;
        },
        addChat(chat: Chat) {
            this.my_chats.push(chat);
        },
        setChatUnreads(chatId: ChatRef, count: number) {
            this.chat_unreads[chatId] = count;
        },
        incrementUnread(chatId: ChatRef) {
            this.chat_unreads[chatId] = (this.chat_unreads[chatId] || 0) + 1;
        },
        resetUnread(chatId: ChatRef) {
            this.chat_unreads[chatId] = 0;
        }
    }
});
