import { Link } from "react-router-dom"
import Logo from "../assets/logo/LogoWebSocialWithText.png"
import { Container } from "react-bootstrap"
import { FcGoogle } from "react-icons/fc"
const Register = () => {
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
          Đăng ký
        </h1>

        <div style={styles.div_input}>
          <input
            type="email"
            placeholder="Email"
            spellCheck={false}
            style={styles.input}
          />
        </div>

        <div style={styles.div_input}>
          <input
            type="text"
            placeholder="Tên tài khoản"
            spellCheck={false}
            style={styles.input}
          />
        </div>
        <div style={styles.div_input}>
          <input
            type="text"
            placeholder="Họ tên"
            spellCheck={false}
            style={styles.input}
          />
        </div>
        <div style={styles.div_input}>
          <input
            type="password"
            placeholder="Mật khẩu"
            spellCheck={false}
            style={styles.input}
          />
        </div>
        <div style={styles.div_input}>
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            spellCheck={false}
            style={styles.input}
          />
        </div>
        <button style={styles.button}>Đăng ký</button>
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
        <button
          style={{
            margin: "10px 0",
            border: "2px solid #c6bcbc",
            padding: "10px 20px",
            maxWidth: 350,
            width: "100%",
            borderRadius: 10,
            fontWeight: 600,
            backgroundColor: "white",
            position: "relative"
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
        </button>
      </Container>
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
