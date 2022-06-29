import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteComment,
  replycomment,
  updateComment
} from '../../redux/actions/commentAction'
import { IComment, RootStore } from '../../utils/types'
import Input from './Input'

interface IProps {
  comment: IComment
  showReply: IComment[]
  setShowReply: (showReply: IComment[]) => void
}

const CommentList: React.FC<IProps> = ({
  children,
  comment,
  showReply,
  setShowReply
}) => {
  const [onReply, setOnReply] = useState(false)
  const [edit, setEdit] = useState<IComment>()
  const { auth } = useSelector((state: RootStore) => state)

  const dispatch = useDispatch()

  const handleReply = (body: string) => {
    if (!auth.user || !auth.access_token) return
    const data = {
      user: auth.user,
      blog_id: comment.blog_id as string,
      blog_user_id: comment.blog_user_id,
      content: body,
      replyCmt: [],
      reply_user: comment.user,
      comment_root: comment.comment_root || comment._id,
      createdAt: new Date().toISOString()
    }
    setShowReply([data, ...showReply])
    dispatch(replycomment(data, auth.access_token))
    setOnReply(false)
  }

  const handleUpdate = (body: string) => {
    if (!auth.user || !auth.access_token || !edit) return

    if (body === edit.content) return setEdit(undefined)

    const newComment = { ...edit, content: body }
    if (!newComment) return
    dispatch(updateComment(newComment, auth.access_token))
    setEdit(undefined)
  }

  const handleDelete = (comment: IComment) => {
    if (!auth.access_token || !auth.user) return
    dispatch(deleteComment(comment, auth.access_token))
  }
  const Nav = (commnet: IComment) => {
    return (
      <div>
        <i
          className="fas fa-trash-alt mx-2"
          onClick={() => handleDelete(commnet)}
        />
        <i className="fas fa-edit ms-2" onClick={() => setEdit(comment)} />
      </div>
    )
  }
  return (
    <div className="w-100">
      {edit ? (
        <Input callback={handleUpdate} edit={edit} setEdit={setEdit} />
      ) : (
        <div className="comment_box">
          <div
            className="p-2"
            dangerouslySetInnerHTML={{
              __html: comment.content
            }}
          />

          <div className="d-flex justify-content-between p-2">
            <small
              style={{ cursor: 'pointer' }}
              onClick={() => setOnReply(!onReply)}
            >
              {onReply ? '-cancel' : '-reply-'}
            </small>

            <small className="d-flex">
              <div style={{ cursor: 'pointer' }}>
                {comment.blog_user_id === auth.user?._id ? (
                  comment.user._id === auth.user?._id ? (
                    Nav(comment)
                  ) : (
                    <i className="fas fa-trash-alt mx-2"></i>
                  )
                ) : (
                  comment.user._id === auth.user?._id && Nav(comment)
                )}
              </div>

              <div>{new Date(comment.createdAt).toLocaleString()}</div>
            </small>
          </div>
        </div>
      )}

      {onReply && <Input callback={handleReply} />}

      {children}
    </div>
  )
}

export default CommentList
