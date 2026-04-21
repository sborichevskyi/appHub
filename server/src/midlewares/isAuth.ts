import { jwtService } from '../services/jwt.service';
import { Request, Response, NextFunction } from "express";

export const isAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(401);
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  const userData = jwtService.verifyAccessToken(token);

  if (!userData) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = userData;

  next();
};
