import axiosInstance from "../utils/axiosInstance"

export const getAllConversations = async () => {
  const { data } = await axiosInstance.get("/conversations/all")
  return data.map((v) => v._id)
}

export const getConversations = async () => {
  const { data } = await axiosInstance.get("/conversations")
  return data
}

export const getInfoConversation = async (conversationId) => {
  const { data } = await axiosInstance.get(`/conversations/${conversationId}`)
  return data
}
