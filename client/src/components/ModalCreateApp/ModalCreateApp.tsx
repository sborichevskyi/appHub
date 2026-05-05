import { useCreateApplicationMutation } from "../../features/applications/applicationsApi";
import { useCreateJobMutation } from "../../features/jobs/jobsApi";
import { Button } from "../Button/Button";
import "./ModalCreateApp.scss";

type Props = {
  onClose: () => void;
};

export const ModalCreateApp: React.FC<Props> = ({ onClose }) => {
  const [createJob] = useCreateJobMutation();
  const [createApplication] = useCreateApplicationMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      title: String(formData.get("title") || ""),
      company: String(formData.get("company") || ""),
      country: String(formData.get("country") || ""),
      location: String(formData.get("location") || ""),
      url: String(formData.get("url") || ""),
      level: String(formData.get("level") || ""),
    };

    console.log("SUBMIT DATA:", data);

    const newJob = await createJob(data).unwrap();

    await createApplication({
      jobId: newJob.job.id,
    }).unwrap();

    onClose();
  };

  return (
    <div className="modal-create-app">
      <div className="modal-create-app__backdrop" onClick={onClose} />

      <div className="modal-create-app__content">
        <button className="modal-create-app__close" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-create-app__title">Create application</h2>

        <div className="modal-create-app__body">
          <form onSubmit={handleSubmit} className="modal-create-app__form">
            <div className="modal-create-app__inputs">
              <input type="text" name="title" placeholder="Job Title" />
              <input type="text" name="company" placeholder="Company" />
              <input type="text" name="country" placeholder="Country" />
              <input type="text" name="location" placeholder="Location" />
              <input type="text" name="url" placeholder="URL" />
              <input type="text" name="level" placeholder="Level" />
            </div>
            <Button type="submit">Create Application</Button>
          </form>
        </div>
      </div>
    </div>
  );
};
