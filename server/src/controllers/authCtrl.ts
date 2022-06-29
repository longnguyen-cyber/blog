import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import {
  generateActiveToken,
  generateAccessToken,
  generateRefreshToken
} from './../config/generateToken'
import sendEmail from '../config/sendMail'
import Users from '../models/User'
import { validPhone, validateEmail } from '../middlewares/valid'
import { sendSms, smsOTP, smsVerify } from '../config/sendSMS'
import {
  IDecodedToken,
  IGgPayload,
  IReqAuth,
  IUser,
  IUserParams
} from '../config/interface'
import { OAuth2Client } from 'google-auth-library'
import fetch from 'node-fetch'
import User from '../models/User'

const client = new OAuth2Client(`${process.env.MAIL_CLIENT_ID}`)
const CLIENT_URL = `${process.env.BASE_URL}`

const authCrtl = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, account, password } = req.body

      const user = await Users.findOne({ account })
      if (user)
        return res
          .status(400)
          .json({ msg: 'Email or phone number is already taken' })

      const hashPassword = await bcrypt.hash(password, 12)

      const newUser = {
        name,
        account,
        password: hashPassword
      }
      const access_token = generateActiveToken({ newUser })

      const url = `${CLIENT_URL}/active/${access_token}`

      if (validateEmail(account)) {
        sendEmail(account, url, 'Verify your email')
        return res.status(200).json({
          msg: 'Register success Please check your email'
        })
      } else if (validPhone(account)) {
        sendSms(account, url, 'Verify your phone number')
        return res.status(200).json({
          msg: 'Register success Please check your phone number'
        })
      }
    } catch (err: any) {
      return res.status(500).json({ mgs: err.message })
    }
  },

  activeAccount: async (req: Request, res: Response) => {
    try {
      const { active_token } = req.body
      const decoded = <IDecodedToken>(
        jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)
      )
      const { newUser } = decoded
      if (!newUser)
        return res.status(400).json({ msg: 'Invalid authentication' })

      const user = await Users.findOne({ account: newUser.account })

      if (user) return res.status(400).json({ msg: 'Account already exists.' })

      const new_user = new Users(newUser)

      await new_user.save()
      res.json({ msg: 'Active account success' })
    } catch (error: any) {
      return res.status(500).json({ mgs: error.message })
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { account, password } = req.body

      const user = await Users.findOne({ account })
      if (!user)
        return res.status(400).json({ msg: 'This Account does not exist.' })

      loginUser(user, password, res)
    } catch (error: any) {
      return res.status(500).json({ mgs: error.message })
    }
  },
  logout: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: 'Invalid Authentication.' })

    try {
      res.clearCookie('refreshtoken', { path: `/api/refresh_token` })

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          rf_token: ''
        }
      )

      return res.json({ msg: 'Logged out!' })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    try {
      const rf_token = req.cookies.refreshtoken
      if (!rf_token) return res.status(400).json({ msg: 'Please login now!' })

      const decoded = <IDecodedToken>(
        jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)
      )
      if (!decoded.id) return res.status(400).json({ msg: 'Please login now!' })

      const user = await Users.findById(decoded.id).select(
        '-password +rf_token'
      )
      if (!user)
        return res.status(400).json({ msg: 'This account does not exist.' })

      if (rf_token !== user.rf_token)
        return res.status(400).json({ msg: 'Please login now!' })

      const access_token = generateAccessToken({ id: user._id })
      const refresh_token = generateRefreshToken({ id: user._id }, res)

      await Users.findOneAndUpdate(
        { _id: user._id },
        {
          rf_token: refresh_token
        }
      )

      res.json({ access_token, user })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  googleLogin: async (req: Request, res: Response) => {
    try {
      const { id_token } = req.body
      const verify = await client.verifyIdToken({
        idToken: id_token,
        audience: `${process.env.MAIL_CLIENT_ID}`
      })

      const { email, email_verified, name, picture } = <IGgPayload>(
        verify.getPayload()
      )

      if (!email_verified)
        return res.status(400).json({ msg: 'Email verification failed.' })
      const password = email + 'your gg sercret password'
      const password_hash = await bcrypt.hash(password, 12)

      const user = await Users.findOne({ account: email })
      if (user) {
        loginUser(user, password, res)
      } else {
        const user = {
          name,
          account: email,
          password: password_hash,
          avatar: picture,
          type: 'google'
        }
        registerUser(user, res)
      }
    } catch (error: any) {
      return res.status(500).json({ mgs: error.message })
    }
  },
  facebookLogin: async (req: Request, res: Response) => {
    try {
      const { accessToken, userID } = req.body
      const URL = `https://graph.facebook.com/v3.0/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`

      const data = await fetch(URL)
        .then((res) => res.json())
        .then((res) => {
          return res
        })
      const { email, name, picture } = data
      const password = email + 'your fb sercret password'
      const password_hash = await bcrypt.hash(password, 12)

      const user = await Users.findOne({ account: email })
      if (user) {
        loginUser(user, password, res)
      } else {
        const user = {
          name,
          account: email,
          password: password_hash,
          avatar: picture.data.url,
          type: 'facebook'
        }
        registerUser(user, res)
      }
    } catch (error: any) {
      return res.status(500).json({ mgs: error.message })
    }
  },
  loginSMS: async (req: Request, res: Response) => {
    try {
      const { phone } = req.body
      const data = await smsOTP(phone, 'sms')
      res.json(data)
    } catch (error: any) {
      return res.status(500).json({ mgs: error.message })
    }
  },
  smsVerify: async (req: Request, res: Response) => {
    try {
      const { phone, code } = req.body
      const data = await smsVerify(phone, code)
      if (!data?.valid) return res.status(400).json({ msg: 'Invalid code' })
      const password = phone + 'your fb sercret password'
      const password_hash = await bcrypt.hash(password, 12)

      const user = await Users.findOne({ account: phone })
      if (user) {
        loginUser(user, password, res)
      } else {
        const user = {
          name: phone,
          account: phone,
          password: password_hash,
          type: 'sms'
        }
        registerUser(user, res)
      }
      res.json(data)
    } catch (error: any) {
      return res.status(500).json({ mgs: error.message })
    }
  },
  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { account } = req.body

      const user = await Users.findOne({ account })

      if (!user)
        return res.status(400).json({ msg: 'This account does not exists.' })

      if (user.type !== 'register')
        return res.status(400).json({
          msg: `Quick login account with ${user.type} can't use this function`
        })

      const access_token = generateAccessToken({ id: user._id })

      const url = `${CLIENT_URL}/reset_password/${access_token}`

      if (validPhone(account)) {
        sendSms(account, url, 'Forget password?')
        return res.json({ msg: 'Success please check your phone.' })
      } else if (validateEmail(account)) {
        sendEmail(account, url, 'Forget password?')
        return res.json({ msg: 'please check your email' })
      }
    } catch (error: any) {
      return res.status(500).json({ msg: error.message })
    }
  }
}
const loginUser = async (user: IUser, password: string, res: Response) => {
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    let msgError =
      user.type === 'register'
        ? 'Invalid password'
        : `Invalid password. This account login with ${user.type}`
    return res.status(400).json({ msg: msgError })
  }

  const access_token = generateAccessToken({ id: user._id })
  const refresh_token = generateRefreshToken({ id: user._id }, res)

  await Users.findOneAndUpdate(
    { _id: user._id },
    {
      rf_token: refresh_token
    }
  )

  res.json({
    msg: 'Login success',
    access_token,
    user: { ...user._doc, password: '' }
  })
}
const registerUser = async (user: IUserParams, res: Response) => {
  const newUser = new Users(user)

  const access_token = generateAccessToken({ id: newUser._id })
  const refresh_token = generateRefreshToken({ id: newUser._id }, res)

  newUser.rf_token = refresh_token
  await newUser.save()

  res.json({
    msg: 'Login success',
    access_token,
    user: { ...newUser._doc, password: '' }
  })
}
export default authCrtl
