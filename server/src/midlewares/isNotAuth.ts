import {Request, Response, NextFunction} from 'express';
import { jwtService } from '../services/jwt.service';

export const isNotAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const refreshToken = req.cookies?.refreshToken;

  if (authHeader) {
    return res.sendStatus(403);
  }

  if (refreshToken) {
    const userData = jwtService.verifyRefreshToken(refreshToken);

    if (userData) {
      return res.sendStatus(403);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
    });
  }

  next();
};