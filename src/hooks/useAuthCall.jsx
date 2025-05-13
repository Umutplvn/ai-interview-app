import { createUserWithEmailAndPassword } from "firebase/auth"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase/firebaseConfig"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { signOut } from "firebase/auth";

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


  const login = async (email, password) => {
    dispatch(fetchStart());
    try {
      const data = await signInWithEmailAndPassword(auth, email, password);
      const username = data.user.email;
      const accessToken = await data.user.getIdToken();
      console.log("FIREBASE RESPONSE", data);
      dispatch(loginSuccess({ username, accessToken }));
    } catch (error) {
      console.log("LOGIN ERROR", error.message);
      dispatch(fetchFail());
    }
  };

  const logout = async () => {
    dispatch(fetchStart())
    try {
      await signOut(auth);
      dispatch(logoutSuccess())
      console.log("User signed out successfully.");
    } catch (error) {
      console.error("Logout error:", error.message);
      dispatch(fetchFail())
    }
  }

  const register = async (email, password) => {
    dispatch(fetchStart());
    try {
      const data = await createUserWithEmailAndPassword(auth, email, password);
      console.log("FIREBASE RESPONSE", data);
  
      const username = data.user.email;
      const accessToken = await data.user.getIdToken();
  
      dispatch(registerSuccess({ username, accessToken }));
    } catch (error) {
      console.log("REGISTER ERROR", error);
      dispatch(fetchFail());
    }
  };
  

  return { login, logout, register }
}

export default useAuthCall
