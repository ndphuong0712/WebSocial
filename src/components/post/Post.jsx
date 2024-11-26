import {PiDotsThreeOutlineFill} from "react-icons/pi";
import {GoHeart, GoHeartFill} from "react-icons/go";
import {BsChat, BsBookmark, BsBookmarkFill} from "react-icons/bs";
import axiosInstance from "../../utils/axiosInstance";
import React, {useState} from "react";

const Post = ({post}) => {
	const [postLike, setPostLike] = useState({
		[post._id]: post.isLike,
	});
	const [postBookMark, setPostBookMark] = useState({
		[post._id]: post.isBookmark,
	});
	//const [bookMark, setBookMark] = useState(post.isBookmark);
	const [numberLikeState, setNumberLikeState] = useState(post.numberLikes);
	const [isLoading, setIsLoading] = useState(false);

	//gọi cập api like post
	const handleLike = async (postId) => {
		const apiUrl = `/likes/${postId}`;
		setIsLoading(true); // Bắt đầu loading
		try {
			if (postLike[postId]) {
				await axiosInstance.delete(apiUrl);
				setNumberLikeState((prev) => prev - 1);
			} else {
				await axiosInstance.post(apiUrl);
				setNumberLikeState((prev) => prev + 1);
			}

			setPostLike((prevState) => ({
				...prevState,
				[postId]: !prevState[postId],
			}));
		} catch (error) {
			console.error("Lỗi khi gọi API:", error.response || error.message);
		} finally {
			setIsLoading(false); // Kết thúc loading
		}
	};

	const handleBookMark = async (postId) => {
		const apiUrl = `/bookmarks/${postId}`;
		setIsLoading(true); // Bắt đầu loading
		try {
			if (postBookMark[postId]) {
				await axiosInstance.delete(apiUrl);
			} else {
				await axiosInstance.post(apiUrl);
			}
			setPostBookMark((prevState) => ({
				...prevState,
				[postId]: !prevState[postId],
			}));
		} catch (error) {
			console.error("Lỗi khi gọi API:", error.response || error.message);
		} finally {
			setIsLoading(false); // Kết thúc loading
		}
	};

	console.log(post);
	return (
		<div key={post._id} className="post">
			<div className="info">
				<div className="person">
					<img src={post.user.avatar.url} />
					<div>
						<p href="#">{post.user.username}</p>
						<span></span>
					</div>
				</div>
				<div className="more">
					<PiDotsThreeOutlineFill size={30} style={{padding: 4, cursor: "pointer"}} />
				</div>
			</div>
			<div className="post_desc">
				<p>{post.content}</p>
			</div>
			{/* <div className="image">{posts.media.length === 0 ? "" : <img src={posts.media[0].url} />}</div> */}
			<div className="image"> {post.media.length !== 0 && <img src={post.media[0].url} />}</div>
			<div className="desc">
				<div className="detail">
					<span>{numberLikeState} lượt thích</span>
					<span>{post.numberComments} bình luận</span>
				</div>
				<hr />
				<div className="icons">
					<div
						className="like"
						style={{cursor: "pointer"}}
						onClick={() => {
							handleLike(post._id);
						}}
						disabled={isLoading}
					>
						{isLoading ? "loading...." : postLike[post._id] ? <GoHeartFill size={24} color="red" /> : <GoHeart size={24} />}
						<span>Thích</span>
					</div>
					<div className="chat" style={{cursor: "pointer"}}>
						<BsChat size={24} />
						<span>Bình luận</span>
					</div>
					<div className="save not_saved" style={{cursor: "pointer"}} onClick={() => handleBookMark(post._id)}>
						{postBookMark[post._id] ? <BsBookmarkFill size={24} color="#1F509A" /> : <BsBookmark size={24} />}
						<span>Lưu</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Post;
