import create from 'zustand';
import { MessageModel } from '../models/messageModel';


interface Store {
    message: MessageModel,
    selectMessage: (message: MessageModel) => void
}

export const useSelectMessageStore = create<Store>()((set) => ({
    message: {} as MessageModel,
    selectMessage: message => set(state => ({ message }))
}))
