import { createBrowserRouter } from "react-router-dom"
import { AuthProvider } from "../contexts/AuthProvider"
import Login from "../pages/Login"
import Register from "../pages/Register"
import AuthRedirect from "../components/auth/AuthRedirect"
import ForgetPassword from "../pages/forgetPassword"
import { NotificationProvider } from "../contexts/NotificationProvider"
import MainLayout from "../layouts/MainLayout"
import Home from "../pages/Home"
import Search from "../pages/Search"
import Profile from "../pages/Profile"
import Chat from "../pages/Chat"
import PrivateRoute from "../components/auth/PrivateRoute"
import VerifyEmail from "../pages/VerifyEmail"
import ResetPassword from "../pages/ResetPassword"
import MainChat from "../pages/MainChat"
import { ChatProvider } from "../contexts/ChatProvider"

const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      {
        element: <AuthRedirect />,
        children: [
          {
            path: "/login",
            element: <Login />
          },
          { path: "/register", element: <Register /> },
          { path: "/forgetPassword", element: <ForgetPassword /> }
        ]
      },
      {
        element: <NotificationProvider />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { path: "/", element: <Home /> },
              { path: "/search", element: <Search /> },
              { path: "/profile/:userId", element: <Profile /> },
              {
                path: "/chat",
                element: (
                  <PrivateRoute>
                    <ChatProvider>
                      <Chat />
                    </ChatProvider>
                  </PrivateRoute>
                ),
                children: [{ path: ":conversationId", element: <MainChat /> }]
              }
            ]
          }
        ]
      }
    ]
  },
  { path: "/verifyEmail", element: <VerifyEmail /> },
  { path: "/resetPassword", element: <ResetPassword /> }
])

export default router
