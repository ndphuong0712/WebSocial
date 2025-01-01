import { MdOutlineArticle } from "react-icons/md"
import { BsBookmark } from "react-icons/bs"
import { GoHeart } from "react-icons/go"
import { useContext, useEffect, useRef, useState } from "react"
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
import ModalComment from "../components/modalComment/ModalComment"
import Post from "../components/post/Post"
import Loader2 from "../components/loader/Loader2"
const Profile = () => {
  const { user } = useContext(AuthContext)
  const { userId } = useParams()
  const [query] = useSearchParams()
  const navigate = useNavigate()
  const loader = useRef()
  const [userInfo, setUserInfo] = useState()
  const [isShowModalInfo, setIsShowModalInfo] = useState(false)
  const [isShowModalFollow, setIsShowModalFollow] = useState(false)
  const [followType, setFollowType] = useState()
  const [posts, setPosts] = useState([])
  const [modalCommentPostId, setModalCommentPostId] = useState()
  const [showLoader, setShowLoader] = useState(false)
  const [lastTime, setLastTime] = useState()

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

  const handleGetPosts = async ({ isReset }) => {
    const postType = query.get("postType")
    let _lastTime = isReset ? null : lastTime
    let _posts = isReset ? [] : posts
    let data
    if (postType === "like") {
      data = await getLikePostsByUser(_lastTime)
      setLastTime(data[data.length - 1]?.likeAt)
    } else if (postType === "bookmark") {
      data = await getBookmarkPostsByUser(_lastTime)
      setLastTime(data[data.length - 1]?.bookmarkAt)
    } else {
      data = await getPostsByUser(userId, _lastTime)
      setLastTime(data[data.length - 1]?.createdAt)
    }
    if (data.length > 0) {
      setPosts([..._posts, ...data])
    }
    if (data.length === 10) {
      setShowLoader(true)
    } else {
      setShowLoader(false)
    }
  }

  const handleShowModalComment = async (postId) => {
    setModalCommentPostId(postId)
    document.body.style = "overflow-y: hidden"
  }

  const handlecloseModalComment = async () => {
    setModalCommentPostId()
    document.body.style = "overflow-y: auto"
  }

  const handleUpdatePostUI = (postData) => {
    setPosts(
      posts.map((post) => {
        if (post._id === postData._id) {
          return {
            ...post,
            content: postData.content,
            audience: postData.audience,
            media: postData.media
          }
        }
        return post
      })
    )
  }

  const handleDeletePostUI = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId))
  }

  // Lấy thông tin của user
  useEffect(() => {
    handleGetUserInfo()
  }, [userId])

  useEffect(() => {
    setPosts([])
    setLastTime()
    setShowLoader(false)
    handleGetPosts({ isReset: true })
  }, [userId, query])

  useEffect(() => {
    let observer
    if (showLoader) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleGetPosts({ isReset: false })
          }
        })
      })
      observer.observe(loader.current)
    }
    return () => {
      if (showLoader && loader.current) {
        observer.unobserve(loader.current)
      }
    }
  }, [showLoader, lastTime])

  return (
    userInfo && (
      <div className="posts_container">
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
          {posts.length === 0 ? (
            <h1>Chưa có bài viết</h1>
          ) : (
            <>
              {posts.map((post) => (
                <Post
                  key={post._id}
                  post={post}
                  handleShow={handleShowModalComment}
                  handleUpdatePostUI={handleUpdatePostUI}
                  handleDeletePostUI={handleDeletePostUI}
                />
              ))}
              {showLoader && (
                <div
                  ref={loader}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                  <Loader2 />
                </div>
              )}
            </>
          )}
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
        {modalCommentPostId && (
          <ModalComment
            handleClose={handlecloseModalComment}
            postId={modalCommentPostId}
          />
        )}
      </div>
    )
  )
}

export default Profile
