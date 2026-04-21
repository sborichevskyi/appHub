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
      ...(country && { country: { [Op.iLike]: `%${country}%` } }),
      ...(location && { location: { [Op.iLike]: `%${location}%` } }),
  // ...(level && { level: { [Op.iLike]: `%${level}%` } }),

      ...(textConditions.length && {
        [Op.or]: textConditions,
      }),
    },
    order: [['createdAt', 'DESC']],
  });

  return jobs;
  // const orConditions: any[] = [];

  // if (role) {
  //   orConditions.push(
  //     { title: { [Op.iLike]: `%${role}%` } },
  //     { description: { [Op.iLike]: `%${role}%` } },
  //   );
  // }

  // for (const keyword of keywords) {
  //   orConditions.push(
  //     { title: { [Op.iLike]: `%${keyword}%` } },
  //     { description: { [Op.iLike]: `%${keyword}%` } },
  //   );
  // }

  // const where: any = {};

  // if (country) {
  //   where.country = { [Op.iLike]: `%${country}%` };
  // }

  // if (location) {
  //   where.location = { [Op.iLike]: `%${location}%` };
  // }

  // if (level) {
  //   where.level = { [Op.iLike]: `%${level}%` };
  // }

  // if (orConditions.length) {
  //   where[Op.or] = orConditions;
  // }

  // const jobs = await Job.findAll({
  //   where,
  //   order: [["createdAt", "DESC"]],
  // });

  // return jobs;
};

const getJobById = async (id: string) => {
  const job = await Job.findByPk(id);
  return job;
};

export const jobService = {
  getRelevantJobs,
  getJobById,
};
