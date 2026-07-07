import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { FiUser, FiMail, FiLock, FiBriefcase, FiEye, FiEyeOff } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import zxcvbn from 'zxcvbn';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  role: z.enum(['customer', 'worker'])
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'worker' ? 'worker' : 'customer';

  const { register: registerUser, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: defaultRole as 'customer' | 'worker'
    }
  });

  const watchPassword = watch('password', '');
  const passwordStrength = zxcvbn(watchPassword);
  
  const getStrengthLabel = (score: number) => {
    switch (score) {
      case 0: return { label: 'Very Weak', color: 'bg-red-500', textClass: 'text-red-500' };
      case 1: return { label: 'Weak', color: 'bg-orange-500', textClass: 'text-orange-500' };
      case 2: return { label: 'Fair', color: 'bg-yellow-500', textClass: 'text-yellow-500' };
      case 3: return { label: 'Good', color: 'bg-blue-500', textClass: 'text-blue-500' };
      case 4: return { label: 'Strong', color: 'bg-green-500', textClass: 'text-green-500' };
      default: return { label: '', color: 'bg-slate-700', textClass: 'text-slate-500' };
    }
  };

  const strength = getStrengthLabel(watchPassword ? passwordStrength.score : -1);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser(data.name, data.email, data.password, data.role);
    } catch (error) {
      // Handled by hook toasts
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-slate-100">
          Create an Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-violet-400 hover:text-violet-300 transition-colors">
            Sign In
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Full Name
          </label>
          <div className="relative flex items-center">
            <FiUser className="absolute left-3.5 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="John Doe"
              {...register('name')}
              className={`w-full pl-11 pr-4 py-3 bg-slate-950/40 border focus:bg-slate-950/70 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all ${
                errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-violet-500'
              }`}
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative flex items-center">
            <FiMail className="absolute left-3.5 text-slate-500 w-5 h-5" />
            <input
              type="email"
              placeholder="john@example.com"
              {...register('email')}
              className={`w-full pl-11 pr-4 py-3 bg-slate-950/40 border focus:bg-slate-950/70 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-violet-500'
              }`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative flex items-center">
            <FiLock className="absolute left-3.5 text-slate-500 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register('password')}
              className={`w-full pl-11 pr-11 py-3 bg-slate-950/40 border focus:bg-slate-950/70 rounded-xl text-sm font-medium text-slate-100 focus:outline-none transition-all ${
                errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-800 focus:border-violet-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer"
            >
              {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          
          {/* Password Strength Indicator */}
          {watchPassword && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-400">Password Strength:</span>
                <span className={`text-xs font-bold ${strength.textClass}`}>{strength.label}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 flex gap-1 overflow-hidden">
                <div className={`h-full flex-1 ${passwordStrength.score >= 0 ? strength.color : 'bg-slate-700'}`}></div>
                <div className={`h-full flex-1 ${passwordStrength.score >= 1 ? strength.color : 'bg-slate-700'}`}></div>
                <div className={`h-full flex-1 ${passwordStrength.score >= 2 ? strength.color : 'bg-slate-700'}`}></div>
                <div className={`h-full flex-1 ${passwordStrength.score >= 3 ? strength.color : 'bg-slate-700'}`}></div>
                <div className={`h-full flex-1 ${passwordStrength.score >= 4 ? strength.color : 'bg-slate-700'}`}></div>
              </div>
              {passwordStrength.feedback.warning && (
                <p className="text-xs text-orange-400 mt-1">{passwordStrength.feedback.warning}</p>
              )}
            </div>
          )}
        </div>

        {/* Role Selection Radio Cards */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Select Your Primary Role
          </label>
          <div className="grid grid-cols-2 gap-4">
            {/* Customer Option */}
            <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer hover:bg-slate-950/40 hover:border-slate-700/80 transition-all ${
              watch('role') === 'customer'
                ? 'border-violet-600 bg-violet-500/10 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                : 'border-slate-800 bg-slate-950/20 text-slate-450'
            }`}>
              <input
                type="radio"
                value="customer"
                {...register('role')}
                className="sr-only"
              />
              <FiUser className="w-6 h-6 mb-2" />
              <span className="text-sm font-bold">Customer</span>
              <span className="text-[10px] text-center mt-1 text-slate-500">Hire services</span>
            </label>

            {/* Worker Option */}
            <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer hover:bg-slate-950/40 hover:border-slate-700/80 transition-all ${
              watch('role') === 'worker'
                ? 'border-violet-600 bg-violet-500/10 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                : 'border-slate-800 bg-slate-950/20 text-slate-450'
            }`}>
              <input
                type="radio"
                value="worker"
                {...register('role')}
                className="sr-only"
              />
              <FiBriefcase className="w-6 h-6 mb-2" />
              <span className="text-sm font-bold">Worker</span>
              <span className="text-[10px] text-center mt-1 text-slate-500">Offer services</span>
            </label>
          </div>
          {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none disabled:opacity-50 mt-2"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
