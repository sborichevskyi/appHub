import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAuthInitialized: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isAuthInitialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isAuthInitialized = true;
      // // Save to localStorage
      // localStorage.setItem('token', action.payload.token)
      // localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAuthInitialized = false;
      // // Clear localStorage
      // localStorage.removeItem('token')
      // localStorage.removeItem('user')
    },
    restoreCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isAuthInitialized = true;
    },
    authInitialized: (state) => {
      state.isAuthInitialized = true;
    },
  },
})

export const { setCredentials, logout, restoreCredentials, authInitialized } = authSlice.actions
export default authSlice.reducer