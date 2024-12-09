import { useEffect, useState } from "react"
import "./ModalFollow.css"
import { IoMdClose } from "react-icons/io"
import {
  getAllFollowers,
  getAllFollowings
} from "../../services/follow.services"
import UserItem from "../userItem/UserItem"

const ModalFollow = ({ type, setIsShowModal, userId }) => {
  const [users, setUsers] = useState([])

  const handleGetAllFollowers = async () => {
    const data = await getAllFollowers(userId)

    setUsers(data.users)
  }

  const handleGetAllFollowings = async () => {
    const data = await getAllFollowings(userId)

    setUsers(data.users)
  }

  useEffect(() => {
    if (type === "follower") {
      handleGetAllFollowers()
    } else {
      handleGetAllFollowings()
    }
  }, [])
  return (
    <div className="my_modal">
      <div className="container">
        <div className="header">
          <span>
            {type === "follower" ? "Người theo dõi" : "Đang theo dõi"}
          </span>
          <div
            className="close-icon"
            onClick={() => {
              setIsShowModal(false)
            }}>
            <IoMdClose />
          </div>
        </div>
        <div className="body">
          {users.length === 0 && (
            <p style={{ textAlign: "center", fontSize: 20 }}>
              {type === "follower" ? "Chưa có ai theo dõi" : "Chưa theo dõi ai"}
            </p>
          )}
          {users.map((user) => (
            <UserItem key={user.userId} userInfo={user} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ModalFollow
