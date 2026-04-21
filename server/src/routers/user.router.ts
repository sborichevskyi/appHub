import express from 'express';
import { userController } from '../controllers/userController';
import { isAuth } from '../midlewares/isAuth';

export const userRouter = express.Router();

userRouter.get('/', isAuth, userController.getAllUsers);