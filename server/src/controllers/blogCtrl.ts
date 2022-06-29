import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Blog from '../models/Blog'
import Comments from '../models/Comment'
import { IReqAuth } from './../config/interface'
const Pagination = (req: IReqAuth) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 4
  let skip = (page - 1) * limit
  return { page, limit, skip }
}
const blogCtrl = {
  createBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(401).json({ message: 'Invalid Authentication' })
    try {
      const { title, content, description, thumbnail, category } = req.body

      const newBlog = new Blog({
        user: req.user._id,
        title,
        content,
        description,
        thumbnail,
        category
      })

      await newBlog.save()
      res.json({ ...newBlog._doc, user: req.user })
    } catch (error: any) {
      return res.status(500).json({ msg: error.message })
    }
  },
  getHomeBlogs: async (req: Request, res: Response) => {
    try {
      const blogs = await Blog.aggregate([
        {
          $lookup: {
            from: 'users',
            let: { userId: '$user' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
              { $project: { password: 0 } }
            ],
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: '$category'
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $group: {
            _id: '$category._id',
            name: { $first: '$category.name' },
            blogs: { $push: '$$ROOT' },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            blogs: { $slice: ['$blogs', 0, 4] },
            count: 1,
            name: 1
          }
        }
      ])
      res.json(blogs)
    } catch (error: any) {
      return res.status(500).json({ msg: error.message })
    }
  },
  getBlogsByCategory: async (req: Request, res: Response) => {
    const { limit, skip } = Pagination(req)
    try {
      const data = await Blog.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  category: new mongoose.Types.ObjectId(req.params.category_id)
                }
              },
              {
                $lookup: {
                  from: 'users',
                  let: { userId: '$user' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
                    { $project: { password: 0 } }
                  ],
                  as: 'user'
                }
              },
              {
                $unwind: '$user'
              },
              {
                $sort: { createdAt: -1 }
              },
              {
                $skip: skip
              },
              {
                $limit: limit
              }
            ],
            totalCount: [
              {
                $match: {
                  category: new mongoose.Types.ObjectId(req.params.category_id)
                }
              },
              {
                $count: 'count'
              }
            ]
          }
        },
        {
          $project: {
            count: { $arrayElemAt: ['$totalCount.count', 0] },
            totalData: 1
          }
        }
      ])

      const blogs = data[0].totalData
      const count = data[0].count

      //pagination

      let total = 0
      if (count % limit === 0) {
        total = count / limit
      } else {
        total = Math.floor(count / limit) + 1
      }
      res.json({
        blogs,
        total
      })
    } catch (error: any) {
      return res.status(500).json({ msg: error.message })
    }
  },
  getBlogsByUser: async (req: Request, res: Response) => {
    const { limit, skip } = Pagination(req)
    try {
      const data = await Blog.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  user: new mongoose.Types.ObjectId(req.params.id)
                }
              },
              {
                $lookup: {
                  from: 'users',
                  let: { userId: '$user' },
                  pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
                    { $project: { password: 0 } }
                  ],
                  as: 'user'
                }
              },
              {
                $unwind: '$user'
              },
              {
                $sort: { createdAt: -1 }
              },
              {
                $skip: skip
              },
              {
                $limit: limit
              }
            ],
            totalCount: [
              {
                $match: {
                  user: new mongoose.Types.ObjectId(req.params.id)
                }
              },
              {
                $count: 'count'
              }
            ]
          }
        },
        {
          $project: {
            count: { $arrayElemAt: ['$totalCount.count', 0] },
            totalData: 1
          }
        }
      ])

      const blogs = data[0].totalData
      const count = data[0].count

      //pagination

      let total = 0
      if (count % limit === 0) {
        total = count / limit
      } else {
        total = Math.floor(count / limit) + 1
      }
      res.json({
        blogs,
        total
      })
    } catch (error: any) {
      return res.status(500).json({ msg: error.message })
    }
  },
  getBlog: async (req: Request, res: Response) => {
    try {
      const blog = await Blog.findOne({ _id: req.params.id }).populate(
        'user',
        '-password'
      )

      if (!blog) return res.status(400).json({ msg: 'Blog does not exist.' })

      return res.json(blog)
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  deleteBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: 'Invalid Authentication' })
    try {
      const blog = await Blog.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
      })

      if (!blog) return res.status(400).json({ msg: 'Invalid Authentication' })

      await Comments.deleteMany({ blog_id: blog._id })

      res.json({ msg: 'Delete Success!' })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },
  updateBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(401).json({ message: 'Invalid Authentication' })
    try {
      const blog = await Blog.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        req.body
      )

      if (!blog) return res.status(400).json({ msg: 'Invalid Authentication' })

      res.json({ msg: 'Update Success!', blog })
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  },

  //create active search in mongo cloud
  searchBlogs: async (req: Request, res: Response) => {
    try {
      const blogs = await Blog.aggregate([
        {
          $search: {
            index: 'searchTitle',
            autocomplete: {
              query: `${req.query.title}`,
              path: 'title'
            }
          }
        },
        { $sort: { createdAt: -1 } },
        { $limit: 5 },
        {
          $project: {
            title: 1,
            description: 1,
            thumbnail: 1,
            createdAt: 1
          }
        }
      ])

      if (!blogs.length) return res.status(400).json({ msg: 'No Blogs' })

      res.json(blogs)
    } catch (err: any) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

export default blogCtrl
