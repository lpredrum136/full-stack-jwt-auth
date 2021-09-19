import { Request, Response } from 'express'
import { UserAuthPayload } from './UserAuthPayload'

export type Context = {
  req: Request
  res: Response
  user: UserAuthPayload
}
