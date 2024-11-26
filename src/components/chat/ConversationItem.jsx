import { NavLink } from "react-router-dom"
import formatTime from "../../utils/formatTime"
import { NotificationContext } from "../../contexts/NotificationProvider"
import { useContext } from "react"

const ConversationItem = ({ conversation }) => {
  const { onlineUsers, notifications } = useContext(NotificationContext)
  return (
    <NavLink
      to={`/chat/${conversation._id}`}
      className={`conversation ${
        notifications.some(
          (notification) =>
            notification.conversationId === conversation._id &&
            notification.hasNotification
        ) && "notification"
      }`}>
      <div className="avatar">
        <img src={conversation.avatar.url} alt="" />
        {conversation.type === 1 && onlineUsers[conversation.friendId] && (
          <span className="online" />
        )}
      </div>
      <div className="info">
        <div className="name">
          <p>{conversation.type === 0 ? "Cá nhân" : conversation.name}</p>
          <span className="date">
            {formatTime(conversation.lastMessage.createdAt)}
          </span>
        </div>
        <span className="message">
          {conversation.lastMessage.content === ""
            ? "File phương tiện"
            : conversation.lastMessage.content}
        </span>
      </div>
    </NavLink>
  )
}

export default ConversationItem
