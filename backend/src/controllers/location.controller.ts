import { Request, Response, NextFunction } from 'express';
import { Location } from '../models/Location.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

export const getLocations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query; // optional: 'city' or 'area'
    const query = type ? { type: type as string } : {};
    
    const locations = await Location.find(query).sort({ label: 1 });
    return sendSuccess(res, 'Locations retrieved successfully', { locations });
  } catch (error) {
    next(error);
  }
};

export const createLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, name, label, cityId } = req.body;

    if (!type || !name || !label) {
      return sendError(res, 'Type, name, and label are required', 400);
    }

    if (!['city', 'area'].includes(type)) {
      return sendError(res, 'Invalid location type', 400);
    }

    const normalizedName = name.trim().toLowerCase();

    const existing = await Location.findOne({ type, name: normalizedName });
    if (existing) {
      return sendError(res, `A ${type} with this name already exists`, 400);
    }

    const newLocation = new Location({
      type,
      name: normalizedName,
      label: label.trim(),
      cityId: cityId || null,
    });

    await newLocation.save();
    return sendSuccess(res, 'Location created successfully', { location: newLocation }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, label, cityId } = req.body;

    const location = await Location.findById(id);
    if (!location) {
      return sendError(res, 'Location not found', 404);
    }

    if (name) {
      const normalizedName = name.trim().toLowerCase();
      if (normalizedName !== location.name) {
        const existing = await Location.findOne({ type: location.type, name: normalizedName });
        if (existing) {
          return sendError(res, `A ${location.type} with this name already exists`, 400);
        }
        location.name = normalizedName;
      }
    }

    if (label) location.label = label.trim();
    if (cityId !== undefined) location.cityId = cityId;

    await location.save();
    return sendSuccess(res, 'Location updated successfully', { location });
  } catch (error) {
    next(error);
  }
};

export const deleteLocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const location = await Location.findById(id);
    if (!location) {
      return sendError(res, 'Location not found', 404);
    }

    await Location.findByIdAndDelete(id);

    return sendSuccess(res, 'Location deleted successfully');
  } catch (error) {
    next(error);
  }
};
