import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js';
import { getProfile, updateProfile, deleteProfile } from '../services/user.service.js';
import { FiCheck } from 'react-icons/fi';
import ProfileBasicInfo from '../components/ProfileBasicInfo';
import ProfileSecurity from '../components/ProfileSecurity';
export default function ProfilePage() {
  const { user, becomeWorker, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getProfile();
        if (response.success) {
          setName(response.data.user.name);
          setEmail(response.data.user.email);
        }
      } catch (error) {
        toast.error('Failed to load profile details');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Name is required');

    setSaving(true);
    try {
      const payload: { name: string; currentPassword?: string; newPassword?: string } = { name };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      
      const response = await updateProfile(payload);
      if (response.success) {
        toast.success('Profile details updated successfully');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update details';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone and will delete all your data including worker profile and reviews.")) {
      setIsDeleting(true);
      try {
        await deleteProfile();
        toast.success('Your account has been deleted successfully.');
        logout();
      } catch (error) {
        const msg = error.response?.data?.message || 'Failed to delete account';
        toast.error(msg);
        setIsDeleting(false);
      }
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800/60 rounded-3xl p-6 md:p-10 shadow-lg transition-all">
      <div className="mb-8 border-b border-slate-800/60 pb-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100">
          Account Profile
        </h2>
        <p className="text-sm text-slate-450 mt-1">
          Manage your account profile details, security settings, and permissions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ProfileBasicInfo
          name={name} setName={setName}
          email={email} user={user}
        />

        <ProfileSecurity
          currentPassword={currentPassword} setCurrentPassword={setCurrentPassword}
          newPassword={newPassword} setNewPassword={setNewPassword}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FiCheck className="w-5 h-5" />
          <span>{saving ? 'Updating Account...' : 'Save Profile Changes'}</span>
        </button>
      </form>

      {/* Danger Zone */}
      <div className="mt-10 pt-8 border-t border-red-900/30">
        <h3 className="text-xl font-bold text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-slate-400 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded-xl font-semibold transition-colors focus:outline-none disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
}
