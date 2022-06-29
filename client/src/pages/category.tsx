import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NotFound from '../components/global/NotFound'
import {
  createCategory,
  deleteCategory,
  updateCategory
} from '../redux/actions/categoryAction'
import { FormSubmit, ICategory, RootStore } from '../utils/types'

const Category = () => {
  const [name, setName] = useState('')
  const [edit, setEdit] = useState<ICategory | null>(null)

  const { auth, categories } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    if (edit) setName(edit.name)
  }, [edit])

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault()
    if (!auth.access_token || !name) return
    if (edit) {
      if (edit.name === name) return
      const data = { ...edit, name }
      dispatch(updateCategory(data, auth.access_token))
    } else dispatch(createCategory(name, auth.access_token))
    setName('')
    setEdit(null)
  }

  const handelDelete = (id: string) => {
    if (!auth.access_token) return
    if (window.confirm('Are you sure to delte this category?'))
      dispatch(deleteCategory(id, auth.access_token))
  }

  if (auth.user?.role !== 'admin') return <NotFound />

  return (
    <div className="category">
      <form onSubmit={handleSubmit}>
        <label htmlFor="category">Category</label>
        <div className="d-flex align-items-center">
          {edit && (
            <i
              className="fas fa-times me-2 text-danger"
              onClick={() => setEdit(null)}
              style={{ cursor: 'pointer' }}
            />
          )}
          <input
            type="text"
            name="category"
            id="category"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="btn btn-success ms-2" type="submit">
            {edit ? 'Update' : 'create'}
          </button>
        </div>
      </form>
      <div>
        {categories.map((category) => (
          <div className="category_row" key={category._id}>
            <p className="m-0 text-capitalize">{category.name}</p>
            <div>
              <i
                className="fas fa-edit mx-2"
                onClick={() => setEdit(category)}
              />
              <i
                className="fas fa-trash-alt"
                onClick={() => handelDelete(category._id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Category
