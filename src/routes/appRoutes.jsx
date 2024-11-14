import { createBrowserRouter } from "react-router-dom"
import AuthProvider from "../contexts/AuthProvider"
import Login from "../pages/Login"
import Register from "../pages/Register"

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProvider />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> }
    ]
  }
])

export default router
