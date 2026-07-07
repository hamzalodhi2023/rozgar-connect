import React, { useState, useEffect } from 'react';
import { FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { getCategories } from '../services/category.service.js';
import { useFormContext } from 'react-hook-form';

const DEFAULT_CATEGORIES = [
  { value: 'plumber', label: 'Plumbing' },
  { value: 'electrician', label: 'Electrical' },
  { value: 'carpenter', label: 'Carpentry' },
  { value: 'painter', label: 'Painting' },
  { value: 'ac technician', label: 'AC Service' },
  { value: 'mechanic', label: 'Mechanical' },
  { value: 'gardener', label: 'Gardening' },
  { value: 'cleaner', label: 'Cleaning' },
];

export default function WorkerSetupFields({
  idCardFrontPreview, handleIdCardFrontChange,
  idCardBackPreview, handleIdCardBackChange,
}: any) {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const [dbCategories, setDbCategories] = useState<{ value: string; label: string }[]>([]);
  const selectedCategories = watch('categories') || [];

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await getCategories();
        if (response.success && response.data.categories?.length > 0) {
          setDbCategories(response.data.categories.map((c: any) => ({
            value: c.name,
            label: c.label
          })));
        } else {
          setDbCategories(DEFAULT_CATEGORIES);
        }
      } catch (error) {
        setDbCategories(DEFAULT_CATEGORIES);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {/* Categories */}
      <div className="md:col-span-2">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">
          Service Categories <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">(Select multiple)</span>
        </label>
        <div className="flex flex-wrap gap-2.5">
          {dbCategories.map((cat) => {
            const isSelected = selectedCategories.includes(cat.value);
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setValue('categories', selectedCategories.filter((c: string) => c !== cat.value), { shouldValidate: true });
                  } else {
                    setValue('categories', [...selectedCategories, cat.value], { shouldValidate: true });
                  }
                }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                  isSelected
                    ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-500/25 scale-105'
                    : 'bg-slate-50/80 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:border-violet-400 dark:hover:border-violet-500'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
        {errors.categories && <p className="text-red-500 text-xs mt-1 ml-1">{errors.categories?.message as string}</p>}
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">
          City
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiMapPin className="text-slate-400 dark:text-slate-500 w-5 h-5 group-focus-within:text-violet-500 dark:group-focus-within:text-violet-400 transition-colors duration-300" />
          </div>
          <input
            type="text"
            placeholder="e.g. Islamabad"
            {...register('city')}
            className={`w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md border focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all duration-300 shadow-sm ${
              errors.city ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700/80 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          />
        </div>
        {errors.city && <p className="text-red-500 text-xs mt-1 ml-1">{errors.city?.message as string}</p>}
      </div>

      {/* Area */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">
          Area/Neighborhood
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiMapPin className="text-slate-400 dark:text-slate-500 w-5 h-5 group-focus-within:text-violet-500 dark:group-focus-within:text-violet-400 transition-colors duration-300" />
          </div>
          <input
            type="text"
            placeholder="e.g. Blue Area"
            {...register('area')}
            className={`w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md border focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all duration-300 shadow-sm ${
              errors.area ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700/80 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          />
        </div>
        {errors.area && <p className="text-red-500 text-xs mt-1 ml-1">{errors.area?.message as string}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">
          Phone Number
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiPhone className="text-slate-400 dark:text-slate-500 w-5 h-5 group-focus-within:text-violet-500 dark:group-focus-within:text-violet-400 transition-colors duration-300" />
          </div>
          <input
            type="tel"
            placeholder="e.g. +923001234567"
            {...register('phone')}
            className={`w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md border focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all duration-300 shadow-sm ${
              errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700/80 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          />
        </div>
        {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone?.message as string}</p>}
      </div>

      {/* WhatsApp */}
      <div className="md:col-span-2">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">
          WhatsApp Number
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaWhatsapp className="text-slate-400 dark:text-slate-500 w-5 h-5 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors duration-300" />
          </div>
          <input
            type="tel"
            placeholder="e.g. +923001234567"
            {...register('whatsapp')}
            className={`w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md border focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all duration-300 shadow-sm ${
              errors.whatsapp ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          />
        </div>
        {errors.whatsapp && <p className="text-red-500 text-xs mt-1 ml-1">{errors.whatsapp?.message as string}</p>}
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">
          Description / Experience Details
        </label>
        <div className="relative group">
          <textarea
            rows={4}
            placeholder="Describe your services, charges, experience, and why customers should hire you..."
            {...register('description')}
            className={`w-full px-4 py-3.5 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md border focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all duration-300 shadow-sm resize-none ${
              errors.description ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700/80 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          />
        </div>
        {errors.description && <p className="text-red-500 text-xs mt-1 ml-1">{errors.description?.message as string}</p>}
      </div>

      {/* ID Card Front and Back Verification */}
      <div className="md:col-span-2 border-t border-slate-200 dark:border-slate-800 pt-6 mt-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 ml-1">
          National ID Card Verification
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 ml-1">
          Please upload clear photos of your ID card (Front & Back) to get the "Verified" badge on your profile.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* ID Card Front */}
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50 transition-all duration-300 relative group h-44 overflow-hidden">
            {idCardFrontPreview ? (
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={idCardFrontPreview}
                  alt="ID Front Preview"
                  className="w-full h-full object-cover rounded-3xl"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-3xl">
                  <label className="px-4 py-2 bg-white text-slate-800 font-bold text-xs rounded-xl shadow cursor-pointer">
                    Change Front
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIdCardFrontChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer space-y-2 w-full h-full text-center">
                <div className="p-3 bg-violet-100 dark:bg-violet-500/10 text-violet-600 rounded-2xl">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">ID Card (Front Photo)</span>
                <span className="text-[10px] text-slate-400">Click to upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIdCardFrontChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* ID Card Back */}
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50 transition-all duration-300 relative group h-44 overflow-hidden">
            {idCardBackPreview ? (
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={idCardBackPreview}
                  alt="ID Back Preview"
                  className="w-full h-full object-cover rounded-3xl"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-3xl">
                  <label className="px-4 py-2 bg-white text-slate-800 font-bold text-xs rounded-xl shadow cursor-pointer">
                    Change Back
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIdCardBackChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer space-y-2 w-full h-full text-center">
                <div className="p-3 bg-violet-100 dark:bg-violet-500/10 text-violet-600 rounded-2xl">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">ID Card (Back Photo)</span>
                <span className="text-[10px] text-slate-400">Click to upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIdCardBackChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
