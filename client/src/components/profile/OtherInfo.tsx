import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOtherInfo } from '../../redux/actions/userAction'
import { IUser, RootStore } from '../../utils/types'
import Loading from '../global/Loading'
interface IProps {
  id: string
}
const OtherInfo = ({ id }: IProps) => {
  const [other, setOther] = useState<IUser>()
  const dispatch = useDispatch()
  const { otherInfo } = useSelector((state: RootStore) => state)
  useEffect(() => {
    if (!id) return
    if (otherInfo.every((user) => user._id !== id)) dispatch(getOtherInfo(id))
    else {
      const newUser = otherInfo.find((user) => user._id === id)
      setOther(newUser)
    }
  }, [id, dispatch, otherInfo])

  if (!other) return <Loading />

  return (
    <div className="profile_info text-center rounded">
      <div className="info_avatar">
        <img src={other.avatar} alt="avatar" />
      </div>

      <h5 className="text-uppercase text-danger">{other.role}</h5>

      <div>
        Name: <span className="text-info">{other.name} </span>
      </div>

      <div>Email/Phone</div>
      <span className="text-info">{other.account}</span>
      <div>Join date :{new Date(other.createAt).toLocaleString()}</div>
    </div>
  )
}

export default OtherInfo
