import { Request, Response, NextFunction } from 'express';
import { WorkCategory } from '../models/WorkCategory.js';
import { WorkerProfile } from '../models/WorkerProfile.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await WorkCategory.find().sort({ label: 1 });
    return sendSuccess(res, 'Categories retrieved successfully', { categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, label, iconName, iconColor } = req.body;

    if (!name || !label) {
      return sendError(res, 'Category name and label are required', 400);
    }

    const normalizedName = name.trim().toLowerCase();

    const existing = await WorkCategory.findOne({ name: normalizedName });
    if (existing) {
      return sendError(res, 'A category with this name already exists', 400);
    }

    const newCategory = new WorkCategory({
      name: normalizedName,
      label: label.trim(),
      iconName: iconName ? iconName.trim() : 'FaWrench',
      iconColor: iconColor ? iconColor.trim() : 'blue',
    });

    await newCategory.save();
    return sendSuccess(res, 'Category created successfully', { category: newCategory }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, label, iconName, iconColor } = req.body;

    const category = await WorkCategory.findById(id);
    if (!category) {
      return sendError(res, 'Category not found', 404);
    }

    const oldName = category.name;
    let newName = oldName;

    if (name) {
      newName = name.trim().toLowerCase();
      if (newName !== oldName) {
        const existing = await WorkCategory.findOne({ name: newName });
        if (existing) {
          return sendError(res, 'A category with this name already exists', 400);
        }
      }
      category.name = newName;
    }

    if (label) category.label = label.trim();
    if (iconName !== undefined) category.iconName = iconName.trim();
    if (iconColor !== undefined) category.iconColor = iconColor.trim();

    await category.save();

    // If the category name was updated, rename it in all worker profiles
    if (name && newName !== oldName) {
      await WorkerProfile.updateMany(
        { categories: oldName },
        { $set: { 'categories.$[elem]': newName } },
        { arrayFilters: [{ 'elem': oldName }] }
      );
    }

    return sendSuccess(res, 'Category updated successfully', { category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const category = await WorkCategory.findById(id);
    if (!category) {
      return sendError(res, 'Category not found', 404);
    }

    const categoryName = category.name;

    await WorkCategory.findByIdAndDelete(id);

    // Remove this category from all worker profiles
    await WorkerProfile.updateMany(
      { categories: categoryName },
      { $pull: { categories: categoryName } }
    );

    return sendSuccess(res, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};
