import { Op } from "sequelize";
import { Job } from "../db/models/Job";

interface JobSearchCriteria {
  role?: string;
  keywords?: string[];
  country?: string;
  location?: string;
  level?: string;
}

const getRelevantJobs = async ({
  role,
  keywords = [],
  country,
  location,
  level,
}: JobSearchCriteria) => {
  const textConditions: any[] = [];

  if (role) {
    textConditions.push(
      { title: { [Op.iLike]: `%${role}%` } },
      { description: { [Op.iLike]: `%${role}%` } },
    );
  }

  for (const keyword of keywords) {
    textConditions.push(
      { title: { [Op.iLike]: `%${keyword}%` } },
      { description: { [Op.iLike]: `%${keyword}%` } },
    );
  }

  const jobs = await Job.findAll({
    where: {
      isCustom: {
        [Op.eq]: false,
      },

      ...(country && { country: { [Op.iLike]: `%${country}%` } }),
      ...(location && { location: { [Op.iLike]: `%${location}%` } }),

      ...(textConditions.length
        ? {
            [Op.and]: [
              {
                [Op.or]: textConditions,
              },
            ],
          }
        : {}),
    },
    order: [["createdAt", "DESC"]],
  });

  return jobs;
};

const getJobById = async (id: string) => {
  const job = await Job.findByPk(id);
  return job;
};

const createManualJob = async ({ jobData }: { jobData: any }) => {
  const job = await Job.create(jobData);
  return job;
};

export const jobService = {
  getRelevantJobs,
  getJobById,
  createManualJob,
};
