import translate from "translations"

const types = [
  {
    value: 0,
    name: translate('orders.Tiêu chuẩn', 'Tiêu chuẩn')
  },
  {
    value: 1,
    name: translate('orders.Dễ vỡ', 'Dễ vỡ')
  },
  {
    value: 2,
    name: translate('orders.Giao hàng 1 phần', 'Giao hàng 1 phần')
  },
  {
    value: 7,
    name: translate('orders.Nông sản/thực phẩm khô', 'Nông sản/thực phẩm khô')
  }
]
const typeShowItem = [
  {
    value: 1,
    name: translate('orders.Không cho xem hàng', 'Không cho xem hàng')
  },
  {
    value: 2,
    name: translate('orders.Cho xem hàng không thử', 'Cho xem hàng không thử')
  },
  {
    value: 3,
    name: translate('orders.Cho thử hàng', 'Cho thử hàng')
  }
]
export { types, typeShowItem }