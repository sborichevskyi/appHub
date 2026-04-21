import type { Job } from "../../features/jobs/jobsSlice";
import type { Application } from "../../features/applications/applocationSlice";
import { useLayoutEffect, useRef, useState } from "react";
import "./ApplicationCard.scss";
import { useNavigate } from "react-router-dom";
import {
  useDeleteApplicationMutation,
  useUpdateApplicationStatusMutation,
} from "../../features/applications/applicationsApi";
import {
  useCreateCommentMutation,
  type Comment,
} from "../../features/comments/commentsApi";
import { StatusButton } from "../StatusButton/StatusButton";

interface ApplicationCardProps {
  job: Job | null;
  application: Application;
  lastComment: Comment | null;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  job,
  application,
  lastComment,
}) => {
  const navigate = useNavigate();
  const appRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [updateStatus, { isLoading }] = useUpdateApplicationStatusMutation();
  const [deleteApplication] = useDeleteApplicationMutation();
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [createComment] = useCreateCommentMutation();
  const [openStatusBar, setOpenStatusBar] = useState(false);

  // const statusFlow = [
  //   "not_applied",
  //   "applied",
  //   "interview",
  //   "rejected",
  //   "hired",
  // ];

  const handleToggle = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const handleDelete = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await deleteApplication({ applicationId: application.id }).unwrap();
      } catch (error) {
        console.error("Failed to delete application:", error);
      }
    }
  };

  const handleCommentToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsCommentOpen((prev) => !prev);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await createComment({
        jobId: job!.id,
        text: commentText,
      }).unwrap();

      setCommentText("");
      setIsCommentOpen(false);
    } catch (err) {
      console.error("Failed to create comment:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const openStatusChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenStatusBar((prev) => !prev);
  };

  const handleStatusSelect = async (status: string) => {
    try {
      await updateStatus({
        applicationId: application.id,
        status,
      }).unwrap();

      setOpenStatusBar(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  useLayoutEffect(() => {
    if (expanded && appRef.current) {
      appRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [expanded]);

  useLayoutEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (appRef.current && !appRef.current.contains(e.target as Node)) {
        setOpenStatusBar(false);
        setIsCommentOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!job) {
    return (
      <div className="application-card no-job" ref={appRef}>
        <p>Job details not found.</p>
        <div className="application-card__actions">
          {/* <button
            className={`step ${application.status}`}
            onClick={handleStatusChange}
            disabled={isLoading}
          ></button> */}
          {/* <div className="application-card__status-wrapper">
  <button
    className={`step ${application.status}`}
    onClick={openStatusChange}
    disabled={isLoading}
  />

  {openStatusBar && (
    <div
      className="application-card__status-dropdown"
      onClick={(e) => e.stopPropagation()}
    >
      {statusFlow.map((status) => (
        <div
          key={status}
          className={`status-option ${status}`}
          onClick={() => handleStatusSelect(status)}
        >
          {status.replace("_", " ")}
        </div>
      ))}
    </div>
  )}
</div> */}
          <StatusButton
            job={job}
            application={application}
            isLoading={isLoading}
            openStatusBar={openStatusBar}
            setOpenStatusBar={setOpenStatusBar}
            handleStatusSelect={handleStatusSelect}
            openStatusChange={openStatusChange}
          />
          <div className="application-card__delete" onClick={handleDelete}>
            ✕
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="application-card"
        ref={appRef}
        onClick={() => navigate(`/jobs/${job.id}`)}
      >
        <div className="application-card__details">
          <h2>{job.title}</h2>
          <p>
            <b>Company:</b> {job.company}
          </p>
          <p>
            <b>Location:</b> {`${job.country}, ${job.location}`}
          </p>

          <p
            className={`application-card__description ${expanded ? "expanded" : ""}`}
            onClick={handleToggle}
          >
            {job.description}
          </p>

          {job.description.length > 200 && (
            <span className="application-card__more" onClick={handleToggle}>
              {expanded ? "show less" : "read more"}
            </span>
          )}
        </div>
        <div className="application-card__actions">
          <button
            className="application-card__comment"
            onClick={handleCommentToggle}
          >
            📝
          </button>

          {/* <div className="application-card__status-wrapper">
  <button
    className={`step ${application.status}`}
    onClick={openStatusChange}
    disabled={isLoading}
  />

  {openStatusBar && (
    <div
      className="application-card__status-dropdown"
      onClick={(e) => e.stopPropagation()}
    >
      {statusFlow.map((status) => (
        <div
          key={status}
          className={`status-option ${status} ${
            status === application.status ? "active" : ""
          }`}
          onClick={() => handleStatusSelect(status)}
        >
          {status.replace("_", " ")}
        </div>
      ))}
    </div>
  )}
</div> */}
          <StatusButton
            job={job}
            application={application}
            isLoading={isLoading}
            openStatusBar={openStatusBar}
            setOpenStatusBar={setOpenStatusBar}
            handleStatusSelect={handleStatusSelect}
            openStatusChange={openStatusChange}
          />

          <div className="application-card__delete" onClick={handleDelete}>
            ✕
          </div>
        </div>
        {isCommentOpen && (
          <div
            className="application-card__comment-section"
            onClick={(e) => e.stopPropagation()}
          >
            <textarea
              placeholder="Add a note..."
              id="createComment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
        )}
        <div>
          {lastComment && (
            <div className="application-card__last-comment">
              <p>„{lastComment.text}“</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
