import type { Job } from "../jobs/jobsSlice";

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: string;
  createdAt: string;
  job?: Job | null;
};