import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { createComment, getComments } from '../../redux/actions/commentAction'
import { IBlog, IComment, IUser, RootStore } from '../../utils/types'
import Comments from '../comments/Comments'
import Input from '../comments/Input'
import Loading from '../global/Loading'
import Pagination from '../global/Pagination'
interface IProps {
  blog: IBlog
}
const DisplayBlog = ({ blog }: IProps) => {
  const { auth, comments } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()
  const history = useHistory()

  const [loading, setLoading] = useState(false)

  const [showComments, setShowComments] = useState<IComment[]>([])

  const handleComment = (body: string) => {
    if (!auth.user || !auth.access_token) return

    const data = {
      content: body,
      user: auth.user,
      blog_id: blog._id as string,
      blog_user_id: (blog.user as IUser)._id,
      replyCmt: [],
      createdAt: new Date().toISOString()
    }
    setShowComments([data, ...showComments])
    dispatch(createComment(data, auth.access_token))
  }

  useEffect(() => {
    if (comments.data.length === 0) return
    setShowComments(comments.data)
  }, [comments.data])

  const fetchComment = useCallback(
    async (id: string, num = 1) => {
      setLoading(true)
      dispatch(getComments(id, num))
      setLoading(false)
    },
    [dispatch]
  )

  useEffect(() => {
    if (!blog._id) return
    const num = history.location.search.slice(6) || 1

    fetchComment(blog._id, num)
  }, [blog._id, fetchComment, history])

  const handlePagination = (num: number) => {
    if (!blog._id) return
    fetchComment(blog._id, num)
  }

  return (
    <div>
      <h2
        className="text-center my-3 text-capitalize fs-1"
        style={{ color: '#ff7a00' }}
      >
        {blog.title}
      </h2>

      <div className="text-end fst-italic" style={{ color: 'red' }}>
        <small>
          {typeof blog.user !== 'string' && `By: ${blog.user?.name}`}
        </small>

        <small className="ms-2">
          {new Date(blog.createdAt).toLocaleString()}
        </small>
      </div>

      <div
        dangerouslySetInnerHTML={{
          __html: blog.content
        }}
      />
      <hr className="my-1" />
      <h3 style={{ color: '#ff7a00' }}>✩ Comments ✩</h3>

      {auth.user ? (
        <Input callback={handleComment} />
      ) : (
        // /login?blog/${blog._id} return link blog you want comment before login
        <h5>
          Please <Link to={`/login?blog/${blog._id}`}>login</Link> to comment.
        </h5>
      )}

      {loading ? (
        <Loading />
      ) : (
        showComments?.map((comment, index) => (
          <Comments key={index} comment={comment} />
        ))
      )}

      {comments.total > 1 && (
        <Pagination total={comments.total} callback={handlePagination} />
      )}
    </div>
  )
}

export default DisplayBlog
