import { useEffect, useState } from "react"
import "./UserItem.css"
import { followUser, unfollowUser } from "../../services/follow.services"

const UserItem = ({ userInfo }) => {
  const [follow, setFollow] = useState(userInfo.isFollow)
  // console.log("Follow:", follow, userInfo.isFollow)
  const handleFollow = async () => {
    await followUser(userInfo.userId)
    setFollow(true)
  }

  const handleUnfollow = async () => {
    await unfollowUser(userInfo.userId)
    setFollow(false)
  }

  useEffect(() => {
    console.log("UserItem")
  }, [])

  return (
    <div className="user_item">
      <img className="avatar" src={userInfo.avatar.url} alt="" />
      <div className="info">
        <span>{userInfo.username}</span>
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
