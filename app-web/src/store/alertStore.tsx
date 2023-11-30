import create from 'zustand';

interface Store {
    isOpenAlert: boolean,
    alertText: string,
    type: 'success' | 'info' | 'warning' | 'error',
    setAlert: (alertText: string) => void
    setType: (type: 'success' | 'info' | 'warning' | 'error') => void
    setIsOpenAlert: (isOpenAlert: boolean) => void,
    vertical: 'bottom' | 'top',
    setVertical: (vertical: 'bottom' | 'top') => void
    horizontal: 'left' | 'center' | 'right',
    setHorizontal: (horizontal: 'left' | 'center' | 'right') => void

}

export const useAlertStore = create<Store>()((set) => ({
    isOpenAlert: false,
    alertText: '',
    type: 'warning',
    vertical: 'top',
    horizontal: 'left',
    setAlert: alertText => set(state => {
        return {
            alertText, 
            type: 'warning',
            vertical: 'top',
            horizontal: 'left',
        }
    }),
    setType: type => set(state => ({ type })),
    setIsOpenAlert: isOpenAlert => set(state => ({ isOpenAlert })),
    setVertical: vertical => set(state => ({ vertical })),
    setHorizontal: horizontal => set(state => ({ horizontal })),

}))
