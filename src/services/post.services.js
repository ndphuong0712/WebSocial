import axiosInstance from "../utils/axiosInstance"

export const getPostsByUser = async (userId) => {
  const { data } = await axiosInstance.get(`/posts/user/${userId}`)
  return data
}

export const getLikePostsByUser = async () => {
  const { data } = await axiosInstance.get("/posts/likes")
  return data
}

export const getBookmarkPostsByUser = async () => {
  const { data } = await axiosInstance.get("/posts/bookmarks")
  return data
}
