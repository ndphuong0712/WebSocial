import { createContext, useContext, useEffect, useState } from "react"
import {
  getConversations,
  getInfoConversation
} from "../services/conversation.services"
import { useParams } from "react-router-dom"
import { getMessagesByConversation } from "../services/message.services"
import { NotificationContext } from "./NotificationProvider"
// import { NotificationContext } from "./NotificationProvider"

// import Loader from "../components/Loader"

const ChatContext = createContext()
const ChatProvider = ({ children }) => {
  const { conversationId } = useParams()

  const { socket } = useContext(NotificationContext)
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const handleGetConversations = async () => {
    const data = await getConversations()
    setConversations(data)
    setLoading(false)
  }
  const handleGetInfoConversationAndMessages = async () => {
    setLoading(true)
    const [conversation, messages] = await Promise.all([
      getInfoConversation(conversationId),
      getMessagesByConversation(conversationId)
    ])
    setCurrentConversation(conversation)
    setMessages(messages)
    setLoading(false)
  }

  // const handleUpdateNotification = () => {
  //   const newNotifications = [...notifications]
  //   for (let i = 0; i < notifications.length; ++i) {
  //     if (newNotifications[i].conversationId === conversationId) {
  //       newNotifications[i].hasNotification = false
  //       console.log("HHHHHHHFGH", newNotifications)
  //       setNotifications(newNotifications)
  //     }
  //   }
  // }

  useEffect(() => {
    handleGetConversations()
  }, [])
  useEffect(() => {
    if (conversationId) {
      handleGetInfoConversationAndMessages()
    }
  }, [conversationId])
  useEffect(() => {
    socket.on("getNewMessage", async (newMessage) => {
      if (conversationId === newMessage.conversationId) {
        //Khi người dùng cũng đang trong đoạn chat
        const _messages = [...messages]
        _messages.unshift(newMessage)
        setMessages(_messages)

        let conversation = conversations.find(
          (c) => c._id === newMessage.conversationId
        )
        if (conversation) {
          conversation.lastMessage = {
            ...newMessage,
            username: newMessage.user.username
          }
          const _conversations = conversations.filter(
            (c) => c._id !== newMessage.conversationId
          )
          setConversations([conversation, ..._conversations])
        } else {
          const _conversations = await getConversations()
          setConversations(_conversations)
        }
      } else {
        let conversation = conversations.find(
          (c) => c._id === newMessage.conversationId
        )
        if (conversation) {
          conversation.lastMessage = {
            ...newMessage,
            username: newMessage.user.username
          }
          const _conversations = conversations.filter(
            (c) => c._id !== newMessage.conversationId
          )
          setConversations([conversation, ..._conversations])
        } else {
          const _conversations = await getConversations()
          setConversations(_conversations)
        }
      }
    })
    return () => socket.off("getNewMessage")
  }, [conversationId, messages])

  return (
    <ChatContext.Provider
      value={{ conversations, currentConversation, messages }}>
      {!loading && children}
    </ChatContext.Provider>
  )
}

export { ChatProvider, ChatContext }
