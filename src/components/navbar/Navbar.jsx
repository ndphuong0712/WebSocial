import Logo2 from "../../assets/logo/LogoWebSocial.png"
import Logo1 from "../../assets/logo/LogoWebSocialWithText.png"
import { IoHome, IoSearchSharp } from "react-icons/io5"
import { IoIosSend } from "react-icons/io"
import { CiSquarePlus } from "react-icons/ci"
import { NavLink } from "react-router-dom"
const Navbar = () => {
  return (
    <div className="nav_menu">
      <div className="fix_top">
        {/* <!-- nav for big->medium screen --> */}
        <div className="nav">
          <div className="logo">
            <a href="./home.html">
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
              <li>
                <NavLink to={"/profile"}>
                  <img
                    className="avatar"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXNLf6lX2yRCGfW9exRiCmjEYbGhq96NxQDQ&s"
                  />
                  <span className="d-none d-lg-block">Trang cá nhân</span>
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="logout">
            <p>Đăng xuất</p>
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
              <span>Đăng xuất</span>
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
            <div>
              <span>Đăng xuất</span>
            </div>
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

        <a href="./profile.html">
          <img
            className="avatar"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXNLf6lX2yRCGfW9exRiCmjEYbGhq96NxQDQ&s"
          />
          <span className="d-none d-lg-block">Trang cá nhân</span>
        </a>
      </div>
    </div>
  )
}

export default Navbar
