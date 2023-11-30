export interface FanpageModel {
  userId: string,
  baseUserId: string,
  pageName: string,
  pagePictureUrl: string,
  status: number,
  isExpired: boolean,
  createdOn: Date,
  isPullingMessages: boolean,
  userTags: [
    {
      id: string,
      tagName: string,
      colorCode: string,
      isPiorty: boolean
    }
  ]
}
export interface ShopInfoModel {
  fullName: string,
  imageUrl: string,
  userName: string,
  userId: number,

}