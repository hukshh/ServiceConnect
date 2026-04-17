import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-700 border-gray-200',
  accepted: 'bg-black text-white border-black',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  in_progress: 'bg-gray-800 text-white border-gray-800',
  completed: 'bg-gray-100 text-black border-gray-300',
  cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
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
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-black transition-all duration-300 shadow-sm">
      {/* Header: Service + Status */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-4 bg-gray-50">
        <div>
          <h3 className="text-base font-bold text-black mb-1">{booking.service?.title}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {party?.name}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[booking.status]}`}>
          {formatStatus(booking.status)}
        </div>
      </div>

      {/* Body: Details */}
      <div className="p-5 space-y-4">
        {/* Date & Time */}
        <div className="flex items-center gap-6">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-black flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Date & Time</p>
              <p className="text-sm font-bold text-black">{formattedDate}</p>
              <p className="text-sm text-gray-500">{booking.timeSlot}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-black flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Amount</p>
              <p className="text-sm font-bold text-black">₹{booking.totalAmount}</p>
              <p className="text-xs text-gray-500">{booking.isPaid ? 'Paid' : 'Pending Payment'}</p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2.5 pt-4 border-t border-gray-100">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-black flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Location</p>
            <p className="text-sm font-medium text-black">
              {booking.address?.street}, {booking.address?.city} {booking.address?.pincode}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
        {/* CUSTOMER CONTROLS */}
        {role === 'customer' && (
          <>
            {['pending', 'accepted'].includes(booking.status) && (
              <button
                onClick={() => onCancel && onCancel(booking._id)}
                className="px-4 py-2 text-sm font-bold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-xl transition-all duration-200"
              >
                Cancel Booking
              </button>
            )}
            {booking.status === 'completed' && !booking.isReviewed && (
              <button
                onClick={() => navigate(`/review/${booking._id}`)}
                className="px-4 py-2 text-sm font-bold text-black border border-gray-300 hover:bg-gray-100 rounded-xl transition-all duration-200"
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
                  className="px-4 py-2 text-sm font-bold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-xl transition-all duration-200"
                >
                  Reject
                </button>
                <button
                  onClick={() => onStatusChange && onStatusChange(booking._id, 'accepted')}
                  className="px-4 py-2 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-xl transition-all duration-200"
                >
                  Accept Job
                </button>
              </>
            )}
            {booking.status === 'accepted' && (
              <button
                onClick={() => onStatusChange && onStatusChange(booking._id, 'in_progress')}
                className="px-4 py-2 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-xl transition-all duration-200"
              >
                Start Job
              </button>
            )}
            {booking.status === 'in_progress' && (
              <button
                onClick={() => onStatusChange && onStatusChange(booking._id, 'completed')}
                className="px-4 py-2 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-xl transition-all duration-200 shadow-md"
              >
                Mark Completed
              </button>
            )}
          </>
        )}
        
        {/* FALLBACK VIEWING BUTTON */}
        {!['pending', 'accepted', 'in_progress'].includes(booking.status) && role === 'provider' && (
           <span className="text-xs text-gray-500 font-bold py-2">No actions available</span>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
