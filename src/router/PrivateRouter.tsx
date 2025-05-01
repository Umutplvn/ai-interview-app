import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import { RootState } from "../app/store"

const PrivateRouter = () => {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser)

  return currentUser ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRouter
