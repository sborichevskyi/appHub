import { baseApi } from "../../shared/api/baseApi";
import type { Application } from "./applocationSlice";

export const applicationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createApplication: builder.mutation<
      { application: Application },
      { jobId: string }
    >({
      query: ({ jobId }) => ({
        url: "/applications",
        method: "POST",
        body: { jobId },
      }),
      invalidatesTags: ["Applications"],
    }),
    getUserApplications: builder.query<{ applications: Application[] }, void>({
      query: () => "/applications",
      providesTags: ["Applications"],
    }),
    updateApplicationStatus: builder.mutation<
      { application: Application },
      { applicationId: string; status: string }
    >({
      query: ({ applicationId, status }) => ({
        url: `/applications/${applicationId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Applications"],
    }),
    deleteApplication: builder.mutation<
      { application: Application },
      { applicationId: string }
    >({
      query: ({ applicationId }) => ({
        url: `/applications/${applicationId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { applicationId }) => [
        { type: "Applications", id: applicationId },
        "Applications",
        "Comments",
        "Jobs",
      ],
    }),
    getApplicationByJobId: builder.query<
      { application: Application | null },
      { jobId: string }
    >({
      query: ({ jobId }) => ({
        url: `/applications/${jobId}`,
        method: "GET",
      }),
      providesTags: ["Applications"],
    }),
  }),
});

export const {
  useCreateApplicationMutation,
  useGetUserApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useDeleteApplicationMutation,
  useGetApplicationByJobIdQuery,
} = applicationsApi;
