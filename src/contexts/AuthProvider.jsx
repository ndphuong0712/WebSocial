import { createContext } from "react"
import { Outlet } from "react-router-dom"

const AuthContext = createContext()
const AuthProvider = () => {
  return (
    <AuthContext.Provider value={123}>
      <Outlet />
    </AuthContext.Provider>
  )
}

export default AuthProvider
export { Outlet }
