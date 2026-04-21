import { Request, Response } from 'express';
import { applicationService } from '../services/application.service';

const createApplication = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No user in request' });
    }

    const { jobId } = req.body;
    const userId = req.user!.id;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const application = await applicationService.createApplication(jobId, userId);

    res.status(201).json({ application });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error creating application',
    });
  }
};

const getApplicationsByUserId = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No user in request' });
    }

    console.log('📥 Received request for applications, user:', req.user);
    const applications = await applicationService.getApplicationsByUserId(req.user.id);

    res.json({ applications });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error fetching applications',
    });
  }
};

const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No user in request' });
    }

    const { applicationId } = req.params;
    const { status } = req.body;

    if (!applicationId || !status) {
      return res.status(400).json({ message: 'Application ID and status are required' });
    }

    const updatedApplication = await applicationService.updateApplicationStatus(applicationId, status, req.user.id);

    if (!updatedApplication) {
      return res.status(404).json({ message: 'Application not found or not owned by user' });
    }

    res.json({ application: updatedApplication });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error updating application status',
    });
  }
}

const deleteApplication = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No user in request' });
    }

    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({ message: 'Application ID is required' });
    }

    const deletedApplication = await applicationService.deleteApplication(applicationId, req.user.id);

    if (!deletedApplication) {
      return res.status(404).json({ message: 'Application not found or not owned by user' });
    }

    res.json({ application: deletedApplication });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error deleting application',
    });

  }
}

const getApplicationByJobId = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No user in request' });
    }

    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const application = await applicationService.getApplicationByJobId(String(jobId), req.user.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found for this job and user' });
    }

    res.json({ application });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error getting application by job ID',
    });
  }
};

export const applicationController = {
  createApplication,
  getApplicationsByUserId,
  updateApplicationStatus,
  deleteApplication,
  getApplicationByJobId,
};