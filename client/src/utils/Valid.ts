import { IBlog, IUserRegister } from './types'

export const validRegister = (userRegister: IUserRegister) => {
  const { name, account, cf_password, password } = userRegister
  const errors: string[] = []
  if (!name) {
    errors.push('Please add your name.')
  } else if (name.length > 20) {
    errors.push('Your name is up to 20 chars long.')
  }

  if (!account) {
    errors.push('Please add your email or phone number.')
  } else if (!validPhone(account) && !validateEmail(account)) {
    errors.push('Email or phone number format is incorrect.')
  }
  const msg = checkpass(password, cf_password)
  if (msg) errors.push(msg)
  return {
    errMsg: errors,
    errLength: errors.length
  }
}

export const checkpass = (password: string, cf_password: string) => {
  if (password.length < 6) {
    return 'Password must be at least 6 chars long.'
  } else if (password !== cf_password) {
    return 'Password and confirm password are not match.'
  }
}
export const validPhone = (phone: string) => {
  const re = /^[+]/g
  return re.test(phone)
}

export const validateEmail = (email: String) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

export const validBlog = (blog: IBlog) => {
  const { title, content, description, thumbnail, category } = blog
  const errors: string[] = []

  if (title.trim().length < 10) {
    errors.push('Title has at least 10 characters.')
  } else if (title.trim().length > 50) {
    errors.push('Title is up to 50 characters long.')
  }

  if (content.trim().length < 2000) {
    errors.push('Content has at least 2000 characters.')
  }

  if (description.trim().length < 50) {
    errors.push('Description has at least 50 characters.')
  } else if (description.trim().length > 200) {
    errors.push('Description is up to 200 characters long.')
  }

  if (!thumbnail) {
    errors.push('Thumbnail cannot be left blank.')
  }

  if (!category) {
    errors.push('Category cannot be left blank.')
  }

  return {
    errMsg: errors,
    errLength: errors.length
  }
}

export const shallowEqual = (object1: any, object2: any) => {
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length) return false

  for (let key of keys1) if (object1[key] !== object2[key]) return false
  return true
}
