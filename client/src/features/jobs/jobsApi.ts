import { baseApi } from "../../shared/api/baseApi";
import { setRelevantJobs } from "./jobsSlice";
import type { Job } from "./jobsSlice";

export interface JobsResponse {
  jobs: Job[];
}

export interface JobResponse {
  job: Job;
}

export type CreateJobRequest = {
  title: string;
  company: string;
  country?: string;
  location?: string;
  url?: string;
  level?: string;
};

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
      providesTags: ["Jobs"],
    }),
    getJobById: builder.query<JobResponse, string>({
      query: (id) => `jobs/${id}`,
      providesTags: ["Jobs"],
    }),
    createJob: builder.mutation<JobResponse, CreateJobRequest>({
      query: (body) => ({
        url: "/jobs/job",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Jobs"],
    }),
  }),
});

export const {
  useGetRelevantJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
} = jobsApi;
