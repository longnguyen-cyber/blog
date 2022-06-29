import {
  FacebookLogin,
  FacebookLoginAuthResponse
} from 'react-facebook-login-lite'
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login-lite'
import { useDispatch } from 'react-redux'
import { facebookLogin, googLeLogin } from '../../redux/actions/authAction'
const SocialLogin = () => {
  const dispatch = useDispatch()
  const onSuccess = (googleUser: GoogleLoginResponse) => {
    const id_token = googleUser.getAuthResponse().id_token
    dispatch(googLeLogin(id_token))
  }

  const onFailure = (err: any) => {
    console.log(err)
  }

  const onSuccessFb = (response: FacebookLoginAuthResponse) => {
    const { userID, accessToken } = response.authResponse
    dispatch(facebookLogin(userID, accessToken))
  }

  const onFailureFb = (error: any) => {
    console.log(error)
  }
  return (
    <div className="d-flex align-items-center">
      <GoogleLogin
        client_id="638406348821-2a64e4icb9sr1u36tc1d6h94e83r3t8q.apps.googleusercontent.com"
        cookiepolicy="single_host_origin"
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
      <FacebookLogin
        appId="5184867258268706"
        onSuccess={onSuccessFb}
        onFailure={onFailureFb}
      />
    </div>
  )
}

export default SocialLogin
