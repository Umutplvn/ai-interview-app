// features/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  currentUser: string | null
  loading: boolean
  error: boolean
  isAdmin: boolean
  token: string | null
}

const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: false,
  isAdmin: false,
  token: null,
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
      action: PayloadAction<{
        user: { username: string }
        key: string
      }>
    ) => {
      state.loading = false
      state.currentUser = action.payload.user.username
      state.token = action.payload.key
      state.error = false
    },

    logoutSuccess: (state) => {
      state.loading = false
      state.currentUser = null
      state.token = null
    },

    registerSuccess: (
      state,
      action: PayloadAction<{
        username: string
        token: string
      }>
    ) => {
      state.loading = false
      state.currentUser = action.payload.username
      state.token = action.payload.token
      state.error = false
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
