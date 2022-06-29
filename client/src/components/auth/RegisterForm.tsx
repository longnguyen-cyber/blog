import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { register } from '../../redux/actions/authAction'
import { FormSubmit, InputChange } from '../../utils/types'

const RegiserForm = () => {
  const initalState = { name: '', account: '', password: '', cf_password: '' }
  const [userRegister, setUserRegister] = useState(initalState)
  const [typePass, setTypePass] = useState(false)
  const [typeCfPass, setTypeCfPass] = useState(false)
  const { name, account, password, cf_password } = userRegister

  const dispatch = useDispatch()

  const handleChangeInput = (e: InputChange) => {
    const { value, name } = e.target
    setUserRegister({ ...userRegister, [name]: value })
  }

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault()
    dispatch(register(userRegister))
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="name">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={name}
          onChange={handleChangeInput}
          autoComplete="name"
        />
      </div>
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
      <div className="form-group">
        <label className="form-label" htmlFor="cf_password">
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
            autoComplete="current-password"
          />
          <small onClick={() => setTypeCfPass(!typeCfPass)}>
            {typeCfPass ? 'Hide' : 'Show'}
          </small>
        </div>
      </div>

      <button className="btn btn-dark w-100 mt-3" type="submit">
        Register
      </button>
    </form>
  )
}

export default RegiserForm
