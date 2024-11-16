import { MdOutlineArticle } from "react-icons/md"
import { BsBookmark, BsChat } from "react-icons/bs"
import { GoHeart } from "react-icons/go"
import { PiDotsThreeOutlineFill } from "react-icons/pi"
const Profile = () => {
  return (
    <div className="posts_container">
      <div className="profile">
        <div className="profile_info">
          <div className="cart">
            <div className="img">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXNLf6lX2yRCGfW9exRiCmjEYbGhq96NxQDQ&s"
                alt=""
              />
            </div>
            <div className="info">
              <p className="name">
                Zineb_essoussi
                <button className="edit_profile">Chỉnh sửa thông tin</button>
              </p>
              {/* <div className="info_btn">
                    <button className="edit_profile">Theo dõi</button>
                    <button className="edit_profile">Nhắn tin</button>
                  </div> */}
              <div className="general_info">
                <p>
                  <span>177</span> followers
                </p>
                <p>
                  <span>137</span> following
                </p>
              </div>
              <p className="nick_name">Zin Ess</p>
              <p className="desc">
                Iam an engineering student <br />
                ENSAO
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="posts">
        <ul
          className="nav-pills w-100 d-flex justify-content-center"
          id="pills-tab"
          role="tablist">
          <li className="nav-item mx-2" role="presentation">
            <button
              className="nav-link active"
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true">
              <MdOutlineArticle size={18} style={{ marginRight: 5 }} />
              Bài viết
            </button>
          </li>
          <li className="nav-item mx-2" role="presentation">
            <button
              className="nav-link"
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-profile"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false">
              <GoHeart size={18} style={{ marginRight: 5 }} />
              Đã thích
            </button>
          </li>
          <li className="nav-item mx-2" role="presentation">
            <button
              className="nav-link"
              id="pills-contact-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-contact"
              type="button"
              role="tab"
              aria-controls="pills-contact"
              aria-selected="false">
              <BsBookmark size={16} style={{ marginRight: 5 }} />
              Đã lưu
            </button>
          </li>
        </ul>
        <div className="post">
          <div className="info">
            <div className="person">
              <img src="https://i.ibb.co/3S1hjKR/account1.jpg" />
              <div>
                <p href="#">zineb</p>
                <span>45m</span>
              </div>
            </div>
            <div className="more">
              <PiDotsThreeOutlineFill
                size={30}
                style={{ padding: 4, cursor: "pointer" }}
              />
            </div>
          </div>
          <div className="post_desc">
            <p>
              <a className="bold" href="#">
                zineb
              </a>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima
              accusantium aperiam quod non minus cumque, recusandae hic soluta
              harum aut nulla...
            </p>
          </div>
          <div className="image">
            <img src="https://i.ibb.co/Jqh3rHv/img1.jpg" />
          </div>
          <div className="desc">
            <div className="detail">
              <span>13 lượt thích</span>
              <span>6 bình luận</span>
            </div>
            <hr />
            <div className="icons">
              <div className="like" style={{ cursor: "pointer" }}>
                <GoHeart size={24} />
                <span>Thích</span>
              </div>
              <div className="chat" style={{ cursor: "pointer" }}>
                <BsChat size={24} />
                <span>Bình luận</span>
              </div>
              <div className="save not_saved" style={{ cursor: "pointer" }}>
                <BsBookmark size={24} />
                <span>Lưu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
