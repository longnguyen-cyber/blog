import { io } from './../index'
import { Response } from 'express'
import mongoose from 'mongoose'
import { IReqAuth } from '../config/interface'
import Comments from '../models/Comment'

const Pagination = (req: IReqAuth) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 4
  let skip = (page - 1) * limit
  return { page, limit, skip }
}
const commentCtrl = {
  createComment: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(401).json({ message: 'Invalid Authentication' })

    try {
      const { content, blog_id, blog_user_id } = req.body

      const newComment = new Comments({
        user: req.user._id,
        content,
        blog_id,
        blog_user_id
      })

      const data = {
        ...newComment._doc,
        user: req.user,
        createdAt: new Date().toISOString()
      }
      io.to(`${blog_id}`).emit('createComment', data)
      await newComment.save()
      return res.status(200).json(newComment)
    } catch (error: any) {
      return res.status(500).json({ msg: error.message })
    }
  },
  getComment: async (req: IReqAuth, res: Response) => {
    const { limit, skip } = Pagination(req)
    try {
      const data = await Comments.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  blog_id: new mongoose.Types.ObjectId(req.params.id),
                  comment_root: {
                    $exists: false
                  },
                  reply_user: { $exists: false }
                }
              },
              {
                $lookup: {
                  from: 'users',
                  let: { user_id: '$user' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$user_id'] }
                      }
                    },
                    {
                      $project: {
                        name: 1,
                        avatar: 1
                      }
                    }
                  ],

                  as: 'user'
                }
              },
              {
                $unwind: '$user'
              },
              {
                $lookup: {
                  from: 'comments',
                  let: { cm_id: '$replyCmt' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $in: ['$_id', '$$cm_id'] }
                      }
                    },
                    {
                      $lookup: {
                        from: 'users',
                        let: { user_id: '$user' },
                        pipeline: [
                          { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
                          { $project: { name: 1, avatar: 1 } }
                        ],
                        as: 'user'
                      }
                    },
                    { $unwind: '$user' },
                    {
                      $lookup: {
                        from: 'users',
                        localField: 'reply_user',
                        foreignField: '_id',
                        as: 'reply_user'
                      }
                    },
                    { $unwind: '$reply_user' },
                    {
                      $project: {
                        'reply_user.password': 0
                      }
                    }
                  ],
                  as: 'replyCmt'
                }
              },
              {
                $sort: {
                  createdAt: -1
                }
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
                  blog_id: new mongoose.Types.ObjectId(req.params.id)
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
      const comments = data[0].totalData
      const count = data[0].count
      let total = 0

      if (count % limit === 0) {
        total = count / limit
      } else {
        total = Math.floor(count / limit) + 1
      }
      res.json({
        comments,
        total
      })
    } catch (error: any) {
      return res.status(500).json({ msg: error.message })
    }
  },
  replyComment: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(401).json({ message: 'Invalid Authentication' })

    try {
      const { content, blog_id, blog_user_id, comment_root, reply_user } =
        req.body

      const newComment = new Comments({
        user: req.user._id,
        content,
        blog_id,
        blog_user_id,
        comment_root,
        reply_user: reply_user._id
      })

      await Comments.findByIdAndUpdate(
        {
          _id: comment_root
        },
        {
          $push: {
            replyCmt: newComment._id
          }
        }
      )

      const data = {
        ...newComment._doc,
        user: req.user,
        reply_user: reply_user,
        createdAt: new Date().toISOString()
      }
      io.to(`${blog_id}`).emit('replyComment', data)

      await newComment.save()

      return res.status(200).json(newComment)
    } catch (error: any) {
      return res.status(500).json({ msg: error.message })
    }
  },
  updateComment: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(401).json({ message: 'Invalid Authentication' })

    try {
      const { data } = req.body

      const comment = await Comments.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { content: data.content }
      )
      if (!comment)
        return res.json(400).json({
          msg: 'Comment does not exists'
        })

      io.to(`${data.blog_id}`).emit('updateComennt', data)

      return res.status(200).json({ msg: 'update successfully' })
    } catch (error: any) {
      return res.status(500).json({ msg: error.message })
    }
  },
  deleteComment: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(401).json({ message: 'Invalid Authentication' })

    try {
      const comment = await Comments.findOneAndDelete({
        _id: req.params.id,
        $or: [{ user: req.user._id }, { blog_user_id: req.user._id }]
      })
      if (!comment)
        return res.json(400).json({
          msg: 'Comment does not exists'
        })
      if (comment.comment_root)
        await Comments.findOneAndUpdate(
          { _id: comment.comment_root },
          { $pull: { replyCmt: comment._id } }
        )
      else await Comments.deleteMany({ _id: { $in: comment.replyCmt } })

      io.to(`${comment.blog_id}`).emit('deleteComment', comment)

      return res.status(200).json({ msg: 'Delete successfully' })
    } catch (error: any) {
      return res.status(500).json({ msg: error.message })
    }
  }
}

export default commentCtrl
