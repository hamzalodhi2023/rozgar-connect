import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../services/category.service.js';
import * as FaIcons from 'react-icons/fa';

export const COLOR_MAPS: Record<string, { iconBg: string; text: string; glowBg: string; hoverBorder: string; hoverText: string }> = {
  blue: {
    iconBg: 'bg-blue-500/10 text-blue-500',
    text: 'text-blue-500',
    glowBg: 'bg-blue-500',
    hoverBorder: 'hover:border-blue-500/50 dark:hover:border-blue-400/50',
    hoverText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
  },
  amber: {
    iconBg: 'bg-amber-500/10 text-amber-500',
    text: 'text-amber-500',
    glowBg: 'bg-amber-500',
    hoverBorder: 'hover:border-amber-500/50 dark:hover:border-amber-400/50',
    hoverText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
  },
  orange: {
    iconBg: 'bg-orange-500/10 text-orange-500',
    text: 'text-orange-500',
    glowBg: 'bg-orange-500',
    hoverBorder: 'hover:border-orange-500/50 dark:hover:border-orange-400/50',
    hoverText: 'group-hover:text-orange-600 dark:group-hover:text-orange-400',
  },
  pink: {
    iconBg: 'bg-pink-500/10 text-pink-500',
    text: 'text-pink-500',
    glowBg: 'bg-pink-500',
    hoverBorder: 'hover:border-pink-500/50 dark:hover:border-pink-400/50',
    hoverText: 'group-hover:text-pink-600 dark:group-hover:text-pink-400',
  },
  cyan: {
    iconBg: 'bg-cyan-500/10 text-cyan-500',
    text: 'text-cyan-500',
    glowBg: 'bg-cyan-500',
    hoverBorder: 'hover:border-cyan-500/50 dark:hover:border-cyan-400/50',
    hoverText: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
  },
  red: {
    iconBg: 'bg-red-500/10 text-red-500',
    text: 'text-red-500',
    glowBg: 'bg-red-500',
    hoverBorder: 'hover:border-red-500/50 dark:hover:border-red-400/50',
    hoverText: 'group-hover:text-red-600 dark:group-hover:text-red-400',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10 text-emerald-500',
    text: 'text-emerald-500',
    glowBg: 'bg-emerald-500',
    hoverBorder: 'hover:border-emerald-500/50 dark:hover:border-emerald-400/50',
    hoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
  },
  purple: {
    iconBg: 'bg-purple-500/10 text-purple-500',
    text: 'text-purple-500',
    glowBg: 'bg-purple-500',
    hoverBorder: 'hover:border-purple-500/50 dark:hover:border-purple-400/50',
    hoverText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
  },
  indigo: {
    iconBg: 'bg-indigo-500/10 text-indigo-500',
    text: 'text-indigo-500',
    glowBg: 'bg-indigo-500',
    hoverBorder: 'hover:border-indigo-500/50 dark:hover:border-indigo-400/50',
    hoverText: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
  },
  violet: {
    iconBg: 'bg-violet-500/10 text-violet-500',
    text: 'text-violet-500',
    glowBg: 'bg-violet-500',
    hoverBorder: 'hover:border-violet-500/50 dark:hover:border-violet-400/50',
    hoverText: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
  },
  teal: {
    iconBg: 'bg-teal-500/10 text-teal-500',
    text: 'text-teal-500',
    glowBg: 'bg-teal-500',
    hoverBorder: 'hover:border-teal-500/50 dark:hover:border-teal-400/50',
    hoverText: 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
  },
  rose: {
    iconBg: 'bg-rose-500/10 text-rose-500',
    text: 'text-rose-500',
    glowBg: 'bg-rose-500',
    hoverBorder: 'hover:border-rose-500/50 dark:hover:border-rose-400/50',
    hoverText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
  },
};

const DEFAULT_CATEGORIES = [
  { name: 'plumber', label: 'Plumbing', iconName: 'FaWrench', iconColor: 'blue' },
  { name: 'electrician', label: 'Electrical', iconName: 'FaBolt', iconColor: 'amber' },
  { name: 'carpenter', label: 'Carpentry', iconName: 'FaHammer', iconColor: 'orange' },
  { name: 'painter', label: 'Painting', iconName: 'FaPaintRoller', iconColor: 'pink' },
  { name: 'ac technician', label: 'AC Service', iconName: 'FaFan', iconColor: 'cyan' },
  { name: 'mechanic', label: 'Mechanical', iconName: 'FaCar', iconColor: 'red' },
  { name: 'gardener', label: 'Gardening', iconName: 'FaTree', iconColor: 'emerald' },
  { name: 'cleaner', label: 'Cleaning', iconName: 'FaBroom', iconColor: 'purple' },
];

export default function HomeCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.success && response.data.categories?.length > 0) {
          setCategories(response.data.categories);
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
      } catch (error) {
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/search?category=${categoryName}`);
  };

  const renderIcon = (iconName: string, iconColor: string) => {
    const IconComponent = (FaIcons as any)[iconName];
    const resolvedColor = iconColor || 'violet';
    const colorStyle = COLOR_MAPS[resolvedColor] || COLOR_MAPS.violet;
    const animationClass = iconName === 'FaFan' ? 'animate-[spin_8s_linear_infinite]' : '';

    if (!IconComponent) {
      return <FaIcons.FaWrench className={`w-6 h-6 ${colorStyle.text} ${animationClass}`} />;
    }
    return <IconComponent className={`w-6 h-6 ${colorStyle.text} ${animationClass}`} />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-600" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          Browse Services by Category
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Choose from our highly requested skilled worker sectors.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 gap-4 sm:gap-6">
        {categories.slice(0, 8).map((cat) => {
          const resolvedColor = cat.iconColor || 'violet';
          const colorStyle = COLOR_MAPS[resolvedColor] || COLOR_MAPS.violet;

          return (
            <button
              key={cat._id || cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex flex-col items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-700 ${colorStyle.hoverBorder} rounded-3xl shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group h-36 focus:outline-none cursor-pointer`}
            >
              <div className={`p-3.5 rounded-2xl ${colorStyle.iconBg} group-hover:scale-105 transition-transform duration-300 mt-1`}>
                {renderIcon(cat.iconName, cat.iconColor)}
              </div>
              <div className="w-full text-center pb-1">
                <span className={`text-xs font-bold text-slate-700 dark:text-slate-200 capitalize block truncate w-full ${colorStyle.hoverText} transition-colors duration-300`}>
                  {cat.label}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium block mt-0.5">
                  Browse list
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
