import { Request, Response } from 'express'
import prisma from '../db/db'
import jwt from 'jsonwebtoken'
import { IUser, IUserAttributes } from '../types/types'

const secret = process.env.SECRET_KEY || ''

interface AuthMidReqType extends Request {
  headers: {
    authorization: string
  }
  user: undefined | IUserAttributes
}

const authMiddleware = async (
  req: AuthMidReqType,
  res: Response,
  next: Function,
) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      console.log('==authMiddleware==\n No token')
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const decoded = jwt.verify(token, secret) as { id: number }
    if (!decoded) {
      console.log('==authMiddleware==\n Invalid token')
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const userId = decoded.id;

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      console.log('==authMiddleware==\n Invalid token')
      return res.status(401).json({ message: 'Unauthorized' })
    }

    req.user = { ...user, password: '' }
    next()
  } catch (error) {
    console.log('==authMiddleware==\n', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export default authMiddleware
