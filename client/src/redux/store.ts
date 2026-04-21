import { configureStore } from "@reduxjs/toolkit"
import authReducer from '../features/auth/authSlice'
import jobsReducer from '../features/jobs/jobsSlice'
import { baseApi } from "../shared/api/baseApi"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch