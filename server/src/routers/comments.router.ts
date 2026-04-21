import express from 'express';
import { isAuth } from '../midlewares/isAuth';
import { commentController } from '../controllers/commentsController';

export const commentRouter = express.Router();

commentRouter.get('/job/:jobId', isAuth, commentController.getUserCommentsByJobId);
commentRouter.post('/job/:jobId', isAuth, commentController.createUserCommentByJobId);
commentRouter.patch('/:commentId', isAuth, commentController.updateUserComment);
commentRouter.delete('/:commentId', isAuth, commentController.deleteCommentById);
commentRouter.get('/', isAuth, commentController.getCommentsByJobIds);