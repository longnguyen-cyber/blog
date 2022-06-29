import { GET_OTHER_USER, IGetOtherInfoType } from './../types/otherInfoType'
import { Dispatch } from 'react'
import { getAPI, patchAPI } from '../../utils/FetchData'
import { ALERT, IAlertType } from '../types/alertType'
import { AUTH, IAuth, IAuthType } from '../types/authType'
import { checkImage, imageUpload } from './../../utils/ImageUpload'
import { checkpass } from './../../utils/Valid'
import { checkTokenExpire } from '../../utils/checkTokenExpire'

export const updateUser =
  (avatar: File, name: string, auth: IAuth) =>
  async (dispatch: Dispatch<IAlertType | IAuthType>) => {
    if (!auth.access_token || !auth.user) return

    const result = await checkTokenExpire(auth.access_token, dispatch)
    const access_token = result ? result : auth.access_token

    let url = ''
    try {
      dispatch({ type: ALERT, payload: { loading: true } })

      if (avatar) {
        const check = checkImage(avatar)
        if (check) return dispatch({ type: ALERT, payload: { errors: check } })

        const photo = await imageUpload(avatar)
        url = photo.url
      }
      const res = await patchAPI(
        'user',
        {
          name: name ? name : auth.user.name,
          avatar: url ? url : auth.user.avatar
        },
        access_token
      )
      dispatch({
        type: AUTH,
        payload: {
          access_token: auth.access_token,
          user: {
            ...auth.user,
            name: name ? name : auth.user.name,
            avatar: url ? url : auth.user.avatar
          }
        }
      })
      dispatch({ type: ALERT, payload: { success: res.data.msg } })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
export const resetPassword =
  (password: string, cf_password: string, accessToken: string) =>
  async (dispatch: Dispatch<IAlertType | IAuthType>) => {
    if (!accessToken) return
    const result = await checkTokenExpire(accessToken, dispatch)
    const access_token = result ? result : accessToken

    const msg = checkpass(password, cf_password)
    if (msg) return dispatch({ type: ALERT, payload: { errors: msg } })
    try {
      dispatch({ type: ALERT, payload: { loading: true } })

      const res = await patchAPI('reset_password', { password }, access_token)

      dispatch({ type: ALERT, payload: { success: res.data.msg } })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
export const getOtherInfo =
  (id: string) =>
  async (dispatch: Dispatch<IAlertType | IGetOtherInfoType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })

      const res = await getAPI(`user/${id}`)
      dispatch({
        type: GET_OTHER_USER,
        payload: res.data
      })

      dispatch({ type: ALERT, payload: {} })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
