import { IUser } from '../../utils/types'
import { GET_OTHER_USER, IGetOtherInfoType } from '../types/otherInfoType'

const otherInfoReducer = (
  state: IUser[] = [],
  action: IGetOtherInfoType
): IUser[] => {
  switch (action.type) {
    case GET_OTHER_USER:
      return [...state, action.payload]
    default:
      return state
  }
}

export default otherInfoReducer
