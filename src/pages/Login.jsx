import { Container } from "react-bootstrap"
import Logo from "../assets/logo/LogoWebSocialWithText.png"
const Login = () => {
  return (
    <div
      style={{
        height: "100vh",
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
      </Container>
    </div>
  )
}

export default Login
