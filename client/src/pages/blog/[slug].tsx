import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { showErrMsg } from '../../components/alert/Alert'
import DisplayBlog from '../../components/blog/DisplayBlog'
import Loading from '../../components/global/Loading'
import { getAPI } from '../../utils/FetchData'
import { IBlog, IParams, RootStore } from '../../utils/types'

const DetailBlog = () => {
  const id = useParams<IParams>().slug
  const { socket } = useSelector((state: RootStore) => state)

  const [blog, setBlog] = useState<IBlog>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    setLoading(true)

    getAPI(`blog/${id}`)
      .then((res) => {
        setBlog(res.data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.response.data.msg)
        setLoading(false)
      })

    return () => setBlog(undefined)
  }, [id])

  useEffect(() => {
    if (!id || !socket) return
    socket.emit('joinRoom', id)
    return () => {
      socket.emit('outRoom', id)
    }
  }, [socket, id])

  if (loading) <Loading />
  return (
    <div className="my-4">
      {error && showErrMsg(error)}
      {blog && <DisplayBlog blog={blog} />}
    </div>
  )
}

export default DetailBlog
