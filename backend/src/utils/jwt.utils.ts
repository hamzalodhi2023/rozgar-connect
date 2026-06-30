import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const generateAccessToken = (user: any) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      roles: user.roles,
    },
    env.jwtAccessSecret as string,
    { expiresIn: env.jwtAccessExpiry as any }
  );
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign(
    {
      id: user._id || user.id,
    },
    env.jwtRefreshSecret as string,
    { expiresIn: env.jwtRefreshExpiry as any }
  );
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, env.jwtAccessSecret);
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, env.jwtRefreshSecret);
  } catch (error) {
    return null;
  }
};
