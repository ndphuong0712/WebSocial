import {PiDotsThreeOutlineFill} from "react-icons/pi";
import {GoHeart, GoHeartFill} from "react-icons/go";
import {BsChat, BsBookmark} from "react-icons/bs";
import React, {useState, useEffect} from "react";
import axiosInstance from "../utils/axiosInstance";
import Post from "../components/post/Post";

const Home = () => {
	const [posts, setPosts] = useState([]);

	// const [numberLikes, setNumberLikes] = useState(initialLikes);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	//gọi api newsFeed
	useEffect(() => {
		async function fetchNewsFeed() {
			setLoading(true);
			try {
				const response = await axiosInstance.get("/posts/newsFeed"); // Gọi API từ instance
				setPosts(response.data); // Giả sử response trả về data là danh sách bài viết
				console.log(response);
			} catch (error) {
				setError(error.message); // Nếu có lỗi, hiển thị lỗi
			} finally {
				setLoading(false);
			}
		}

		fetchNewsFeed();
	}, []);

	//cập nhật api like

	// useEffect(() => {
	// 	const savedState = localStorage.getItem(`liked-${post._id}`);
	// 	if (savedState !== null) {
	// 		setIsLiked(JSON.parse(savedState));
	// 	}
	// }, [post._id]);

	// const handleLike = async (postId) => {
	// 	setLoading(true); // Bật chế độ loading
	// 	await axiosInstance.post(`/likes/${postId}`);
	// 	const newIsLiked = !isLiked; // Đảo trạng thái
	// 	setIsLiked(newIsLiked); // Cập nhật trạng thái yêu thích
	// 	localStorage.setItem(`liked-${postId}`, JSON.stringify(newIsLiked)); // Lưu vào localStorage
	// 	setLoading(false); // Tắt chế độ loading
	// };

	return (
		<div className="posts_container">
			<div className="posts">
				{posts.map((post) => (
					<Post key={post._id} post={post} />
				))}

				{/* <div className="post">
					<div className="info">
						<div className="person">
							<img src="https://i.ibb.co/3S1hjKR/account1.jpg" />
							<div>
								<p href="#">zineb</p>
								<span>45m</span>
							</div>
						</div>
						<div className="more">
							<PiDotsThreeOutlineFill size={30} style={{padding: 4, cursor: "pointer"}} />
						</div>
					</div>
					<div className="post_desc">
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima accusantium aperiam quod non minus cumque, recusandae hic soluta harum aut nulla...</p>
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
							<div className="like" style={{cursor: "pointer"}}>
								<GoHeart size={24} />
								<span>Thích</span>
							</div>
							<div className="chat" style={{cursor: "pointer"}}>
								<BsChat size={24} />
								<span>Bình luận</span>
							</div>
							<div className="save not_saved" style={{cursor: "pointer"}}>
								<BsBookmark size={24} />
								<span>Lưu</span>
							</div>
						</div>
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default Home;
