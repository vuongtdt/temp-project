import create from 'zustand';

interface Store {
    userId: string,
    changeUserId: (userId: string) => void
}

export const useUserIdStore = create<Store>()((set) => ({
    userId: '',
    changeUserId: userId => set(state => ({ userId }))
}))
