import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { showErrMsg } from '../../components/alert/Alert'
import DisplayBlog from '../../components/blog/DisplayBlog'
import Loading from '../../components/global/Loading'
import Sliders from '../../components/slider/Sliders'
import { getAPI } from '../../utils/FetchData'
import { IBlog, ICategory, IParams, RootStore } from '../../utils/types'

const DetailBlog = () => {
  const id = useParams<IParams>().slug
  const { socket } = useSelector((state: RootStore) => state)

  const [blog, setBlog] = useState<IBlog>()
  const [category, setCategory] = useState<ICategory>()
  const [blogs, setBlogs] = useState<IBlog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!id) return

    setLoading(true)

    getAPI(`blog/${id}`)
      .then((res) => {
        setBlogs(res.data.blogs)
        setBlog(res.data.blog)
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

  useEffect(() => {
    if (!blog?.category) return

    setLoading(true)

    getAPI(`category/${blog?.category}`)
      .then((res) => setCategory(res.data.category))
      .catch((err) => {
        setError(err.response.data.msg)
        setLoading(false)
      })
  }, [blog?.category, id])

  if (loading) <Loading />
  return (
    <div className="my-4">
      {error && showErrMsg(error)}
      {blog && <DisplayBlog blog={blog} blogs={blogs} />}
      {category && <Sliders cate={category} blogs={blogs} />}
    </div>
  )
}

export default DetailBlog
