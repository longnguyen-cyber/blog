import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { IBlog, InputChange, RootStore } from '../../utils/types'
interface IProps {
  blog: IBlog
  setBlog: (blog: IBlog) => void
}
const CreateForm = ({ blog, setBlog }: IProps) => {
  const { categories } = useSelector((state: RootStore) => state)
  const handleChangeInput = (e: InputChange) => {
    const { name, value } = e.target
    setBlog({ ...blog, [name]: value })
  }

  const [url, setUrl] = useState(true)
  const [thumbnailUrl, setThumbnailUrl] = useState('')

  const handleChangeThumbnail = (e: InputChange) => {
    const target = e.target as HTMLInputElement
    const files = target.files
    if (files) {
      const file = files[0]
      setBlog({ ...blog, thumbnail: file })
    }
  }

  return (
    <form>
      <div className="form-group position-relative">
        <label>Title</label>
        <input
          type="text"
          className="form-control"
          name="title"
          onChange={handleChangeInput}
          value={blog.title}
        />

        <small
          className="text-muted position-absolute"
          style={{ bottom: 0, right: '3px', opacity: '0.3' }}
        >
          {blog.title.length}/50
        </small>
      </div>

      <div className="form-group my-3">
        <div className="d-flex justify-content-between">
          <label>thumbnail</label>
          <label
            className="btn btn-light bg-transparent"
            onClick={() => setUrl(!url)}
          >
            URL
          </label>
        </div>
        {url ? (
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleChangeThumbnail}
          />
        ) : (
          <input
            type="text"
            className="form-control"
            onChange={(e) => {
              setThumbnailUrl(e.target.value)
              setBlog({ ...blog, thumbnail: e.target.value })
            }}
            value={thumbnailUrl}
          />
        )}
      </div>

      <div className="form-group position-relative">
        <label>Description</label>
        <textarea
          className="form-control"
          rows={4}
          style={{ resize: 'none' }}
          name="description"
          onChange={handleChangeInput}
          value={blog.description}
        />

        <small
          className="text-muted position-absolute"
          style={{ bottom: 0, right: '3px', opacity: '0.3' }}
        >
          {blog.description.length}/200
        </small>
      </div>

      <div className="form-group my-3">
        <label>Category</label>
        <select
          className="form-control text-capitalize"
          name="category"
          value={blog.category}
          onChange={handleChangeInput}
        >
          <option value="">Choose a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </form>
  )
}

export default CreateForm
