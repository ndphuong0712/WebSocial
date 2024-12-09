import axiosInstance from "../utils/axiosInstance"

export const getAllFollowers = async (userId) => {
  const { data } = await axiosInstance.get(`/follows/followers/${userId}`)
  return data
}

export const getAllFollowings = async (userId) => {
  const { data } = await axiosInstance.get(`/follows/followings/${userId}`)
  return data
}

export const followUser = (userId) => {
  return axiosInstance.post(`/follows/${userId}`)
}

export const unfollowUser = (userId) => {
  return axiosInstance.delete(`/follows/${userId}`)
}
