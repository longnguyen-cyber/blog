import {
  CREATE_COMMENT,
  DELETE_COMMENT,
  DELETE_REPLY,
  GET_COMMENT,
  ICommentState,
  ICommentType
} from '../types/commentType'
import {
  REPLY_COMMENT,
  UPDATE_COMMENT,
  UPDATE_REPLY
} from './../types/commentType'

const initialState = {
  data: [],
  total: 1
}

const commentReducer = (
  state: ICommentState = initialState,
  action: ICommentType
): ICommentState => {
  switch (action.type) {
    case CREATE_COMMENT:
      return {
        ...state,
        data: [action.payload, ...state.data]
      }
    case GET_COMMENT:
      return action.payload
    case UPDATE_COMMENT:
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload._id ? action.payload : item
        )
      }
    case DELETE_COMMENT:
      return {
        ...state,
        data: state.data.filter((item) => item._id !== action.payload._id)
      }
    case REPLY_COMMENT:
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload.comment_root
            ? {
                ...item,
                replyCmt: [action.payload, ...item.replyCmt]
              }
            : item
        )
      }
    case UPDATE_REPLY:
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload.comment_root
            ? {
                ...item,
                replyCmt: item.replyCmt?.map((rp) =>
                  rp._id === action.payload._id ? action.payload : rp
                )
              }
            : item
        )
      }
    case DELETE_REPLY:
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload.comment_root
            ? {
                ...item,
                replyCmt: item.replyCmt?.filter(
                  (rp) => rp._id !== action.payload._id
                )
              }
            : item
        )
      }
    default:
      return state
  }
}

export default commentReducer
