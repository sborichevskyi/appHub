import { useMemo, useState } from "react";
import {
  CustomSelect,
  type Option,
} from "../../components/CustomSelect/CustomSelect";
import { JobCard } from "../../components/JobCard/JobCard";
import { Loader } from "../../components/Loader/Loader";
import { demoJobs } from "../../constants/demoJobs";
import { useGetRelevantJobsQuery } from "../../features/jobs/jobsApi";
import { isDemoMode } from "../../shared/heplers/demoHelper";
import { useAuth } from "../../shared/hooks/authHook";
import "./Jobs.scss";
import type { Job } from "../../features/jobs/jobsSlice";
import { useGetUserApplicationsQuery } from "../../features/applications/applicationsApi";
import type { Application } from "../../features/applications/applocationSlice";

const sortOptions: Option[] = [
  { label: "New", value: "new", query: "New" },
  { label: "Old", value: "old", query: "Old" },
  { label: "Saved first", value: "saved_desc", query: "Saved first" },
  { label: "Saved last", value: "saved_asc", query: "Saved last" },
];

export const Jobs: React.FC = () => {
  const [sort, setSort] = useState<Option | null>(sortOptions[0]);
  const { data: applicationsData, isLoading: applicationsLoading } =
    useGetUserApplicationsQuery();

  const applications = useMemo<Application[]>(() => {
    return applicationsData?.applications ?? [];
  }, [applicationsData?.applications]);
  const isDemo = isDemoMode();
  const { isAuthenticated } = useAuth();
  const shouldFetch = isAuthenticated && !isDemo;
  const { data, isLoading } = useGetRelevantJobsQuery(undefined, {
    skip: !shouldFetch,
    refetchOnMountOrArgChange: true,
  });
  const baseJobs = useMemo<Job[]>(() => {
    if (isDemo) return demoJobs;
    if (isAuthenticated) return data?.jobs ?? [];
    return [];
  }, [isDemo, isAuthenticated, data?.jobs]);

  const savedSet = useMemo(() => {
    return new Set(applications.map((a) => a.jobId));
  }, [applications]);

  const jobsWithSaved = useMemo(() => {
    return baseJobs.map((job) => ({
      ...job,
      isSaved: savedSet.has(job.id),
    }));
  }, [baseJobs, savedSet]);

  const sortedJobs = useMemo(() => {
    return [...jobsWithSaved].sort((a, b) => {
      switch (sort?.value) {
        case "new":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        case "old":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

        case "saved_desc":
          return Number(b.isSaved) - Number(a.isSaved);

        case "saved_asc":
          return Number(a.isSaved) - Number(b.isSaved);

        default:
          return 0;
      }
    });
  }, [jobsWithSaved, sort]);

  const isPageLoading = !isDemo && isLoading;

  if (!isDemo && !isAuthenticated) {
    return (
      <div className="jobs-container-demo">
        <h1>Jobs</h1>
        <p>
          Please <a href="/login">log in</a> to see all the opportunities.
        </p>
        <p>Or try demo mode to see sample data.</p>
      </div>
    );
  }

  if (isPageLoading || applicationsLoading) {
    return <Loader />;
  }

  if (sortedJobs.length === 0) {
    return (
      <div className="jobs-container">
        <h1>{isDemo ? "Explore demo jobs" : "Here are your opportunities"}</h1>
        <p>No relevant jobs found</p>
      </div>
    );
  }

  return (
    <div className="jobs-container">
      <h1>{isDemo ? "Explore demo jobs" : "Here are your opportunities"}</h1>

      <div className="sort-container">
        <p>Sort by</p>
        <CustomSelect
          id="sort"
          elements={sortOptions}
          value={sort}
          onChange={(option) => setSort(option as Option | null)}
        />
      </div>

      <div className="jobs-container__cards">
        {sortedJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};
