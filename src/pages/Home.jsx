import Post from "../components/post/Post"
import ModalComment from "../components/modalComment/ModalComment"
import { getNewsFeed } from "../services/post.services"
import { useEffect, useRef, useState } from "react"
import Loader2 from "../components/loader/Loader2"

const Home = () => {
  const loader = useRef()
  const [posts, setPosts] = useState([])
  const [modalCommentPostId, setModalCommentPostId] = useState()
  const [showLoader, setShowLoader] = useState(false)
  const [lastTime, setLastTime] = useState()

  const handleGetNewsFeed = async () => {
    const data = await getNewsFeed(lastTime)
    if (data.length > 0) {
      setPosts([...posts, ...data])
      setLastTime(data[data.length - 1].createdAt)
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

  const handleCloseModalComment = async () => {
    setModalCommentPostId()
    document.body.style = "overflow-y: auto"
  }

  useEffect(() => {
    handleGetNewsFeed()
  }, [])

  useEffect(() => {
    let observer
    if (showLoader) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleGetNewsFeed()
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
    <div className="posts_container">
      {modalCommentPostId && (
        <ModalComment
          handleClose={handleCloseModalComment}
          postId={modalCommentPostId}
        />
      )}
      <div className="posts">
        {posts.length === 0 ? (
          <h1>Chưa có bài viết</h1>
        ) : (
          <>
            {posts.map((post) => (
              <Post
                key={post._id}
                post={post}
                handleShow={handleShowModalComment}
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
    </div>
  )
}

export default Home
