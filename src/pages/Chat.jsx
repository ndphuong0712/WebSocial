import { useContext } from "react"
import { ChatContext } from "../contexts/ChatProvider"
import ConversationItem from "../components/chat/ConversationItem"
import { Outlet } from "react-router-dom"

const Chat = () => {
  const { conversations } = useContext(ChatContext)
  return (
    <div className="chat_div">
      <div className="chat-container">
        <div className="sibebar-conversation">
          <h1>Chat</h1>
          <div className="conversation-list">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
              />
            ))}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default Chat
