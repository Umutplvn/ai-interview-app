import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface MainState {
  loading: Boolean,
  error: Boolean
}

const initialState: MainState =  {
  loading: false,
  error: false,
}

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true
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
  fetchFail,
 
} = mainSlice.actions
export default mainSlice.reducer
