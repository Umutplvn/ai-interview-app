import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
} from "firebase/auth"
import { auth, googleProvider } from "../firebase/firebaseConfig"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"

import {
  fetchFail,
  fetchStart,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
} from "../features/authSlice"

const useAuthCall = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const login = async (email: string, password: string): Promise<void> => {
    dispatch(fetchStart())
    try {
      const data: UserCredential = await signInWithEmailAndPassword(auth, email, password)
      const username: string = data.user.email ?? "Unknown User"
      const accessToken: string = await data.user.getIdToken()

      dispatch(loginSuccess({ username, accessToken }))
    } catch (error: any) {
      console.error("LOGIN ERROR", error.message)
      dispatch(fetchFail())
    }
  }

  const logout = async (): Promise<void> => {
    dispatch(fetchStart())
    try {
      await signOut(auth)
      dispatch(logoutSuccess())
      console.log("User signed out successfully.")
    } catch (error: any) {
      console.error("Logout error:", error.message)
      dispatch(fetchFail())
    }
  }

  const register = async (email: string, password: string): Promise<void> => {
    dispatch(fetchStart())
    try {
      const data: UserCredential = await createUserWithEmailAndPassword(auth, email, password)
      const username: string = data.user.email ?? "Unknown User"
      const accessToken: string = await data.user.getIdToken()

      dispatch(registerSuccess({ username, accessToken }))
    } catch (error: any) {
      console.error("REGISTER ERROR", error.message)
      dispatch(fetchFail())
    }
  }

  const googleSignIn = async (): Promise<void> => {
    dispatch(fetchStart())
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider)
      const username: string = result.user.email ?? "Unknown User"
      const accessToken: string = await result.user.getIdToken()

      dispatch(loginSuccess({ username, accessToken }))
      console.log("Google login successful:", result.user)
    } catch (error: any) {
      console.error("Google login error:", error.message)
      dispatch(fetchFail())
    }
  }

  return { login, logout, register, googleSignIn }
}

export default useAuthCall
