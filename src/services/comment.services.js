import axiosInstance from "../utils/axiosInstance"

export const getCommentsByPostId = async ({ postId, sort }) => {
  const { data } = await axiosInstance.get(`/comments/${postId}?sort=${sort}`)
  return data
}

export const createComment = async (dataBody) => {
  const { data } = await axiosInstance.post("/comments", dataBody)
  return data
}
