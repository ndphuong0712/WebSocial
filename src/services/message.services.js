import axiosInstance from "../utils/axiosInstance"

export const getMessagesByConversation = async (conversationId) => {
  const { data } = await axiosInstance.get(`/messages/${conversationId}`)
  return data
}

export const sendMessage = ({ files, content, conversationId }) => {
  const body = new FormData()
  files.forEach((file) => body.append("media", file))
  body.append("content", content)
  body.append("conversationId", conversationId)
  return axiosInstance.post("/messages", body, {
    headers: { "Content-Type": "multipart/form-data" }
  })
}
