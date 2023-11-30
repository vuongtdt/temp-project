import { ITags } from 'components/Settings/Tags';
import create from 'zustand';

interface Store {
    tags: ITags[],
    setTags: (tags: ITags[]) => void
}

export const useTagsStore = create<Store>()((set) => ({
    tags: [],
    setTags: tags => set(state => ({ tags }))

}))
