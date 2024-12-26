import { useContext, useEffect, useState } from "react"
import { IoIosImages } from "react-icons/io"
import { MdSend } from "react-icons/md"
import { IoIosCloseCircle } from "react-icons/io"
import InputEmoji from "react-input-emoji"
import { ChatContext } from "../../contexts/ChatProvider"
import { sendMessage } from "../../services/message.services"
import Loader from "../loader/Loader"
import { NotificationContext } from "../../contexts/NotificationProvider"

const InputChat = () => {
  const { currentConversation } = useContext(ChatContext)
  const [message, setMessage] = useState("")
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const { socket } = useContext(NotificationContext)

  const handleInputFiles = (e) => {
    const newfiles = [...e.target.files].map((file) => {
      if (file.type.startsWith("image"))
        file.preview = URL.createObjectURL(file)
      return file
    })
    setFiles((prev) => [...prev, ...newfiles])
  }
  const handleDeleteFile = (index) => {
    files[index].preview && URL.revokeObjectURL(files[index].preview)
    setFiles(files.filter((file, i) => i !== index))
  }
  const handleSendMessage = async () => {
    setLoading(true)
    const { data: newMessage } = await sendMessage({
      files,
      content: message.replaceAll("</br>", "\n"),
      conversationId: currentConversation._id
    })
    socket.emit("sendMessage", newMessage)
    setLoading(false)
    setMessage("")
    setFiles([])
  }

  useEffect(() => {
    setMessage("")
    setFiles([])
  }, [currentConversation])
  return (
    <>
      {files.length > 0 && (
        <div className="chat-files">
          {files.map((file, index) =>
            file.type.startsWith("image") ? (
              <div key={file.name} className="image-preview">
                <img src={file.preview} alt="" />
                <IoIosCloseCircle
                  size={18}
                  color="white"
                  className="icon"
                  onClick={() => handleDeleteFile(index)}
                />
              </div>
            ) : (
              <div key={file.name} className="video-preview">
                <p>{file.name}</p>
                <IoIosCloseCircle
                  size={18}
                  color="white"
                  className="icon"
                  onClick={() => handleDeleteFile(index)}
                />
              </div>
            )
          )}
        </div>
      )}
      <div className="chat-input">
        <label htmlFor="file">
          <IoIosImages className="icon" color="#daa520" />
        </label>
        <input
          type="file"
          id="file"
          hidden
          multiple
          accept="image/*,video/*"
          onInput={handleInputFiles}
        />

        <InputEmoji
          value={message}
          shouldReturn={true}
          onEnter={() => {
            if (message.trim() !== "" || files.length > 0) handleSendMessage()
          }}
          onChange={(text) => {
            if (text == "</br>") text = ""
            setMessage(text)
          }}
        />
        {(message.trim() !== "" || files.length > 0) && (
          <MdSend
            className="icon"
            color="#daa520"
            onClick={handleSendMessage}
          />
        )}
      </div>
      <Loader loading={loading} />
    </>
  )
}

export default InputChat
