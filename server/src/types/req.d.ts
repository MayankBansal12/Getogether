import { Request } from 'express'
import { IUserAttributes } from './types'

export interface AuthReqType extends Request {
  body: {
    token: string
  }
}

export interface UserReqType extends Request {
  user: IUserAttributes
}
