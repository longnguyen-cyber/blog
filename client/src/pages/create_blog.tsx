/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CardHoriz from '../components/cards/CardHoriz'
import CreateForm from '../components/cards/CreateForm'
import Quill from '../components/editor/Quill'
import NotFound from '../components/global/NotFound'
import { createBlog, updateBlog } from '../redux/actions/blogAction'
import { ALERT } from '../redux/types/alertType'
import { getAPI } from '../utils/FetchData'

import { IBlog, IUser, RootStore } from '../utils/types'
import { shallowEqual, validBlog } from '../utils/Valid'

interface IProps {
  id?: string
}

const CreateBlog = ({ id }: IProps) => {
  const initalState = {
    user: '',
    title: '',
    content: '',
    description: '',
    thumbnail: '',
    category: '',
    createdAt: new Date().toISOString()
  }
  const divRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()

  const [blog, setBlog] = useState<IBlog>(initalState)
  const [text, setText] = useState('')
  const [body, setBody] = useState<string>('')
  const { auth } = useSelector((state: RootStore) => state)
  const [oldData, setOldData] = useState<IBlog>(initalState)

  useEffect(() => {
    if (!id) return

    getAPI(`blog/${id}`)
      .then((res) => {
        setBlog(res.data)
        setBody(res.data.content)
        setOldData(res.data)
      })
      .catch((err) => console.log(err))

    const initData = {
      user: '',
      title: '',
      content: '',
      description: '',
      thumbnail: '',
      category: '',
      createdAt: new Date().toISOString()
    }

    return () => {
      setBlog(initData)
      setBody('')
      setOldData(initData)
    }
  }, [id])

  useEffect(() => {
    const divText = divRef.current
    if (!divText) return
    const content = divText?.innerText as string
    setText(content)
  }, [body])

  const handleSubmit = async () => {
    if (!auth.access_token) return

    const check = validBlog({ ...blog, content: text })
    if (check.errLength !== 0)
      return dispatch({ type: ALERT, payload: { errors: check.errMsg } })

    let newData = { ...blog, content: text }
    if (id) {
      if ((blog.user as IUser)._id !== auth.user?._id)
        return dispatch({
          type: ALERT,
          payload: { errors: 'Invalid Authentication.' }
        })
      const result = shallowEqual(oldData, newData)
      console.log(result)
      if (result)
        return dispatch({
          type: ALERT,
          payload: { errors: 'The data does not change' }
        })
      dispatch(updateBlog(newData, auth.access_token))
    } else dispatch(createBlog(newData, auth.access_token))
    setBlog(initalState)
    setText('')
  }

  if (!auth.access_token) return <NotFound />
  return (
    <div>
      <div className="row mt-4">
        <div className="col-md-6">
          <h5>Create</h5>
          <CreateForm blog={blog} setBlog={setBlog} />
        </div>
        <div className="col-md-6">
          <h5>Preview</h5>
          <CardHoriz blog={blog} />
        </div>
      </div>
      <Quill setBody={setBody} body={body} />
      <div
        ref={divRef}
        dangerouslySetInnerHTML={{ __html: body }}
        style={{ display: 'none' }}
      />
      <small>{text.length}</small>
      <button
        className="btn btn-dark mt-3 d-block mx-auto"
        onClick={handleSubmit}
      >
        {id ? 'Update' : 'Create'}
      </button>
    </div>
  )
}

export default CreateBlog
