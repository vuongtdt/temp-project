import create from 'zustand';

interface Store {
    tabMenu: number,
    setTabMenu: (tabMenu: number) => void
}

export const useTabMenuStore = create<Store>()((set) => ({
    tabMenu: 1,
    setTabMenu: tabMenu => set(state => ({ tabMenu }))

}))
