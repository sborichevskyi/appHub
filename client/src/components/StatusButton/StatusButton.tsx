import { useLayoutEffect, useRef } from "react";
import { useCreateApplicationMutation } from "../../features/applications/applicationsApi";
import type { Application } from "../../features/applications/applocationSlice";
import type { Job } from "../../features/jobs/jobsSlice";
import "./StatusButton.scss";
import { Button } from "../Button/Button";

interface StatusButtonProps {
  job: Job | null;
  application: Application | null | undefined;
  isLoading: boolean;
  openStatusBar: boolean;
  setOpenStatusBar: React.Dispatch<React.SetStateAction<boolean>>;
  handleStatusSelect: (status: string) => void;
  openStatusChange: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const statusFlow = ["not_applied", "applied", "interview", "rejected", "hired"];

export const StatusButton: React.FC<StatusButtonProps> = ({
  // statusRef,
  job,
  application,
  isLoading,
  openStatusBar,
  setOpenStatusBar,
  handleStatusSelect,
  openStatusChange,
}) => {
  const statusRef = useRef<HTMLDivElement>(null);
  const [createApplication, { isLoading: isCreatingApplication }] =
    useCreateApplicationMutation();
  const handleCreateApplication = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    try {
      if (job) {
        await createApplication({ jobId: job.id }).unwrap();
      }
    } catch (error) {
      console.error("Failed to create application:", error);
    }
  };

  useLayoutEffect(() => {
    if (statusRef) {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          statusRef.current &&
          !statusRef.current.contains(e.target as Node)
        ) {
          setOpenStatusBar(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [setOpenStatusBar]);

  if (!application) {
    return (
      <div className="status-button-wrapper">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCreateApplication}
          disabled={isCreatingApplication}
        >
          Add
        </Button>
      </div>
    );
  }

  return (
    <div className="status-wrapper" ref={statusRef}>
      <button
        className={`step ${application.status}`}
        onClick={openStatusChange}
        disabled={isLoading}
      />

      {openStatusBar && (
        <div className="status-dropdown" onClick={(e) => e.stopPropagation()}>
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
    </div>
  );
};
