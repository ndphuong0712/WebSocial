import "./ModalComment.css"
import { IoMdClose } from "react-icons/io"
import { MdSend } from "react-icons/md"
import InputEmoji from "react-input-emoji"
import { Form } from "react-bootstrap"
import React, { useContext, useEffect, useRef, useState } from "react"
import {
  createComment,
  getCommentsByPostId
} from "../../services/comment.services"
import formatTime from "../../utils/formatTime"
import { AuthContext } from "../../contexts/AuthProvider"
import { Link } from "react-router-dom"

const ModalComment = ({ handleClose, postId }) => {
  const { user } = useContext(AuthContext)
  const input = useRef()
  const [sort, setSort] = useState(-1)
  const [comments, setComments] = useState([])
  const [replyCommentId, setReplyCommentId] = useState()
  const [currentComment, setCurrentComment] = useState("")

  const handleChangeSort = async (sort) => {
    setSort(sort)
  }

  const handleReplyComment = (commentId) => {
    setReplyCommentId(commentId)
    input.current.focus()
  }

  const handleCloseReplyComment = () => {
    setReplyCommentId()
  }

  const handleGetCommnents = async () => {
    const data = await getCommentsByPostId({ postId, sort })
    setComments(data)
  }

  const handleChangeComment = async (content) => {
    if (content === "</br>") content = ""
    setCurrentComment(content)
  }

  const handleCreateComment = async () => {
    if (currentComment === "") {
      return
    }
    const dataBody = {
      postId,
      content: currentComment.replaceAll("</br>", "\n")
    }

    if (replyCommentId) dataBody.originalCommentId = replyCommentId

    const data = await createComment(dataBody)
    if (data.originalCommentId) {
      const newComments = [...comments]
      for (let i = 0; i < newComments.length; ++i) {
        if (newComments[i]._id === data.originalCommentId) {
          newComments[i].children.push({
            _id: data._id,
            originalCommentId: data.originalCommentId,
            content: data.content,
            createdAt: data.createdAt,
            user
          })
          break
        }
      }
      setComments(newComments)
    } else {
      setComments([
        ...comments,
        {
          _id: data._id,
          originalCommentId: data.originalCommentId,
          content: data.content,
          createdAt: data.createdAt,
          user,
          children: []
        }
      ])
    }
    setReplyCommentId()
    setCurrentComment("")
  }

  useEffect(() => {
    handleGetCommnents()
  }, [sort])

  return (
    <div className="comment-modal">
      <div className="comment-container">
        <div className="header">
          <span>Bình luận</span>
          <div className="close-icon" onClick={handleClose}>
            <IoMdClose />
          </div>
        </div>
        <div className="body">
          <div className="select">
            <Form.Select
              size="sm"
              onChange={(e) => handleChangeSort(e.target.value)}>
              <option value={-1}>Mới nhất</option>
              <option value={1}>Cũ nhất</option>
            </Form.Select>
          </div>
          {comments.length === 0 && (
            <h1 className="text-center mt-5">Chưa có bình luận</h1>
          )}
          {comments.map((comment) => (
            <React.Fragment key={comment._id}>
              <div className="comment">
                <img src={comment.user.avatar.url} alt="" />
                <div className="comment-content">
                  <Link
                    onClick={handleClose}
                    to={`/profile/${comment.user._id}`}
                    className="username">
                    {comment.user.username}
                  </Link>
                  <span className="content">{comment.content}</span>
                  <div className="comment-footer">
                    <span className="date">
                      {formatTime(comment.createdAt)}
                    </span>
                    <span
                      className="reply"
                      onClick={() => handleReplyComment(comment._id)}>
                      Phản hồi
                    </span>
                  </div>
                </div>
              </div>
              {comment.children.map((commentChild) => (
                <div key={commentChild._id} className="comment children">
                  <img src={commentChild.user.avatar.url} alt="" />
                  <div className="comment-content">
                    <span className="username">
                      {commentChild.user.username}
                    </span>
                    <span className="content">{commentChild.content}</span>
                    <div className="comment-footer">
                      <span className="date">
                        {formatTime(commentChild.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
          {/* <div className="comment">
            <img
              src="https://cdn.24h.com.vn/upload/4-2021/images/2021-11-27/1-1638024206-305-width650height813.jpg"
              alt=""
            />
            <div className="comment-content">
              <span className="username">licn</span>
              <span className="content">
                {
                  "dsffffffffgfd dfgdgdfgdfgdfg dfgdfgdfg dfgfdgdfgdfg fdfgfdg fgd fgfgfdgfdgfgd gdgfdfg"
                }
              </span>
              <div className="comment-footer">
                <span className="date">07/12/2023</span>
                <span className="reply">Phản hồi</span>
              </div>
            </div>
          </div>
          <div className="comment children">
            <img
              src="https://cdn.24h.com.vn/upload/4-2021/images/2021-11-27/1-1638024206-305-width650height813.jpg"
              alt=""
            />
            <div className="comment-content">
              <span className="username">licn</span>
              <span className="content">{"dsfff"}</span>
              <div className="comment-footer">
                <span className="date">07/12/2023</span>
              </div>
            </div>
          </div>
          <div className="comment children">
            <img
              src="https://cdn.24h.com.vn/upload/4-2021/images/2021-11-27/1-1638024206-305-width650height813.jpg"
              alt=""
            />
            <div className="comment-content">
              <span className="username">licn</span>
              <span className="content">{"dsfff"}</span>
              <div className="comment-footer">
                <span className="date">07/12/2023</span>
              </div>
            </div>
          </div>
          <div className="comment children">
            <img
              src="https://cdn.24h.com.vn/upload/4-2021/images/2021-11-27/1-1638024206-305-width650height813.jpg"
              alt=""
            />
            <div className="comment-content">
              <span className="username">licn</span>
              <span className="content">{"dsfff"}</span>
              <div className="comment-footer">
                <span className="date">07/12/2023</span>
              </div>
            </div>
          </div>
          <div className="comment children">
            <img
              src="https://cdn.24h.com.vn/upload/4-2021/images/2021-11-27/1-1638024206-305-width650height813.jpg"
              alt=""
            />
            <div className="comment-content">
              <span className="username">licn</span>
              <span className="content">{"dsfff"}</span>
              <div className="comment-footer">
                <span className="date">07/12/2023</span>
              </div>
            </div>
          </div>
          <div className="comment children">
            <img
              src="https://cdn.24h.com.vn/upload/4-2021/images/2021-11-27/1-1638024206-305-width650height813.jpg"
              alt=""
            />
            <div className="comment-content">
              <span className="username">licn</span>
              <span className="content">{"dsfff"}</span>
              <div className="comment-footer">
                <span className="date">07/12/2023</span>
              </div>
            </div>
          </div>
          <div className="comment">
            <img
              src="https://cdn.24h.com.vn/upload/4-2021/images/2021-11-27/1-1638024206-305-width650height813.jpg"
              alt=""
            />
            <div className="comment-content">
              <span className="username">licn</span>
              <span className="content">{"dsfff"}</span>
              <div className="comment-footer">
                <span className="date">07/12/2023</span>
                <span className="reply">Phản hồi</span>
              </div>
            </div>
          </div> */}
        </div>
        <div className="input">
          {replyCommentId && (
            <span className="reply">
              Phản hồi bình luận{" "}
              <IoMdClose
                className="close-reply"
                onClick={handleCloseReplyComment}
              />
            </span>
          )}
          <div className="input2">
            <InputEmoji
              ref={input}
              shouldReturn={true}
              value={currentComment}
              onChange={handleChangeComment}
              onEnter={handleCreateComment}
            />
            <MdSend
              size={24}
              className="send-icon"
              onClick={handleCreateComment}
              style={{ cursor: currentComment ? "pointer" : "not-allowed" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalComment
