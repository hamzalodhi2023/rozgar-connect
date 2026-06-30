import { verifyAccessToken } from '../utils/jwt.utils.js';
import { sendError } from '../utils/response.utils.js';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Access denied. No token provided.', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return sendError(res, 'Invalid or expired access token.', 401);
  }

  req.user = decoded;
  next();
};
