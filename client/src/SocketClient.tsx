import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CREATE_COMMENT,
  DELETE_COMMENT,
  DELETE_REPLY,
  REPLY_COMMENT,
  UPDATE_COMMENT,
  UPDATE_REPLY
} from './redux/types/commentType'
import { IComment, RootStore } from './utils/types'

const SocketClient = () => {
  const { socket } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()

  //create commennt
  useEffect(() => {
    if (!socket) return
    socket.on('createComment', (data: IComment) => {
      dispatch({
        type: CREATE_COMMENT,
        payload: data
      })
    })

    return () => {
      socket.off('createComment')
    }
  }, [socket, dispatch])

  //reply commennt
  useEffect(() => {
    if (!socket) return
    socket.on('replyComment', (data: IComment) => {
      dispatch({
        type: REPLY_COMMENT,
        payload: data
      })
    })

    return () => {
      socket.off('replyComment')
    }
  }, [socket, dispatch])

  //update commennt
  useEffect(() => {
    if (!socket) return
    socket.on('updateComennt', (data: IComment) => {
      dispatch({
        type: data.comment_root ? UPDATE_REPLY : UPDATE_COMMENT,
        payload: data
      })
    })

    return () => {
      socket.off('updateComennt')
    }
  }, [socket, dispatch])

  //update commennt
  useEffect(() => {
    if (!socket) return
    socket.on('deleteComment', (data: IComment) => {
      dispatch({
        type: data.comment_root ? DELETE_REPLY : DELETE_COMMENT,
        payload: data
      })
    })

    return () => {
      socket.off('deleteComment')
    }
  }, [socket, dispatch])

  return <div></div>
}

export default SocketClient
