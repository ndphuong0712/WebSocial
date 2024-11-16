import { Outlet } from "react-router-dom"
import Navbar from "../components/navbar/navbar"

const MainLayout = () => {
  return (
    <div className="post_page">
      <Navbar />
      <div className="second_container">
        <div className="main_section">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default MainLayout
