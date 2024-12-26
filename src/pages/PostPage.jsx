import { useEffect, useState } from "react"
import ModalComment from "../components/modalComment/ModalComment"
import { useParams } from "react-router-dom"
import Post from "../components/post/Post"
import { getPost } from "../services/post.services"

const PostPage = () => {
  const { postId } = useParams()
  const [modalCommentPostId, setModalCommentPostId] = useState()
  const [post, setPost] = useState()

  const handleShowModalComment = async (postId) => {
    setModalCommentPostId(postId)
    document.body.style = "overflow-y: hidden"
  }

  const handlecloseModalComment = async () => {
    setModalCommentPostId()
    document.body.style = "overflow-y: auto"
  }

  const handleGetPost = async () => {
    try {
      const data = await getPost(postId)
      setPost(data)
    } catch {
      // setPost()
    }
  }

  const handleUpdatePostUI = (postData) => {
    setPost({
      ...post,
      content: postData.content,
      audience: postData.audience,
      media: postData.media
    })
  }

  const handleDeletePostUI = () => {
    setPost()
  }

  useEffect(() => {
    handleGetPost()
  }, [])

  return (
    <div className="posts_container">
      {modalCommentPostId && (
        <ModalComment
          handleClose={handlecloseModalComment}
          postId={modalCommentPostId}
        />
      )}
      <div className="posts">
        {post ? (
          <Post
            post={post}
            handleShow={handleShowModalComment}
            handleUpdatePostUI={handleUpdatePostUI}
            handleDeletePostUI={handleDeletePostUI}
          />
        ) : (
          <h1>Bài viết không tồn tại</h1>
        )}
      </div>
    </div>
  )
}

export default PostPage
