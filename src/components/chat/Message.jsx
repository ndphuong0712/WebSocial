import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { Pagination, Navigation } from "swiper/modules"
import formatTime from "../../utils/formatTime"
import { useContext } from "react"
import { AuthContext } from "../../contexts/AuthProvider"

const Message = ({ message, showAvatarName, showUnSeen }) => {
  const { user } = useContext(AuthContext)
  return (
    <>
      {showUnSeen && (
        <div className="message-unseen">
          <hr />
          <span>Tin nhắn chưa đọc</span>
          <hr />
        </div>
      )}
      <div
        title={formatTime(message.createdAt)}
        className={`message-container ${
          user._id === message.user._id ? "sent" : "received"
        }`}>
        <div className="avatar">
          {showAvatarName && <img src={message.user.avatar.url} alt="" />}
        </div>

        <div className="_message">
          {showAvatarName && <span>{message.user.username}</span>}
          <div className="message">
            {message.media.length > 0 && (
              <Swiper
                style={{ borderRadius: 10 }}
                pagination={{
                  type: "fraction"
                }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="mySwiper">
                {message.media.map((v) => (
                  <SwiperSlide key={v.id}>
                    {v.type === 0 && <img src={v.url} alt="" />}
                    {v.type === 1 && <video src={v.url} controls />}
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            {message.content && (
              <span className="content">{message.content}</span>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Message
