import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useParams } from 'react-router-dom'
import { getBlogsByUserId } from '../../redux/actions/blogAction'
import { IBlog, IParams, RootStore } from '../../utils/types'
import CardHoriz from '../cards/CardHoriz'
import Loading from '../global/Loading'
import Pagination from '../global/Pagination'

const UserBlog = () => {
  const user_Id = useParams<IParams>().slug
  const dispatch = useDispatch()
  const { blogsUser } = useSelector((state: RootStore) => state)
  const history = useHistory()
  const { search } = history.location

  const [blogs, setBlogs] = useState<IBlog[]>()
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!user_Id) return
    if (blogsUser.every((item) => item.id !== user_Id))
      dispatch(getBlogsByUserId(user_Id, search))
    else {
      const data = blogsUser.find((item) => item.id === user_Id)
      if (!data) return
      setBlogs(data.blogs)
      setTotal(data.total)
      if (data.search) history.push(data.search)
    }
  }, [user_Id, blogsUser, dispatch, search, history])

  const handlePagination = (num: number) => {
    const search = `?page=${num}`
    dispatch(getBlogsByUserId(user_Id, search))
  }

  if (!blogs) return <Loading />

  if (blogs.length === 0 && total < 1)
    return (
      <div className="text-center">
        <h3>No Blogs</h3>
        <Link to="/create_blog" style={{ textDecoration: 'none' }}>
          <span>You want to create blog</span>
        </Link>
      </div>
    )
  return (
    <div>
      <div>
        {blogs.map((blog) => (
          <CardHoriz key={blog._id} blog={blog} />
        ))}
      </div>

      <div>
        {total > 1 && <Pagination total={total} callback={handlePagination} />}
      </div>
    </div>
  )
}

export default UserBlog
