import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/axios';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';

const WriteReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await API.get(`/bookings/${bookingId}`);
        setBooking(data);
        if (data.status !== 'completed' || data.isReviewed) {
           setError('This booking is either not completed or already reviewed.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating (1-5 stars)');
      return;
    }
    if (comment.length < 20) {
      alert('Please provide a comment of at least 20 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await API.post('/reviews', {
        bookingId,
        rating,
        comment
      });
      navigate('/bookings');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center text-slate-400">Loading...</div>
      </div>
    );
  }

  if (error || !booking) {
     return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
           <h3 className="text-xl font-bold text-red-400 mb-2">Unavailable</h3>
           <p className="text-slate-400 mb-6">{error}</p>
           <button onClick={() => navigate('/bookings')} className="px-6 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-white">Back to Bookings</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-white mb-2">Write a Review</h1>
          <p className="text-slate-400">Share your experience with others.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
           {/* Context Info */}
           <div className="bg-black/20 p-4 rounded-xl border border-white/5 mb-6">
              <p className="text-sm text-slate-400 mb-1">You are reviewing:</p>
              <h3 className="text-lg font-bold text-white mb-1">{booking.service?.title}</h3>
              <p className="text-sm font-medium text-brand-400">Provider: {booking.provider?.name}</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
             <div>
               <label className="block text-sm font-medium text-white mb-3 text-center">
                 Overall Rating
               </label>
               <div className="flex justify-center mb-1">
                 <StarRating value={rating} onChange={setRating} size="w-10 h-10" />
               </div>
               <p className="text-xs text-center text-slate-500">Click to select 1-5 stars</p>
             </div>

             <div>
               <label className="block text-sm font-medium text-white mb-2">
                 Your Experience
               </label>
               <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was the service? What did you like or dislike?"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all min-h-[120px] resize-y"
                  required
               />
               <p className={`text-xs mt-2 ${comment.length < 20 && comment.length > 0 ? 'text-red-400' : 'text-slate-500'}`}>
                 {comment.length}/20 minimum characters
               </p>
             </div>

             <button
               type="submit"
               disabled={submitting || rating === 0 || comment.length < 20}
               className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all duration-200"
             >
               {submitting ? 'Submitting...' : 'Submit Review'}
             </button>
           </form>
        </div>
      </div>
    </div>
  );
};

export default WriteReview;
