import { Link, useHistory } from 'react-router-dom'
import RegisterForm from '../components/auth/RegisterForm'

const Register = () => {
  const history = useHistory()
  return (
    <div className="auth_page">
      <div className="auth_box">
        <h3 className="text-uppercase text-center mb-4">Register</h3>
        <RegisterForm />
        <p className="mt-2">
          You don't have an account?{' '}
          <Link
            to={`/login${history.location.search}`}
            style={{ color: 'crimson', textDecoration: 'none' }}
          >
            Login now
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
