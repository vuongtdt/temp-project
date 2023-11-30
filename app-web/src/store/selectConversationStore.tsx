import create from 'zustand';
import { ConversationModel } from '../models/messageModel';

interface Store {
    conversation: ConversationModel,
    countOrders: number,
    setConversation: (conversation: ConversationModel) => void,
    setCountOrders: (countOrders: number) => void,
}

export const useSelectConversationStore = create<Store>()((set) => {
    return {
        conversation: {} as ConversationModel,
        countOrders: 0,
        setConversation: conversation => set(state => ({ conversation})),
        setCountOrders: countOrders => set(state => ({ countOrders })),
    }
})
