import { Application, Comment, Job } from "../db/sequalize";
import { HttpError } from "../utils/HttpError";

const STATUSES = ['not_applied', 'applied', 'interview', 'rejected', 'hired'] as const;

type StatusType = typeof STATUSES[number];

const createApplication = async (jobId: string, userId: string) => {
  const existing = await Application.findOne({ where: { jobId, userId } });

  if (existing) {
    throw new HttpError(409, "Application already exists");
  }

  const job = await Job.findByPk(jobId);

  if (!job) {
    throw new HttpError(404, "Job not found");
  }

  const application = await Application.create({ jobId, userId, status: 'not_applied' });

  return application;
};

const getApplicationsByUserId = async (userId: string) => {
  const applications = await Application.findAll({
    where: { userId },
    include: [
      {
        model: Job,
        as: "job",
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return applications;
};

const updateApplicationStatus = async (applicationId: string | string[], status: StatusType, userId: string) => {
  if (!STATUSES.includes(status)) {
    throw new HttpError(400, "Invalid application status");
  }

  const application = await Application.findOne({ where: { id: applicationId, userId } });

  if (!application) {
    throw new HttpError(404, "Application not found or not owned by user");
  }

  application.status = status;
  await application.save();

  return application;
}

const deleteApplication = async (applicationId: string | string[], userId: string) => {
  const application = await Application.findOne({ where: { id: applicationId, userId } });

  if (!application) {
    throw new HttpError(404, "Application not found or not owned by user");
  }

  await Comment.destroy({
    where: { jobId: application.jobId, userId },
  });

  await application.destroy();

  return true;
}

const getApplicationByJobId = async (jobId: string, userId: string) => {
  const application = await Application.findOne({ where: { jobId, userId } });

  return application;
}

export const applicationService = {
  createApplication,
  getApplicationsByUserId,
  updateApplicationStatus,
  deleteApplication,
  getApplicationByJobId,
};