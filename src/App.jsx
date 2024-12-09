import { RouterProvider } from "react-router-dom"
import router from "./routes/appRoutes"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "bootstrap/dist/css/bootstrap.min.css"
function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
        pauseOnHover={false}
        closeButton={false}
        theme="light"
      />
    </>
  )
}

export default App
