import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Skill {
  label: string
  value: string
  query: string
}

export interface Role {
  label: string
  value: string
  query: string
}

export interface Country {
  label: string
  value: string
  query: string
}

export interface Level {
  label: string
  value: string
  query: string
}
  
interface ProfileState {
  role: Role | null
  skills: Skill[]
  country: Country | null
  location: string
}

const initialState: ProfileState = {
  role: null,
  skills: [],
  country: null,
  location: '',
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload
    },
    setSkills: (state, action: PayloadAction<Skill[]>) => {
      state.skills = action.payload
    },
    setCountry: (state, action: PayloadAction<Country>) => {
      state.country = action.payload
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload
    },
    resetProfile: (state) => {
      state.role = null
      state.skills = []
      state.country = null
      state.location = ''
    },
  },
})

export const { setRole, setSkills, setCountry, setLocation, resetProfile } = profileSlice.actions
export default profileSlice.reducer