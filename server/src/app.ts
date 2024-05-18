import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 5000

// Routes here
import eventRouter from './routes/event-router'
import groupRouter from './routes/group-router'
import channelRouter from './routes/channel-router'
import userRouter from './routes/user-router'

app.use('/user', userRouter)
app.use('/event', eventRouter)
app.use('/group', groupRouter)
app.use('/channel', channelRouter)

// Ye mai dummy likh raha, jab auth decide karlenge tab sahi wala likh lenge
app.post('/auth/me', (req, res) => {
  res.send({
    user: {
      id: 1,
      name: 'Mohit',
      email: 'random@gmail.com',
      phone: '1234567891',
      about: 'Hey there Im using whatsapp',
    },
  })
})

// Todo - Setting up socket server for connection

// Routes
app.get('/', (req, res) => {
  res.send('Server running fine')
})

app.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}/`)
})
