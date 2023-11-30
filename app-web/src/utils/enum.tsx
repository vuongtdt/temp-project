export enum TabInfo {
    Info,
    CreateOrder,
    Orders
}
export enum PageConnect {
    Connect,
    NotConnect
}
export enum Page {
    PageSize = 25,
}
export enum FilterConver {
    All = '',
    HasRead = 'hasRead',
    HasReplied = 'hasReplied',
    HasOrder = 'hasOrder',
    Together = 'userId',
}
export enum StatusUser {
    Active,
    Deactive,
}

export enum OrderStatus {
    ReimbursementDelivery = -3,
    Reimbursement = -2,
    Canceled = -1,
    WaitingConfirm = 0,
    WaitingTakeOrder = 1,
    Delivering = 2,
    Deliveried = 3,
    WaitingReturn = 4,
    Returned = 5,
    DeliveryFailed = 6,
    Incident = 7,
    PickedUp = 8,
    Transporting = 9,
    Stored = 10,
    PartiallyReturning = 11,
    PartiallyDelivered = 12,
    PartiallyReturned = 13,
}


export enum OrderStatusText {
    ReimbursementDelivery = "Bồi hoàn pvc",
    Reimbursement = "Bồi hoàn",
    Canceled = "Hủy",
    WaitingConfirm = "Chờ xác nhận",
    WaitingTakeOrder = "Chờ lấy hàng",
    Delivering = "Đang trên xe giao hàng",
    Deliveried = "Đã giao hàng",
    WaitingReturn = "Đơn chờ trả về",
    Returned = "Đơn đã trả về",
    DeliveryFailed = 'Không giao được hàng',
    Incident = 'Đang khiếu nại đền bù',
    PickedUp = 'Đã lấy hàng/ Nhập kho',
    Transporting = 'Đang trung chuyển',
    Stored = 'Đã nhập kho giao',
    PartiallyReturning = 'GH1P - chờ trả',
    PartiallyDelivered = 'Đã giao hàng 1 phần',
    PartiallyReturned = 'GH1P - đã trả',
}
export enum CODStatuses {
    None = 0,
    WaitingCOD = 1,
    Done = 2,
}

export enum CODStatusesText {
    None = "Không ứng tiền",
    WaitingCOD = "Chờ ứng tiền",
    Done = "Đã ứng tiền",
}
export enum OrderPaidStatuses {
    None = 0,
    NotPaid = 1,
    WaitingPaid = 2,
    Done = 3,
}

export enum OrderPaidStatusesText {
    None = "",
    NotPaid = "Chưa thu",
    WaitingPaid = "Chờ đối soát",
    Done = "Hoàn tất",
}
export enum DeliveryStatus {
    None = 0,
    DelayPickup = 1,
    DelayDelivery = 2,
    WeightChanged = 3,
    ReturnPartPackage = 4,
    RetryDelivery = 5,
    DeliveryFailed = 6,
    Delivering = 7,
    Delivered = 8,
}

export enum DeliveryStatusText {
    None = "",
    DelayPickup = "",
    DelayDelivery = "Delay Giao hàng",
    WeightChanged = "Delay Giao hàng",
    ReturnPartPackage = "Delay Giao hàng",
    RetryDelivery = "Delay Giao hàng > 2",
    DeliveryFailed = "Không giao được hàng",
    Delivering = "Đang trên xe giao hàng",
    Delivered = "Đã giao hàng",
}
export enum RequireOrder {
    ReDelivery = "re-delivery",
    Complain = "complain",
    Reschedule = "reschedule",
    Return = "return",
}
export enum TabSettings {
    General,
    Tags,
}
export enum FacebookAttachmentType {
    Image = 'image',
    Video = 'video',
    Audio = 'audio',
    File = 'file'
}
export enum PageName {
    Settings = 'Cài đặt',
    Messages = 'Tin nhắn'
}
