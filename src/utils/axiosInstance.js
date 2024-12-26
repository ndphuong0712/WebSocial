import axios from "axios"

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const axiosInstance = axios.create({ baseURL: SERVER_URL })

axiosInstance.interceptors.request.use(
  (config) => {
    if (localStorage.getItem("accessToken"))
      config.headers.Authorization = `Bearer ${localStorage.getItem(
        "accessToken"
      )}`
    return config
  },
  (error) => Promise.reject(error)
)

let isRefreshToken = false
let requestsToRefresh = []

axiosInstance.interceptors.response.use(
  (res) => {
    return res.data
  },
  async (error) => {
    if (
      error.response.status === 422 ||
      (error.config.method === "get" &&
        error.config.url.startsWith("/posts") &&
        (error.response.status === 403 ||
          error.response.status === 404 ||
          error.response.status === 400))
    ) {
      return Promise.reject(error.response.data)
    }
    if (
      error.response.status !== 401 ||
      error.response.data.message !== "jwt expired"
    ) {
      window.location.href = "/login"
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      return Promise.reject(error)
    }
    try {
      if (!isRefreshToken) {
        refreshToken()
      }
      return new Promise((resolve) => {
        requestsToRefresh.push(() => {
          const originalRequest = error.config
          resolve(axiosInstance(originalRequest))
        })
      })
    } catch (error) {
      window.location.href = "/login"
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      return Promise.reject(error)
    }
  }
)

const refreshToken = async () => {
  try {
    isRefreshToken = true
    const res = await axios.post(`${SERVER_URL}/auth/refreshToken`, {
      token: localStorage.getItem("refreshToken")
    })
    localStorage.setItem("refreshToken", res.data.data.refreshToken)
    localStorage.setItem("accessToken", res.data.data.accessToken)
    await Promise.all(requestsToRefresh.map((cb) => cb()))
    isRefreshToken = false
    requestsToRefresh = []
  } catch (error) {
    window.location.href = "/login"
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    return Promise.reject(error)
  }
}

export default axiosInstance
