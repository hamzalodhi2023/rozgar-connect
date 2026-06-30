import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  loginSuccess,
  logoutSuccess,
  setLoading,
  setError,
  updateUser,
} from '../redux/slices/authSlice.js';
import * as authService from '../services/auth.service.js';
import * as userService from '../services/user.service.js';
import { useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Force dark mode globally
    const root = window.document.documentElement;
    root.classList.add('dark');
  }, []);


  const handleRegister = async (name, email, password, role) => {
    dispatch(setLoading(true));
    try {
      const data = await authService.registerUser(name, email, password, role);
      dispatch(loginSuccess({ user: data.data.user, accessToken: data.data.accessToken }));
      toast.success('Registration successful!');
      if (data.data.redirectToSetup) {
        navigate('/worker-setup');
      } else {
        navigate('/');
      }
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    }
  };

  const handleLogin = async (email, password) => {
    dispatch(setLoading(true));
    try {
      const data = await authService.loginUser(email, password);
      dispatch(loginSuccess({ user: data.data.user, accessToken: data.data.accessToken }));
      toast.success('Logged in successfully!');
      
      if (data.data.user.roles.includes('worker') && !data.data.hasWorkerProfile) {
        navigate('/worker-setup');
      } else {
        navigate('/');
      }
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      dispatch(setError(msg));
      toast.error(msg);
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
    } catch (err) {
      console.error('Logout API failed:', err);
    } finally {
      dispatch(logoutSuccess());
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const handleBecomeWorker = async () => {
    dispatch(setLoading(true));
    try {
      const data = await userService.becomeWorker();
      dispatch(updateUser(data.data.user));
      dispatch(loginSuccess({ user: data.data.user, accessToken: data.data.accessToken }));
      toast.success('Role updated! Please configure your worker profile.');
      navigate('/worker-setup');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to become worker';
      toast.error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    loading,
    error,
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout,
    becomeWorker: handleBecomeWorker,
  };
};
