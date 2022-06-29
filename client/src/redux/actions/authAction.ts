import { validPhone } from './../../utils/Valid'
import { Dispatch } from 'react'
import { postAPI, getAPI } from '../../utils/FetchData'
import { IUserLogin, IUserRegister } from '../../utils/types'
import { ALERT, IAlertType } from '../types/alertType'
import { AUTH, IAuthType } from '../types/authType'
import { validRegister } from '../../utils/Valid'
import { checkTokenExpire } from '../../utils/checkTokenExpire'

export const login =
  (userLogin: IUserLogin) =>
  async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })

      const res = await postAPI('login', userLogin)
      dispatch({
        type: AUTH,
        payload: res.data
      })
      dispatch({ type: ALERT, payload: { success: res.data.msg } })
      localStorage.setItem('logged', 'kuga')
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
export const googLeLogin =
  (id_token: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })

      const res = await postAPI('google_login', { id_token })

      dispatch({
        type: AUTH,
        payload: res.data
      })
      dispatch({ type: ALERT, payload: { success: res.data.msg } })
      localStorage.setItem('logged', 'kuga')
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
export const facebookLogin =
  (userID: string, accessToken: string) =>
  async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })

      const res = await postAPI('facebook_login', { userID, accessToken })
      dispatch({
        type: AUTH,
        payload: res.data
      })
      dispatch({ type: ALERT, payload: { success: res.data.msg } })
      localStorage.setItem('logged', 'kuga')
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
export const loginSMS =
  (phone: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const check = validPhone(phone)
    if (!check) {
      return dispatch({
        type: ALERT,
        payload: { errors: 'Phone number format is incorrect.' }
      })
    } else {
      try {
        dispatch({ type: ALERT, payload: { loading: true } })
        const res = await postAPI(`login_sms`, { phone })
        if (!res.data.valid) setTimeout(() => verifySMS(phone, dispatch), 5000)
      } catch (error: any) {
        dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
      }
    }
  }

export const register =
  (userRegister: IUserRegister) =>
  async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const check = validRegister(userRegister)
    if (check.errLength > 0)
      dispatch({ type: ALERT, payload: { errors: check.errMsg } })
    else {
      try {
        dispatch({ type: ALERT, payload: { loading: true } })
        const res = await postAPI('register', userRegister)
        dispatch({ type: ALERT, payload: { success: res.data.msg } })
      } catch (error: any) {
        dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
      }
    }
  }
export const refreshToken =
  () => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const logged = localStorage.getItem('logged')
    if (logged !== 'kuga') return

    try {
      dispatch({ type: ALERT, payload: { loading: true } })

      const res = await getAPI('refresh_token')

      dispatch({ type: AUTH, payload: res.data })

      dispatch({ type: ALERT, payload: {} })
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } })
      localStorage.removeItem('logged')
    }
  }

export const logout =
  (accessToken: string) =>
  async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const result = await checkTokenExpire(accessToken, dispatch)
    const access_token = result ? result : accessToken
    try {
      localStorage.removeItem('logged')
      dispatch({ type: ALERT, payload: {} })
      await getAPI('logout', access_token)
      window.location.href = '/'
      dispatch({ type: ALERT, payload: { success: 'Logout success' } })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }

export const verifySMS = async (
  phone: string,
  dispatch: Dispatch<IAuthType | IAlertType>
) => {
  const code = prompt('Enter your code')
  if (!code) return
  try {
    dispatch({ type: ALERT, payload: { loading: true } })

    const res = await postAPI(`sms_verify`, { phone, code })
    dispatch({ type: AUTH, payload: res.data })

    dispatch({ type: ALERT, payload: { success: res.data.msg } })
    localStorage.setItem('logged', 'true')
  } catch (error: any) {
    dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    setTimeout(() => verifySMS(phone, dispatch), 500)
  }
}

export const forgotPassword =
  (account: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })

      const res = await postAPI('forgot_password', { account })

      dispatch({ type: ALERT, payload: { success: res.data.msg } })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
