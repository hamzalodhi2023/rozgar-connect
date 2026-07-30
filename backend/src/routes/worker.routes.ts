import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  createWorkerProfile,
  updateWorkerProfile,
  getMyWorkerProfile,
  getWorkerProfileById,
  searchWorkers,
  deleteMyWorkerProfile,
} from '../controllers/worker.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/role.middleware.js';
import { handleValidation } from '../middlewares/validate.middleware.js';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, PNG, and WEBP images are allowed!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

const uploadFields = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'idCardFront', maxCount: 1 },
  { name: 'idCardBack', maxCount: 1 },
]);

const validateWorkerProfile = [
  body('categories').customSanitizer(val => {
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch (e) { return [val]; }
    }
    return val;
  }).isArray({ min: 1 }).withMessage('At least one category is required'),
  body('categories.*').trim().notEmpty().withMessage('Category cannot be empty'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('area').trim().notEmpty().withMessage('Area is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('whatsapp').trim().notEmpty().withMessage('WhatsApp number is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('latitude').notEmpty().withMessage('GPS Location is required').isFloat().withMessage('Latitude must be a valid number'),
  body('longitude').notEmpty().withMessage('GPS Location is required').isFloat().withMessage('Longitude must be a valid number'),
];

router.get('/search', searchWorkers);
router.get('/me', requireAuth, requireRoles('worker'), getMyWorkerProfile);
router.get('/:id', getWorkerProfileById);

router.post(
  '/',
  requireAuth,
  requireRoles('worker'),
  uploadFields,
  validateWorkerProfile,
  handleValidation,
  createWorkerProfile
);

router.put(
  '/',
  requireAuth,
  requireRoles('worker'),
  uploadFields,
  [
    body('categories').optional().customSanitizer(val => {
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch (e) { return [val]; }
      }
      return val;
    }).isArray({ min: 1 }).withMessage('At least one category is required'),
    body('categories.*').optional().trim().notEmpty().withMessage('Category cannot be empty'),
    body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
    body('area').optional().trim().notEmpty().withMessage('Area cannot be empty'),
    body('phone').optional().trim().notEmpty().withMessage('Phone number cannot be empty'),
    body('whatsapp').optional().trim().notEmpty().withMessage('WhatsApp number cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('latitude').notEmpty().withMessage('GPS Location is required').isFloat().withMessage('Latitude must be a valid number'),
    body('longitude').notEmpty().withMessage('GPS Location is required').isFloat().withMessage('Longitude must be a valid number'),
  ],
  handleValidation,
  updateWorkerProfile
);

router.delete('/me', requireAuth, requireRoles('worker'), deleteMyWorkerProfile);

export default router;
