import create from 'zustand';
import { setHeadersChatGo24 } from '../helper/setHeaders';


interface Store {
    token: string,
    setToken: (token: string) => void
}

export const setTokenStore = create<Store>()((set) => ({
    token: '',
    setToken: token => set(state => {
        setHeadersChatGo24(token);
        return { token }
    })
}))