import { Outlet } from "react-router-dom"
import Navbar from "../components/navbar/Navbar"
import { useContext } from "react"
import { NotificationContext } from "../contexts/NotificationProvider"

const MainLayout = () => {
  const { notifications } = useContext(NotificationContext)
  return (
    <div className="post_page">
      <Navbar notifications={notifications} />
      <div className="second_container">
        <div className="main_section">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default MainLayout
