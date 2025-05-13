import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  currentUser: string | null
  loading: boolean
  error: boolean
  token: string | null
}

const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: false,
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
      action: PayloadAction<{ username: string; accessToken: string }>
    ) => {
      state.loading = false;
      state.currentUser = action.payload.username;
      state.token = action.payload.accessToken;
      state.error = false;
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
        accessToken: string
      }>
    ) => {
      state.loading = false;
      state.currentUser = action.payload.username;
      state.token = action.payload.accessToken;
      state.error = false;
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
