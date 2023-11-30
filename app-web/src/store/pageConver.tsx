import create from 'zustand';

interface Store {
    pageIndexCon: number,
    setPageIndexCon: ( pageIndexCon: number) => void
}

export const pageConver = create<Store>()((set) => ({
    pageIndexCon: 1,
    setPageIndexCon: pageIndexCon => set(state => ({ pageIndexCon }))

}))
