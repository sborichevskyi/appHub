// features/auth/authThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setCredentials, logout } from '../../features/auth/authSlice';

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { dispatch }) => {
    try {
      const res = await fetch('http://localhost:5000/auth/me', {
        credentials: 'include',
      });

      if (!res.ok) throw new Error();

      const user = await res.json();

      dispatch(setCredentials(user));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      dispatch(logout());
    }
  }
);