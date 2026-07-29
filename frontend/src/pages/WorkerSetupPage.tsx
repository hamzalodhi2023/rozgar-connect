import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyWorkerProfile, createWorkerProfile, updateWorkerProfile } from '../services/worker.service.js';
import { FiCheck } from 'react-icons/fi';
import WorkerSetupPhotoUpload from '../components/WorkerSetupPhotoUpload';
import WorkerSetupFields from '../components/WorkerSetupFields';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const workerSchema = z.object({
  categories: z.array(z.string()).min(1, 'Please select at least one category'),
  city: z.string().min(2, 'City is required'),
  area: z.string().min(2, 'Area is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  whatsapp: z.string().min(10, 'Valid WhatsApp number is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  latitude: z.number({ required_error: 'GPS Location is required', invalid_type_error: 'GPS Location is required' }),
  longitude: z.number({ required_error: 'GPS Location is required', invalid_type_error: 'GPS Location is required' }),
});

type WorkerFormValues = z.infer<typeof workerSchema>;

export default function WorkerSetupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [idCardFront, setIdCardFront] = useState(null);
  const [idCardFrontPreview, setIdCardFrontPreview] = useState('');
  const [idCardBack, setIdCardBack] = useState(null);
  const [idCardBackPreview, setIdCardBackPreview] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('unverified');

  const methods = useForm<WorkerFormValues>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      categories: [],
      city: '',
      area: '',
      phone: '',
      whatsapp: '',
      description: '',
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyWorkerProfile();
        if (response.success && response.data.profile) {
          const profile = response.data.profile;
          methods.reset({
            categories: profile.categories || [],
            city: profile.city || '',
            area: profile.area || '',
            phone: profile.phone || '',
            whatsapp: profile.whatsapp || '',
            description: profile.description || ''
          });
          setIsEditMode(true);
          setVerificationStatus(profile.verificationStatus || 'unverified');
          
          const HOST = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
          let backendUrl = import.meta.env.VITE_SOCKET_URL || `http://${HOST}:5000`;
          if (backendUrl === '/') backendUrl = ''; // Fix double slash for proxy

          if (profile.photo) {
            setPhotoPreview(`${backendUrl}${profile.photo}`);
          }
          if (profile.idCardFront) {
            setIdCardFrontPreview(`${backendUrl}${profile.idCardFront}`);
          }
          if (profile.idCardBack) {
            setIdCardBackPreview(`${backendUrl}${profile.idCardBack}`);
          }
        }
      } catch (error: any) {
        // 404 is expected if profile is not setup yet
        if (error.response?.status !== 404) {
          toast.error('Failed to load profile data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [methods]);

  const handlePhotoChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleIdCardFrontChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setIdCardFront(file);
      setIdCardFrontPreview(URL.createObjectURL(file));
    }
  };

  const handleIdCardBackChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setIdCardBack(file);
      setIdCardBackPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: WorkerFormValues) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append('categories', JSON.stringify(data.categories));
    formData.append('city', data.city);
    formData.append('area', data.area);
    formData.append('phone', data.phone);
    formData.append('whatsapp', data.whatsapp);
    formData.append('description', data.description);
    if (data.latitude !== undefined) {
      formData.append('latitude', data.latitude.toString());
    }
    if (data.longitude !== undefined) {
      formData.append('longitude', data.longitude.toString());
    }
    if (photo) {
      formData.append('photo', photo);
    }
    if (idCardFront) {
      formData.append('idCardFront', idCardFront);
    }
    if (idCardBack) {
      formData.append('idCardBack', idCardBack);
    }

    try {
      if (isEditMode) {
        await updateWorkerProfile(formData);
        toast.success('Worker profile updated successfully!');
      } else {
        await createWorkerProfile(formData);
        toast.success('Worker profile set up successfully!');
      }
      navigate('/worker-dashboard');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to save profile';
      toast.error(msg);
    } finally {
      setSubmitting(false);
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
    <div className="max-w-3xl mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/50 dark:border-slate-800/50 rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-400/20 dark:bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 mb-3">
          {isEditMode ? 'Update Worker Profile' : 'Set Up Worker Profile'}
        </h2>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {isEditMode
            ? 'Modify your services and location coordinates to keep customers updated.'
            : 'Fill in details below to unlock receiving requests and job applications.'}
        </p>
      </div>

      {/* Verification Status Banner */}
      {isEditMode && (
        <div className={`p-5 rounded-3xl mb-8 border flex items-start gap-4 ${
          verificationStatus === 'verified'
            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-800 dark:text-emerald-300'
            : verificationStatus === 'pending'
            ? 'bg-amber-500/10 border-amber-500/25 text-amber-800 dark:text-amber-300'
            : verificationStatus === 'rejected'
            ? 'bg-red-500/10 border-red-500/25 text-red-800 dark:text-red-300'
            : 'bg-slate-500/10 border-slate-500/25 text-slate-800 dark:text-slate-300'
        }`}>
          <div className="mt-0.5">
            {verificationStatus === 'verified' ? (
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 animate-pulse text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          <div>
            <h4 className="font-bold text-sm">
              Profile Verification: {verificationStatus.toUpperCase()}
            </h4>
            <p className="text-xs mt-1 leading-normal opacity-90">
              {verificationStatus === 'verified'
                ? 'Congratulations! Your profile is verified. A verification badge is active on your profile page.'
                : verificationStatus === 'pending'
                ? 'Your verification documents are under review. Admins will check them shortly.'
                : verificationStatus === 'rejected'
                ? 'Verification rejected. Please re-upload clear photos of the front and back of your ID Card and submit.'
                : 'Your profile is currently unverified. Upload ID documents below to request a verification badge.'}
            </p>
          </div>
        </div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
          <WorkerSetupPhotoUpload photoPreview={photoPreview} handlePhotoChange={handlePhotoChange} />
          
          <WorkerSetupFields
            idCardFrontPreview={idCardFrontPreview} handleIdCardFrontChange={handleIdCardFrontChange}
            idCardBackPreview={idCardBackPreview} handleIdCardBackChange={handleIdCardBackChange}
          />

          {/* Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-violet-500/20 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              <FiCheck className="w-6 h-6" />
              <span>{submitting ? 'Saving Profile...' : isEditMode ? 'Update Profile' : 'Complete Setup'}</span>
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
