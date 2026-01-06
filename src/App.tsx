import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';

// Contexts
import { CartProvider } from './contexts/CartContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/common/HomePage.tsx';
import ExplorePage from './pages/common/ExplorePage.tsx';
import NotFoundPage from './pages/common/NotFoundPage.tsx';
import CartPage from './pages/common/CartPage.tsx';
import CheckoutPage from './pages/common/CheckoutPage.tsx';
import PhotoDetailPage from './pages/common/PhotoDetailPage.tsx';
import OrdersPage from './pages/common/OrdersPage.tsx';
import ContactPage from './pages/common/ContactPage.tsx';
import FAQPage from './pages/common/FAQPage.tsx';
import TermsOfServicePage from './pages/common/TermsOfServicePage.tsx';
import PrivacyPolicyPage from './pages/common/PrivacyPolicyPage.tsx';
import CookiePolicyPage from './pages/common/CookiePolicyPage.tsx';
import CopyrightPage from './pages/common/CopyrightPage.tsx';
import AboutPage from './pages/common/AboutPage.tsx';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Dashboard Pages - Removed (using OrdersPage instead)

// Photographer Pages
import PhotographerDashboardPage from './pages/photographer/PhotographerDashboardPage';

// Admin Layout and Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UsersPage from './pages/admin/UsersPage';
import PhotosPage from './pages/admin/PhotosPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import AdminOrdersPage from './pages/admin/OrdersPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import ReportsPage from './pages/admin/ReportsPage';

// Protected Route
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './pages/common/UnauthorizedPage.tsx';
import ScrollToTop from './components/ScrollToTop';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />

            {/* Photo Detail */}
            <Route path="/photo/:id" element={<PhotoDetailPage />} />
            <Route path="/category/:name" element={<div className="page-placeholder">Category Page - Coming Soon</div>} />
            <Route path="/photographer/:id" element={<div className="page-placeholder">Photographer Profile - Coming Soon</div>} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/cookies" element={<CookiePolicyPage />} />
            <Route path="/copyright" element={<CopyrightPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/purchases" element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/favorites" element={
              <ProtectedRoute>
                <div className="dashboard-overview"><h2>Favorites</h2><p className="page-subtitle">Coming Soon</p></div>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/settings" element={
              <ProtectedRoute>
                <div className="dashboard-overview"><h2>Settings</h2><p className="page-subtitle">Coming Soon</p></div>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <div className="dashboard-overview"><h2>Settings</h2><p className="page-subtitle">Coming Soon</p></div>
              </ProtectedRoute>
            } />
          </Route>

          {/* Auth Routes with AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<div className="auth-form-container"><h2 className="auth-form-title">Forgot Password</h2><p className="auth-form-subtitle">Coming Soon</p></div>} />
          </Route>

          {/* User Dashboard Routes - Moved to MainLayout */}

          {/* Photographer Dashboard Routes with DashboardLayout */}
          <Route element={
            <ProtectedRoute requiredRole="PHOTOGRAPHER">
              <DashboardLayout userType="photographer" />
            </ProtectedRoute>
          }>
            <Route path="/photographer/dashboard" element={<PhotographerDashboardPage />} />
            <Route path="/photographer/upload" element={<div className="dashboard-overview"><h2>Upload Photo</h2><p className="page-subtitle">Coming Soon</p></div>} />
            <Route path="/photographer/portfolio" element={<div className="dashboard-overview"><h2>My Portfolio</h2><p className="page-subtitle">Coming Soon</p></div>} />
            <Route path="/photographer/sales" element={<div className="dashboard-overview"><h2>Sales</h2><p className="page-subtitle">Coming Soon</p></div>} />
            <Route path="/photographer/earnings" element={<div className="dashboard-overview"><h2>Earnings</h2><p className="page-subtitle">Coming Soon</p></div>} />
          </Route>

          {/* Admin Routes with AdminLayout - Protected */}
          <Route element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/photographers" element={<div className="dashboard-overview"><h2>Photographer Management</h2><p className="page-subtitle">Coming Soon</p></div>} />
            <Route path="/admin/photos" element={<PhotosPage />} />
            <Route path="/admin/categories" element={<CategoriesPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/analytics" element={<div className="dashboard-overview"><h2>Analytics & Reports</h2><p className="page-subtitle">Coming Soon</p></div>} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
            <Route path="/admin/settings" element={<div className="dashboard-overview"><h2>Admin Settings</h2><p className="page-subtitle">Coming Soon</p></div>} />
          </Route>

          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
