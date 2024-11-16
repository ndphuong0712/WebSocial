import axiosInstance from "../utils/axiosInstance"
import axios from "axios"

export const loginUser = async (dataBody) => {
  const { data } = await axiosInstance.post("/auth/login", dataBody)
  localStorage.setItem("accessToken", data.accessToken)
  localStorage.setItem("refreshToken", data.refreshToken)
  return data
}

export const checkAccessToken = async (accessToken) => {
  try {
    const { data } = await axios.get("/auth/me", {
      baseURL: import.meta.env.VITE_SERVER_URL,
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    return data.data
  } catch {
    window.location.href = "/login"
  }
}
