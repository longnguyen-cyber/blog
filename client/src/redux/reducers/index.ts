import { combineReducers } from 'redux'
import alertReducer from './alertReducer'
import authReducer from './authReducer'
import categoryReducer from './categoryReducer'
import blogReducer from './blogReducer'
import blogsCategoryReducer from './blogsCategoryReducer'
import otherInfoReducer from './otherInfoReducer'
import blogsUserReducer from './blogsUserReducer'
import commentReducer from './commentReducer'
import socketReducer from './socketReducer'

export default combineReducers({
  auth: authReducer,
  alert: alertReducer,
  categories: categoryReducer,
  homeBlogs: blogReducer,
  blogsCategory: blogsCategoryReducer,
  otherInfo: otherInfoReducer,
  blogsUser: blogsUserReducer,
  comments: commentReducer,
  socket: socketReducer
})
