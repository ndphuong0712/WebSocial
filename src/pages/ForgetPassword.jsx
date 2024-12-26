import { useState } from "react"
import Loader from "../components/loader/Loader"
import Logo from "../assets/logo/LogoWebSocialWithText.png"
import { Container } from "react-bootstrap"
import { emailRegex } from "../utils/regex"
import { forgetPassword } from "../services/auth.services"
import { Link } from "react-router-dom"

const ForgetPassword = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [success, setSuccess] = useState(false)
  const hanndleForgetPassword = async () => {
    setLoading(true)
    let check = true
    if (!emailRegex.test(email)) {
      check = false
      setError("Email không đúng định dạng")
    }
    if (check) {
      try {
        await forgetPassword(email)
        setSuccess(true)
        setError("")
      } catch {
        setError("Không có tài khoản dùng email này")
      }
    }
    setLoading(false)
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        backgroundImage: "linear-gradient(145deg,#1ce1da,#597fe4)",
        display: "flex"
      }}>
      {success ? (
        <div className="mx-auto" style={{ textAlign: "center" }}>
          <img src={Logo} alt="" style={{ width: 150 }} />
          <h1>
            Kiểm tra mail của bạn để hoàn tất quá trình khôi phục mật khẩu
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
      ) : (
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
            Quên mật khẩu
          </h1>
          <span style={{ marginTop: 10 }}>
            Nhập email của tài khoản cần khôi phục mật khẩu
          </span>
          <div style={styles.div_input}>
            <input
              type="email"
              placeholder="Email"
              spellCheck={false}
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="text-danger font-italic">{error}</span>
          </div>

          <button style={styles.button} onClick={hanndleForgetPassword}>
            Tiếp tục
          </button>
        </Container>
      )}
      <Loader loading={loading} />
    </div>
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

export default ForgetPassword
