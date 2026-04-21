import { baseApi } from "../../shared/api/baseApi";
import { setRelevantJobs } from "./jobsSlice";
import type { Job } from "./jobsSlice";

export interface JobsResponse {
  jobs: Job[];
}

export interface JobResponse {
  job: Job;
}

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRelevantJobs: builder.query<JobsResponse, void>({
      query: () => "/jobs",
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setRelevantJobs(data.jobs));
        } catch (err) {
          console.error("Failed to store relevant jobs", err);
        }
      },
    }),
    getJobById: builder.query<JobResponse, string>({
      query: (id) => `jobs/${id}`,
    }),
  }),
});

export const { useGetRelevantJobsQuery, useGetJobByIdQuery } = jobsApi;