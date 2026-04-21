import { useState, useRef } from "react";
import type { Job } from "../../features/jobs/jobsSlice";
import "./JobCard.scss";
import { Button } from "../Button/Button";
import {
  useCreateApplicationMutation,
  useGetUserApplicationsQuery,
} from "../../features/applications/applicationsApi";
import type { Application } from "../../features/applications/applocationSlice";
import { useNavigate } from "react-router-dom";
import { isDemoMode } from "../../shared/heplers/demoHelper";

export const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  const navigate = useNavigate();
  const { data } = useGetUserApplicationsQuery();
  const applications: Application[] = data?.applications ?? [];
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [createApplication, { isLoading }] = useCreateApplicationMutation();
  const isSaved = applications.some((app) => app.jobId === job.id);

  const handleToggle = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handleSaveJob = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const demo = isDemoMode();
    if (demo) {
      // просто симулюємо успіх
      console.log(`Demo save: job ${job.id}`);
      setSaved(true);
      return;
    } else {
      try {
        await createApplication({ jobId: job.id }).unwrap();
        setSaved(true);
      } catch (err) {
        console.error("Failed to save job", err);
      }
    }
  };

  return (
    <div
      className="job-card"
      ref={cardRef}
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      <div className="job-card__details">
        <h2>{job.title}</h2>

        <p>
          <b>Company:</b> {job.company}
        </p>
        <p>
          <b>Location:</b> {`${job.country}, ${job.location}`}
        </p>

        <p
          className={`job-card__description ${expanded ? "expanded" : ""}`}
          onClick={handleToggle}
        >
          {job.description}
        </p>

        {job.description.length > 200 && (
          <span className="job-card__more" onClick={handleToggle}>
            {expanded ? "show less" : "read more"}
          </span>
        )}
      </div>

      <div className="job-card__actions">
        <Button
          as="link"
          to={job.url}
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          size="square"
          onClick={(e) => e.stopPropagation()}
        >
          View Job
        </Button>

        <Button
          variant="primary"
          size="square"
          onClick={handleSaveJob}
          disabled={isLoading || isSaved || saved}
        >
          {isSaved ? "Saved" : isLoading ? "Saving..." : "Save Job"}
        </Button>
      </div>
    </div>
  );
};
