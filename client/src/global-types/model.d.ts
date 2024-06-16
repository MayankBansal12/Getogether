interface UserType {
  id: number
  name: string
  email: string
  password: string
  phone: string
  about: string
  profilePic: string
  PicName: string
  role?: string
  participantId?: number
}

interface BudgetType {
  id: number
  eventId: number
  totalAmount: number
  spent: number
}

type NameType = {
  name: string
}
interface PaymentType {
  id: number,
  amount: number,
  date: Date,
  payerId: number,
  payeeId: number,
  eventId: number,
  status: number,
  Payer: NameType,
  Payee: NameType,
}

interface EventTableType {
  id: number,
  tableId: number,
  eventId: number,
  total_row: number,
  total_col: number,
  table_size: number,
  SingleTable: []
}

interface EventType {
  id: number
  name: string
  desc: string
  image: string
  date: Date
  bookTable: boolean
  hostId: number,
  EventParticipant: EventParticipantType[]
  Photo: []
  Vendor: []
  Budget?: BudgetType | null
  EventTable?: EventTableType | null
  Channel: ChannelType[]
  ChatParticipant: []
  Chat: []
}

interface EventParticipantType {
  id: number
  eventId: number
  userId: number
  createdDate: Date
  role: string
  status: number
  Event: EventType
  User: UserType
  ChatParticipant: []
  ChannelParticipant: []
  PhotoParticipant: []
}

interface ChannelType {
  id: number
  eventId: number
  name: string
  venue: string
  desc: string
  startTime: Date
  endTime: Date
  Event: EventType
  ChannelService: []
  GroupRelation: GroupRelationType[]
  ChannelParticipant: []
}

interface GroupRelationType {
  id: number
  groupId: number
  channelId: number
  Group: GroupType
}


interface GroupType {
  id: number
  name: string
  desc: string
  eventId: number
  GroupRelation: GroupRelationType[]
  GroupMessage: GroupMessageType[]
}

interface GroupMessageType {
  id: number
  groupId: number
  senderId: number
  senderName: string
  senderAvatar: string
  message: string
  time: Date
  photos: string
  Group: IGroup
  SenderChannelParticipant: ChannelParticipantType
}

interface ChannelParticipantType {
  id: number
  participantId: number
  channelId: number
  Channel: ChannelType
  EventParticipant: EventParticipantType
}

export { UserType, EventType, ChannelType, BudgetType, PaymentType, GroupRelationType, GroupType, GroupMessageType, ChannelParticipantType }
