import { Button, Modal } from "react-bootstrap"
import "./ModalChangeAvatar.css"
import { changeAvatar } from "../../services/user.services"
import { useContext, useState } from "react"
import { AuthContext } from "../../contexts/AuthProvider"
import Loader from "../Loader"
import { toast } from "react-toastify"

const ModalChangeAvatar = ({ avatarFile, setAvatarFile, setUserInfo }) => {
  const { user, setUserContext } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  const handleChangeAvatar = async () => {
    setLoading(true)
    const data = await changeAvatar(avatarFile)
    setAvatarFile()
    setUserContext({ _id: user._id, username: user.username, avatar: data })
    setUserInfo((prev) => {
      const newData = { ...prev }
      newData.avatar = data
      return newData
    })
    setLoading(false)
    toast.success("Thay đổi ảnh đại diện thành công")
  }
  return (
    <>
      <Modal show={!!avatarFile} size="sm" className="my-modal">
        <Modal.Header>
          <Modal.Title>Ảnh đại diện</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            width={150}
            height={150}
            className="rounded-circle box-shadow"
            src={avatarFile?.preview}
            alt=""
          />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={() => setAvatarFile()}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleChangeAvatar}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
      <Loader loading={loading} />
    </>
  )
}

export default ModalChangeAvatar
