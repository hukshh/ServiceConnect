import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  accepted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  in_progress: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const formatStatus = (status) => {
  return status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const BookingCard = ({ booking, role = 'customer', onStatusChange, onCancel }) => {
  const navigate = useNavigate();
  const party = role === 'customer' ? booking.provider : booking.customer;
  
  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.08] hover:border-brand-500/30 transition-all duration-300">
      {/* Header: Service + Status */}
      <div className="px-5 py-4 border-b border-white/5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">{booking.service?.title}</h3>
          <p className="text-sm text-slate-400 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {party?.name}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[booking.status]}`}>
          {formatStatus(booking.status)}
        </div>
      </div>

      {/* Body: Details */}
      <div className="p-5 space-y-4">
        {/* Date & Time */}
        <div className="flex items-center gap-6">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-400 flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Date & Time</p>
              <p className="text-sm font-medium text-white">{formattedDate}</p>
              <p className="text-sm text-slate-400">{booking.timeSlot}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Amount</p>
              <p className="text-sm font-bold text-white">₹{booking.totalAmount}</p>
              <p className="text-xs text-slate-400">{booking.isPaid ? 'Paid' : 'Pending Payment'}</p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2.5 pt-4 border-t border-white/5">
          <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Location</p>
            <p className="text-sm text-slate-300">
              {booking.address?.street}, {booking.address?.city} {booking.address?.pincode}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 bg-black/20 border-t border-white/5 flex justify-end gap-3">
        {/* CUSTOMER CONTROLS */}
        {role === 'customer' && (
          <>
            {['pending', 'accepted'].includes(booking.status) && (
              <button
                onClick={() => onCancel && onCancel(booking._id)}
                className="px-4 py-2 text-sm font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 rounded-xl transition-all duration-200"
              >
                Cancel Booking
              </button>
            )}
            {booking.status === 'completed' && !booking.isReviewed && (
              <button
                onClick={() => navigate(`/review/${booking._id}`)}
                className="px-4 py-2 text-sm font-medium text-brand-400 hover:text-white bg-brand-500/10 hover:bg-brand-500 border border-brand-500/20 hover:border-brand-500 rounded-xl transition-all duration-200"
              >
                Write Review
              </button>
            )}
          </>
        )}

        {/* PROVIDER CONTROLS */}
        {role === 'provider' && (
          <>
            {booking.status === 'pending' && (
              <>
                <button
                  onClick={() => onStatusChange && onStatusChange(booking._id, 'rejected')}
                  className="px-4 py-2 text-sm font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 rounded-xl transition-all duration-200"
                >
                  Reject
                </button>
                <button
                  onClick={() => onStatusChange && onStatusChange(booking._id, 'accepted')}
                  className="px-4 py-2 text-sm font-medium text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 hover:border-emerald-500 rounded-xl transition-all duration-200"
                >
                  Accept Job
                </button>
              </>
            )}
            {booking.status === 'accepted' && (
              <button
                onClick={() => onStatusChange && onStatusChange(booking._id, 'in_progress')}
                className="px-4 py-2 text-sm font-medium text-purple-400 hover:text-white bg-purple-500/10 hover:bg-purple-500 border border-purple-500/20 hover:border-purple-500 rounded-xl transition-all duration-200"
              >
                Start Job
              </button>
            )}
            {booking.status === 'in_progress' && (
              <button
                onClick={() => onStatusChange && onStatusChange(booking._id, 'completed')}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25"
              >
                Mark Completed
              </button>
            )}
          </>
        )}
        
        {/* FALLBACK VIEWING BUTTON */}
        {!['pending', 'accepted', 'in_progress'].includes(booking.status) && role === 'provider' && (
           <span className="text-xs text-slate-500 font-medium py-2">No actions available</span>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
