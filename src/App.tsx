import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import NotFoundPage from './pages/NotFoundPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';

// Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage';

// Photographer Pages
import PhotographerDashboardPage from './pages/photographer/PhotographerDashboardPage';

// Admin Layout and Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UsersPage from './pages/admin/UsersPage';
import PhotosPage from './pages/admin/PhotosPage';
import OrdersPage from './pages/admin/OrdersPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />

          {/* Placeholder routes - will be implemented later */}
          <Route path="/photo/:id" element={<div className="page-placeholder">Photo Detail Page - Coming Soon</div>} />
          <Route path="/category/:name" element={<div className="page-placeholder">Category Page - Coming Soon</div>} />
          <Route path="/photographer/:id" element={<div className="page-placeholder">Photographer Profile - Coming Soon</div>} />
          <Route path="/about" element={<div className="page-placeholder">About Page - Coming Soon</div>} />
          <Route path="/contact" element={<div className="page-placeholder">Contact Page - Coming Soon</div>} />
          <Route path="/cart" element={<div className="page-placeholder">Shopping Cart - Coming Soon</div>} />
          <Route path="/checkout" element={<div className="page-placeholder">Checkout - Coming Soon</div>} />
        </Route>

        {/* Auth Routes with AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<div className="auth-form-container"><h2 className="auth-form-title">Forgot Password</h2><p className="auth-form-subtitle">Coming Soon</p></div>} />
        </Route>

        {/* User Dashboard Routes with DashboardLayout */}
        <Route element={<DashboardLayout userType="buyer" />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/purchases" element={<div className="dashboard-overview"><h2>My Purchases</h2><p className="page-subtitle">Coming Soon</p></div>} />
          <Route path="/dashboard/favorites" element={<div className="dashboard-overview"><h2>Favorites</h2><p className="page-subtitle">Coming Soon</p></div>} />
          <Route path="/dashboard/settings" element={<div className="dashboard-overview"><h2>Settings</h2><p className="page-subtitle">Coming Soon</p></div>} />
        </Route>

        {/* Photographer Dashboard Routes with DashboardLayout */}
        <Route element={<DashboardLayout userType="photographer" />}>
          <Route path="/photographer/dashboard" element={<PhotographerDashboardPage />} />
          <Route path="/photographer/upload" element={<div className="dashboard-overview"><h2>Upload Photo</h2><p className="page-subtitle">Coming Soon</p></div>} />
          <Route path="/photographer/portfolio" element={<div className="dashboard-overview"><h2>My Portfolio</h2><p className="page-subtitle">Coming Soon</p></div>} />
          <Route path="/photographer/sales" element={<div className="dashboard-overview"><h2>Sales</h2><p className="page-subtitle">Coming Soon</p></div>} />
          <Route path="/photographer/earnings" element={<div className="dashboard-overview"><h2>Earnings</h2><p className="page-subtitle">Coming Soon</p></div>} />
        </Route>

        {/* Admin Routes with AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/photographers" element={<div className="dashboard-overview"><h2>Photographer Management</h2><p className="page-subtitle">Coming Soon</p></div>} />
          <Route path="/admin/photos" element={<PhotosPage />} />
          <Route path="/admin/categories" element={<div className="dashboard-overview"><h2>Category Management</h2><p className="page-subtitle">Coming Soon</p></div>} />
          <Route path="/admin/sales" element={<OrdersPage />} />
          <Route path="/admin/analytics" element={<div className="dashboard-overview"><h2>Analytics & Reports</h2><p className="page-subtitle">Coming Soon</p></div>} />
          <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
          <Route path="/admin/settings" element={<div className="dashboard-overview"><h2>Admin Settings</h2><p className="page-subtitle">Coming Soon</p></div>} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
