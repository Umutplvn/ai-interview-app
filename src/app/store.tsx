import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/authSlice"
import mainReducer from "../features/mainSlice"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage/session" //? default : localStorage

const persistConfig = {
  key: "root",
  storage,
}

const persistedReducer = persistReducer( persistConfig, authReducer)


const store = configureStore({
  reducer: {
    auth: persistedReducer,
    main: mainReducer,
  },
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export default store
