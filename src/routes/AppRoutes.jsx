import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ServicesPage from '../pages/ServicesPage';
import WorkersPage from '../pages/WorkersPage';
import WorkerDetailsPage from '../pages/WorkerDetailsPage';
import WorkerDashboardPage from '../pages/WorkerDashboardPage';
import CustomerDashboardPage from '../pages/CustomerDashboardPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import MessagesPage from '../pages/MessagesPage';
import HowItWorksPage from '../pages/HowItWorksPage';
import ContactPage from '../pages/ContactPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="workers" element={<WorkersPage />} />
          <Route path="workers/:id" element={<WorkerDetailsPage />} />

          {/* Customer Protected Route */}
          <Route
            path="customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Worker Protected Route */}
          <Route
            path="worker/dashboard"
            element={
              <ProtectedRoute allowedRoles={['worker']}>
                <WorkerDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Route */}
          <Route
            path="admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Real-time Messages Route */}
          <Route
            path="messages"
            element={
              <ProtectedRoute allowedRoles={['customer', 'worker', 'admin']}>
                <MessagesPage />
              </ProtectedRoute>
            }
          />

          {/* Alias / Fallback Dashboard Routes */}
          <Route path="worker-dashboard" element={<Navigate to="/worker/dashboard" replace />} />
          <Route path="customer-dashboard" element={<Navigate to="/customer/dashboard" replace />} />
          <Route path="admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />

          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
