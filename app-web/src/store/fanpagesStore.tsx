import create from 'zustand';
import { FanpageModel } from '../models/fanpageModels';

interface Store {
    fanpages: FanpageModel[],
    setFanpages: (fanpages: FanpageModel[]) => void
}

export const useFanpagesStore = create<Store>()((set) => ({
    fanpages: [] as FanpageModel[],
    setFanpages: fanpages => set(state => ({ fanpages }))
}))
