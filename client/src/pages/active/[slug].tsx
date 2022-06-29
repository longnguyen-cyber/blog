import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { postAPI } from '../../utils/FetchData'
import { IParams } from '../../utils/types'
import { showErrMsg, showSuccessMsg } from '../../components/alert/Alert'
const Active = () => {
  const { slug }: IParams = useParams()
  const [success, setSuccess] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    if (slug) {
      postAPI('active', { active_token: slug })
        .then((res) => setSuccess(res.data.msg))
        .catch((err) => setErr(err.response.data.msg))
    }
  }, [slug])
  return (
    <div>
      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}
    </div>
  )
}

export default Active
