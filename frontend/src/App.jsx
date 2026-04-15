import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProviderProfile from './pages/ProviderProfile';

import BookService from './pages/BookService';
import BookingHistory from './pages/BookingHistory';
import ProviderDashboard from './pages/ProviderDashboard';
import WriteReview from './pages/WriteReview';
import AdminDashboard from './pages/AdminDashboard';

// Protects routes by checking if user is authenticated and has the correct role
const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'provider') return <Navigate to="/provider/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

// Redirects authenticated users away from login/register pages to their dashboard
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'provider') return <Navigate to="/provider/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main application component with all route definitions and role-based access control
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes — redirect if already authenticated */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Public provider profile — accessible without login */}
        <Route path="/provider/:userId" element={<ProviderProfile />} />

        {/* Customer home and bookings — accessible to all authenticated users for browsing services */}
        <Route path="/" element={<PrivateRoute roles={['customer', 'provider', 'admin']}><Home /></PrivateRoute>} />
        <Route path="/bookings" element={<PrivateRoute roles={['customer']}><BookingHistory /></PrivateRoute>} />
        <Route path="/book/:providerId" element={<PrivateRoute roles={['customer']}><BookService /></PrivateRoute>} />
        <Route path="/review/:bookingId" element={<PrivateRoute roles={['customer']}><WriteReview /></PrivateRoute>} />

        {/* Provider routes */}
        <Route path="/provider/dashboard" element={<PrivateRoute roles={['provider']}><ProviderDashboard /></PrivateRoute>} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
