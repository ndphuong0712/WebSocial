import { createContext, useContext, useEffect, useState } from "react"
import { Outlet, useParams } from "react-router-dom"
import { AuthContext } from "./AuthProvider"
import { io } from "socket.io-client"
import { getAllConversations } from "../services/conversation.services"
import { getNotifications } from "../services/notification.services"

const NotificationContext = createContext()
const NotificationProvider = () => {
  const { user } = useContext(AuthContext)
  const { conversationId } = useParams()
  const [socket, setSocket] = useState()
  const [allConversations, setAllConversations] = useState([])
  const [notifications, setNotifications] = useState([])
  const [onlineUsers, setOnlineUsers] = useState({})
  const [loading, setLoading] = useState(true)

  const handleGetAllConversations = async () => {
    const data = await getAllConversations()
    setAllConversations(data)
  }
  const handleGetNotifications = async () => {
    const data = await getNotifications()
    setNotifications(data)
  }

  const handleGetAllConversationsAndNotifications = async () => {
    await Promise.all([handleGetAllConversations(), handleGetNotifications()])
    setLoading(false)
  }

  useEffect(() => {
    if (user) {
      handleGetAllConversationsAndNotifications()
      const newSocket = io(import.meta.env.VITE_SERVER_URL, {
        auth: { id: user._id }
      })
      newSocket.on("connect", () => {
        setSocket(newSocket)
        newSocket.on("getOnlineUsers", (onlineUsers) =>
          setOnlineUsers(onlineUsers)
        )
      })
      return () => newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on("getNewNotification", (newMessage) => {
        if (conversationId === newMessage.conversationId) {
          //Khi người dùng cũng đang trong đoạn chat
        } else {
          const _notifications = [...notifications]
          for (let i = 0; i < _notifications.length; ++i) {
            if (
              _notifications[i].conversationId === newMessage.conversationId
            ) {
              _notifications[i].hasNotification = true
            }
            setNotifications(_notifications)
          }
        }
      })
    }
    return () => {
      if (socket) socket.off("getNewNotification")
    }
  }, [notifications, socket, conversationId])

  console.log("NOTIFICATIONS: ", notifications)

  useEffect(() => {
    if (conversationId) {
      const newNotifications = [...notifications]
      for (let i = 0; i < newNotifications.length; ++i) {
        if (newNotifications[i].conversationId === conversationId) {
          newNotifications[i].hasNotification = false
        }
      }
      setNotifications(newNotifications)
    }
  }, [conversationId])

  useEffect(() => {
    if (socket) {
      socket.emit("joinRooms", allConversations)
    }
  }, [socket, allConversations])

  return (
    <NotificationContext.Provider
      value={{ socket, notifications, onlineUsers, setNotifications }}>
      {!user || (!loading && socket && <Outlet />)}
    </NotificationContext.Provider>
  )
}

export { NotificationContext, NotificationProvider }
