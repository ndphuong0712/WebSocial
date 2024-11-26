import ENV from '@constants/env'
import { Server as ServerHttp } from 'http'
import { Server } from 'socket.io'

const handleSocket = (httpServer: ServerHttp) => {
  const onlineUsers: { [key: string]: string[] } = {}
  const io = new Server(httpServer, { cors: { origin: ENV.CLIENT_URL } })

  io.on('connection', socket => {
    console.log('Kết nối mới:', socket.id)
    if (onlineUsers[socket.handshake.auth.id] && onlineUsers[socket.handshake.auth.id].length > 0)
      onlineUsers[socket.handshake.auth.id].push(socket.id)
    else onlineUsers[socket.handshake.auth.id] = [socket.id]
    console.log('onlineUsers: ', onlineUsers)
    io.emit('getOnlineUsers', onlineUsers)

    socket.on('disconnect', () => {
      console.log('Hủy kết nối:', socket.id)
      onlineUsers[socket.handshake.auth.id] = onlineUsers[socket.handshake.auth.id].filter(
        socketId => socketId !== socket.id
      )
    })
    socket.on('joinRooms', (roomIds: string[]) => {
      roomIds.forEach(roomId => socket.join(roomId))
      console.log(socket.id + ':', socket.rooms)
    })
    socket.on('sendMessage', message => {
      io.to(message.conversationId).emit('getNewNotification', message)
      io.to(message.conversationId).emit('getNewMessage', message)
    })
  })
}

export default handleSocket
