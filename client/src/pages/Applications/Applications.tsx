import { ApplicationCard } from "../../components/ApplicationCard/ApplicationCard";
import { Loader } from "../../components/Loader/Loader";
import { demoApplications } from "../../constants/demoApplications";
import { demoJobs } from "../../constants/demoJobs";
import { useGetUserApplicationsQuery } from "../../features/applications/applicationsApi";
import { useGetCommentsByJobsQuery, type Comment } from "../../features/comments/commentsApi";
import { isDemoMode } from "../../shared/heplers/demoHelper";
import { useAuth } from "../../shared/hooks/authHook";
import "./Applications.scss";

export const Applications: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const demo = isDemoMode();

  const { data, isLoading, } = useGetUserApplicationsQuery(undefined, {
    skip: demo || !isAuthenticated,
  });

  const applications = demo
    ? demoApplications.map((app) => ({
        ...app,
        job: demoJobs.find((j) => j.id === app.jobId),
      }))
    : (data?.applications ?? []);
  const jobIds = applications.flatMap((app) =>
    app.job?.id ? [app.job.id] : [],
  );
  const { data: comments = [] } = useGetCommentsByJobsQuery(jobIds);
  const commentsByJobId = comments.reduce(
    (acc, comment) => {
      if (!acc[comment.jobId]) {
        acc[comment.jobId] = [];
      }
      acc[comment.jobId].push(comment);
      return acc;
    },
    {} as Record<string, Comment[]>,
  );

  if (isLoading) {
    return (
      <Loader />
    );
  }

  if (!isAuthenticated && !demo) {
    return (
      <div className="applications-container-demo">
        <h1>My Applications</h1>
        <p>
          Please <a href="/login">log in</a> to see your applications.
        </p>
        <p>Or try demo mode to see sample data.</p>
      </div>
    );
  }

  return (
    <div className="applications-container">
      <h1>My Applications</h1>
      {applications.length === 0 ? (
        <p>You haven't saved any jobs yet.</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              job={app.job ?? null}
              application={app}
              lastComment={
                commentsByJobId[app.job?.id || ""]?.at(-1) || null
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
};
