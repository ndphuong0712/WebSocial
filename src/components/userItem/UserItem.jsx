import { useState } from "react"
import "./UserItem.css"
import { followUser, unfollowUser } from "../../services/follow.services"
import { Link } from "react-router-dom"

const UserItem = ({ userInfo, handleCloseModal }) => {
  const [follow, setFollow] = useState(userInfo.isFollow)
  const handleFollow = async () => {
    await followUser(userInfo.userId)
    setFollow(true)
  }

  const handleUnfollow = async () => {
    await unfollowUser(userInfo.userId)
    setFollow(false)
  }

  return (
    <div className="user_item">
      <img className="avatar" src={userInfo.avatar.url} alt="" />
      <div className="info">
        <Link
          className="username"
          to={`/profile/${userInfo.userId}`}
          onClick={handleCloseModal}>
          {userInfo.username}
        </Link>

        <span>{userInfo.fullname}</span>
      </div>
      <div className="btn">
        {!userInfo.isMe &&
          (follow ? (
            <button className="btn btn-secondary" onClick={handleUnfollow}>
              Đã theo dõi
            </button>
          ) : (
            <button className="btn btn-info" onClick={handleFollow}>
              Theo dõi
            </button>
          ))}
      </div>
    </div>
  )
}

export default UserItem
