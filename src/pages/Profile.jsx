import { MdOutlineArticle } from "react-icons/md"
import { BsBookmark, BsChat } from "react-icons/bs"
import { GoHeart } from "react-icons/go"
import { PiDotsThreeOutlineFill } from "react-icons/pi"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { getDetailInfoUser } from "../services/user.services"
import { AuthContext } from "../contexts/AuthProvider"
import ModalInfo from "../components/modalInfo/ModalInfo"
import {
  getBookmarkPostsByUser,
  getLikePostsByUser,
  getPostsByUser
} from "../services/post.services"
import ModalFollow from "../components/modalFollow/ModalFollow"
import { followUser, unfollowUser } from "../services/follow.services"
import { findOrCreateFriendConversation } from "../services/conversation.services"
const Profile = () => {
  const { user } = useContext(AuthContext)
  const { userId } = useParams()
  const [query] = useSearchParams()
  const navigate = useNavigate()

  const [userInfo, setUserInfo] = useState()
  const [isShowModalInfo, setIsShowModalInfo] = useState(false)
  const [isShowModalFollow, setIsShowModalFollow] = useState(false)
  const [followType, setFollowType] = useState()
  const [posts, setPosts] = useState([])

  console.log("POSTS IN PROFILE: ", posts)

  const handleGetUserInfo = async () => {
    const data = await getDetailInfoUser({ userId, myId: user?._id })
    setUserInfo(data)
  }

  const handleFollow = async () => {
    await followUser(userId)
    setUserInfo({ ...userInfo, isFollowUser: true })
  }

  const handleUnfollow = async () => {
    await unfollowUser(userId)
    setUserInfo({ ...userInfo, isFollowUser: false })
  }

  const handleOnClickChat = async () => {
    const conversationId = await findOrCreateFriendConversation(userId)
    navigate(`/chat/${conversationId}`)
  }

  const handleGetMyPosts = async () => {
    const postType = query.get("postType")
    let _posts
    if (postType === "like") {
      _posts = await getLikePostsByUser()
    } else if (postType === "bookmark") {
      _posts = await getBookmarkPostsByUser()
    } else {
      _posts = await getPostsByUser(userId)
    }
    setPosts(_posts)
  }

  // Lấy thông tin của user
  useEffect(() => {
    handleGetUserInfo()
  }, [userId])

  useEffect(() => {
    handleGetMyPosts()
  }, [userId, query])

  return (
    userInfo && (
      <div
        className="posts_container"
        // style={{ height: "calc(100vh - 35px)", overflowY: "hidden" }}
      >
        <div className="profile">
          <div className="profile_info">
            <div className="cart">
              <div className="img">
                <img src={userInfo.avatar.url} />
              </div>
              <div className="info">
                <p className="name">
                  {userInfo.username}
                  {user._id === userId && (
                    <button
                      className="edit_profile"
                      onClick={() => setIsShowModalInfo(true)}>
                      Chỉnh sửa thông tin
                    </button>
                  )}
                </p>
                {user._id !== userId && (
                  <div className="info_btn">
                    {userInfo.isFollowUser ? (
                      <button
                        className="edit_profile"
                        style={{ backgroundColor: "#b2adad" }}
                        onClick={handleUnfollow}>
                        Đã theo dõi
                      </button>
                    ) : (
                      <button className="edit_profile" onClick={handleFollow}>
                        Theo dõi
                      </button>
                    )}
                    <button
                      className="edit_profile"
                      onClick={handleOnClickChat}>
                      Nhắn tin
                    </button>
                  </div>
                )}
                <div className="general_info">
                  <p
                    onClick={() => {
                      setFollowType("follower")
                      setIsShowModalFollow(true)
                    }}>
                    <span>{userInfo.numberFollowers}</span> followers
                  </p>
                  <p
                    onClick={() => {
                      setFollowType("following")
                      setIsShowModalFollow(true)
                    }}>
                    <span onClick={() => setFollowType("following")}>
                      {userInfo.numberFollowings}
                    </span>{" "}
                    following
                  </p>
                </div>
                <p className="nick_name">{userInfo.fullname}</p>
                <p className="desc">{userInfo.biography}</p>
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
              <Link
                to={`/profile/${userId}`}
                className={`nav-link ${
                  query.get("postType") !== "like" &&
                  query.get("postType") !== "bookmark"
                    ? "active"
                    : ""
                }`}
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true">
                <MdOutlineArticle size={18} style={{ marginRight: 5 }} />
                Bài viết
              </Link>
            </li>
            {userId === user._id && (
              <li className="nav-item mx-2" role="presentation">
                <Link
                  to={`/profile/${userId}?postType=like`}
                  className={`nav-link ${
                    query.get("postType") === "like" ? "active" : ""
                  }`}
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-profile"
                  aria-selected="false">
                  <GoHeart size={18} style={{ marginRight: 5 }} />
                  Đã thích
                </Link>
              </li>
            )}
            {userId === user._id && (
              <li className="nav-item mx-2" role="presentation">
                <Link
                  to={`/profile/${userId}?postType=bookmark`}
                  className={`nav-link ${
                    query.get("postType") === "bookmark" ? "active" : ""
                  }`}
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false">
                  <BsBookmark size={16} style={{ marginRight: 5 }} />
                  Đã lưu
                </Link>
              </li>
            )}
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
        <ModalInfo
          isShowModal={isShowModalInfo}
          setIsShowModal={setIsShowModalInfo}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
        {isShowModalFollow && (
          <ModalFollow
            setIsShowModal={setIsShowModalFollow}
            type={followType}
            userId={userId}
          />
        )}
      </div>
    )
  )
}

export default Profile
