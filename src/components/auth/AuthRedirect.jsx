import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthProvider"

const AuthRedirect = () => {
  const { user } = useContext(AuthContext)
  if (user) return <Navigate to={"/"} replace />

  return <Outlet />
}

export default AuthRedirect
