import { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import useDebouce from "../customHook/useDebouce"
import { searchUsers } from "../services/user.services"
import Loader2 from "../components/loader/Loader2"
import { followUser, unfollowUser } from "../services/follow.services"
import { AuthContext } from "../contexts/AuthProvider"

const Search = () => {
  const { user: userContext } = useContext(AuthContext)
  const [query] = useSearchParams()
  const navigate = useNavigate()
  const loaderUserItem = useRef()
  const [textSearch, setTextSearch] = useState(query.get("search") ?? "")
  const finalTextSearch = useDebouce(textSearch, 200)
  const [users, setUsers] = useState([])
  const [showLoaderUserItem, setShowLoaderUserItem] = useState(false)
  const [lastTime, setLastTime] = useState()

  const handleChangeTextSearch = (text) => {
    setTextSearch(text)
  }

  const getQuery = ({ query, textSearch, type = "username" }) => {
    const queryObj = Object.fromEntries([...query])
    let queryStr = "?"
    if (type === "fullname") queryStr += "fullname&"
    if (textSearch) queryStr += `search=${textSearch}&`
    for (let i in queryObj) {
      if (i === "fullname" || i === "search") {
        break
      }
      queryStr += `${i}=${queryObj[i]}&`
    }
    return queryStr.slice(0, queryStr.length - 1)
  }

  const handleSearchUsers = async () => {
    if (!finalTextSearch) {
      setUsers([])
      return
    }
    const data = await searchUsers({
      textSearch: finalTextSearch,
      isFullname: query.get("fullname") === null ? false : true
    })
    setUsers(data)
    if (data.length > 0) setLastTime(data[data.length - 1].createdAt)
    if (data.length === 10) {
      setShowLoaderUserItem(true)
    } else {
      setShowLoaderUserItem(false)
    }
  }

  const handleLoadUsers = async () => {
    const data = await searchUsers({
      textSearch: finalTextSearch,
      isFullname: query.get("fullname") === null ? false : true,
      lastTime: lastTime
    })

    setUsers([...users, ...data])
    if (data.length > 0) {
      setLastTime(data[data.length - 1].createdAt)
    }

    if (data.length === 10) {
      setShowLoaderUserItem(true)
    } else {
      setShowLoaderUserItem(false)
    }
  }

  const handleFollow = (userId) => {
    followUser(userId)
    setUsers(
      users.map((user) => {
        if (user._id === userId) user.isFollow = true
        return user
      })
    )
  }

  const handleUnfollow = (userId) => {
    unfollowUser(userId)
    setUsers(
      users.map((user) => {
        if (user._id === userId) user.isFollow = false
        return user
      })
    )
  }
  console.log(users)

  useEffect(() => {
    navigate(
      `/search${getQuery({
        query,
        textSearch: finalTextSearch,
        type: query.get("fullname") === null ? "username" : "fullname"
      })}`
    )
    handleSearchUsers()
  }, [finalTextSearch, query])

  useEffect(() => {
    let observer
    if (showLoaderUserItem) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleLoadUsers()
          }
        })
      })
      observer.observe(loaderUserItem.current)
    }
    return () => {
      if (observer && loaderUserItem.current)
        observer.unobserve(loaderUserItem.current)
    }
  }, [showLoaderUserItem, lastTime])

  return (
    <div className="search_container">
      <input
        type="text"
        placeholder="Tìm kiếm"
        value={textSearch}
        onChange={(e) => handleChangeTextSearch(e.target.value)}
      />
      <div className="type_search">
        <Link
          className={`type_item ${query.get("fullname") === null && "active"}`}
          to={`/search${getQuery({ query, textSearch: finalTextSearch })}`}>
          Tên tài khoản
        </Link>
        <Link
          className={`type_item ${query.get("fullname") !== null && "active"}`}
          to={`/search${getQuery({
            query,
            type: "fullname",
            textSearch: finalTextSearch
          })}`}>
          Tên người dùng
        </Link>
      </div>
      <div className="users_container">
        {users.length === 0 ? (
          "Không tìm thấy người dùng"
        ) : (
          <>
            {users.map((user) => (
              <Link
                key={user._id}
                to={`/profile/${user._id}`}
                className="user_item">
                <img src={user.avatar.url} alt="" />
                <div className="info">
                  <span className="username">{user.username}</span>
                  <span className="fullname">{user.fullname}</span>
                </div>
                {userContext._id !== user._id &&
                  (user.isFollow ? (
                    <button
                      style={{ backgroundColor: "gray" }}
                      onClick={(e) => {
                        e.preventDefault()
                        handleUnfollow(user._id)
                      }}>
                      Đã theo dõi
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleFollow(user._id)
                      }}>
                      Theo dõi
                    </button>
                  ))}
              </Link>
            ))}
            {showLoaderUserItem && (
              <div
                ref={loaderUserItem}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                <Loader2 />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Search
