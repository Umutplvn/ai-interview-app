import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  currentUser: string | null
  name: string | null
  loading: boolean
  error: boolean
  token: string | null
  userId: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  name: null,
  loading: false,
  error: false,
  token: null,
  userId: null,  
}

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    fetchStart: (state) => {
      state.loading = true
      state.error = false
    },

    loginSuccess: (
      state,
      action: PayloadAction<{ username: string; accessToken: string,  name: string, uid: string }>
    ) => {
      state.loading = false;
      state.currentUser = action.payload.username;
      state.token = action.payload.accessToken;
      state.error = false;
      state.name = action.payload.name;
      state.userId = action.payload.uid; 

    },

    logoutSuccess: (state) => {
      state.loading = false
      state.currentUser = null
      state.token = null
      state.name=null
      state.userId = null;
    },

    registerSuccess: (
      state,
      action: PayloadAction<{
        username: string
        name: string
        accessToken: string
        uid: string
      }>
    ) => {
      state.loading = false;
      state.currentUser = action.payload.username;
      state.token = action.payload.accessToken;
      state.name = action.payload.name;
      state.error = false;
      state.userId = action.payload.uid;
    },    

    fetchFail: (state) => {
      state.loading = false
      state.error = true
    },
  },
})

export const {
  fetchStart,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
  fetchFail,
} = authSlice.actions

export default authSlice.reducer
