import axiosInstance from "../utils/axiosInstance"

export const getBasicInfo = async () => {
  const { data } = await axiosInstance.get("/auth/me")
  return data
}
