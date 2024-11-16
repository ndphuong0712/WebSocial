import { createContext } from "react"
import { Outlet } from "react-router-dom"

const NotificationContext = createContext()
const NotificationProvider = () => {
  return (
    <NotificationContext.Provider value={123}>
      <Outlet />
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
export { NotificationContext }
