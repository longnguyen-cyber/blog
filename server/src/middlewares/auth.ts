import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import { IDecodedToken, IReqAuth } from '../config/interface'
import User from '../models/User'

const auth = async (req: IReqAuth, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')
    if (!token) {
      return res.status(400).json({ msg: 'No token, authorization denied' })
    }
    const decoded = <IDecodedToken>(
      jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
    )

    if (!decoded) return res.status(400).json({ msg: 'Invalid token' })

    const user = await User.findOne({ _id: decoded.id }).select('-password')

    if (!user) return res.status(400).json({ msg: 'User does not exists.' })

    req.user = user

    next()
  } catch (error: any) {
    return res.status(500).json({
      msg: error.response.data.msg
    })
  }
}

export default auth
