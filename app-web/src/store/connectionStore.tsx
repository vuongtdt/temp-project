import create from 'zustand';


interface Store {
    connection: any,
    setConnection: (connection: any) => void
}

export const useConnectionStore = create<Store>()((set) => ({
    connection: null,
    setConnection: connection => set(state => ({connection}))
}))
