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
import ProviderAvailability from './pages/ProviderAvailability';
import ProviderEarnings from './pages/ProviderEarnings';
import ProviderServices from './pages/ProviderServices';
import NotFound from './pages/NotFound';
import Spinner from './components/Spinner';
import Footer from './components/Footer';

// Protects routes by checking if user is authenticated and has the correct role
const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner global />;
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
    return <Spinner global />;
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
      <div className="flex flex-col min-h-screen bg-white text-black">
        <div className="flex-1">
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
            <Route path="/provider/availability" element={<PrivateRoute roles={['provider']}><ProviderAvailability /></PrivateRoute>} />
            <Route path="/provider/earnings" element={<PrivateRoute roles={['provider']}><ProviderEarnings /></PrivateRoute>} />
            <Route path="/provider/services" element={<PrivateRoute roles={['provider']}><ProviderServices /></PrivateRoute>} />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />

            {/* Catch-all 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
