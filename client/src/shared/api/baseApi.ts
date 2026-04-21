import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../../redux/store'
import { setCredentials, logout, type User } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'GET' },
      api,
      extraOptions
    )

    if (refreshResult.data) {
      // Store the new token
      const { user, accessToken } = refreshResult.data as { user: User; accessToken: string }
      api.dispatch(setCredentials({ user, token: accessToken }))

      // Retry the original query with new token
      result = await baseQuery(args, api, extraOptions)
    } else {
      // Refresh failed, logout
      api.dispatch(logout())
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Profile', 'Jobs', 'Applications', 'Comments'],
  endpoints: () => ({}),
})