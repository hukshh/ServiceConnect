import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

// Top navigation bar with logo, role-based links, and auth buttons
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Logs the user out and redirects to the login page
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center shadow-md transition-all duration-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-black tracking-tight">
              Service<span className="text-gray-500">Connect</span>
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-3">
             <NavLink
               to="/services"
               className={({ isActive }) => `flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-colors duration-200 ${isActive ? 'text-black bg-gray-100 rounded-xl' : 'text-gray-500 hover:text-black'}`}
             >
               Services
             </NavLink>

            {user ? (
              <>
                {/* Role-based navigation links */}
                {user.role === 'customer' && (
                  <NavLink
                    to="/bookings"
                    className={({ isActive }) => `hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-colors duration-200 ${isActive ? 'text-black bg-gray-100 rounded-xl' : 'text-gray-500 hover:text-black'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    My Bookings
                  </NavLink>
                )}
                {user.role === 'provider' && (
                  <>
                    <NavLink
                      to="/provider/dashboard"
                      className={({ isActive }) => `hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-colors duration-200 ${isActive ? 'text-black bg-gray-100 rounded-xl' : 'text-gray-500 hover:text-black'}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/provider/earnings"
                      className={({ isActive }) => `hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-colors duration-200 ${isActive ? 'text-black bg-gray-100 rounded-xl' : 'text-gray-500 hover:text-black'}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Earnings
                    </NavLink>
                  </>
                )}
                {user.role === 'admin' && (
                  <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) => `hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors duration-200 ${isActive ? 'text-amber-400 bg-amber-500/10 rounded-xl' : 'text-slate-300 hover:text-amber-300'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Admin
                  </NavLink>
                )}

                {/* Notification Bell */}
                <NotificationBell />

                {/* User avatar + name */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200">
                  <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-bold text-black max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-gray-500 hover:text-white bg-gray-50 hover:bg-black border border-gray-200 hover:border-black rounded-xl transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:block">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-black transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-xl transition-all duration-200 shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
