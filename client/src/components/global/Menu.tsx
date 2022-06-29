import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { logout } from '../../redux/actions/authAction'
import { RootStore } from '../../utils/types'

const Menu = () => {
  const { auth } = useSelector((state: RootStore) => state)
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const bfLoginLinks = [
    { label: 'Login', path: '/login' },
    { label: 'Register', path: '/register' }
  ]
  const afLoginLinks = [
    { label: 'Home', path: '/' },
    { label: 'CreateBlog', path: '/create_blog' }
  ]

  const navLinks = auth.access_token ? afLoginLinks : bfLoginLinks

  const isActive = (path: string) => {
    if (pathname.includes(path)) {
      return 'active'
    }
  }

  const handleLogout = () => {
    if (!auth.access_token) return
    dispatch(logout(auth.access_token))
  }
  return (
    <ul className="navbar-nav ms-auto">
      {navLinks.map((link, index) => (
        <li key={index} className={`nav-item ${isActive(link.path)}`}>
          <Link to={link.path} className="nav-link">
            {link.label}
          </Link>
        </li>
      ))}

      {auth.user?.role === 'admin' && (
        <li className={`nav-item ${isActive('/category')}`}>
          <Link to="/category" className="nav-link">
            Category
          </Link>
        </li>
      )}

      {auth.user && (
        <li className="nav-item dropdown">
          <span
            className="nav-link dropdown-toggle "
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src={auth.user.avatar}
              className="avatar"
              alt={auth.user.name}
            />
            {auth.user.name}
          </span>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li>
              <Link to={`/profile/${auth.user._id}`} className="dropdown-item">
                Profile
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <Link to="/" className="dropdown-item" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </ul>
        </li>
      )}
    </ul>
  )
}

export default Menu
