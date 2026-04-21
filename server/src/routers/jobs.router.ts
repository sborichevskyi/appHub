import express from 'express';

import { isAuth } from '../midlewares/isAuth';
import { jobsController } from '../controllers/jobsController';

export const jobsRouter = express.Router();

jobsRouter.get('/', isAuth, jobsController.getRelevantJobs);
jobsRouter.get('/:id', isAuth, jobsController.getJobById);