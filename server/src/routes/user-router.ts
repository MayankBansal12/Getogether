// Router for user -> /user
import { Router, Request, Response } from 'express'
import prisma from '../db/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const router = Router()

const SECRET_KEY = process.env.SECRET_KEY

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
      .json({ error: 'Internal server error!', message: error.message })
  }
})

// /user/signup -> User signup
router.post('/signup', async (req: Request, res: Response) => {
  const { name, email, phone, about, password } = req.body

  if (!email || !password || !name || !phone || !about) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    // Check if user already exists
    const userExist = await prisma.user.count({ where: { email } })
    if (userExist > 0) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        about,
        password: hashedPassword,
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
      .json({ error: 'Internal server error', message: error.message })
  }
})

// /user/event -> For fetching all events that user is part of
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

export default router
