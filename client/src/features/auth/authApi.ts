import { baseApi } from '../../shared/api/baseApi'
import type { User } from './authSlice'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { user: User; accessToken: string },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    signup: builder.mutation<
      { user: User; accessToken: string },
      { name: string; email: string; password: string }
    >({
      query: (body) => ({
        url: '/auth/registration',
        method: 'POST',
        body,
      }),
    }),

    refresh: builder.query<{ user: User; accessToken: string }, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useSignupMutation,
  useRefreshQuery,
} = authApi