import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/axios';
import Navbar from '../components/Navbar';
import BookingCard from '../components/BookingCard';

const TABS = ['All', 'Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'];

const ProviderDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Pending');

  useEffect(() => {
    document.title = "ServiceConnect - Provider Dashboard";
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, bookingsRes] = await Promise.all([
        API.get('/providers/profile/me'),
        API.get('/bookings/provider')
      ]);
      setProfile(profileRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      if (err.response?.status === 404) {
         setError('Please complete your profile to start accepting bookings.');
      } else {
         setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    let reason = '';
    if (newStatus === 'rejected') {
      const input = window.prompt("Optional: Provide a reason for rejecting this booking:");
      if (input === null) return; // User cancelled
      reason = input;
    }

    try {
      const { data } = await API.put(`/bookings/${bookingId}/status`, { 
        status: newStatus,
        cancellationReason: reason 
      });
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? data : b)));
      
      // Update local earnings if completed
      if (newStatus === 'completed' && profile) {
         setProfile(prev => ({...prev, totalEarnings: prev.totalEarnings + data.totalAmount}));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const upcomingCount = bookings.filter(b => b.status === 'accepted' || b.status === 'in_progress').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'All') return true;
    return b.status.toLowerCase().replace('_', ' ') === activeTab.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-black mb-2">Provider Dashboard</h1>
            <p className="text-gray-500 font-medium">Manage your bookings, earnings, and upcoming schedule.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
             <Link 
                to="/provider/services" 
                className="px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-black font-bold rounded-xl transition-colors shrink-0 flex items-center justify-center gap-2 shadow-sm"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Manage Services
             </Link>
             <Link 
                to="/provider/availability" 
                className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-colors shrink-0 flex items-center justify-center gap-2 shadow-md"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Manage Availability
             </Link>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center">
            <h3 className="text-xl font-bold mb-2">Profile Incomplete</h3>
            <p>{error}</p>
          </div>
        ) : loading ? (
          <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div className="h-28 bg-gray-200 rounded-2xl"></div><div className="h-28 bg-gray-200 rounded-2xl"></div><div className="h-28 bg-gray-200 rounded-2xl"></div><div className="h-28 bg-gray-200 rounded-2xl"></div></div>
            <div className="h-10 bg-gray-200 rounded-lg w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><div className="h-64 bg-gray-200 rounded-2xl"></div></div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-center shadow-sm">
                <p className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-wider">Pending</p>
                <div className="text-3xl font-black text-black">{pendingCount}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-center shadow-sm">
                <p className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-wider">Upcoming Jobs</p>
                <div className="text-3xl font-black text-black">{upcomingCount}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-center shadow-sm">
                <p className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-wider">Completed</p>
                <div className="text-3xl font-black text-black">{completedCount}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-center shadow-sm">
                <p className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-wider">Earnings</p>
                <div className="text-3xl font-black text-black">₹{profile?.totalEarnings || 0}</div>
              </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 mb-8 pb-px">
              <div className="flex gap-6 min-w-max">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-bold transition-all duration-200 border-b-2 relative -mb-[2px] ${
                      activeTab === tab
                        ? 'text-black border-black'
                        : 'text-gray-500 border-transparent hover:text-black'
                    }`}
                  >
                    {tab}
                    {tab === 'Pending' && pendingCount > 0 && (
                      <span className="absolute top-0 -right-4 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            {filteredBookings.length === 0 ? (
               <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
                 <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 <h3 className="text-lg font-bold text-black mb-1">No {activeTab.toLowerCase()} bookings</h3>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {filteredBookings.map((booking) => (
                   <BookingCard 
                     key={booking._id} 
                     booking={booking} 
                     role="provider" 
                     onStatusChange={handleStatusChange} 
                   />
                 ))}
               </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;
