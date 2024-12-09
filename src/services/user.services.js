import axiosInstance from "../utils/axiosInstance"

export const getBasicInfo = async () => {
  const { data } = await axiosInstance.get("/auth/me")
  return data
}

export const getDetailInfoUser = async ({ userId, myId }) => {
  if (userId === myId) {
    const { data } = await axiosInstance.get("/users/me")
    return data
  }
  const { data } = await axiosInstance.get(`/users/${userId}`)
  return data
}

export const updateMe = async (dataBody) => {
  return axiosInstance.patch("/users/me", dataBody)
}

export const changeAvatar = async (file) => {
  const body = new FormData()
  body.append("avatar", file)
  const { data } = await axiosInstance.patch("/users/avatar", body, {
    headers: { "Content-Type": "multipart/form-data" }
  })
  return data
}

export const changePassword = (dataBody) => {
  return axiosInstance.patch("/users/password", dataBody)
}
