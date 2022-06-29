import { Response } from 'express'
import { IReqAuth } from '../config/interface'
import Blog from '../models/Blog'
import Categories from '../models/Category'
const categoryCtrl = {
  getCategories: async (req: IReqAuth, res: Response) => {
    try {
      const categories = await Categories.find().sort({ createdAt: -1 })

      res.status(200).json({ categories })
    } catch (error: any) {
      return res.status(500).json({ msg: error.message })
    }
  },
  getCategory: async (req: IReqAuth, res: Response) => {
    try {
      const category = await Categories.findOne({ _id: req.params.id }).sort({
        createdAt: -1
      })

      res.status(200).json({ category })
    } catch (error: any) {
      return res.status(500).json({ msg: error.message })
    }
  },
  createCategory: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(401).json({ message: 'Invalid Authentication' })

    if (req.user.role !== 'admin')
      return res.status(401).json({ message: 'Invalid Authentication' })
    try {
      const name = req.body.name.toLowerCase()

      const newCategory = new Categories({ name })
      await newCategory.save()

      res.status(200).json({ newCategory })
    } catch (error: any) {
      let errMsg

      if (error.code === 11000) {
        errMsg = Object.values(error.keyValue)[0] + ' already exists'
      } else {
        let name = Object.keys(error.keyValue)[0]
        errMsg = error.errors[`${name}`].message
      }

      return res.status(500).json({ msg: errMsg })
    }
  },
  updateCategory: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(401).json({ message: 'Invalid Authentication' })

    if (req.user.role !== 'admin')
      return res.status(401).json({ message: 'Invalid Authentication' })
    try {
      const category = await Categories.findOneAndUpdate(
        { _id: req.params.id },
        { name: req.body.name.toLowerCase() }
      )

      res.status(200).json({ msg: 'update success!' })
    } catch (error: any) {
      let errMsg

      if (error.code === 11000) {
        errMsg = Object.values(error.keyValue)[0] + ' already exists'
      } else {
        let name = Object.keys(error.keyValue)[0]
        errMsg = error.errors[`${name}`].message
      }

      return res.status(500).json({ msg: errMsg })
    }
  },
  deleteCategory: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(401).json({ message: 'Invalid Authentication' })

    if (req.user.role !== 'admin')
      return res.status(401).json({ message: 'Invalid Authentication' })
    try {
      const blog = await Blog.findOne({ category: req.params.id })
      if (blog)
        return res
          .status(400)
          .json({ msg: 'Can not delete! In this category also exist blogs' })
      const category = await Categories.findOneAndDelete({ _id: req.params.id })

      if (!category)
        return res.status(400).json({ msg: 'Category does not exists' })

      res.status(200).json({ msg: 'delete success!' })
    } catch (error: any) {
      let errMsg

      if (error.code === 11000) {
        errMsg = Object.values(error.keyValue)[0] + ' already exists'
      } else {
        let name = Object.keys(error.keyValue)[0]
        errMsg = error.errors[`${name}`].message
      }

      return res.status(500).json({ msg: errMsg })
    }
  }
}

export default categoryCtrl
