// Router for user -> /user
import { Router, Request, Response } from 'express'
import prisma from '../db/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserReqType } from '../types/req'
import authMiddleware from '../middlewares/user-middleware'
import push from 'web-push'
import UploadImg from '../helper/upload-img'

const router = Router()

const SECRET_KEY = process.env.SECRET_KEY
const vapidKeys = {
  publicKey:
    'BCykaAlOtZwChaoyEILvMBUlaE3_aTj1opSk185cbvMa9EAwDyGS--ckZ_4HfLEYzB7hI-c1ZHiAYDlkDTpZKow',
  privateKey: process.env.FCM_PRIVATE_KEY,
}

push.setVapidDetails(
  'mailto:arghyadas242004@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey,
)

// /user/login -> User login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields not provided' })
  }

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { email },
    })

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY)

    res.json({ token })
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already in use!' })
    }
    res
      .status(500)
      .json({ message: 'Internal server error!', error: error.message })
  }
})

// /user/signup -> User signup
router.post('/signup', async (req: Request, res: Response) => {
  const { name, email, phone, about, password, image, imageName } = req.body

  if (
    !email ||
    !password ||
    !name ||
    !phone ||
    !about ||
    !image ||
    !imageName
  ) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    // Check if user already exists
    const userExist = await prisma.user.count({ where: { email } })
    if (userExist > 0) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const ImageUrl = await UploadImg(image)

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        about,
        password: hashedPassword,
        profilePic: ImageUrl,
        PicName: imageName,
      },
    })

    const token = jwt.sign({ userId: newUser.id }, SECRET_KEY)

    res.status(201).json({ message: 'User signed up successfully!', token })
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already in use' })
    }
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
})

// /user/:userId/event -> For fetching all events that user is part of
router.get('/:userId/event', async (req: Request, res: Response) => {
  const { userId } = req.params

  try {
    // Fetch all events where the user is a participant
    const userEvents = await prisma.event.findMany({
      where: {
        EventParticipant: {
          some: {
            userId: Number(userId),
          },
        },
      },
    })

    return res.status(200).json({
      message: 'Successfully fetched the events list!',
      events: userEvents,
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'An error occurred while fetching events!' })
  }
})

interface FCMReqType {
  body: {
    endpoint: string
    keys: {
      p256dh: string
      auth: string
    }
  }
}

// registering data /user/subscribe
router.post(
  '/subscribe',
  authMiddleware,
  async (req: UserReqType & FCMReqType, res: Response) => {
    const { endpoint, keys } = req.body
    if (!endpoint || !keys) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    try {
      await prisma.fCM.upsert({
        where: {
          userId: req.user.id,
        },
        create: {
          userId: req.user.id,
          auth: keys.auth,
          endPoint: endpoint,
          p256dh: keys.p256dh,
        },
        update: {
          auth: keys.auth,
          endPoint: endpoint,
          p256dh: keys.p256dh,
        },
      })
      res.status(201).json({ message: 'Successfully subscribed' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'An error occurred while subscribing' })
    }
  },
)

// dummy notification /user/notify
router.get(
  '/notify',
  authMiddleware,
  async (req: UserReqType, res: Response) => {
    try {
      const fcm = await prisma.fCM.findFirst({
        where: {
          userId: req.user.id,
        },
      })

      if (!fcm) {
        return res.status(400).json({ message: 'No subscription found' })
      }

      const notificationData = {
        title: 'Saari umra bhar joker',
        body: 'Tere picche ih zindagi circus ho gayi',
      }

      push.sendNotification(
        {
          endpoint: fcm.endPoint,
          expirationTime: null,
          keys: {
            auth: fcm.auth,
            p256dh: fcm.p256dh,
          },
        },
        JSON.stringify(notificationData),
      )
      res.status(200).json({ message: 'Notification sent successfully' })
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json({ message: 'An error occurred while sending notification' })
    }
  },
)

export default router
