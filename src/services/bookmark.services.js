import axiosInstance from "../utils/axiosInstance"

export const bookmarkPost = (postId) => {
  return axiosInstance.post(`/bookmarks/${postId}`)
}

export const unbookmarkPost = (postId) => {
  return axiosInstance.delete(`/bookmarks/${postId}`)
}
