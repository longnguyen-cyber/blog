import { Socket } from 'socket.io'

export const SOCKET = 'SOCKET'

export interface ISocketType {
  type: typeof SOCKET
  payload: Socket
}
