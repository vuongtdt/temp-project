import create from 'zustand';

interface Store {
    tabSettings: number,
    setTabSettings: (tabSettings: number) => void
}

export const useTabSettingsStore = create<Store>()((set) => ({
    tabSettings: 0,
    setTabSettings: tabSettings => set(state => ({ tabSettings }))

}))
