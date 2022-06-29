import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginSMS } from '../../redux/actions/authAction'
import { FormSubmit } from '../../utils/types'

const LoginSMS = () => {
  const [phone, setPhone] = useState('')
  const dispatch = useDispatch()
  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault()
    dispatch(loginSMS(phone))
  }
  return (
    <form className="mt-2" onSubmit={handleSubmit}>
      <div className="form-group mb-3">
        <label htmlFor="phone">Phone number</label>
        <input
          type="text"
          className="form-control"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <button
        className="btn btn-dark w-100"
        type="submit"
        disabled={phone ? false : true}
      >
        Login
      </button>
    </form>
  )
}

export default LoginSMS
