import create from 'zustand';
import { setMessages } from '../translations';
import messages_vi from "../translations/locales/vi.json";

interface Store {
    language: any,
    locale: string,
    translate: (language: any,locale: string) => void,
}

export const useTranslateStore = create<Store>()((set) => ({
    language: messages_vi,
    locale: 'vi',
    translate: (language,locale) => set(state => {
        setMessages(language);
        return {
            language,
            locale
        }
    })
}))
