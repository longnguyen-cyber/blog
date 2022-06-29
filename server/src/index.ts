import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { Server, Socket } from 'socket.io'
import { createServer } from 'http'

import routes from './routes/index'

//middleware
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})
app.use(morgan('dev'))
app.use(cookieParser())

//socket
const http = createServer(app)
export const io = new Server(http)

io.on('connection', (socket: Socket) => {
  SocketServer(socket)
})

//Route auth
app.use('/api', routes)

import './config/database'
import { SocketServer } from './config/socket'
import path from 'path'

//production deloy
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'build', 'index.html'))
  })
}

//server listening
const PORT = process.env.PORT || 5000
http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
