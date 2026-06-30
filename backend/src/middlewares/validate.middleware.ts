import { validationResult } from 'express-validator';
import { sendError } from '../utils/response.utils.js';

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 'Validation error', 400, errors.array());
  }
  next();
};
