import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/axios';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import Spinner from '../components/Spinner';

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
    document.title = 'ServiceConnect - Write Review';
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
      <div className="min-h-screen bg-gray-50 pb-20">
        <Navbar />
        <Spinner />
      </div>
    );
  }

  if (error || !booking) {
     return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
           <h3 className="text-xl font-bold text-red-600 mb-2">Unavailable</h3>
           <p className="text-gray-500 font-medium mb-6">{error}</p>
           <button onClick={() => navigate('/bookings')} className="px-6 py-2 bg-black hover:bg-gray-800 rounded-xl text-white font-bold">Back to Bookings</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-black mb-2">Write a Review</h1>
          <p className="text-gray-500 font-medium">Share your experience with others.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
           {/* Context Info */}
           <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
              <p className="text-sm font-bold text-gray-500 mb-1">You are reviewing:</p>
              <h3 className="text-lg font-bold text-black mb-1">{booking.service?.title}</h3>
              <p className="text-sm font-bold text-black">Provider: {booking.provider?.name}</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
             <div>
               <label className="block text-sm font-bold text-black mb-3 text-center">
                 Overall Rating
               </label>
               <div className="flex justify-center mb-1">
                 <StarRating value={rating} onChange={setRating} size="w-10 h-10" />
               </div>
               <p className="text-xs font-bold text-center text-gray-400">Click to select 1-5 stars</p>
             </div>

             <div>
               <label className="block text-sm font-bold text-black mb-2">
                 Your Experience
               </label>
               <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was the service? What did you like or dislike?"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-black font-medium placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all min-h-[120px] resize-y"
                  required
               />
               <p className={`text-xs mt-2 font-bold ${comment.length < 20 && comment.length > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                 {comment.length}/20 minimum characters
               </p>
             </div>

             <button
               type="submit"
               disabled={submitting || rating === 0 || comment.length < 20}
               className="w-full py-3.5 bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all duration-200"
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
