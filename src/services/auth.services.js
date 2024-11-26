import axiosInstance from "../utils/axiosInstance"
import axios from "axios"

export const loginUser = async (dataBody) => {
  const { data } = await axiosInstance.post("/auth/login", dataBody)
  localStorage.setItem("accessToken", data.accessToken)
  localStorage.setItem("refreshToken", data.refreshToken)
  return data
}

export const logoutUser = (dataBody) =>
  axios.post("/auth/logout", dataBody, {
    baseURL: import.meta.env.VITE_SERVER_URL
  })

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

export const registerUser = async (dataBody) => {
  await axiosInstance.post("/auth/register", dataBody)
}

export const verifyEmail = async (dataBody) => {
  await axios.post("/auth/verifyEmail", dataBody, {
    baseURL: import.meta.env.VITE_SERVER_URL
  })
}

export const forgetPassword = async (email) => {
  await axios.post(
    "/auth/sendMailForgetPassword",
    { email },
    {
      baseURL: import.meta.env.VITE_SERVER_URL
    }
  )
}

export const resetPassword = async (dataBody) => {
  await axios.post("/auth/resetPassword", dataBody, {
    baseURL: import.meta.env.VITE_SERVER_URL
  })
}
