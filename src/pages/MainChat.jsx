import React, { useContext, useEffect, useMemo } from "react"
import { MdInfo } from "react-icons/md"
import { ChatContext } from "../contexts/ChatProvider"
import Message from "../components/chat/Message"
import InputChat from "../components/chat/InputChat"
import { AuthContext } from "../contexts/AuthProvider"
import { NotificationContext } from "../contexts/NotificationProvider"
import { updateNotification } from "../services/notification.services"

const MainChat = () => {
  const { user } = useContext(AuthContext)
  const { currentConversation, messages } = useContext(ChatContext)
  const { notifications, setNotifications } = useContext(NotificationContext)
  const notification = useMemo(() => {
    return notifications.find(
      (n) => n.conversationId === currentConversation?._id
    )
  }, [notifications, currentConversation])

  useEffect(() => {
    if (
      messages.length > 0 &&
      currentConversation &&
      notifications.find(
        (n) =>
          n.conversationId === currentConversation._id &&
          n.lastMessageId !== messages[0]._id
      )
    ) {
      console.log("Gọi API cập nhật thông báo")
      updateNotification({
        conversationId: currentConversation._id,
        lastMessageId: messages[0]._id
      })
    }
    return () => {
      const newNotifications = [...notifications]
      for (let i = 0; i < newNotifications.length; ++i) {
        if (newNotifications[i].conversationId === currentConversation?._id) {
          newNotifications[i].lastMessageId = messages[0]?._id
          setNotifications(newNotifications)
        }
      }
    }
  }, [currentConversation, messages])

  return (
    <div className="chat-box">
      {currentConversation ? (
        <>
          <div className="chat-header">
            <div className="chat-info">
              <img src={currentConversation.avatar.url} />
              <p className="name">{currentConversation.name}</p>
            </div>
            <div className="chat-icon">
              <MdInfo className="icon" color="#daa520" />
            </div>
          </div>
          <div className="chat-content">
            {messages.map((message, index) => (
              <React.Fragment key={message._id}>
                {notification &&
                  notification.lastMessageId === message._id &&
                  index !== 0 &&
                  user._id !== messages[0].userId && (
                    <div className="message-unseen">
                      <hr />
                      <span>Tin nhắn chưa đọc</span>
                      <hr />
                    </div>
                  )}
                <Message
                  message={message}
                  showAvatarName={
                    user._id !== message.userId &&
                    message.userId !== messages[index + 1]?.userId
                  }
                />
              </React.Fragment>
            ))}
            {notification &&
              notification.lastMessageId === null &&
              messages.length > 0 &&
              user._id !== messages[0].userId && (
                <div className="message-unseen">
                  <hr />
                  <span>Tin nhắn chưa đọc</span>
                  <hr />
                </div>
              )}
          </div>
          <InputChat />
        </>
      ) : (
        <h1 className="m-auto">No conversation</h1>
      )}
    </div>
  )
}

export default MainChat
