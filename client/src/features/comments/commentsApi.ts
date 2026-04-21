import { baseApi } from "../../shared/api/baseApi";

export interface Comment {
  id: string;
  userId: string;
  jobId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsByJob: builder.query<Comment[], string>({
      query: (jobId) => `comments/job/${jobId}`,
      providesTags: (_result, _error, jobId) => [
        { type: "Comments", id: jobId },
      ],
    }),
    getCommentsByJobs: builder.query<Comment[], string[]>({
      query: (jobIds) => ({
        url: "/comments",
        params: { jobIds: jobIds.join(",") },
      }),
      providesTags: (_result, _error, jobIds) =>
        jobIds.map((id) => ({ type: "Comments" as const, id })),
    }),
    createComment: builder.mutation<Comment, { jobId: string; text: string }>({
      query: ({ jobId, text }) => ({
        url: `comments/job/${jobId}`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: (_result, _error, { jobId }) => [
        { type: "Comments", id: jobId },
      ],
    }),
    updateComment: builder.mutation<
      Comment,
      { commentId: string; jobId: string; text: string }
    >({
      query: ({ commentId, text }) => ({
        url: `comments/${commentId}`,
        method: "PATCH",
        body: { text },
      }),
      invalidatesTags: (_result, _error, { jobId }) => [
        { type: "Comments", id: jobId },
      ],
    }),
    deleteComment: builder.mutation<
      { message: string },
      { commentId: string; jobId: string }
    >({
      query: ({ commentId }) => ({
        url: `comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { jobId }) => [
        { type: "Comments", id: jobId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCommentsByJobQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsByJobsQuery,
} = commentsApi;
