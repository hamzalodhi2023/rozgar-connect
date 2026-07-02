import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory
} from '../services/category.service.js';
import * as FaIcons from 'react-icons/fa';
import { FiLayers, FiTrash2, FiEdit2, FiPlus, FiX, FiCheck } from 'react-icons/fi';

// Color map to keep preview styling premium and compiling correctly
export const COLOR_MAPS: Record<string, { iconBg: string; text: string; bg: string; border: string }> = {
  blue: {
    iconBg: 'bg-blue-500/10 text-blue-500',
    text: 'text-blue-500',
    bg: 'bg-blue-500',
    border: 'border-blue-500',
  },
  amber: {
    iconBg: 'bg-amber-500/10 text-amber-500',
    text: 'text-amber-500',
    bg: 'bg-amber-500',
    border: 'border-amber-500',
  },
  orange: {
    iconBg: 'bg-orange-500/10 text-orange-500',
    text: 'text-orange-500',
    bg: 'bg-orange-500',
    border: 'border-orange-500',
  },
  pink: {
    iconBg: 'bg-pink-500/10 text-pink-500',
    text: 'text-pink-500',
    bg: 'bg-pink-500',
    border: 'border-pink-500',
  },
  cyan: {
    iconBg: 'bg-cyan-500/10 text-cyan-500',
    text: 'text-cyan-500',
    bg: 'bg-cyan-500',
    border: 'border-cyan-500',
  },
  red: {
    iconBg: 'bg-red-500/10 text-red-500',
    text: 'text-red-500',
    bg: 'bg-red-500',
    border: 'border-red-500',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10 text-emerald-500',
    text: 'text-emerald-500',
    bg: 'bg-emerald-500',
    border: 'border-emerald-500',
  },
  purple: {
    iconBg: 'bg-purple-500/10 text-purple-500',
    text: 'text-purple-500',
    bg: 'bg-purple-500',
    border: 'border-purple-500',
  },
  indigo: {
    iconBg: 'bg-indigo-500/10 text-indigo-500',
    text: 'text-indigo-500',
    bg: 'bg-indigo-500',
    border: 'border-indigo-500',
  },
  violet: {
    iconBg: 'bg-violet-500/10 text-violet-500',
    text: 'text-violet-500',
    bg: 'bg-violet-500',
    border: 'border-violet-500',
  },
  teal: {
    iconBg: 'bg-teal-500/10 text-teal-500',
    text: 'text-teal-500',
    bg: 'bg-teal-500',
    border: 'border-teal-500',
  },
  rose: {
    iconBg: 'bg-rose-500/10 text-rose-500',
    text: 'text-rose-500',
    bg: 'bg-rose-500',
    border: 'border-rose-500',
  },
};

const POPULAR_ICONS = [
  { value: 'FaWrench', label: 'Wrench' },
  { value: 'FaBolt', label: 'Bolt' },
  { value: 'FaHammer', label: 'Hammer' },
  { value: 'FaPaintRoller', label: 'Paint Roller' },
  { value: 'FaFan', label: 'Fan / AC' },
  { value: 'FaCar', label: 'Car / Mechanic' },
  { value: 'FaTree', label: 'Tree / Garden' },
  { value: 'FaBroom', label: 'Broom / Cleaner' },
  { value: 'FaScissors', label: 'Scissors / Salon' },
  { value: 'FaTruck', label: 'Truck / Delivery' },
  { value: 'FaScrewdriver', label: 'Screwdriver / Repair' },
  { value: 'FaPlug', label: 'Plug / Electric' },
  { value: 'FaTv', label: 'TV / Electronic' },
  { value: 'FaHome', label: 'Home / Helper' },
  { value: 'FaMedkit', label: 'First Aid' },
  { value: 'FaShieldAlt', label: 'Security' },
  { value: 'FaUtensils', label: 'Catering / Chef' },
];

