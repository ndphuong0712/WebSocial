import { Link, useNavigate, useSearchParams } from "react-router-dom"
import Logo from "../assets/logo/LogoWebSocialWithText.png"
import { useEffect, useState } from "react"
import Loader from "../components/loader/Loader"
import { verifyEmail } from "../services/auth.services"

const VerifyEmail = () => {
  const [query] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [verifySuccess, setVerifySuccess] = useState(false)
  const handleVerifyEmail = async (token) => {
    setLoading(true)
    try {
      await verifyEmail({ token })
      setVerifySuccess(true)
    } catch {
      setVerifySuccess(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!query.get("token")) {
      navigate("/login")
    } else {
      handleVerifyEmail(query.get("token"))
    }
  }, [])

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        backgroundImage: "linear-gradient(145deg,#1ce1da,#597fe4)",
        display: "flex"
      }}>
      <div className="mx-auto" style={{ textAlign: "center" }}>
        <img src={Logo} alt="" style={{ width: 150 }} />
        <h1>
          {verifySuccess
            ? "Xác thực email thành công"
            : "Phiên xác thực email bị lỗi hoặc đã hết hạn"}
        </h1>
        <Link
          to={"/login"}
          style={{
            display: "inline-block",
            marginTop: 20,
            color: "black",
            fontSize: 18,
            border: "2px solid #c6bcbc",
            padding: "10px 20px",
            maxWidth: 200,
            width: "100%",
            borderRadius: 10,
            fontWeight: 600,
            backgroundColor: "white"
          }}>
          Quay về trang đăng nhập
        </Link>
      </div>
      <Loader loading={loading} />
    </div>
  )
}

export default VerifyEmail
