import { PiDotsThreeOutlineFill } from "react-icons/pi"
import { GoHeart } from "react-icons/go"
import { BsChat, BsBookmark } from "react-icons/bs"
const Home = () => {
  return (
    <div className="posts_container">
      <div className="posts">
        <div className="post">
          <div className="info">
            <div className="person">
              <img src="https://i.ibb.co/3S1hjKR/account1.jpg" />
              <div>
                <p href="#">zineb</p>
                <span>45m</span>
              </div>
            </div>
            <div className="more">
              <PiDotsThreeOutlineFill
                size={30}
                style={{ padding: 4, cursor: "pointer" }}
              />
            </div>
          </div>
          <div className="post_desc">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima
              accusantium aperiam quod non minus cumque, recusandae hic soluta
              harum aut nulla...
            </p>
          </div>
          <div className="image">
            <img src="https://i.ibb.co/Jqh3rHv/img1.jpg" />
          </div>
          <div className="desc">
            <div className="detail">
              <span>13 lượt thích</span>
              <span>6 bình luận</span>
            </div>
            <hr />
            <div className="icons">
              <div className="like" style={{ cursor: "pointer" }}>
                <GoHeart size={24} />
                <span>Thích</span>
              </div>
              <div className="chat" style={{ cursor: "pointer" }}>
                <BsChat size={24} />
                <span>Bình luận</span>
              </div>
              <div className="save not_saved" style={{ cursor: "pointer" }}>
                <BsBookmark size={24} />
                <span>Lưu</span>
              </div>
            </div>
          </div>
        </div>
        <div className="post">
          <div className="info">
            <div className="person">
              <img src="https://i.ibb.co/3S1hjKR/account1.jpg" />
              <div>
                <p href="#">zineb</p>
                <span>45m</span>
              </div>
            </div>
            <div className="more">
              <PiDotsThreeOutlineFill
                size={30}
                style={{ padding: 4, cursor: "pointer" }}
              />
            </div>
          </div>
          <div className="post_desc">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima
              accusantium aperiam quod non minus cumque, recusandae hic soluta
              harum aut nulla...
            </p>
          </div>
          <div className="image">
            <img src="https://i.ibb.co/Jqh3rHv/img1.jpg" />
          </div>
          <div className="desc">
            <div className="detail">
              <span>13 lượt thích</span>
              <span>6 bình luận</span>
            </div>
            <hr />
            <div className="icons">
              <div className="like" style={{ cursor: "pointer" }}>
                <GoHeart size={24} />
                <span>Thích</span>
              </div>
              <div className="chat" style={{ cursor: "pointer" }}>
                <BsChat size={24} />
                <span>Bình luận</span>
              </div>
              <div className="save not_saved" style={{ cursor: "pointer" }}>
                <BsBookmark size={24} />
                <span>Lưu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
