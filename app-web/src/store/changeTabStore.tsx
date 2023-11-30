import create from 'zustand';

interface Store {
    tab: number,
    isEdit: boolean,
    changeTab: (tab: number, isEdit?: boolean) => void,
}

export const useTabStore = create<Store>()((set) => ({
    tab: 0,
    isEdit: false,
    changeTab: (tab, isEdit = false) => set(state => ({ tab,isEdit })),
}))
