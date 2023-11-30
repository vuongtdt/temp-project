export interface ItemModel {
    id: number,
    code: string,
    categories: number[],
    name: string,
    imageUrl: string,
    width: number,
    height: number,
    length: number,
    weight: number,
    isUsed: true,
    originalPrice: number,
    retailPrice: number,
    wholeSalePrice: number,
    inventoryLocation: string,
    shopLocationIds: [],
    sizes: string[],
    colors: string[],
    attribute01Type: number,
    attribute01Name: string,
    attribute01Values: string[],
    attribute02Type: number,
    attribute02Name: string,
    attribute02Values: string[],
    attribute03Type: number,
    attribute03Name: string,
    attribute03Values: [],
    parentId: number,
    quantity: number,
    child: [],
    createdDate: Date,
    createdBy: number,
    modifiedDate: Date,
    modifiedBy: number
}
export interface ShowActionModel {
    isShowConfirm: boolean,
    isShowCancel: boolean,
    isShowReCreate: boolean,
    isShowEdit: boolean,
    isShowMore: boolean
}
export interface OrderModel {
    id?: number,
    shopCode?: string,
    shopLocationAddress?: string,
    shopLocationProvinceId?: number,
    shopLocationDistrictId?: number,
    phoneNumber?: string,
    fullName?: string,
    email?: string,
    address: string,
    provinceId?: number,
    districtId?: number,
    wardId?: number,
    addressLevel4Id?: number,
    contentNote?: string,
    collectMoney?: number,
    weight?: number,
    weightConverted?: number,
    isMoneyCollection?: false,
    isShowItem?: true,
    isCustomerPaid?: false,
    deliveryAmount?: number,
    totalTakenCustomerAmount?: number,
    totalPaidShopAmount?: number,
    statusId?: number,
    paidStatusId?: number,
    codStatusId?: number,
    year?: number,
    month?: number,
    insurranceAmount?: number,
    insurranceFee?: number,
    isChoosing?: false,
    isDeliveryOwner?: false,
    paidAmount?: number,
    wardName?: string,
    shopLocationName?: string,
    shopLocationPhoneNumber?: string,
    shopLocationWardName?: string,
    shopLocationDistrictName?: string,
    shopLocationProvinceName?: string,
    voucherCode?: string,
    voucherData: {},
    deliveryStatus?: number,
    items?: ItemModel[],
    shopAdvancePaymentAmount?: number,
    codFeeAmount?: number,
    incurredCosts?: [],
    collectArrears?: [],
    deliveryOwner?: number,
    type?: number,
    hashtags?: [],
    typeShowItem?: number,
    note?: string,
    shopLocationId: number,
    provinceName?: string,
    districtName?: string,
    noteShowItem?: string,
    partnerDeliveryId?: number,
    partnerDeliveryName?: string,
    createdDate: string,
    createdBy: number,
    modifiedDate: string,
    modifiedBy: number,
    deliveryCode?: string,
    width?: number,
    height?: number,
    length?: number,
    totalIncurredCost?: number,
    code?: string,
    showAction?: ShowActionModel,
}

