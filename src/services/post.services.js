import axiosInstance from "../utils/axiosInstance"

export const getPostsByUser = async (userId, lastTime) => {
  const { data } = await axiosInstance.get(`/posts/user/${userId}`, {
    params: { lastTime }
  })
  return data
}

export const getLikePostsByUser = async (lastTime) => {
  const { data } = await axiosInstance.get("/posts/likes", {
    params: { lastTime }
  })
  return data
}

export const getBookmarkPostsByUser = async (lastTime) => {
  const { data } = await axiosInstance.get("/posts/bookmarks", {
    params: { lastTime }
  })
  return data
}

export const getNewsFeed = async (lastTime) => {
  const { data } = await axiosInstance.get(`/posts/newsFeed`, {
    params: { lastTime }
  })
  return data
}

export const getPost = async (postId) => {
  const { data } = await axiosInstance.get(`/posts/${postId}`)
  return data
}

export const getOriginalPost = async (originalPostId) => {
  const { data } = await axiosInstance.get(`/posts/basicInfo/${originalPostId}`)
  return data
}

export const updatePost = async ({
  audience,
  content,
  deleteMedia,
  media,
  postId
}) => {
  const body = new FormData()
  body.append("audience", audience)
  body.append("content", content)
  body.append("deleteMedia", JSON.stringify(deleteMedia))
  media.forEach((m) => body.append("media", m))
  const { data } = await axiosInstance.patch(`/posts/${postId}`, body, {
    headers: { "Content-Type": "multipart/form-data" }
  })
  return data
}

export const deletePost = (postId) => {
  return axiosInstance.delete(`/posts/${postId}`)
}

export const createPost = ({ originalPostId, audience, content, media }) => {
  const body = new FormData()
  body.append("audience", audience)
  originalPostId && body.append("originalPostId", originalPostId)
  body.append("content", content)
  media.forEach((m) => body.append("media", m))
  return axiosInstance.post("/posts", body, {
    headers: { "Content-Type": "multipart/form-data" }
  })
}
