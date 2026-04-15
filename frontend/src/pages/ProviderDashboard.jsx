import { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white mb-2">Provider Dashboard</h1>
          <p className="text-slate-400">Manage your bookings, earnings, and upcoming schedule.</p>
        </div>

        {error ? (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-6 rounded-2xl text-center">
            <h3 className="text-xl font-bold mb-2">Profile Incomplete</h3>
            <p>{error}</p>
            {/* Navigating to profile creation intentionally omitted per user flow constraints, waiting for review */}
          </div>
        ) : loading ? (
          <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div className="h-28 bg-white/5 rounded-2xl"></div><div className="h-28 bg-white/5 rounded-2xl"></div><div className="h-28 bg-white/5 rounded-2xl"></div><div className="h-28 bg-white/5 rounded-2xl"></div></div>
            <div className="h-10 bg-white/5 rounded-lg w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><div className="h-64 bg-white/5 rounded-2xl"></div></div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center">
                <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Pending</p>
                <div className="text-3xl font-bold text-amber-400">{pendingCount}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center">
                <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Upcoming Jobs</p>
                <div className="text-3xl font-bold text-blue-400">{upcomingCount}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center">
                <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Completed</p>
                <div className="text-3xl font-bold text-emerald-400">{completedCount}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center">
                <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Earnings</p>
                <div className="text-3xl font-bold text-purple-400">₹{profile?.totalEarnings || 0}</div>
              </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide border-b border-white/10 mb-8 pb-px">
              <div className="flex gap-6 min-w-max">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-medium transition-all duration-200 border-b-2 relative -mb-[2px] ${
                      activeTab === tab
                        ? 'text-brand-400 border-brand-400'
                        : 'text-slate-400 border-transparent hover:text-slate-200'
                    }`}
                  >
                    {tab}
                    {tab === 'Pending' && pendingCount > 0 && (
                      <span className="absolute top-0 -right-4 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            {filteredBookings.length === 0 ? (
               <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                 <span className="text-4xl mb-4 block">📅</span>
                 <h3 className="text-lg font-medium text-white mb-1">No {activeTab.toLowerCase()} bookings</h3>
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
