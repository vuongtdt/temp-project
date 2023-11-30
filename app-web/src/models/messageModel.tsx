export interface ConversationModel {
    id: string,
    baseUserId: string,
    userId: string,
    sentTo: {
        picture: string,
        userName: string,
        userEmail: string,
        userId: string,
        phoneNumber: string,
        address: string
    },
    lastMessage: string,
    lastUserResponseTime: string,
    conversationUpdatedTime: string,
    conversationLink: string,
    hasRead: boolean,
    hasReplied: boolean,
    isBlocked: boolean,
    hasOrder: boolean,
    go24OrderIds: string[],
    tags: [
        {
            tagName: string,
            colorCode: string
        }
    ],
    isRemoveTags?: boolean,
    userAddresses: IInfo[]
}
export interface IInfo {
    id?: string;
    fullName: string;
    phoneNumber: string;
    addressTitle?: string;
    addressDetail: string;
    isDefault: boolean;
    isTemp?: boolean;
}
export interface TempInfo {
    id?: string;
    fullName: string;
    phoneNumber: string;
    addressTitle?: string;
    addressDetail: string;
    province: string;
    district: string;
    wards: string;
    buiddingOrStreet: string;
    isDefault: boolean;
    isTemp?: boolean;
}
export interface MessageModel {
    baseUserId: string,
    userId: string,
    messageCreatedTime: string,
    sentFrom: {
        picture: string,
        userName: string,
        userEmail: string,
        userId: string,
    },
    messageId?: string,
    messageContent: string,
    messageFileUrl?: string,
    messageFileType?: string,
    isLoading?: boolean,
    tempId?: string,
    isSuccess?: boolean,
    isExpried?: boolean
}
export interface ConversationUpdate {
    hasRead?: boolean,
    isBlocked?: boolean,
    go24OrderId?: string,
    userTags?: [
        {
            tagName: string,
            colorCode: string
        }
    ]
}

export interface FilterConversation {
    hasRead?: boolean,
    hasReplied?: boolean,
    hasTags?: boolean,
    hasOrder?: boolean,
    searchText?: string,
    userId: string[],
}