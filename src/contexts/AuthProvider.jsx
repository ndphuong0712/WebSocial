import { createContext, useEffect, useState } from "react"
import { Outlet, useLocation, useSearchParams } from "react-router-dom"
import { getBasicInfo } from "../services/user.services"
import Loader from "../components/loader"
import { checkAccessToken } from "../services/auth.services"

const AuthContext = createContext()
const AuthProvider = () => {
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)
  const { pathname } = useLocation()
  const [query] = useSearchParams()
  const setUserContext = (user) => {
    setUser(user)
  }
  const checkAuth = async () => {
    setLoading(true)
    const data = await getBasicInfo()
    setUser(data)
    setLoading(false)
  }
  const handleLoginGoogle = async () => {
    setLoading(true)
    const data = await checkAccessToken(query.get("accessToken"))
    setUser(data)
    setLoading(false)
    localStorage.setItem("accessToken", query.get("accessToken"))
    localStorage.setItem("refreshToken", query.get("refreshToken"))
  }
  useEffect(() => {
    setLoading(false)
    if (
      pathname === "/login" &&
      query.get("accessToken") &&
      query.get("refreshToken")
    ) {
      handleLoginGoogle()
    }
    if (localStorage.getItem("accessToken")) {
      checkAuth()
    }
  }, [])

  console.log(user)
  if (loading) return <Loader loading={loading} />
  return (
    <AuthContext.Provider value={{ user, setUserContext }}>
      <Outlet />
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
