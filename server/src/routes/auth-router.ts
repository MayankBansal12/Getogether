import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Request, Router } from 'express'
import { AuthReqType, UserReqType } from '../types/req'
import authMiddleware from '../middlewares/auth'
import prisma from '../db/db'

const router = Router()
const secret = process.env.SECRET || ''

interface SignupReqType extends Request {
  body: {
    email?: string
    password?: string
    name?: string
    phone?: string
    about?: string
  }
}
interface loginRequestType extends Request {
  body: {
    email: string
    password: string
  }
}

router.post('/signup', async (req: SignupReqType, res) => {
  try {
    const { email, password, name, phone, about } = req.body
    if (!email || !password || !name || !phone || !about) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check if user already exists
    const userExist = await prisma.user.count({ where: { email } })
    if (userExist > 0) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create user
    // 1. hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    // 2. save user to db
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        about,
      },
    })
    // 3. generate token
    const token = jwt.sign({ id: user.id }, secret)
    // 4. send response
    res.status(200).json({ token, message: 'Signup successful' })
  } catch (error) {
    console.log('==auth/signup==\n', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.post('/login', async (req: loginRequestType, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields not provided' })
    }

    const user = await prisma.user.findUnique({ where: { email: email } })
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid password' })
    }

    const token = jwt.sign({ id: user.id }, secret)
    res.status(201).json({ token })
  } catch (err) {
    console.log('==login==\n', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.post('/me', authMiddleware, async (req: UserReqType, res) => {
  try {
    res.status(200).json({ user: req.user })
  } catch (error) {
    console.log('==auth/me==\n', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
