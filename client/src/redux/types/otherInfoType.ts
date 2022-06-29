import { IUser } from '../../utils/types'

export const GET_OTHER_USER = 'GET_OTHER_USER'

export interface IGetOtherInfoType {
  type: typeof GET_OTHER_USER
  payload: IUser
}
