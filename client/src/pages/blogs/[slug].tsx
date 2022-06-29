import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import CardVert from '../../components/cards/CardVert'
import Loading from '../../components/global/Loading'
import Pagination from '../../components/global/Pagination'
import { getBlogsByCategoryId } from '../../redux/actions/blogAction'
import { IBlog, IParams, RootStore } from '../../utils/types'

const BlogsByCategory = () => {
  const { categories, blogsCategory } = useSelector((state: RootStore) => state)
  const { slug } = useParams<IParams>()
  const dispatch = useDispatch()
  const history = useHistory()
  const { search } = history.location

  const [categoryId, setCategoryId] = React.useState<string>('')
  const [blogs, setBlogs] = useState<IBlog[]>([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    const category = categories.find((item) => item.name === slug)
    if (category) setCategoryId(category._id)
  }, [slug, categories])

  useEffect(() => {
    if (!categoryId) return
    if (blogsCategory.every((item) => item.id !== categoryId)) {
      dispatch(getBlogsByCategoryId(categoryId, search))
    } else {
      const data = blogsCategory.find((item) => item.id === categoryId)
      if (!data) return
      setBlogs(data.blogs)
      setTotal(data.total)
      if (data.search) history.push(data.search)
    }
  }, [categoryId, dispatch, blogsCategory, search, history])

  const handlePagination = (page: number) => {
    const search = `?page=${page}`
    dispatch(getBlogsByCategoryId(categoryId, search))
  }

  if (!blogs) return <Loading />
  return (
    <div className="blogs_category">
      <div className="show_blogs">
        {blogs.map((blog) => (
          <CardVert blog={blog} key={blog._id} />
        ))}
      </div>

      {total > 1 && <Pagination total={total} callback={handlePagination} />}
    </div>
  )
}

export default BlogsByCategory
