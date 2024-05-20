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
import authRouter from './routes/auth-router'

app.use('/user', userRouter)
app.use('/event', eventRouter)
app.use('/group', groupRouter)
app.use('/channel', channelRouter)
app.use('/auth', authRouter)

// Todo - Setting up socket server for connection

// Routes
app.get('/', (req, res) => {
  res.send('Server running fine')
})

app.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}/`)
})
