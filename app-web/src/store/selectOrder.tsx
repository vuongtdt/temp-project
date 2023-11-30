import { OrderModel } from 'models/orderModel';
import create from 'zustand';

interface Store {
    order: OrderModel,
    setOrder: (order: OrderModel) => void
}

export const useSelectOrder = create<Store>()((set) => ({
    order: {} as OrderModel,
    setOrder: order => set(setOrder => ({ order }))

}))
