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
  createdAt: Date
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
  GroupRelation: []
  ChannelParticipant: []
}

export { UserType, EventType, ChannelType, BudgetType }
