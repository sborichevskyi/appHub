import express from 'express';
import { isNotAuth } from '../midlewares/isNotAuth';
import { isAuth } from '../midlewares/isAuth';
import { authController } from '../controllers/authController';

export const authRouter = express.Router();

authRouter.post('/registration', isNotAuth, authController.register);
authRouter.get('/activate', isNotAuth, authController.activate);
authRouter.post('/login', isNotAuth, authController.login);
authRouter.get('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);
authRouter.get('/me', isAuth, authController.me);