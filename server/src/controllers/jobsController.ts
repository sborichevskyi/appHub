import { Request, Response } from 'express';
import { profileService } from '../services/profile.service';
import { jobService } from '../services/job.service';

const getRelevantJobs = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No user in request' });
    }

    const profile = await profileService.getProfile(req.user!.id);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const jobs = await jobService.getRelevantJobs({
      role: profile.role,
      keywords: profile.keywords,
      country: profile.country,
      location: profile.location,
      level: profile.level,
    });

    res.status(200).json({ jobs });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error fetching relevant jobs',
    });
  };
};

const getJobById = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;

    const job = await jobService.getJobById(String(jobId));

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ job });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error fetching job details',
    });
  }
};

export const jobsController = {
  getRelevantJobs,
  getJobById,
};