import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import OtherInfo from '../../components/profile/OtherInfo'
import UserBlog from '../../components/profile/UserBlog'
import UserInfo from '../../components/profile/UserInfo'
import { IParams, RootStore } from '../../utils/types'
const Profile = () => {
  const { slug }: IParams = useParams()
  const { auth } = useSelector((state: RootStore) => state)
  return (
    <div className="row my-3">
      <div className="col-md-5 mb-3">
        {auth.user?._id === slug ? <UserInfo /> : <OtherInfo id={slug} />}
      </div>
      <div className="col-md-7">
        <UserBlog />
      </div>
    </div>
  )
}

export default Profile
