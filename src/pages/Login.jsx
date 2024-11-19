import { Container } from "react-bootstrap"
import Logo from "../assets/logo/LogoWebSocialWithText.png"
import { Link } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { useContext, useState } from "react"
import { loginUser } from "../services/auth.services"
import { AuthContext } from "../contexts/AuthProvider"
import Loader from "../components/loader"
import { emailRegex } from "../utils/regex"

const Login = () => {
  const { setUserContext } = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState({})
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    let check = true
    const err = {}
    if (!emailRegex.test(email)) {
      check = false
      err.email = "Email không đúng định dạng"
    }
    if (password.length < 8 || password.length > 32) {
      check = false
      err.password = "Mật khẩu phải từ 8 đến 32 kí tự"
    }
    if (check) {
      try {
        const data = await loginUser({ email, password })
        setUserContext(data.user)
      } catch (error) {
        err.emailAndPassword = "Email hoặc mật khẩu sai"
      }
    }
    setLoading(false)
    setError(err)
  }
  const getGoogleOAuthUrl = () => {
    const url = "https://accounts.google.com/o/oauth2/v2/auth"
    const query = {
      client_id: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URI,
      scope:
        "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
      response_type: "code",
      prompt: "consent"
    }
    return `${url}?${new URLSearchParams(query).toString()}`
  }

  return (
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
          Đăng nhập
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
            type="password"
            placeholder="Mật khẩu"
            spellCheck={false}
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="text-danger font-italic">{error.password}</span>
        </div>
        <span className="text-danger font-italic">
          {error.emailAndPassword}
        </span>
        <Link to={"/forgetPassword"}>Quên mật khẩu?</Link>
        <button style={styles.button} onClick={handleLogin}>
          Đăng nhập
        </button>
        <span style={{ paddingTop: 10 }}>
          Bạn chưa có tài khoản? <Link to={"/register"}>Đăng ký</Link>
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

export default Login
