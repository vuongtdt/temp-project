import create from 'zustand';
import { MessageModel } from '../models/messageModel';

interface Store {
    messages: Record<string, MessageModel>;
    totalMessage: number;
    setTotalMessage: (total: number) => void;
    setMessages: (messages: MessageModel[]) => void;
}

export const useMessageStore = create<Store>()((set) => ({
    messages: {},
    totalMessage: 0,
    setTotalMessage: total => set(state => {
        return {...state, totalMessage: total};
    }),
    setMessages: messages => set(state => {
        const messagesTemp: Record<string, MessageModel> = messages.reduce((acc,curr) => {
            acc[curr.messageCreatedTime] = curr;
            return acc;
        }, {} as Record<string, MessageModel>);
        return { ...state, messages: messagesTemp }
    }),
}))
