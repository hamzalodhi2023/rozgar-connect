import { WorkerProfile } from '../models/WorkerProfile.js';
import { User } from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

export const createWorkerProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Verify user has 'worker' role
    if (!req.user.roles.includes('worker')) {
      return sendError(res, 'Only users with the worker role can set up a profile', 403);
    }

    const existingProfile = await WorkerProfile.findOne({ userId });
    if (existingProfile) {
      return sendError(res, 'Worker profile already exists for this user', 400);
    }

    const { categories, city, area, phone, whatsapp, description, latitude, longitude } = req.body;
    
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    let photo = '';
    let idCardFront = '';
    let idCardBack = '';
    let verificationStatus = 'unverified';

    if (files) {
      if (files.photo?.[0]) {
        photo = `/uploads/${files.photo[0].filename}`;
      }
      if (files.idCardFront?.[0]) {
        idCardFront = `/uploads/${files.idCardFront[0].filename}`;
      }
      if (files.idCardBack?.[0]) {
        idCardBack = `/uploads/${files.idCardBack[0].filename}`;
      }
    }

    if (idCardFront && idCardBack) {
      verificationStatus = 'pending';
    }

    const newProfile = new WorkerProfile({
      userId,
      categories,
      city,
      area,
      phone,
      whatsapp,
      description,
      photo,
      idCardFront,
      idCardBack,
      verificationStatus,
      latitude,
      longitude,
    });

    await newProfile.save();

    return sendSuccess(res, 'Worker profile created successfully', { profile: newProfile }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateWorkerProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = await WorkerProfile.findOne({ userId });

    if (!profile) {
      return sendError(res, 'Worker profile not found', 404);
    }

    const { categories, city, area, phone, whatsapp, description, latitude, longitude } = req.body;

    if (categories) profile.categories = categories;
    if (city) profile.city = city;
    if (area) profile.area = area;
    if (phone) profile.phone = phone;
    if (whatsapp) profile.whatsapp = whatsapp;
    if (description) profile.description = description;
    if (latitude !== undefined) profile.latitude = latitude;
    if (longitude !== undefined) profile.longitude = longitude;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    if (files) {
      if (files.photo?.[0]) {
        profile.photo = `/uploads/${files.photo[0].filename}`;
      }
      if (files.idCardFront?.[0]) {
        profile.idCardFront = `/uploads/${files.idCardFront[0].filename}`;
      }
      if (files.idCardBack?.[0]) {
        profile.idCardBack = `/uploads/${files.idCardBack[0].filename}`;
      }
    }

    // If ID cards are uploaded/present, transition state to pending verification
    if (profile.idCardFront && profile.idCardBack && profile.verificationStatus !== 'verified') {
      profile.verificationStatus = 'pending';
    }

    await profile.save();

    return sendSuccess(res, 'Worker profile updated successfully', { profile });
  } catch (error) {
    next(error);
  }
};

export const getMyWorkerProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = await WorkerProfile.findOne({ userId }).populate('userId', 'name email');
    if (!profile) {
      return sendError(res, 'Worker profile not found', 404);
    }
    return sendSuccess(res, 'Worker profile retrieved successfully', { profile });
  } catch (error) {
    next(error);
  }
};

export const getWorkerProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const profile = await WorkerProfile.findById(id).populate('userId', 'name email');
    if (!profile) {
      return sendError(res, 'Worker profile not found', 404);
    }
    return sendSuccess(res, 'Worker profile retrieved successfully', { profile });
  } catch (error) {
    next(error);
  }
};

export const searchWorkers = async (req, res, next) => {
  try {
    const { category, city, area, sortBy } = req.query;

    const filter: any = {};

    if (category) {
      filter.categories = (category as string).trim().toLowerCase();
    }
    if (city) {
      filter.city = { $regex: (city as string).trim(), $options: 'i' };
    }
    if (area) {
      filter.area = { $regex: (area as string).trim(), $options: 'i' };
    }

    // Only show workers whose user accounts are active
    const activeUsers = await User.find({ isActive: true }).select('_id');
    const activeUserIds = activeUsers.map(u => u._id);
    filter.userId = { $in: activeUserIds };
    
    // Only show verified workers
    filter.verificationStatus = 'verified';

    let sort: any = {};

    if (sortBy === 'highestRating') {
      sort.averageRating = -1;
    } else if (sortBy === 'mostReviews') {
      sort.reviewCount = -1;
    } else if (sortBy === 'newest') {
      sort.createdAt = -1;
    } else {
      sort.createdAt = -1; // Default newest
    }

    const workers = await WorkerProfile.find(filter)
      .populate('userId', 'name email')
      .sort(sort);

    return sendSuccess(res, 'Workers searched successfully', { workers });
  } catch (error) {
    next(error);
  }
};
