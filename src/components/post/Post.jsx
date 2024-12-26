import { PiDotsThreeOutlineFill } from "react-icons/pi"
import { GoHeart, GoHeartFill } from "react-icons/go"
import { BsChat, BsBookmark, BsBookmarkFill } from "react-icons/bs"
import { useContext, useEffect, useRef, useState } from "react"
import { likePost, unlikePost } from "../../services/like.services"
import { bookmarkPost, unbookmarkPost } from "../../services/bookmark.services"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "./Post.css"
import formatTime from "../../utils/formatTime"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"
import "tippy.js/themes/light.css"
import { AuthContext } from "../../contexts/AuthProvider"
import ModalPost from "../modalPost/ModalPost"
import ModalDeletePost from "../modalDeletePost/ModalDeletePost"
import { toast } from "react-toastify"
import { getOriginalPost } from "../../services/post.services"
import { Link } from "react-router-dom"

const Post = ({ post, handleShow, handleUpdatePostUI, handleDeletePostUI }) => {
  const { user } = useContext(AuthContext)
  const btn = useRef()
  const [like, setLike] = useState(post.isLike)
  const [numberLikes, setNumberLikes] = useState(post.numberLikes)
  const [bookmark, setBookmark] = useState(post.isBookmark)
  const [showModalUpdate, setShowModalUpdate] = useState(false)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [showModalShare, setShowModalShare] = useState(false)
  const [originalPost, setOriginalPost] = useState()

  const handleLike = async () => {
    await likePost(post._id)
    setLike(true)
    setNumberLikes(numberLikes + 1)
  }

  const handleUnlike = async () => {
    await unlikePost(post._id)
    setLike(false)
    setNumberLikes(numberLikes - 1)
  }

  const handleBookmark = async () => {
    await bookmarkPost(post._id)
    setBookmark(true)
  }

  const handleUnbookmark = async () => {
    await unbookmarkPost(post._id)
    setBookmark(false)
  }

  const handleShowModalUpdate = () => {
    setShowModalUpdate(true)
  }

  const handleCloseModalUpdate = () => {
    setShowModalUpdate(false)
  }

  const handleShowModalDelete = () => {
    setShowModalDelete(true)
  }

  const handleCloseModalDelete = () => {
    setShowModalDelete(false)
  }

  const handleShowModalShare = () => {
    setShowModalShare(true)
  }

  const handleCloseModalShare = () => {
    setShowModalShare(false)
  }

  const handleCopyLinkPost = async (postId) => {
    await navigator.clipboard.writeText(
      `${import.meta.env.VITE_CLIENT_URL}/posts/${postId}`
    )
    btn.current.click()
    toast.success("Đã sao chép liên kết bài viết")
  }

  const handleGetOriginalPost = async () => {
    try {
      const data = await getOriginalPost(post.originalPostId)
      setOriginalPost(data)
    } catch {
      //
    }
  }

  useEffect(() => {
    if (post.originalPostId) {
      handleGetOriginalPost()
    }
  }, [])

  return (
    <>
      {showModalUpdate && (
        <ModalPost
          postId={post._id}
          handleClose={handleCloseModalUpdate}
          type={"update"}
          handleUpdatePostUI={handleUpdatePostUI}
        />
      )}
      {showModalDelete && (
        <ModalDeletePost
          handleClose={handleCloseModalDelete}
          handleDeletePostUI={handleDeletePostUI}
          postId={post._id}
        />
      )}
      {showModalShare && (
        <ModalPost
          postId={post.originalPostId ? post.originalPostId : post._id}
          handleClose={handleCloseModalShare}
          type={"share"}
        />
      )}
      <div className="post">
        <div className="info">
          <div className="person">
            <img src={post.user.avatar.url} />
            <div>
              <Link to={`/profile/${post.user._id}`} className="username">
                {post.user.username}
              </Link>
              <span>{formatTime(post.createdAt)}</span>
            </div>
          </div>
          <div className="more">
            <Tippy
              ref={btn}
              className="tippy"
              theme="light"
              disabled={showModalUpdate || showModalDelete || showModalShare}
              interactive={true}
              placement="right"
              offset={[20, 10]}
              content={
                <ul>
                  <li onClick={() => handleCopyLinkPost(post._id)}>
                    Sao chép liên kết bài viết
                  </li>
                  {post.audience === 0 && (
                    <li onClick={handleShowModalShare}>Chia sẻ bài viết</li>
                  )}
                  {user?._id === post.user._id && (
                    <>
                      <li onClick={handleShowModalUpdate}>
                        Chỉnh sửa bài viết
                      </li>
                      <li onClick={handleShowModalDelete}>Xóa bài viết</li>
                    </>
                  )}
                </ul>
              }
              trigger="click">
              <button style={{ background: "none", border: "none" }}>
                <PiDotsThreeOutlineFill
                  size={30}
                  style={{ padding: 4, cursor: "pointer" }}
                />
              </button>
            </Tippy>
          </div>
        </div>
        <div className="post_desc">
          <p>{post.content}</p>
        </div>
        <div className="image">
          <Swiper
            style={{ borderRadius: 10 }}
            pagination={true}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper">
            {post.media.map((media) => (
              <SwiperSlide key={media.id}>
                {media.type === 0 && <img src={media.url} alt="" />}
                {media.type === 1 && <video src={media.url} controls />}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {post.originalPostId && (
          <div className="share_post" style={{ paddingBottom: 10 }}>
            {!originalPost ? (
              <span className="fs-5">Bài viết không tồn tại</span>
            ) : (
              <>
                <div className="info">
                  <div className="person">
                    <img src={originalPost.user.avatar.url} />
                    <div>
                      <Link
                        to={`/profile/${originalPost.user._id}`}
                        className="username">
                        {originalPost.user.username}
                      </Link>

                      <span>{formatTime(originalPost.createdAt)}</span>
                    </div>
                  </div>
                  <div className="more">
                    <Link target="_blank" to={`/posts/${originalPost._id}`}>
                      Xem bài viết
                    </Link>
                  </div>
                </div>
                <div className="post_desc">
                  <p>{originalPost.content}</p>
                </div>
                <div className="image">
                  <Swiper
                    style={{ borderRadius: 10 }}
                    pagination={true}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className="mySwiper">
                    {originalPost.media.map((media) => (
                      <SwiperSlide key={media.id}>
                        {media.type === 0 && <img src={media.url} alt="" />}
                        {media.type === 1 && <video src={media.url} controls />}
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </>
            )}
          </div>
        )}
        <div className="desc">
          <div className="detail">
            <span>{numberLikes} lượt thích</span>
            <span>{post.numberComments} bình luận</span>
          </div>
          <hr />
          <div className="icons">
            <div
              className="like"
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (like) handleUnlike()
                else handleLike()
              }}>
              {like ? (
                <GoHeartFill size={24} color="red" />
              ) : (
                <GoHeart size={24} />
              )}
              <span>Thích</span>
            </div>
            <div
              className="chat"
              style={{ cursor: "pointer" }}
              onClick={() => handleShow(post._id)}>
              <BsChat size={24} />
              <span>Bình luận</span>
            </div>
            <div
              className="save not_saved"
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (bookmark) handleUnbookmark()
                else handleBookmark()
              }}>
              {bookmark ? (
                <BsBookmarkFill size={24} color="black" />
              ) : (
                <BsBookmark size={24} />
              )}

              <span>Lưu</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Post
