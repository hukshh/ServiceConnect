import { useState, useEffect } from 'react';
import API from '../utils/axios';
import Navbar from '../components/Navbar';
import BookingCard from '../components/BookingCard';

const TABS = ['All', 'Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'];

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/my');
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    const reason = window.prompt("Optional: Why are you cancelling this booking?");
    if (reason === null) return; // User clicked Cancel in prompt

    try {
      const { data } = await API.put(`/bookings/${bookingId}/cancel`, { cancellationReason: reason });
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? data : b)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'All') return true;
    return b.status.toLowerCase().replace('_', ' ') === activeTab.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white mb-2">My Bookings</h1>
          <p className="text-slate-400">View and manage all your service requests.</p>
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
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/5 h-[300px] rounded-2xl"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <span className="text-4xl mb-4 block">📅</span>
            <h3 className="text-lg font-medium text-white mb-1">No {activeTab.toLowerCase()} bookings found</h3>
            <p className="text-slate-400 text-sm">When you book services, they will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {filteredBookings.map((booking) => (
               <BookingCard 
                 key={booking._id} 
                 booking={booking} 
                 role="customer" 
                 onCancel={handleCancel} 
               />
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
