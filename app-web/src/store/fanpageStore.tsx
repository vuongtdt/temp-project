import create from 'zustand';
import { FanpageModel } from '../models/fanpageModels';

interface Store {
    fanpage: FanpageModel,
    setFanpage: (fanpage: FanpageModel) => void
}

export const useFanpageStore = create<Store>()((set) => ({
    fanpage: {} as FanpageModel,
    setFanpage: fanpage => set(state => ({ fanpage }))
}))
