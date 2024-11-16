import { IoIosImages } from "react-icons/io"
import { MdInfo, MdSend } from "react-icons/md"

const Chat = () => {
  return (
    <div className="chat_div">
      <div className="chat-container">
        <div className="sibebar-conversation">
          <h1>Chat</h1>
          <div className="conversation-list">
            <div className="conversation active">
              <div className="avatar">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVNIO4DuH-jwqYPgpIrfurqykYUifH63z5dA&s"
                  alt=""
                />
                <span className="online" />
              </div>
              <div className="info">
                <div className="name">
                  <p>Quỳnh Hani</p>
                  <span className="date">10:37 03/11/2024</span>
                </div>
                <span className="message">
                  Text text text fg dfg fg fgfg dfg dfg dfg dfgfd dfg dfdsf dfdf
                  dfdf fdf fdf ffdf fsffdff fdfdfdf fs
                </span>
              </div>
            </div>
            <div className="conversation">
              <div className="avatar">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh-E3JLU_lFQ6txTck9IKczpwZyP4DFw8SVw&s"
                  alt=""
                />
                <span className="online" />
              </div>
              <div className="info">
                <div className="name">
                  <p>Ngọc Tuyết</p>
                  <span className="date">10:37 03/11/2024</span>
                </div>
                <span className="message">Text text text</span>
              </div>
            </div>
            <div className="conversation">
              <div className="avatar">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShOOrHLWMbve76a8KteKFUUb_KPDTs5Uh_rVC0HUAlnweyNoV-SyVLX_1p7E_85qIdxrY&usqp=CAU"
                  alt=""
                />
                <span className="offline" />
              </div>
              <div className="info">
                <div className="name">
                  <p>Đinh Thu Hương</p>
                  <span className="date">10:37 03/11/2024</span>
                </div>
                <span className="message">Text text text</span>
              </div>
            </div>
          </div>
        </div>
        {/* <div class="chat-box">
          <h1 class="m-auto">No conversation</h1>
        </div> */}
        <div className="chat-box">
          <div className="chat-header">
            <div className="chat-info">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXNLf6lX2yRCGfW9exRiCmjEYbGhq96NxQDQ&s" />
              <p className="name">nvgdddd_f</p>
            </div>
            <div className="chat-icon">
              <MdInfo className="icon" color="#daa520" />
            </div>
          </div>
          <div className="chat-content">
            <div className="message received" title="10/10/2021">
              Hello
            </div>
          </div>
          <div className="chat-input">
            <IoIosImages className="icon" color="#daa520" />
            <input type="text" placeholder="Type a message..." />
            <MdSend className="icon" color="#daa520"></MdSend>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
