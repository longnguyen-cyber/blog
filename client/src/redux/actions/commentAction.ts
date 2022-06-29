import { Dispatch } from 'redux'
import { checkTokenExpire } from '../../utils/checkTokenExpire'
import { deleteAPI, getAPI, patchAPI, postAPI } from '../../utils/FetchData'
import { IComment } from '../../utils/types'
import { ALERT, IAlertType } from '../types/alertType'
import {
  DELETE_COMMENT,
  DELETE_REPLY,
  GET_COMMENT,
  ICreateCommentType,
  IDeleteType,
  IGetCommentType,
  UPDATE_COMMENT,
  UPDATE_REPLY
} from '../types/commentType'
import { IReplyCommentType, IUpdateType } from './../types/commentType'

export const createComment =
  (data: IComment, accessToken: string) =>
  async (dispatch: Dispatch<IAlertType | ICreateCommentType>) => {
    const result = await checkTokenExpire(accessToken, dispatch)
    const access_token = result ? result : accessToken
    try {
      await postAPI('comment', data, access_token)
      // dispatch({
      //   type: CREATE_COMMENT,
      //   payload: {
      //     ...res.data,
      //     user: data.user
      //   }
      // })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
export const getComments =
  (id: string, num: number) =>
  async (dispatch: Dispatch<IAlertType | IGetCommentType>) => {
    try {
      let limit = 4
      const res = await getAPI(`comments/blog/${id}?page=${num}&limit=${limit}`)
      dispatch({
        type: GET_COMMENT,
        payload: {
          data: res.data.comments,
          total: res.data.total
        }
      })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
export const replycomment =
  (data: IComment, accessToken: string) =>
  async (dispatch: Dispatch<IAlertType | IReplyCommentType>) => {
    const result = await checkTokenExpire(accessToken, dispatch)
    const access_token = result ? result : accessToken
    try {
      await postAPI('reply_comment', data, access_token)

      // dispatch({
      //   type: REPLY_COMMENT,
      //   payload: {
      //     ...res.data,
      //     user: data.user,
      //     replyCmt: data.replyCmt
      //   }
      // })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
export const updateComment =
  (data: IComment, accessToken: string) =>
  async (dispatch: Dispatch<IAlertType | IUpdateType>) => {
    const result = await checkTokenExpire(accessToken, dispatch)
    const access_token = result ? result : accessToken
    try {
      dispatch({
        type: data.comment_root ? UPDATE_REPLY : UPDATE_COMMENT,
        payload: data
      })
      await patchAPI(`comment/${data._id}`, { data }, access_token)
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
export const deleteComment =
  (data: IComment, accessToken: string) =>
  async (dispatch: Dispatch<IAlertType | IDeleteType>) => {
    const result = await checkTokenExpire(accessToken, dispatch)
    const access_token = result ? result : accessToken
    try {
      dispatch({
        type: data.comment_root ? DELETE_REPLY : DELETE_COMMENT,
        payload: data
      })
      await deleteAPI(`comment/${data._id}`, access_token)
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
