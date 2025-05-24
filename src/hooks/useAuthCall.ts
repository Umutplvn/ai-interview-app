import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { updateProfile } from "firebase/auth";
import {
  fetchFail,
  fetchStart,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
} from "../features/authSlice";

const useAuthCall = () => {
  const dispatch = useDispatch();

  const getFirebaseErrorMessage = (code: string): string => {
    switch (code) {
      case "auth/user-not-found":
        return "No user found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/email-already-in-use":
        return "This email is already registered.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/invalid-email":
        return "Invalid email address.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    dispatch(fetchStart());
    try {
      const data: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const username: string = data.user.email ?? "Unknown User";
      const name: string = data.user.displayName ?? "Unknown Name";
      const accessToken: string = await data.user.getIdToken();
      const uid: string = data.user.uid;  // UID ekledik
  
      dispatch(loginSuccess({ username, accessToken, name, uid }));
      toast.success("Login successful!");
    } catch (error: any) {
      toast.error(getFirebaseErrorMessage(error.code));
      dispatch(fetchFail());
    }
  };
  

  const logout = async (): Promise<void> => {
    dispatch(fetchStart());
    try {
      await signOut(auth);
      dispatch(logoutSuccess());
      toast.success("Signed out successfully.");
    } catch (error: any) {
      toast.error(getFirebaseErrorMessage(error.code));
      dispatch(fetchFail());
    }
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    dispatch(fetchStart());
    try {
      const data: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
      }
  
      const username: string = data.user.email ?? "Unknown User";
      const accessToken: string = await data.user.getIdToken();
      const uid: string = data.user.uid;  // UID eklendi
      
      dispatch(registerSuccess({ username, accessToken, name, uid }));
      toast.success("Registration completed!");
    } catch (error: any) {
      toast.error(getFirebaseErrorMessage(error.code));
      dispatch(fetchFail());
    }
  };
  

  const googleSignIn = async (): Promise<void> => {
    dispatch(fetchStart());
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const username: string = result.user.email ?? "Unknown User";
      const name: string = result.user.displayName ?? "Unknown Name";
      const accessToken: string = await result.user.getIdToken();
      const uid: string = result.user.uid;

      dispatch(loginSuccess({ username, accessToken, name, uid }));
      toast.success("Login successful!");
    } catch (error: any) {
      toast.error(getFirebaseErrorMessage(error.code));
      dispatch(fetchFail());
    }
  };

  return { login, logout, register, googleSignIn };
};

export default useAuthCall;
