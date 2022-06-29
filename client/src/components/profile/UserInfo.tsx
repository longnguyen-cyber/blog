import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword, updateUser } from '../../redux/actions/userAction'
import {
  InputChange,
  RootStore,
  IUserProfile,
  FormSubmit
} from '../../utils/types'
import NotFound from '../global/NotFound'

const UserInfo = () => {
  const initalState = {
    name: '',
    account: '',
    avatar: '',
    password: '',
    cf_password: ''
  }

  const { auth } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()
  const [user, setUser] = useState<IUserProfile>(initalState)
  const { name, avatar, password, cf_password } = user
  const [typePass, setTypePass] = useState(false)
  const [typeCfPass, setTypeCfPass] = useState(false)

  const handleChangeInput = (e: InputChange) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleChangeAvatar = (e: InputChange) => {
    const target = e.target as HTMLInputElement
    const files = target.files
    if (files) {
      const file = files[0]
      setUser({ ...user, avatar: file })
    }
  }
  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault()
    if (avatar || name) {
      dispatch(updateUser(avatar as File, name, auth))
    }

    if (password && auth.access_token) {
      dispatch(resetPassword(password, cf_password, auth.access_token))
    }
  }

  if (!auth.user) return <NotFound />

  return (
    <form className="profile_info" onSubmit={handleSubmit}>
      <div className="info_avatar">
        <img
          src={
            avatar ? URL.createObjectURL(new Blob([avatar])) : auth.user?.avatar
          }
          alt="avatar"
        />

        <span className="ms-2">
          <label htmlFor="file_up" style={{ cursor: 'pointer' }}>
            Chage avatar
          </label>
          <input
            type="file"
            accept="image/*"
            name="file"
            id="file_up"
            className="d-none"
            onChange={handleChangeAvatar}
          />
        </span>
      </div>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          defaultValue={auth.user?.name}
          onChange={handleChangeInput}
        />
      </div>
      <div className="form-group">
        <label htmlFor="account">Acount</label>
        <input
          type="text"
          className="form-control"
          id="account"
          name="account"
          defaultValue={auth.user?.account}
          onChange={handleChangeInput}
          disabled={true}
        />
      </div>
      {(auth.user.type === 'register' || auth.user.type === 'sms') && (
        <>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="pass">
              <input
                type={typePass ? 'text' : 'password'}
                className="form-control"
                id="password"
                name="password"
                value={password}
                onChange={handleChangeInput}
              />
              <small onClick={() => setTypePass(!typePass)}>
                {typePass ? 'hide' : 'show'}
              </small>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="cf_password" className="form-label">
              Confirm Password
            </label>
            <div className="pass">
              <input
                type={typeCfPass ? 'text' : 'password'}
                className="form-control"
                id="cf_password"
                name="cf_password"
                value={cf_password}
                onChange={handleChangeInput}
              />
              <small onClick={() => setTypeCfPass(!typeCfPass)}>
                {typeCfPass ? 'hide' : 'show'}
              </small>
            </div>
          </div>
        </>
      )}

      <button className="btn btn-info w-100 mt-2" type="submit">
        update
      </button>
    </form>
  )
}

export default UserInfo
