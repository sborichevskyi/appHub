import express from 'express';

import { isAuth } from '../midlewares/isAuth';
import { applicationController } from '../controllers/applicationController';

export const applicationsRouter = express.Router();

applicationsRouter.post('/', isAuth, applicationController.createApplication);
applicationsRouter.get('/', isAuth, applicationController.getApplicationsByUserId);
applicationsRouter.put('/:applicationId', isAuth, applicationController.updateApplicationStatus);
applicationsRouter.delete('/:applicationId', isAuth, applicationController.deleteApplication);
applicationsRouter.get('/:jobId', isAuth, applicationController.getApplicationByJobId);