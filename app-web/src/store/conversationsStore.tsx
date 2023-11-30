import create from 'zustand';
import { ConversationModel, FilterConversation } from '../models/messageModel';

interface Store {
    conversations: ConversationModel[],
    setConversations: (conversations: ConversationModel[]) => void,
    changeConversations: (conversations: ConversationModel[]) => void,
    unMountConversations: () => void,
    filter: FilterConversation,
    changeFilter: (filter: FilterConversation) => void,
}

export const useConversationsStore = create<Store>()((set) => ({
    conversations: [],
    setConversations: conversations => set(state => {
        return { conversations: state.conversations.concat(conversations) }
    }),
    changeConversations: conversations => set(state => ({ conversations })),
    unMountConversations: () => set(state => ({ conversations: [] })),
    filter: {
        hasRead: null,
        hasReplied: null,
        hasTags: null,
        hasOrder: null,
        searchText: '',
        userId: [],
    } as FilterConversation,
    changeFilter: filter => set(state => ({ filter })),
}))
