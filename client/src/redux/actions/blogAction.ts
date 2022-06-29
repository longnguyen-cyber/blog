import { Dispatch } from 'redux'
import { checkTokenExpire } from '../../utils/checkTokenExpire'
import { deleteAPI, getAPI, postAPI, putAPI } from '../../utils/FetchData'
import { imageUpload } from '../../utils/ImageUpload'
import { IBlog } from '../../utils/types'
import { ALERT, IAlertType } from '../types/alertType'
import { IGetHomeBlogsType } from '../types/blogType'
import {
  CREATE_BLOGS_USER_ID,
  DELETE_BLOGS_USER_ID,
  GET_BLOGS_CATEGORY_ID,
  GET_BLOGS_USER_ID,
  GET_HOME_BLOGS,
  IBlogsCategoryType,
  IBlogsUserType,
  ICreateBlogsUserType,
  IDeleteBlogsUserType
} from './../types/blogType'

export const createBlog =
  (blog: IBlog, accessToken: string) =>
  async (dispatch: Dispatch<IAlertType | ICreateBlogsUserType>) => {
    const result = await checkTokenExpire(accessToken, dispatch)
    const access_token = result ? result : accessToken
    if (!accessToken)
      return dispatch({
        type: ALERT,
        payload: { errors: 'You are not logged in' }
      })
    let url = ''
    try {
      dispatch({ type: ALERT, payload: { loading: true } })

      if (typeof blog.thumbnail !== 'string') {
        const photo = await imageUpload(blog.thumbnail)
        dispatch({ type: ALERT, payload: { loading: false } })
        url = photo.url
      } else {
        url = blog.thumbnail
      }
      const newBlog = { ...blog, thumbnail: url }

      const res = await postAPI('blog', newBlog, access_token)

      dispatch({
        type: CREATE_BLOGS_USER_ID,
        payload: res.data
      })
      dispatch({ type: ALERT, payload: { loading: true } })

      dispatch({ type: ALERT, payload: { success: 'create successfully!' } })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
export const updateBlog =
  (blog: IBlog, accessToken: string) =>
  async (dispatch: Dispatch<IAlertType>) => {
    const result = await checkTokenExpire(accessToken, dispatch)
    const access_token = result ? result : accessToken
    if (!accessToken)
      return dispatch({
        type: ALERT,
        payload: { errors: 'You are not logged in' }
      })
    let url = ''
    try {
      dispatch({ type: ALERT, payload: { loading: true } })

      if (typeof blog.thumbnail !== 'string') {
        const photo = await imageUpload(blog.thumbnail)
        dispatch({ type: ALERT, payload: { loading: false } })
        url = photo.url
      } else {
        url = blog.thumbnail
      }
      const newBlog = { ...blog, thumbnail: url }
      const res = await putAPI(`blog/${newBlog._id}`, newBlog, access_token)
      console.log(res)
      dispatch({ type: ALERT, payload: { loading: true } })

      dispatch({ type: ALERT, payload: { success: res.data.msg } })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
export const deleteBlog =
  (blog: IBlog, accessToken: string) =>
  async (dispatch: Dispatch<IAlertType | IDeleteBlogsUserType>) => {
    const result = await checkTokenExpire(accessToken, dispatch)
    const access_token = result ? result : accessToken
    if (!accessToken)
      return dispatch({
        type: ALERT,
        payload: { errors: 'You are not logged in' }
      })

    try {
      dispatch({
        type: DELETE_BLOGS_USER_ID,
        payload: blog
      })
      await deleteAPI(`blog/${blog._id}`, access_token)
      dispatch({ type: ALERT, payload: { loading: true } })

      dispatch({ type: ALERT, payload: { success: 'delete successfully!' } })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
export const getHomeBlogs =
  () => async (dispatch: Dispatch<IAlertType | IGetHomeBlogsType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } })
      const res = await getAPI('home/blogs')

      dispatch({ type: GET_HOME_BLOGS, payload: res.data })

      dispatch({ type: ALERT, payload: { loading: false } })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
export const getBlogsByCategoryId =
  (id: string, search: string) =>
  async (dispatch: Dispatch<IAlertType | IBlogsCategoryType>) => {
    try {
      let limit = 8
      let value = search ? search : '?page=1'
      dispatch({ type: ALERT, payload: { loading: true } })
      const res = await getAPI(`blogs/category/${id}${value}&limit=${limit}`)
      dispatch({
        type: GET_BLOGS_CATEGORY_ID,
        payload: { ...res.data, id, search }
      })
      dispatch({ type: ALERT, payload: { loading: false } })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
export const getBlogsByUserId =
  (id: string, search: string) =>
  async (dispatch: Dispatch<IAlertType | IBlogsUserType>) => {
    try {
      let limit = 3
      let value = search ? search : '?page=1'
      dispatch({ type: ALERT, payload: { loading: true } })
      const res = await getAPI(`blogs/user/${id}${value}&limit=${limit}`)
      dispatch({
        type: GET_BLOGS_USER_ID,
        payload: { ...res.data, id, search }
      })
      dispatch({ type: ALERT, payload: { loading: false } })
    } catch (error: any) {
      dispatch({ type: ALERT, payload: { errors: error.response.data.msg } })
    }
  }
