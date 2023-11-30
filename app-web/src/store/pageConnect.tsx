import create from 'zustand';
import { PageConnect } from '../utils/enum';

interface Store {
    page: number,
    setPage: (page: number) => void
}

export const usePageConnectStore = create<Store>()((set) => ({
    page: PageConnect.Connect,
    setPage: page => set(state => {
        return { page }

    })
}))
