import { createContext, useContext, useEffect, useState } from "react"
import {
  getConversations,
  getInfoConversation
} from "../services/conversation.services"
import { useParams } from "react-router-dom"
import { getMessagesByConversation } from "../services/message.services"
import { NotificationContext } from "./NotificationProvider"
import { AuthContext } from "./AuthProvider"
// import { NotificationContext } from "./NotificationProvider"

// import Loader from "../components/Loader"

const ChatContext = createContext()
const ChatProvider = ({ children }) => {
  const { conversationId } = useParams()
  const { user } = useContext(AuthContext)
  const { socket, allConversations, setAllConversations, setNotifications } =
    useContext(NotificationContext)
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
      //Khi người dùng cũng đang trong đoạn chat
      if (conversationId === newMessage.conversationId) {
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
      }
      //Khi người dùng không trong đoạn chat
      else {
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

  //Khi tạo cuộc trò chuyện 1-1 mới
  useEffect(() => {
    if (currentConversation) {
      if (!allConversations.some((c) => c === currentConversation._id)) {
        setAllConversations([...allConversations, currentConversation._id])
        const notification = {
          conversationId: currentConversation._id,
          hasNotification: false,
          lastMessageId: null,
          userId: user._id
        }
        setNotifications((prev) => [notification, ...prev])
        console.log("Đã tới đây")
        console.log("socket: ", socket)
        socket.emit("newChatFriend", {
          friendId: currentConversation.participants.find((p) => p != user._id),
          conversationId: currentConversation._id
        })
      }
    }
  }, [currentConversation])

  return (
    <ChatContext.Provider
      value={{ conversations, currentConversation, messages }}>
      {!loading && children}
    </ChatContext.Provider>
  )
}

export { ChatProvider, ChatContext }
