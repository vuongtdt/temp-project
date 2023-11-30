import { IInfo } from 'models/messageModel';
import create from 'zustand';

interface Store {
    infoSelect: IInfo,
    setInfoSelect: (infoSelect: IInfo) => void
}

export const useInfoSelectStore = create<Store>()((set) => ({
    infoSelect: null as IInfo,
    setInfoSelect: infoSelect => set(state => ({ infoSelect }))

}))
