import { Link } from "react-router-dom"
import Logo from "../assets/logo/LogoWebSocialWithText.png"
import { Container } from "react-bootstrap"
import { FcGoogle } from "react-icons/fc"
import { useState } from "react"
import {
  emailRegex,
  fullnameRegex,
  passwordRegex,
  usernameRegex
} from "../utils/regex"
import { registerUser } from "../services/auth.services"
import Loader from "../components/loader/Loader"
import getGoogleOAuthUrl from "../utils/getGoogleOAuthUrl"

const Register = () => {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [fullname, setFullname] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState({})
  const [loading, setLoading] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const handleRegister = async () => {
    setLoading(true)
    const err = {}
    let check = true
    let _fullname = fullname.trim()
    _fullname = _fullname.split(/\s+/).join(" ")
    if (!emailRegex.test(email)) {
      err.email = "Email không đúng định dạng"
      check = false
    }
    if (!usernameRegex.test(username)) {
      err.username =
        "Tên tài khoản phải dài từ 1 đến 32 ký tự; Tên người dùng chỉ có thể chứa các chữ cái, số, dấu chấm và dấu gạch dưới, không có dấu chấm liên tiếp và không được bắt đầu hoặc kết thúc bằng dấu chấm"
      check = false
    }
    if (!fullnameRegex.test(_fullname)) {
      err.fullname =
        "Tên người dùng phải ít nhất 1 kí tự và không bao gồm số, kí tự đặc biệt"
      check = false
    }
    if (!passwordRegex.test(password)) {
      err.password =
        "Mật khẩu phải có từ 8 đến 32 kí tự, bao gồm ít nhất 1 chữ thường , 1 chữ hoa, 1 số, 1 kí tự đặc biệt"
      check = false
    }
    if (password != confirmPassword) {
      err.confirmPassword = "Mật khẩu và xác nhận mật khẩu không khớp nhau"
      check = false
    }

    if (check) {
      try {
        await registerUser({
          email,
          username,
          fullname: _fullname,
          password,
          confirmPassword
        })
        setRegisterSuccess(true)
      } catch (e) {
        console.log(e)
        if (e.errors.email) {
          err.email = "Email đã tồn tại"
        }
        if (e.errors.username) {
          err.username = "Tên tài khoản đã tồn tại"
        }
      }
    }
    setLoading(false)
    setError(err)
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        backgroundImage: "linear-gradient(145deg,#1ce1da,#597fe4)",
        display: "flex"
      }}>
      {registerSuccess ? (
        <div className="mx-auto" style={{ textAlign: "center" }}>
          <img src={Logo} alt="" style={{ width: 150 }} />
          <h1>
            Để hoàn tất quá trình đăng kí, bạn cần kiểm tra mail để xác thực tài
            khoản
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
            Đăng ký
          </h1>

          <div style={styles.div_input}>
            <input
              type="email"
              placeholder="Email"
              spellCheck={false}
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="text-danger font-italic">{error.email}</span>
          </div>

          <div style={styles.div_input}>
            <input
              type="text"
              placeholder="Tên tài khoản"
              spellCheck={false}
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span className="text-danger font-italic">{error.username}</span>
          </div>
          <div style={styles.div_input}>
            <input
              type="text"
              placeholder="Họ tên"
              spellCheck={false}
              style={styles.input}
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
            <span className="text-danger font-italic">{error.fullname}</span>
          </div>
          <div style={styles.div_input}>
            <input
              type="password"
              placeholder="Mật khẩu"
              spellCheck={false}
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
              spellCheck={false}
              style={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span className="text-danger font-italic">
              {error.confirmPassword}
            </span>
          </div>
          <button style={styles.button} onClick={handleRegister}>
            Đăng ký
          </button>
          <span style={{ paddingTop: 10 }}>
            Bạn đã có tài khoản? <Link to={"/login"}>Đăng nhập</Link>
          </span>
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              padding: 20
            }}>
            <hr style={{ width: "100%" }} />
            <span style={{ padding: "0 10px" }}>Hoặc</span>
            <hr style={{ width: "100%" }} />
          </div>
          <Link
            to={getGoogleOAuthUrl()}
            style={{
              color: "black",
              margin: "10px 0",
              border: "2px solid #c6bcbc",
              padding: "10px 20px",
              maxWidth: 350,
              width: "100%",
              borderRadius: 10,
              fontWeight: 600,
              backgroundColor: "white",
              position: "relative",
              textAlign: "center"
            }}>
            <FcGoogle
              size={32}
              style={{
                position: "absolute",
                top: "50%",
                left: 10,
                transform: "translateY(-50%)"
              }}
            />
            Đăng nhập bằng google
          </Link>
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

export default Register
