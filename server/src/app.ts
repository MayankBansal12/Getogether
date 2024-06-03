import dotenv from 'dotenv'
dotenv.config()
import express, { json } from 'express'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())
app.use(json({ limit: '50mb' }))

const PORT = process.env.PORT || 5000

// Routes here
import eventRouter from './routes/event-router'
import groupRouter from './routes/group-router'
import channelRouter from './routes/channel-router'
import userRouter from './routes/user-router'
import tableRouter from "./routes/table-router"
import authRouter from './routes/auth-router'
import imageRouter from './routes/photo-test-route'

app.use('/user', userRouter)
app.use('/event', eventRouter)
app.use('/group', groupRouter)
app.use('/channel', channelRouter)
app.use("/table", tableRouter)
app.use('/auth', authRouter)
app.use('/image', imageRouter)

// Routes
app.get('/', (req, res) => {
  res.send('Server running fine')
})

const server = app.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}/`)
})

// socket for messages
import { Server } from 'socket.io'
import prisma from './db/db'
import {
  JoinChannelPayload,
  SendMessagePayload,
  PersonalMessagePayLoad,
} from './types/types'
import UploadImg from './helper/upload-img'

const io = new Server(server, {
  pingTimeout: 120000,
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  // For personal messages
  // For connecting the dm with a user
  socket.on('join-dm', ({ roomId }) => {
    socket.join(roomId)
  })

  // Leave dm
  socket.on('leave-dm', ({ roomId }) => {
    socket.leave(roomId)
  })

  // For sending message
  socket.on(
    'personal-message',
    async ({
      eventId,
      senderId,
      receiverId,
      message,
      photoLink,
      roomId,
    }: PersonalMessagePayLoad) => {
      let imageUrl = ''
      if (photoLink) imageUrl = await UploadImg(photoLink)

      const newMessage = await prisma.chat.create({
        data: {
          eventId,
          senderId,
          receiverId,
          message,
          photos: imageUrl,
          time: new Date(),
        },
      })

      // emit message to the room
      io.to(roomId).emit('newDirectMessage', newMessage)
    },
  )

  // For group messages
  // Join group with a unique groupId
  socket.on('join-group', async ({ userId, groupId }: JoinChannelPayload) => {
    socket.join(groupId.toString())
  })

  // Leave group room
  socket.on('leave-group', ({ userId, groupId }) => {
    socket.leave(groupId.toString())
  })

  // Send messages in a group
  socket.on(
    'send-message',
    async ({ userId, userName, userAvatar, groupId, message, photoLink }: SendMessagePayload) => {
      let imageUrl = ''
      if (photoLink !== '') imageUrl = await UploadImg(photoLink)

      const newMessage = await prisma.groupMessage.create({
        data: {
          senderId: userId,
          groupId,
          message,
          senderName: userName,
          senderAvatar: userAvatar,
          photos: imageUrl,
        },
      })
      io.to(groupId.toString()).emit('message', newMessage)
    },
  )

  socket.on('disconnect', () => {
    console.log('User disconnected!')
  })
})