const POPULAR_COLORS = Object.keys(COLOR_MAPS);

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState('');
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [iconName, setIconName] = useState('FaWrench');
  const [iconColor, setIconColor] = useState('blue');

  const fetchCategoryList = async () => {
    try {
      const response = await getCategories();
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const handleEdit = (category: any) => {
    setIsEditing(true);
    setEditId(category._id);
    setName(category.name);
    setLabel(category.label);
    setIconName(category.iconName || 'FaWrench');
    setIconColor(category.iconColor || 'blue');
  };

  const handleResetForm = () => {
    setIsEditing(false);
    setEditId('');
    setName('');
    setLabel('');
    setIconName('FaWrench');
    setIconColor('blue');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !label.trim()) {
      return toast.error('Name and Label are required');
    }

    try {
      const categoryData = {
        name: name.trim(),
        label: label.trim(),
        iconName,
        iconColor,
      };

      if (isEditing) {
        const response = await adminUpdateCategory(editId, categoryData);
        if (response.success) {
          toast.success('Category updated successfully');
          fetchCategoryList();
          handleResetForm();
        }
      } else {
        const response = await adminCreateCategory(categoryData);
        if (response.success) {
          toast.success('Category created successfully');
          fetchCategoryList();
          handleResetForm();
        }
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to save category';
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string, catLabel: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the "${catLabel}" category? This will pull this category from all registered workers!`
      )
    ) {
      try {
        const response = await adminDeleteCategory(id);
        if (response.success) {
          toast.success('Category deleted successfully');
          fetchCategoryList();
          if (editId === id) {
            handleResetForm();
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const renderIconPreview = (icon: string, color: string) => {
    const IconComponent = (FaIcons as any)[icon];
    const colorStyle = COLOR_MAPS[color] || COLOR_MAPS.violet;
    if (!IconComponent) return <FaIcons.FaWrench className="w-5 h-5" />;
    return <IconComponent className={`w-5 h-5 ${colorStyle.text}`} />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FiLayers className="w-8 h-8 text-violet-600 animate-pulse" />
          <span>Manage Work Categories</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Add, modify, and delete the custom categories offered by skilled workers in the marketplace.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4">Icon</th>
                    <th className="px-6 py-4">Display Label</th>
                    <th className="px-6 py-4">Slug / Database Name</th>
                    <th className="px-6 py-4">Color</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                        No categories found. Create one on the right!
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => {
                      const colorStyle = COLOR_MAPS[cat.iconColor] || COLOR_MAPS.violet;
                      return (
                        <tr
                          key={cat._id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 text-slate-700 dark:text-slate-300 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className={`p-2.5 rounded-xl inline-flex ${colorStyle.iconBg}`}>
                              {renderIconPreview(cat.iconName, cat.iconColor)}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">
                            {cat.label}
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                            {cat.name}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-block text-white ${colorStyle.bg}`}
                            >
                              {cat.iconColor || 'violet'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-1">
                            <button
                              onClick={() => handleEdit(cat)}
                              className="p-2 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-500/10 text-violet-600 dark:text-violet-400 transition-colors"
                              title="Edit Category"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(cat._id, cat.label)}
                              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 dark:text-red-400 transition-colors"
                              title="Delete Category"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Editor Form */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-sm h-fit space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              {isEditing ? <FiEdit2 className="text-violet-600" /> : <FiPlus className="text-violet-600" />}
              <span>{isEditing ? 'Edit Category' : 'Create Category'}</span>
            </h3>
            {isEditing && (
              <button
                onClick={handleResetForm}
                className="p-1 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
                title="Cancel Edit"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Slug / DB Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                Category Slug / Db Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. plumber"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950/80 focus:border-violet-500 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none transition-all"
              />
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block ml-1 leading-normal">
                Lowercase slug. Should map directly to worker category filters.
              </span>
            </div>

            {/* Display Label */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                Display Label
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Plumbing Services"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950/80 focus:border-violet-500 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none transition-all"
              />
            </div>

            {/* Icon Name Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                Select Icon
              </label>
              <div className="grid grid-cols-6 gap-2 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 p-3 rounded-xl max-h-40 overflow-y-auto">
                {POPULAR_ICONS.map((icon) => {
                  const IconComp = (FaIcons as any)[icon.value] || FaIcons.FaWrench;
                  const isSelected = iconName === icon.value;
                  return (
                    <button
                      key={icon.value}
                      type="button"
                      onClick={() => setIconName(icon.value)}
                      className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${isSelected
                          ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25 scale-110'
                          : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      title={icon.label}
                    >
                      <IconComp className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Badge Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                Category Color Theme
              </label>
              <div className="flex flex-wrap gap-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
                {POPULAR_COLORS.map((col) => {
                  const style = COLOR_MAPS[col] || COLOR_MAPS.violet;
                  const isSelected = iconColor === col;
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setIconColor(col)}
                      className={`w-7 h-7 rounded-full transition-all ${style.bg} ${isSelected
                          ? 'ring-4 ring-offset-2 ring-violet-500 dark:ring-offset-slate-900 scale-110'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                        }`}
                      title={col}
                    />
                  );
                })}
              </div>
            </div>

            {/* Visual Preview Card */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Interface Preview
              </label>
              <div className="flex flex-col items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl h-28 w-28 mx-auto shadow-inner">
                <div className={`p-2.5 rounded-xl ${COLOR_MAPS[iconColor]?.iconBg}`}>
                  {renderIconPreview(iconName, iconColor)}
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 capitalize truncate w-full text-center">
                  {label || 'Category'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <button
              type="submit"
              className="w-full mt-4 py-3 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiCheck className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
