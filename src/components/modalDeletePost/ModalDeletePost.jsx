import { Button, Modal } from "react-bootstrap"
import { deletePost } from "../../services/post.services"
import { toast } from "react-toastify"

const ModalDeletePost = ({ handleClose, postId, handleDeletePostUI }) => {
  const handleDeletePost = async () => {
    await deletePost(postId)
    handleDeletePostUI(postId)
    toast.success("Xóa bài viết thành công")
  }
  return (
    <Modal show={true} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title className="fs-3">Xóa bài viết</Modal.Title>
      </Modal.Header>
      <Modal.Body>Bạn muốn xóa bài viết này?</Modal.Body>
      <Modal.Footer>
        <Button className="mx-auto" variant="danger" onClick={handleDeletePost}>
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalDeletePost
