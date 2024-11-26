import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams
} from "react-router-dom"
import Logo from "../assets/logo/LogoWebSocialWithText.png"
import { Container } from "react-bootstrap"
import { useState } from "react"
import Loader from "../components/loader"
import { passwordRegex } from "../utils/regex"
import { resetPassword } from "../services/auth.services"

const ResetPassword = () => {
  const [query] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState({})

  const handleResetPassword = async () => {
    setLoading(true)
    let check = true
    const err = {}
    if (!passwordRegex.test(password)) {
      check = false
      err.password =
        "Mật khẩu phải có từ 8 đến 32 kí tự, bao gồm ít nhất 1 chữ thường , 1 chữ hoa, 1 số, 1 kí tự đặc biệt"
    }
    if (password != confirmPassword) {
      err.confirmPassword = "Mật khẩu và xác nhận mật khẩu không khớp nhau"
      check = false
    }
    if (check) {
      try {
        await resetPassword({
          token: query.get("token"),
          password,
          confirmPassword
        })
        navigate("/resetPassword", { state: { isSuccess: true } })
      } catch {
        navigate("/resetPassword", { state: { isSuccess: false } })
      }
    }
    setLoading(false)
    setError(err)
  }
  if (location.state?.isSuccess === true) {
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
          <h1>Khôi phục mật khẩu thành công</h1>
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
      </div>
    )
  } else if (location.state?.isSuccess === false) {
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
            Khôi phục mật khẩu không thành công do phiên khôi phục mật khẩu đã
            hết hạn hoặc lỗi
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
      </div>
    )
  }
  return query.get("token") ? (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        backgroundImage: "linear-gradient(145deg,#1ce1da,#597fe4)",
        display: "flex"
      }}>
      <Container
        style={{
          margin: "auto",
          backgroundColor: "white",
          maxWidth: 600,
          borderRadius: 16,
          padding: 10,
          boxShadow: "0 0 5px black",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
        <img src={Logo} alt="" style={{ width: 150 }} />
        <h1
          style={{
            fontWeight: 600,
            color: "#1ce1da",
            borderBottom: "4px #1ce1da solid",
            marginBottom: 10
          }}>
          Khôi phục mật khẩu
        </h1>

        <div style={styles.div_input}>
          <input
            type="password"
            placeholder="Mật khẩu"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="text-danger font-italic">{error.password}</span>
        </div>
        <div style={styles.div_input}>
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            style={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span className="text-danger font-italic">
            {error.confirmPassword}
          </span>
        </div>

        <button style={styles.button} onClick={handleResetPassword}>
          Khôi phục mật khẩu
        </button>
      </Container>
      <Loader loading={loading} />
    </div>
  ) : (
    <Navigate to={"/login"} />
  )
}

const styles = {
  input: {
    width: "100%",
    padding: "4px 2px 2px",
    outline: "none",
    border: "none",
    borderBottom: "2px solid #1ce1da",
    color: "#597fe4",
    fontSize: 18,
    fontWeight: 600
  },
  div_input: {
    width: "100%",
    padding: "10px 20px"
  },
  button: {
    marginTop: 20,
    border: "none",
    backgroundImage: "linear-gradient(145deg,#1ce1da,#597fe4)",
    padding: "10px 20px",
    maxWidth: 200,
    width: "100%",
    borderRadius: 10,
    fontWeight: 600
  }
}

export default ResetPassword
