import { ICategory } from '../../utils/types'
import {
  CREATE_CATEGORY,
  DELETE_CATEGORIES,
  GET_CATEGORIES,
  ICategoryType,
  UPDATE_CATEGORIES
} from './../types/categoryType'

const categoryReducer = (
  state: ICategory[] = [],
  action: ICategoryType
): ICategory[] => {
  switch (action.type) {
    case CREATE_CATEGORY:
      return [action.payload, ...state]
    case GET_CATEGORIES:
      return action.payload
    case UPDATE_CATEGORIES:
      return state.map((category) =>
        category._id === action.payload._id
          ? { ...category, name: action.payload.name }
          : category
      )
    case DELETE_CATEGORIES:
      return state.filter((category) => category._id !== action.payload)
    default:
      return state
  }
}

export default categoryReducer
