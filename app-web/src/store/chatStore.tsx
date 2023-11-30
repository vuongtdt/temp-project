import create from 'zustand';
import { ThemesModel } from '../models/themesModel'
import { LightTheme } from '../themes/LightTheme'

interface Store {
    theme: ThemesModel,
    changeTheme: (theme: ThemesModel) => void
}

export const useChatStore = create<Store>()((set) => ({
    theme: LightTheme,
    changeTheme: theme => set(state => ({theme}))
}))
