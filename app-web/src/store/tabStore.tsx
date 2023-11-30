import create from 'zustand';

interface Store {
    tab: number,
    setTab: (tab: number) => void
}

export const useTabStore = create<Store>()((set) => ({
    tab: 0,
    setTab: tab => set(state => ({ tab }))

}))
