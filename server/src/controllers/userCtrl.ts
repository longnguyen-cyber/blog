import { Response, Request } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { IReqAuth } from '../config/interface'
import User from '../models/User'
import bcrypt from 'bcrypt'
const client = new OAuth2Client(`${process.env.MAIL_CLIENT_ID}`)
const CLIENT_URL = `${process.env.BASE_URL}`

const userCtrl = {
  updateUser: async (req: IReqAuth, res: Response) => {
    if (!req.user) return res.status(400).json({ msg: 'User does not exists.' })
    try {
      const { name, avatar } = req.body
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { name, avatar },
        { new: true }
      )
      res.json({ msg: 'updateUser' })
    } catch (error: any) {
      return res.status(500).json({ mgs: error.message })
    }
  },
  resetPassword: async (req: IReqAuth, res: Response) => {
    if (!req.user) return res.status(400).json({ msg: 'User does not exists.' })
    if (req.user.type !== 'register')
      return res.status(400).json({ msg: 'User does not exists.' })
    try {
      const { password } = req.body
      const passwordHash = await bcrypt.hash(password, 12)

      await User.findOneAndUpdate(
        { _id: req.user._id },
        { password: passwordHash },
        { new: true }
      )
      res.json({ msg: 'update password successfully' })
    } catch (error: any) {
      return res.status(500).json({ mgs: error.message })
    }
  },
  getUser: async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      const user = await User.findById(id).select('-password')

      res.status(200).json(user)
    } catch (error: any) {
      return res.status(500).json({ msg: error.message })
    }
  }
}

export default userCtrl
