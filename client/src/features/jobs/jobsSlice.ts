import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  country: string;
  location: string;
  url: string;
  source: string;
  level: string;
  createdAt: string;
  updatedAt: string;
}

interface JobsState {
  relevantJobs: Job[];
}

const initialState: JobsState = {
  relevantJobs: [],
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setRelevantJobs(state, action: PayloadAction<Job[]>) {
      state.relevantJobs = action.payload;
    },
  },
});

export const { setRelevantJobs } = jobsSlice.actions;
export default jobsSlice.reducer;