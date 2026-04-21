import {Request, Response, NextFunction} from 'express';

export const isNotAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const refreshToken = req.cookies?.refreshToken;

  if (authHeader || refreshToken) {
    return res.sendStatus(403);
  }

  next();
};