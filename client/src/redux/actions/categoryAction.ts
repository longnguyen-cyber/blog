import {
  DELETE_CATEGORIES,
  GET_CATEGORIES,
  UPDATE_CATEGORIES
} from './../types/categoryType'
import { deleteAPI, getAPI, patchAPI } from './../../utils/FetchData'
import { Dispatch } from 'redux'
import { postAPI } from '../../utils/FetchData'
import { IAlertType, ALERT } from '../types/alertType'
import { CREATE_CATEGORY, ICategoryType } from '../types/categoryType'
import { ICategory } from '../../utils/types'
import { checkTokenExpire } from '../../utils/checkTokenExpire'

export const createCategory =
  (name: string, accessToken: string) =>
  async (dispatch: Dispatch<IAlertType | ICategoryType>) => {
    const result = await checkTokenExpire(accessToken, dispatch)
    const access_token = result ? result : accessToken
    if (!accessToken)
      return dispatch({
        type: ALERT,
        payload: { errors: 'You are not logged in' }
      })

    try {
      dispatch({ type: ALERT, payload: { loading: true } })
      const res = await postAPI('category', { name }, access_token)
      dispatch({ type: CREATE_CATEGORY, payload: res.data.newCategory })
      dispatch({ type: ALERT, payload: { success: 'create successfully!' } })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }

export const getCategories =
  () => async (dispatch: Dispatch<IAlertType | ICategoryType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })
      const res = await getAPI('category')
      dispatch({ type: GET_CATEGORIES, payload: res.data.categories })
      dispatch({ type: ALERT, payload: { loading: false } })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
export const updateCategory =
  (data: ICategory, accessToken: string) =>
  async (dispatch: Dispatch<IAlertType | ICategoryType>) => {
    const result = await checkTokenExpire(accessToken, dispatch)
    const access_token = result ? result : accessToken
    try {
      dispatch({ type: ALERT, payload: { loading: true } })

      await patchAPI(`category/${data._id}`, { name: data.name }, access_token)

      dispatch({ type: UPDATE_CATEGORIES, payload: data })

      dispatch({ type: ALERT, payload: { loading: false } })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
export const deleteCategory =
  (id: string, accessToken: string) =>
  async (dispatch: Dispatch<IAlertType | ICategoryType>) => {
    const result = await checkTokenExpire(accessToken, dispatch)
    const access_token = result ? result : accessToken
    try {
      dispatch({ type: ALERT, payload: { loading: true } })

      await deleteAPI(`category/${id}`, access_token)

      dispatch({ type: DELETE_CATEGORIES, payload: id })

      dispatch({ type: ALERT, payload: { loading: false } })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
