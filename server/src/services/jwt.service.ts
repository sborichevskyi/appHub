import jwt from 'jsonwebtoken';
import { User } from '../db/models/User';

export interface JwtPayload {
  id: string;
  email: string;
}

const signAccessToken = (user: User): string => {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_KEY as string,
    { expiresIn: '5m' }
  );

  return token;
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_KEY as string
    ) as JwtPayload;
  } catch {
    return null;
  }
};

export const signRefreshToken = (user: User): string => {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
  };

  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_KEY as string,
    { expiresIn: '7d' }
  );
};

const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_KEY as string) as JwtPayload;
  } catch (err) {
    return null;
  }
};

export const jwtService = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
