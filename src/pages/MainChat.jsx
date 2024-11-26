import React, { useContext, useEffect, useMemo } from "react"
import { MdInfo } from "react-icons/md"
import { ChatContext } from "../contexts/ChatProvider"
import Message from "../components/chat/Message"
import InputChat from "../components/chat/InputChat"
import { AuthContext } from "../contexts/AuthProvider"
import { NotificationContext } from "../contexts/NotificationProvider"
import { updateNotification } from "../services/notification.services"
// import { NotificationContext } from "../contexts/NotificationProvider"

const MainChat = () => {
  const { user } = useContext(AuthContext)
  const { currentConversation, messages } = useContext(ChatContext)
  const { notifications, setNotifications } = useContext(NotificationContext)
  const notification = useMemo(() => {
    return notifications.find(
      (n) => n.conversationId === currentConversation?._id
    )
  }, [notifications, currentConversation])

  useEffect(() => {
    if (
      messages.length > 0 &&
      currentConversation &&
      notifications.find(
        (n) =>
          n.conversationId === currentConversation._id &&
          n.lastMessageId !== messages[0]._id
      )
    ) {
      console.log("Gọi API cập nhật thông báo")
      updateNotification({
        conversationId: currentConversation._id,
        lastMessageId: messages[0]._id
      })
    }
    return () => {
      const newNotifications = [...notifications]
      for (let i = 0; i < newNotifications.length; ++i) {
        if (newNotifications[i].conversationId === currentConversation?._id) {
          newNotifications[i].lastMessageId = messages[0]?._id
          setNotifications(newNotifications)
        }
      }
    }
  }, [currentConversation, messages])

  // const notification = useMemo(() => {
  //   const notification = notifications.find(
  //     (n) => n.conversationId === currentConversation?._id
  //   )
  //   return notification
  // }, [messages, notifications, currentConversation])

  // useEffect(() => {
  //   return () => {
  //     setNotifications(
  //       notifications.filter(
  //         (n) => n.conversationId !== currentConversation?._id
  //       )
  //     )
  //   }
  // }, [currentConversation])

  return (
    <div className="chat-box">
      {currentConversation ? (
        <>
          <div className="chat-header">
            <div className="chat-info">
              <img src={currentConversation.avatar.url} />
              <p className="name">{currentConversation.name}</p>
            </div>
            <div className="chat-icon">
              <MdInfo className="icon" color="#daa520" />
            </div>
          </div>
          <div className="chat-content">
            {messages.map((message, index) => (
              <React.Fragment key={message._id}>
                {notification &&
                  notification.lastMessageId === message._id &&
                  index !== 0 &&
                  user._id !== messages[0].userId && (
                    <div className="message-unseen">
                      <hr />
                      <span>Tin nhắn chưa đọc</span>
                      <hr />
                    </div>
                  )}
                <Message
                  message={message}
                  showAvatarName={
                    user._id !== message.userId &&
                    message.userId !== messages[index + 1]?.userId
                  }
                  // showUnSeen={
                  //   notification && notification.lastMessage === message._id
                  // }
                />
              </React.Fragment>
            ))}
            {notification &&
              notification.lastMessageId === null &&
              user._id !== messages[0].userId && (
                <div className="message-unseen">
                  <hr />
                  <span>Tin nhắn chưa đọc</span>
                  <hr />
                </div>
              )}
          </div>
          <InputChat />
        </>
      ) : (
        <h1 className="m-auto">No conversation</h1>
      )}
    </div>
  )
}

export default MainChat

// {/* <div className="message-container received">
// <div className="avatar">
//   {/* <img
//     src="https://res.cloudinary.com/ndp0712/image/upload/v1732208049/WebSocial/gameejuicjdwhziqvmxy.jpg"
//     alt=""
//   /> */}
// </div>

// <div className="message">
//   {/* <Swiper
//     style={{ borderRadius: 10 }}
//     pagination={{
//       type: "fraction"
//     }}
//     navigation={true}
//     modules={[Pagination, Navigation]}
//     className="mySwiper">
//     <SwiperSlide>
//       <img
//         src="https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg"
//         alt=""
//       />
//     </SwiperSlide>
//   </Swiper> */}
//   <span className="content">
//     {
//       "gfg   gf  fgf  fgfg fdf sfdf dfdf fdfg sss \n gh hftt tttty tytyy yt fgg đ đ ss xx bb nn ff ê rrrrrrrrrrrrrrrrrr yytyyyyyyyyy    ê"
//     }
//   </span>
// </div>
// </div>
// <div className="message-container received">
// <div className="avatar">
//   {/* <img
//     src="https://res.cloudinary.com/ndp0712/image/upload/v1732208049/WebSocial/gameejuicjdwhziqvmxy.jpg"
//     alt=""
//   /> */}
// </div>

// <div className="message">
//   <Swiper
//     style={{ borderRadius: 10 }}
//     pagination={{
//       type: "fraction"
//     }}
//     navigation={true}
//     modules={[Pagination, Navigation]}
//     className="mySwiper">
//     <SwiperSlide>
//       <img
//         src="https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg"
//         alt=""
//       />
//     </SwiperSlide>
//   </Swiper>
//   <span className="content">ABC</span>
// </div>
// </div>
// <div className="message-container received">
// <div className="avatar">
//   <img
//     src="https://res.cloudinary.com/ndp0712/image/upload/v1732208049/WebSocial/gameejuicjdwhziqvmxy.jpg"
//     alt=""
//   />
// </div>

// <div className="message">
//   <Swiper
//     style={{ borderRadius: 10 }}
//     pagination={{
//       type: "fraction"
//     }}
//     navigation={true}
//     modules={[Pagination, Navigation]}
//     className="mySwiper">
//     <SwiperSlide>
//       <img
//         src="https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg"
//         alt=""
//       />
//     </SwiperSlide>
//     <SwiperSlide>
//       <img
//         src="https://images2.thanhnien.vn/528068263637045248/2023/5/11/base64-1683774325007671396078.png"
//         alt=""
//       />
//     </SwiperSlide>
//   </Swiper>
//   <span className="content">ABC</span>
// </div>
// </div>

// <div className="message-container sent">
// <div className="message">
//   <Swiper
//     style={{ borderRadius: 10 }}
//     pagination={{
//       type: "fraction"
//     }}
//     navigation={true}
//     modules={[Pagination, Navigation]}
//     className="mySwiper">
//     <SwiperSlide>
//       <img
//         src="https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg"
//         alt=""
//       />
//     </SwiperSlide>
//     <SwiperSlide>
//       <img
//         src="https://images2.thanhnien.vn/528068263637045248/2023/5/11/base64-1683774325007671396078.png"
//         alt=""
//       />
//     </SwiperSlide>
//   </Swiper>
//   <span className="content">Hello Hello</span>
// </div>
// </div>
// <div className="message-container sent">
// <div className="message">
//   <Swiper
//     style={{ borderRadius: 10 }}
//     // pagination={{
//     //   type: "fraction"
//     // }}
//     // navigation={true}
//     // modules={[Pagination, Navigation]}
//     className="mySwiper">
//     <SwiperSlide>
//       <img
//         src="https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg"
//         alt=""
//       />
//     </SwiperSlide>
//   </Swiper>
// </div>
// </div>
// <div className="message-container sent">
// <div className="message sent">
//   <span className="content">{"abc \n nnn         vgg"}</span>
// </div>
// </div> */}
