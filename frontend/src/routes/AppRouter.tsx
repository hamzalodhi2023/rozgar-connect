import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { refreshUserToken } from '../services/auth.service.js';
import { loginSuccess, setCheckingSession } from '../redux/slices/authSlice.js';
import { RootState } from '../redux/store';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import WorkerDetailPage from '../pages/WorkerDetailPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ChatPage from '../pages/ChatPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import JobsPage from '../pages/JobsPage';
import WorkerSetupPage from '../pages/WorkerSetupPage';
import WorkerDashboardPage from '../pages/WorkerDashboardPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminWorkersPage from '../pages/AdminWorkersPage';
import AdminReviewsPage from '../pages/AdminReviewsPage';
import AdminCategoriesPage from '../pages/AdminCategoriesPage';
import NotFoundPage from '../pages/NotFoundPage';

// Guards
import { ProtectedRoute, GuestRoute, RoleRoute } from './RouteGuards';



export default function AppRouter() {
  const dispatch = useDispatch();
  const { checkingSession } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await refreshUserToken();
        if (response.success) {
          dispatch(loginSuccess({ user: response.data.user, accessToken: response.data.accessToken }));
        }
      } catch (err) {
        // Silent catch: no active refresh token cookie
      } finally {
        dispatch(setCheckingSession(false));
      }
    };
    restoreSession();
  }, [dispatch]);

  if (checkingSession) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-600" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Pages wrapped in MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/workers/:id" element={<WorkerDetailPage />} />
        
        {/* Common Protected routes */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Guest Only Pages (Login/Register) wrapped in AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
      </Route>

      {/* Worker Only Dashboard Routes wrapped in DashboardLayout */}
      <Route
        element={
          <RoleRoute requiredRole="worker">
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route path="/worker-dashboard" element={<WorkerDashboardPage />} />
        <Route path="/worker-setup" element={<WorkerSetupPage />} />
      </Route>

      {/* Admin Only Dashboard Routes wrapped in DashboardLayout */}
      <Route
        path="/admin-dashboard"
        element={
          <RoleRoute requiredRole="admin">
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="workers" element={<AdminWorkersPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
      </Route>

      {/* 404 Page (Mount inside MainLayout) */}
      <Route element={<MainLayout />}>
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
