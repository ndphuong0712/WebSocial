import axiosInstance from "../utils/axiosInstance"

export const likePost = (postId) => {
  return axiosInstance.post(`/likes/${postId}`)
}

export const unlikePost = (postId) => {
  return axiosInstance.delete(`/likes/${postId}`)
}
