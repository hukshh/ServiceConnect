import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
  const { notifications, unreadCount, markAllRead } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (bookingId) => {
    setIsOpen(false);
    if (bookingId) {
      // Could navigate to specific booking view, but pointing to generic bookings list is fine for now
      navigate('/bookings');
    }
  };

  // Only show the 8 most recent
  const displayNotifications = notifications.slice(0, 8);

  const getIcon = (type) => {
    switch(type) {
       case 'new_booking': return '📝';
       case 'accepted': return '✅';
       case 'rejected': return '❌';
       case 'in_progress': return '🚀';
       case 'completed': return '🎉';
       case 'cancelled': return '⚠️';
       default: return '🔔';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-300 hover:text-white transition-colors focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-slate-900 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Box */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right animate-fade-in">
          
          {/* Header */}
          <div className="px-5 py-3 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto overscroll-contain">
            {displayNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <span className="text-3xl block mb-2 opacity-50">📭</span>
                <p className="text-sm">You have no notifications</p>
              </div>
            ) : (
              <ul className="divide-y divide-white/5">
                {displayNotifications.map((notif, idx) => (
                  <li 
                    key={idx} 
                    onClick={() => handleNotificationClick(notif.bookingId)}
                    className={`p-4 hover:bg-white/5 cursor-pointer transition-colors flex gap-3 ${!notif.read ? 'bg-brand-500/5' : ''}`}
                  >
                     <div className="flex-shrink-0 text-xl mt-0.5">{getIcon(notif.type)}</div>
                     <div>
                        <p className={`text-sm ${!notif.read ? 'text-white font-medium' : 'text-slate-300'}`}>
                          {notif.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                        </p>
                     </div>
                     {!notif.read && (
                        <div className="ml-auto flex-shrink-0">
                           <div className="w-2.5 h-2.5 bg-brand-500 rounded-full"></div>
                        </div>
                     )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Footer */}
          {notifications.length > 8 && (
            <div className="px-5 py-2.5 border-t border-white/5 bg-slate-900/50 text-center">
              <span className="text-xs text-slate-500">Showing 8 most recent</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
