import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation
} from '../services/location.service.js';
import { FiMapPin, FiTrash2, FiEdit2, FiPlus, FiX } from 'react-icons/fi';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'city' | 'area'>('city');

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState('');
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');

  const fetchLocationList = async () => {
    try {
      const response = await getLocations();
      if (response.success) {
        setLocations(response.data.locations);
      }
    } catch (error) {
      toast.error('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationList();
  }, []);

  const filteredLocations = locations.filter((loc) => loc.type === activeTab);

  const handleEdit = (location: any) => {
    setIsEditing(true);
    setEditId(location._id);
    setName(location.name);
    setLabel(location.label);
  };

  const handleResetForm = () => {
    setIsEditing(false);
    setEditId('');
    setName('');
    setLabel('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !label.trim()) {
      return toast.error('Name and Label are required');
    }

    try {
      const locationData = {
        type: activeTab,
        name: name.trim(),
        label: label.trim(),
      };

      if (isEditing) {
        const response = await updateLocation(editId, locationData);
        if (response.success) {
          toast.success(`${activeTab === 'city' ? 'City' : 'Area'} updated successfully`);
          fetchLocationList();
          handleResetForm();
        }
      } else {
        const response = await createLocation(locationData);
        if (response.success) {
          toast.success(`${activeTab === 'city' ? 'City' : 'Area'} created successfully`);
          fetchLocationList();
          handleResetForm();
        }
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to save location';
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string, locLabel: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the "${locLabel}" ${activeTab}?`
      )
    ) {
      try {
        const response = await deleteLocation(id);
        if (response.success) {
          toast.success(`${activeTab === 'city' ? 'City' : 'Area'} deleted successfully`);
          fetchLocationList();
          if (editId === id) {
            handleResetForm();
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete location');
      }
    }
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
          <FiMapPin className="w-8 h-8 text-violet-600 animate-pulse" />
          <span>Manage Locations</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Add, modify, and delete the Cities and Areas available for workers and searches.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => {
            setActiveTab('city');
            handleResetForm();
          }}
          className={`px-6 py-3 font-semibold text-sm transition-colors relative ${
            activeTab === 'city'
              ? 'text-violet-600 dark:text-violet-400'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Cities
          {activeTab === 'city' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600 dark:bg-violet-400 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab('area');
            handleResetForm();
          }}
          className={`px-6 py-3 font-semibold text-sm transition-colors relative ${
            activeTab === 'area'
              ? 'text-violet-600 dark:text-violet-400'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Areas
          {activeTab === 'area' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600 dark:bg-violet-400 rounded-t-full" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Location List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4">Display Label</th>
                    <th className="px-6 py-4">Database Name</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((loc) => (
                      <tr
                        key={loc._id}
                        className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors ${
                          editId === loc._id ? 'bg-violet-50/30 dark:bg-violet-900/10' : ''
                        }`}
                      >
                        <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                          {loc.label}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                          {loc.name}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(loc)}
                              className="p-2 text-slate-400 hover:text-violet-600 bg-slate-100/50 hover:bg-violet-50 dark:bg-slate-800 dark:hover:bg-violet-500/20 rounded-xl transition-all"
                              title="Edit"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(loc._id, loc.label)}
                              className="p-2 text-slate-400 hover:text-red-600 bg-slate-100/50 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-500/20 rounded-xl transition-all"
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                        No {activeTab === 'city' ? 'cities' : 'areas'} found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-6 rounded-3xl shadow-sm sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {isEditing ? `Edit ${activeTab === 'city' ? 'City' : 'Area'}` : `Add New ${activeTab === 'city' ? 'City' : 'Area'}`}
              </h3>
              {isEditing && (
                <button
                  onClick={handleResetForm}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Cancel Edit"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Database Name
                </label>
                <input
                  type="text"
                  required
                  placeholder={activeTab === 'city' ? 'islamabad' : 'blue area'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1">Lowercase, used internally for exact matches.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Display Label
                </label>
                <input
                  type="text"
                  required
                  placeholder={activeTab === 'city' ? 'Islamabad' : 'Blue Area'}
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1">What users see in the dropdown.</p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-violet-500/25 flex justify-center items-center gap-2"
                >
                  {isEditing ? <FiEdit2 className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
                  {isEditing ? `Save Changes` : `Create ${activeTab === 'city' ? 'City' : 'Area'}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
