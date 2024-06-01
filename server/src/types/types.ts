import { Request } from 'express'

interface SignupReqType extends Request {
  body: {
    email?: string
    password?: string
    name?: string
    phone?: string
    about?: string
    image?: string
    imageName?: string
  }
}
interface loginRequestType extends Request {
  body: {
    email: string
    password: string
  }
}
interface IUserAttributes {
  id: number
  name: string
  email: string
  password: string
  phone: string
  about: string
  profilePic: string
  PicName: string
  FaceEmbeddings?: Number[]
}

interface IUser extends IUserAttributes {
  Photographer?: IPhotographer | null
  EventParticipant?: IEventParticipant | null
  Vendor?: IVendor | null
  Payer: IPayment[]
  Payee: IPayment[]
}

interface IBudget {
  id: number
  eventId: number
  totalAmount: number
  spent: number
  Event: IEvent
}

interface IPhotographer {
  id: number
  userId: number
  Photo: IPhoto[]
  User: IUser
}

interface IPhoto {
  id: number
  photographerId: number
  eventId: number
  private: boolean
  photographer: IPhotographer
  Event: IEvent
}

interface IEvent {
  id: number
  name: string
  desc: string
  date: Date
  EventParticipant: IEventParticipant[]
  Photo: IPhoto[]
  Vendor: IVendor[]
  Budget?: IBudget | null
  Channel: IChannel[]
  ChatParticipant: IChatParticipant[]
  Chat: IChat[]
}

interface IChannel {
  id: number
  eventId: number
  name: string
  venue: string
  startTime: Date
  endTime: Date
  Event: Event
  ChannelService: IChannelService[]
  GroupRelation: IGroupRelation[]
  ChannelParticipant: IChannelParticipant[]
}

interface IChannelParticipant {
  id: number
  participantId: number
  channelId: number
  Channel: IChannel
  EventParticipant: IEventParticipant
  GroupMessage: IGroupMessage[]
}

interface IGroupRelation {
  id: number
  groupId: number
  channelId: number
  Group: IGroup
  Channel: IChannel
}

interface IGroup {
  id: number
  name: string
  desc: string
  eventId: number
  GroupRelation: IGroupRelation[]
  GroupMessage: IGroupMessage[]
}

interface IGroupMessage {
  id: number
  groupId: number
  senderId: number
  message: string
  photos: string
  Group: IGroup
  SenderChannelParticipant: IChannelParticipant
}

interface IChannelService {
  id: number
  channelId: number
  vendorId: number
  Vendor: IVendor
  Channel: IChannel
}

interface IEventParticipant {
  id: number
  eventId: number
  userId: number
  role: string
  status: number
  Event: IEvent
  User: IUser
  ChatParticipant?: IChatParticipant | null
  SendChat: IChat[]
  ReceivedChat: IChat[]
  ChannelParticipant: IChannelParticipant[]
}

interface IVendor {
  id: number
  userId: number
  eventId: number
  service: string
  Event: IEvent
  User: IUser
  ChannelService: IChannelService[]
}

interface IPayment {
  id: number
  amount: number
  date: number
  payerId: number
  payeeId: number
  eventId: number
  status: number
  Payer: IUser
  Payee: IUser
}

interface IChat {
  id: number
  eventId: number
  senderId: number
  receiverId: number
  message: string
  time: Date
  ChatParticipant: IChatParticipant[]
  Event: IEvent
  SenderEventParticipant: IEventParticipant
  ReceiverEventParticipant: IEventParticipant
}

interface IChatParticipant {
  id: number
  eventId: number
  participantId: number
  chatId: number
  Chat: IChat
  EventParticipant: IEventParticipant
  Event: IEvent
}

interface JoinChannelPayload {
  userId: number
  groupId: number
}

interface SendMessagePayload {
  userId: number
  groupId: number
  message: string
  photoLink: string
}
interface PersonalMessagePayLoad {
  eventId: number
  senderId: number
  receiverId: number
  message: string
  photoLink: string
  roomId: string
}

interface IFCMAttributes {
  userId: number
  endPoint: string
  p256dh: string
  auth: string
}

export {
  SignupReqType,
  loginRequestType,
  IUser,
  IUserAttributes,
  IBudget,
  IChannel,
  IChannelParticipant,
  IChannelService,
  IChat,
  IChatParticipant,
  IEvent,
  IEventParticipant,
  IGroup,
  IGroupMessage,
  IGroupRelation,
  IPayment,
  IPhoto,
  IPhotographer,
  IVendor,
  JoinChannelPayload,
  SendMessagePayload,
  PersonalMessagePayLoad,
  IFCMAttributes,
}
