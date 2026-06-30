import { sendError } from '../utils/response.utils.js';

export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return sendError(res, 'Access denied. User roles not found.', 403);
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return sendError(res, 'Access denied. You do not have permission to perform this action.', 403);
    }

    next();
  };
};
