import { Modal } from "react-bootstrap"
import "./ModalInfo.css"
import getDateNowString from "../../utils/getDateNowString"
import { useContext, useEffect, useState } from "react"
import formatTime2 from "../../utils/formatTime2"
import { fullnameRegex, passwordRegex, usernameRegex } from "../../utils/regex"
import { changePassword, updateMe } from "../../services/user.services"
import { AuthContext } from "../../contexts/AuthProvider"
import ModalChangeAvatar from "../modalChangeAvatar/ModalChangeAvatar"
import { toast } from "react-toastify"

const ModalInfo = ({ isShowModal, setIsShowModal, userInfo, setUserInfo }) => {
  const { user, setUserContext } = useContext(AuthContext)
  const [avatarFile, setAvatarFile] = useState()
  const [username, setUsername] = useState(userInfo.username)
  const [fullname, setFullname] = useState(userInfo.fullname)
  const [gender, setGender] = useState(userInfo.gender)
  const [dateOfBirth, setDateOfBirth] = useState(userInfo.dateOfBirth)
  const [biography, setBiography] = useState(userInfo.biography)
  const [errorInfo, setErrorInfo] = useState({})
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [errorPassword, setErrorPassword] = useState({})

  const handleChangeFile = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0]
      file.preview = URL.createObjectURL(file)
      setAvatarFile(file)
    }
  }

  const handleChangeInfo = async () => {
    let check = true
    const err = {}
    if (!usernameRegex.test(username)) {
      err.username =
        "Tên tài khoản phải dài từ 1 đến 32 ký tự; Tên người dùng chỉ có thể chứa các chữ cái, số, dấu chấm và dấu gạch dưới, không có dấu chấm liên tiếp và không được bắt đầu hoặc kết thúc bằng dấu chấm"
      check = false
    }
    if (!fullnameRegex.test(fullname)) {
      err.fullname =
        "Tên người dùng phải ít nhất 1 kí tự và không bao gồm số, kí tự đặc biệt"
      check = false
    }
    if (check) {
      try {
        await updateMe({
          username: username.trim(),
          fullname: fullname.trim(),
          dateOfBirth,
          gender,
          biography: biography.trim()
        })
        const newUserInfo = Object.assign(
          { ...userInfo },
          {
            username: username.trim(),
            fullname: fullname.trim(),
            dateOfBirth,
            gender,
            biography: biography.trim()
          }
        )
        setUserInfo(newUserInfo)
        setUserContext({ _id: user._id, username, avatar: user.avatar })
        toast.success("Cập nhật thông tin thành công")
      } catch (a) {
        err.username = "Tên tài khoản đã tồn tại"
      }
    }
    setErrorInfo(err)
  }

  const handleChangePassword = async () => {
    let check = true
    const err = {}
    if (!passwordRegex.test(newPassword)) {
      check = false
      err.newPassword =
        "Mật khẩu phải có từ 8 đến 32 kí tự, bao gồm ít nhất 1 chữ thường , 1 chữ hoa, 1 số, 1 kí tự đặc biệt"
    }
    if (newPassword !== confirmNewPassword) {
      check = false
      err.confirmNewPassword = "Mật khẩu và xác nhận mật khẩu không khớp nhau"
    }
    if (check) {
      try {
        await changePassword({
          currentPassword: oldPassword,
          newPassword,
          confirmNewPassword
        })
        toast.success("Thay đổi mật khẩu thành công")
        setOldPassword("")
        setNewPassword("")
        setConfirmNewPassword("")
      } catch {
        err.oldPassword = "Mật khẩu không đúng"
      }
    }
    setErrorPassword(err)
  }

  useEffect(() => {
    return () => avatarFile?.preview && URL.revokeObjectURL(avatarFile.preview)
  }, [avatarFile])

  return (
    <>
      <Modal
        size="lg"
        show={isShowModal}
        onHide={() => {
          setIsShowModal(false)
        }}
        aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Chỉnh sửa thông tin
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="fw-bold">Thông tin cá nhân</h5>
          <div className="d-flex">
            <div className="info-avatar d-flex flex-column align-items-center">
              <img
                width={150}
                height={150}
                className="rounded-circle"
                src={userInfo.avatar.url}
                alt=""
              />
              <input
                type="file"
                accept="image/*"
                id="avatar"
                value={""}
                hidden
                onInput={handleChangeFile}
              />
              <label htmlFor="avatar" className="btn btn-info mt-3">
                Thay đổi ảnh đại diện
              </label>
            </div>
            <div className="px-4 flex-grow-1">
              <div className="mb-3 row">
                <label htmlFor="email" className="col-sm-3 col-form-label">
                  Email
                </label>
                <div className="col-sm-9">
                  <input
                    readOnly
                    type="text"
                    className="form-control bg-light"
                    id="email"
                    defaultValue={userInfo.email}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="username" className="col-sm-3 col-form-label">
                  Tên tài khoản
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <span
                  className="text-danger fst-italic"
                  style={{ fontSize: 14 }}>
                  {errorInfo.username}
                </span>
              </div>
              <div className="mb-3 row">
                <label htmlFor="fullname" className="col-sm-3 col-form-label">
                  Họ tên
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    id="fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
                <span
                  className="text-danger fst-italic"
                  style={{ fontSize: 14 }}>
                  {errorInfo.fullname}
                </span>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-3 col-form-label">Giới tính</label>
                <div className="col-sm-9 d-flex align-items-center">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="inlineRadioOptions"
                      id="male"
                      value="0"
                      checked={Number(gender) === 0}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="male">
                      Nam
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="inlineRadioOptions"
                      id="female"
                      value="1"
                      checked={Number(gender) === 1}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="female">
                      Nữ
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="inlineRadioOptions"
                      id="unknown"
                      value="2"
                      checked={Number(gender) === 2}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="unknown">
                      Không xác định
                    </label>
                  </div>
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="date" className="col-sm-3 col-form-label">
                  Ngày sinh
                </label>
                <div className="col-sm-9">
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    max={getDateNowString()}
                    value={formatTime2(dateOfBirth)}
                    onChange={(e) => {
                      const dateISO = new Date(e.target.value).toISOString()
                      setDateOfBirth(dateISO)
                    }}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label htmlFor="biography" className="col-sm-3 col-form-label">
                  Giới thiệu
                </label>
                <div className="col-sm-9">
                  <textarea
                    className="form-control"
                    id="biography"
                    rows="3"
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <button className="btn btn-info" onClick={handleChangeInfo}>
                  Cập nhật thông tin
                </button>
              </div>
            </div>
          </div>
          <h5 className="fw-bold">Mật khẩu</h5>
          <div className="px-4">
            <div className="mb-3 row">
              <label htmlFor="oldPassword" className="col-sm-4 col-form-label">
                Mật khẩu hiện tại
              </label>
              <div className="col-sm-8">
                <input
                  type="password"
                  className="form-control"
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <span className="text-danger fst-italic" style={{ fontSize: 14 }}>
                {errorPassword.oldPassword}
              </span>
            </div>
            <div className="mb-3 row">
              <label htmlFor="newPassword" className="col-sm-4 col-form-label">
                Mật khẩu mới
              </label>
              <div className="col-sm-8">
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <span className="text-danger fst-italic" style={{ fontSize: 14 }}>
                {errorPassword.newPassword}
              </span>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="confirmNewPassword"
                className="col-sm-4 col-form-label">
                Xác nhận mật khẩu mới
              </label>
              <div className="col-sm-8">
                <input
                  type="password"
                  className="form-control"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
              <span className="text-danger fst-italic" style={{ fontSize: 14 }}>
                {errorPassword.confirmNewPassword}
              </span>
            </div>
            <div className="d-flex justify-content-end">
              <button className="btn btn-info" onClick={handleChangePassword}>
                Thay đổi mật khẩu
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <ModalChangeAvatar
        avatarFile={avatarFile}
        setAvatarFile={setAvatarFile}
        setUserInfo={setUserInfo}
      />
    </>
  )
}

export default ModalInfo
