import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { createPost, getPost, updatePost } from "../../services/post.services"
import { IoIosCloseCircle } from "react-icons/io"
import { toast } from "react-toastify"
import "./ModalPost.css"
import Loader from "../loader/Loader"

const ModalPost = ({
  handleClose,
  type = "create",
  postId,
  handleUpdatePostUI
}) => {
  const [audience, setAudience] = useState(0)
  const [content, setContent] = useState("")
  const [originalPostId, setOriginalPostId] = useState()
  const [media, setMedia] = useState([])
  const [files, setFiles] = useState([])
  const [deleteMedia, setDeleteMedia] = useState([])
  const [loading, setLoading] = useState(false)

  const handleGetPost = async () => {
    const data = await getPost(postId)
    setAudience(data.audience)
    setContent(data.content)
    setMedia(data.media)
    setOriginalPostId(data.originalPostId)
  }

  const handleChangeAudience = (audience) => {
    setAudience(audience)
  }

  const handleChangeContent = (content) => {
    setContent(content)
  }

  const handleAddMedia = (newFiles) => {
    const newMedia = [...media]
    for (let i = 0; i < newFiles.length; ++i) {
      if (newFiles[i].type.startsWith("image")) {
        newFiles[i].preview = URL.createObjectURL(newFiles[i])
        newMedia.push({
          type: 0,
          url: newFiles[i].preview,
          name: newFiles[i].name
        })
      } else if (newFiles[i].type.startsWith("video")) {
        newMedia.push({ type: -1, name: newFiles[i].name })
      }
    }
    setMedia(newMedia)
    setFiles([...files, ...newFiles])
  }

  const handleDeleteMedia = (media1, index) => {
    if (type === "update" && media1.id)
      setDeleteMedia([...deleteMedia, media1.id])
    else if (media1.url) URL.revokeObjectURL(media1.url)
    setMedia(media.filter((m, i) => i !== index))
    setFiles(files.filter((f) => f.name !== media1.name))
  }

  const handleUpdatePost = async () => {
    if (content.trim() !== "" || media.length > 0) {
      setLoading(true)
      const data = await updatePost({
        postId,
        audience,
        content,
        deleteMedia,
        media: files
      })
      setLoading(false)
      handleUpdatePostUI(data)
      handleClose()
      toast.success("Sửa bài viết thành công")
    }
  }

  const handleCreatePost = async () => {
    if (content.trim() !== "" || files.length > 0) {
      setLoading(true)
      await createPost({
        audience,
        content,
        media: files,
        originalPostId: postId
      })
      setLoading(false)
      handleClose()
      toast.success("Tạo bài viết thành công")
    }
  }

  useEffect(() => {
    if (type === "update") handleGetPost()
  }, [])
  return (
    <>
      <Loader loading={loading} />
      <Modal show={true} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-3">
            {type === "update"
              ? "Chỉnh sửa bài viết"
              : type === "share"
              ? "Chia sẻ bài viết"
              : "Tạo bài viết"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form.Select
              value={audience}
              onChange={(e) => handleChangeAudience(e.target.value)}
              size="sm"
              style={{
                width: "fit-content",
                marginBottom: 12
              }}>
              <option value={0}>Công khai</option>
              <option value={1}>Người theo dõi</option>
              <option value={2}>Chỉ mình tôi</option>
            </Form.Select>

            <Form.Control
              as="textarea"
              placeholder="Nội dung bài viết"
              style={{ height: "70px", resize: "none", marginBottom: 12 }}
              value={content}
              onChange={(e) => handleChangeContent(e.target.value)}
            />

            {!originalPostId && type != "share" && (
              <>
                {media.length > 0 && (
                  <div className="media-container">
                    {media.map((m, i) => (
                      <div key={i} className="media">
                        {m.type === 0 && <img src={m.url} alt="" />}
                        {m.type === 1 && <video src={m.url} controls />}
                        {m.type === -1 && (
                          <div className="video-preview">{m.name}</div>
                        )}
                        <IoIosCloseCircle
                          className="close-icon"
                          onClick={() => handleDeleteMedia(m, i)}
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="add-media">
                  <span>Thêm ảnh, video</span>
                  <label className="btn-add-file" htmlFor="add-file">
                    Thêm
                  </label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    hidden
                    id="add-file"
                    value={""}
                    onInput={(e) => {
                      handleAddMedia(e.target.files)
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="mx-auto"
            variant="primary"
            onClick={() => {
              if (type === "update") handleUpdatePost()
              else handleCreatePost()
            }}>
            {type === "update" ? "Lưu" : type === "share" ? "Chia sẻ" : "Tạo"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalPost
