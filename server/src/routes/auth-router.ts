import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Router } from 'express'
import { UserReqType } from '../types/req'
import authMiddleware from '../middlewares/user-middleware'
import prisma from '../db/db'
import { SignupReqType, loginRequestType } from '../types/types'

const router = Router()
const secret = process.env.SECRET || ''

router.post('/signup', async (req: SignupReqType, res) => {
  try {
    const { email, password, name, phone, about, image, imageName } = req.body
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

    // Check if user already exists
    const userExist = await prisma.user.count({ where: { email } })
    if (userExist > 0) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        about,
        profilePic: '',
        PicName: '',
      },
    })

    const token = jwt.sign({ id: user.id }, secret)

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
