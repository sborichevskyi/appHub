import { useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { isDemoMode } from "../../shared/heplers/demoHelper";
import { demoJobs } from "../../constants/demoJobs";
import { useGetJobByIdQuery } from "../../features/jobs/jobsApi";
import "./JobDetails.scss";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsByJobQuery,
  useUpdateCommentMutation,
} from "../../features/comments/commentsApi";
import { useState } from "react";
import { CommentCard } from "../../components/CommentCard/CommentCard";
import {
  useGetApplicationByJobIdQuery,
  useUpdateApplicationStatusMutation,
} from "../../features/applications/applicationsApi";
import { Button } from "../../components/Button/Button";
import { StatusButton } from "../../components/StatusButton/StatusButton";
import { Loader } from "../../components/Loader/Loader";

export const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const demo = isDemoMode();

  const jobs = useAppSelector((state) => state.jobs.relevantJobs);

  const demoJob = demo ? demoJobs.find((j) => j.id === id) : null;

  const fromJobsListJob = jobs.find((j) => j.id === id);

  const isAuthInitialized = useAppSelector(
    (state) => state.auth.isAuthInitialized,
  );

  const {
    data: fetchedJob,
    isLoading,
    isError,
  } = useGetJobByIdQuery(id!, {
    skip: demo || !!fromJobsListJob || !isAuthInitialized,
  });

  const job = demoJob || fromJobsListJob || fetchedJob?.job;

  const { data: commentsData, isLoading: commentsLoading, refetch } = useGetCommentsByJobQuery(id!, {
    skip: !id || demo || !isAuthInitialized,
  });

  const { data: applicationData, isLoading: applicationLoading } = useGetApplicationByJobIdQuery(
    { jobId: id! },
    {
      skip: !id || demo || !isAuthInitialized,
    },
  );
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateApplicationStatusMutation();

  const comments = commentsData || [];

  const [newComment, setNewComment] = useState("");
  const [createComment] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [openStatusBar, setOpenStatusBar] = useState(false);

  const getGoogleMapsLink = (company: string, location: string) => {
    const query = encodeURIComponent(`${company} ${location}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await createComment({ jobId: id!, text: newComment }).unwrap();
    setNewComment("");
    refetch();
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment({ commentId, jobId: id! }).unwrap();
    refetch();
  };

  const handleUpdateComment = async (commentId: string, newText: string) => {
    try {
      await updateComment({
        commentId,
        jobId: id!,
        text: newText,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleStatusSelect = async (status: string) => {
    try {
      if (applicationData?.application) {
        await updateStatus({
          applicationId: applicationData.application.id,
          status,
        }).unwrap();
      }

      setOpenStatusBar(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const openStatusChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenStatusBar((prev) => !prev);
  };

  if (!id) return <div>Job not found</div>;
  if (isLoading || commentsLoading || applicationLoading ) return <Loader />;
  if (!job || isError) return <div>Job not found</div>;

  return (
    <div className="job-details">
      <h1>{job.title}</h1>
      <p>
        <b>Company:</b> {job.company}
      </p>
      <p>
        <b>Location:</b> {`${job.country}, ${job.location}`}
      </p>
      <p>
        <b>Description:</b>
      </p>
      <p>{job.description}</p>
      <div className="status-section">
        <p>
          <b>Current Status:</b>{" "}
          {applicationData
            ? applicationData.application?.status
            : "Not Applied"}
        </p>
      </div>
      <div className="job-details__buttons">
        {job.url && (
          <Button
            variant="ghost"
            size="sm"
            as="link"
            to={job.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Job Posting
          </Button>
        )}
        <StatusButton
          // statusRef={statusRef}
          job={job}
          application={applicationData?.application}
          isLoading={isUpdatingStatus}
          openStatusBar={openStatusBar}
          setOpenStatusBar={setOpenStatusBar}
          handleStatusSelect={handleStatusSelect}
          openStatusChange={openStatusChange}
        />
        <Button
          variant="ghost"
          size="sm"
          as="link"
          to={getGoogleMapsLink(job.company, job.location)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Find in Google Maps
        </Button>
      </div>
      <p></p>

      <div className="comments-section">
        <h2>Notes</h2>
        <div className="add-comment">
          <textarea
            id="createComment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a note..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
        </div>

        {comments.length === 0 && <p>Add your first note</p>}
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onDelete={handleDeleteComment}
            onUpdate={handleUpdateComment}
          />
        ))}
      </div>
    </div>
  );
};
