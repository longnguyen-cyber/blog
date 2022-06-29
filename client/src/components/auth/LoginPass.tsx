import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/actions/authAction'
import { FormSubmit, InputChange } from '../../utils/types'

const LoginPass = () => {
  const initalState = { account: '', password: '' }
  const [userLogin, setUserLogin] = useState(initalState)
  const [typePass, setTypePass] = useState(false)
  const { account, password } = userLogin

  const dispatch = useDispatch()

  const handleChangeInput = (e: InputChange) => {
    const { value, name } = e.target
    setUserLogin({ ...userLogin, [name]: value })
  }

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault()
    dispatch(login(userLogin))
  }
  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="form-group">
        <label className="form-label" htmlFor="account">
          Email / Phone number
        </label>
        <input
          type="text"
          className="form-control"
          id="account"
          name="account"
          value={account}
          onChange={handleChangeInput}
          autoComplete="username"
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="password">
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
            autoComplete="current-password"
          />
          <small onClick={() => setTypePass(!typePass)}>
            {typePass ? 'Hide' : 'Show'}
          </small>
        </div>
      </div>

      <button
        className="btn btn-dark w-100 mt-3"
        type="submit"
        disabled={!account || !password}
      >
        Login
      </button>
    </form>
  )
}

export default LoginPass
