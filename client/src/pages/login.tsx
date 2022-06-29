import { gapi } from 'gapi-script'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import LoginPass from '../components/auth/LoginPass'
import LoginSMS from '../components/auth/LoginSMS'
import SocialLogin from '../components/auth/SocialLogin'
import { RootStore } from '../utils/types'

const Login = () => {
  const [sms, setSms] = useState(false)

  const history = useHistory()
  const { auth } = useSelector((state: RootStore) => state)
  useEffect(() => {
    if (auth.access_token) {
      const url = history.location.search.replace('?', '/')
      history.push(url)
    }
  }, [auth.access_token, history])

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId:
          '638406348821-2a64e4icb9sr1u36tc1d6h94e83r3t8q.apps.googleusercontent.com',
        scope: ''
      })
    }

    gapi.load('client:auth2', start)
  })

  return (
    <div className="auth_page">
      <div className="auth_box">
        <h3 className="text-uppercase text-center mb-4">login</h3>
        <SocialLogin />
        {!sms ? <LoginPass /> : <LoginSMS />}
        <small className="row my-2 text-primary" style={{ cursor: 'pointer' }}>
          <span className="col-6 text-center">
            <Link to="/forgot_password" style={{ textDecoration: 'none' }}>
              Forget password?
            </Link>
          </span>
          <span
            className="col-6 text-center"
            onClick={() => setSms(!sms)}
            style={{ textDecoration: 'none' }}
          >
            {sms ? 'Sign in with password' : 'Sign in with SMS'}
          </span>
        </small>

        <p className="mt-2">
          You don't have an account?{' '}
          <Link
            to={`/register`}
            style={{ color: 'crimson', textDecoration: 'none' }}
          >
            Register now
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
