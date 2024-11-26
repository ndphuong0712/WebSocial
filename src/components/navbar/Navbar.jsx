import Logo2 from "../../assets/logo/LogoWebSocial.png"
import Logo1 from "../../assets/logo/LogoWebSocialWithText.png"
import { IoHome, IoSearchSharp } from "react-icons/io5"
import { IoIosSend } from "react-icons/io"
import { CiSquarePlus } from "react-icons/ci"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { logoutUser } from "../../services/auth.services"
import { useContext, useState } from "react"
import Loader from "../Loader"
import { AuthContext } from "../../contexts/AuthProvider"
const Navbar = ({ notifications }) => {
  const navigate = useNavigate()
  const { user, setUserContext } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const handleLogout = async () => {
    setLoading(true)
    await logoutUser({ token: localStorage.getItem("refreshToken") })
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setLoading(false)
    setUserContext()
    navigate("/login")
  }
  return (
    <>
      <div className="nav_menu">
        <div className="fix_top">
          {/* <!-- nav for big->medium screen --> */}
          <div className="nav">
            <div className="logo">
              <a href="/">
                <img
                  className="d-block d-lg-none small-logo"
                  src={Logo2}
                  alt="logo"
                />
                <img
                  className="d-none d-lg-block"
                  src={Logo1}
                  width="120"
                  alt="logo"
                />
              </a>
            </div>
            <div className="menu">
              <ul>
                <li>
                  <NavLink to={"/"}>
                    <IoHome size={24} style={{ marginRight: 10 }} />
                    <span className="d-none d-lg-block">Trang chủ</span>
                  </NavLink>
                </li>
                <li id="search_icon">
                  <NavLink to={"/search"}>
                    <IoSearchSharp size={24} style={{ marginRight: 10 }} />
                    <span className="d-none d-lg-block search">Tìm kiếm</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/chat"}>
                    <IoIosSend size={24} style={{ marginRight: 10 }} />
                    <span className="d-none d-lg-block">Tin nhắn</span>
                    {notifications.filter((n) => n.hasNotification).length >
                      0 && (
                      <span
                        className="d-none d-lg-block bg-danger rounded-circle text-center p-0"
                        style={{
                          width: 28,
                          height: 28,
                          lineHeight: "28px",
                          color: "black"
                        }}>
                        +{notifications.filter((n) => n.hasNotification).length}
                      </span>
                    )}
                  </NavLink>
                </li>

                <li>
                  <div
                    style={{
                      color: "rgb(38, 38, 38)",
                      fontSize: 17,
                      display: "flex",
                      flexDirection: "row",
                      fontWeight: 400,
                      cursor: "pointer"
                    }}>
                    <CiSquarePlus size={24} style={{ marginRight: 10 }} />
                    <span className="d-none d-lg-block">Tạo bài viết</span>
                  </div>
                </li>
                {user && (
                  <li>
                    <NavLink to={"/profile"}>
                      <img className="avatar" src={user.avatar.url} />
                      <span className="d-none d-lg-block">Trang cá nhân</span>
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>

            <div>
              {user ? (
                <button onClick={handleLogout} className="btn-info btn">
                  Đăng xuất
                </button>
              ) : (
                <Link className="btn-info btn" to={"/login"}>
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
          {/* <!-- nav for small screen  --> */}
          <div className="nav_sm">
            <div className="content">
              <div className="logo">
                <img className="logo" src={Logo2} width="32" />
                <span>Web Social</span>
              </div>
              <div>
                {user ? (
                  <button className="btn-info btn" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                ) : (
                  <Link className="btn-info btn" to={"/login"}>
                    Đăng nhập
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* <!-- nav for ex-small screen  --> */}
          <div className="nav_xm">
            <div className="content">
              <div className="logo">
                <img className="logo" src={Logo2} width="32" />
                <span>Web Social</span>
              </div>
            </div>
            <div>
              {user ? (
                <button className="btn-info btn" onClick={handleLogout}>
                  Đăng xuất
                </button>
              ) : (
                <Link className="btn-info btn" to={"/login"}>
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* <!-- menu in the botton for smal screen  --> */}
        <div className="nav_bottom">
          <NavLink to={"/"}>
            <IoHome size={24} color="black" />
          </NavLink>
          <NavLink to={"/search"}>
            <IoSearchSharp size={24} color="black" />
          </NavLink>
          <span>
            <CiSquarePlus size={24} color="black" />
          </span>
          <NavLink to={"/chat"}>
            <IoIosSend size={24} color="black" />
          </NavLink>

          {user && (
            <NavLink to="/profile">
              <img className="avatar" src={user.avatar.url} />
              <span className="d-none d-lg-block">Trang cá nhân</span>
            </NavLink>
          )}
        </div>
      </div>
      <Loader loading={loading} />
    </>
  )
}

export default Navbar
