import { useState, useEffect } from 'react';
import API from '../utils/axios';
import Navbar from '../components/Navbar';
import BookingCard from '../components/BookingCard';
import Spinner from '../components/Spinner';

const TABS = ['All', 'Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'];

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    document.title = "ServiceConnect - My Bookings";
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-black mb-2">My Bookings</h1>
          <p className="text-gray-500 font-medium">View and manage all your service requests.</p>
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
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="text-center py-20 text-red-600 font-medium">{error}</div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <h3 className="text-lg font-bold text-black mb-1">No {activeTab.toLowerCase()} bookings found</h3>
            <p className="text-gray-500 text-sm font-medium">When you book services, they will appear here.</p>
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
