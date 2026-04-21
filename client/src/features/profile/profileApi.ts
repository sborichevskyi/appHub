// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { type Skill, type Role, type Country } from './profileSlice';

// export interface Profile {
//   id: string;
//   role: Role | null;
//   skills: Skill[];
//   country: Country | null;
//   location: string;
//   level?: string;
// }

// export const profileApi = createApi({
//   reducerPath: 'profileApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'http://localhost:5000',
//     credentials: 'include',
//   }),
//   endpoints: (builder) => ({
//     getProfile: builder.query<Profile, void>({
//       query: () => ({
//         url: '/profile',
//         method: 'GET',
//       }),
//     }),
//     setProfile: builder.mutation<Profile, Partial<Profile>>({
//       query: (body) => ({
//         url: '/profile',
//         method: 'PUT',
//         body,
//       }),
//     }),
//   }),
// });

// export const { useGetProfileQuery, useSetProfileMutation } = profileApi;
import { baseApi } from '../../shared/api/baseApi'
// import { type Skill, type Role, type Country } from './profileSlice'

// export interface Profile {
//   id: string
//   role: Role | null
//   skills: Skill[]
//   country: Country | null
//   location: string
//   level?: string
// }
export interface Profile {
  id: string
  role: string | null
  keywords: string[]
  country: string | null
  location: string
  level?: string
}

export interface SetProfilePayload {
  role: string
  keywords: string[]
  country: string
  location: string
  level?: string
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<Profile, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
    }),

    setProfile: builder.mutation<Profile, SetProfilePayload>({
      query: (body) => ({
        url: '/profile',
        method: 'PUT',
        body,
      }),
    }),
  }),
})

export const {
  useGetProfileQuery,
  useSetProfileMutation,
} = profileApi