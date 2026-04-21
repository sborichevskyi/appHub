import express from 'express';

import { isAuth } from '../midlewares/isAuth';
import { profileController } from '../controllers/profileController';

export const profileRouter = express.Router();

profileRouter.get('/', isAuth, profileController.getProfile);
profileRouter.put('/', isAuth, profileController.setProfile);