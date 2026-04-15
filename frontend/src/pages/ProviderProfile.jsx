import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../utils/axios';
import StarRating from '../components/StarRating';

// Renders a star rating row for the provider's profile
const StarRow = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-4 h-4 ${rating >= star ? 'text-amber-400' : 'text-slate-600'}`}
        fill={rating >= star ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ))}
  </div>
);

// Provider profile page showing bio, availability, and listed services
const ProviderProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetches the provider's profile, services, and reviews on mount
  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const [profileRes, reviewsRes] = await Promise.all([
           API.get(`/providers/${userId}`),
           API.get(`/reviews/provider/${userId}`)
        ]);
        setProfile(profileRes.data.profile);
        setServices(profileRes.data.services);
        setReviews(reviewsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Provider not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProviderData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-6">
          <div className="flex gap-6 items-center">
            <div className="w-24 h-24 rounded-full bg-white/10 flex-shrink-0" />
            <div className="space-y-3 flex-1">
              <div className="h-7 w-48 bg-white/10 rounded-lg" />
              <div className="h-4 w-32 bg-white/10 rounded" />
              <div className="h-4 w-56 bg-white/10 rounded" />
            </div>
          </div>
          <div className="h-24 w-full bg-white/10 rounded-2xl" />
          <div className="grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => <div key={i} className="h-20 bg-white/10 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <span className="text-6xl mb-4 block">😕</span>
          <h2 className="text-2xl font-bold text-white mb-2">Provider not found</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-all duration-200">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { user, bio, experience, location, availability, rating, numReviews, isVerified } = profile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-fade-in">

        {/* Profile Header */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0 shadow-lg shadow-brand-500/20">
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-2">
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-medium text-emerald-400">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-3 text-sm">
              <div className="flex items-center gap-1.5">
                <StarRow rating={rating} />
                <span className="text-amber-400 font-medium">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
                {numReviews > 0 && <span className="text-slate-500">({numReviews} reviews)</span>}
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {experience} yr{experience !== 1 ? 's' : ''} experience
              </div>
              {location?.city && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {location.city}{location.state ? `, ${location.state}` : ''}
                </div>
              )}
            </div>

            {/* Bio */}
            {bio && <p className="text-slate-300 text-sm leading-relaxed max-w-xl">{bio}</p>}
          </div>

          {/* Book Button */}
          <button
            onClick={() => navigate(`/book/${userId}`)}
            className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-500/25 hover:scale-105"
          >
            Book this Provider
          </button>
        </div>

        {/* Availability Grid */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Availability
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {availability?.map((slot) => (
              <div
                key={slot.day}
                className={`rounded-xl p-3 text-center border ${
                  slot.isAvailable
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-white/5 border-white/5 text-slate-600'
                }`}
              >
                <div className="text-xs font-bold mb-1">{slot.day}</div>
                {slot.isAvailable ? (
                  <div className="text-xs leading-tight">
                    {slot.startTime}–{slot.endTime}
                  </div>
                ) : (
                  <div className="text-xs">Off</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Services Offered */}
        <div>
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Services Offered ({services.length})
          </h2>

          {services.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
              <span className="text-4xl mb-3 block">📭</span>
              <p className="text-slate-400">No services listed yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service._id} className="bg-white/5 border border-white/10 hover:border-brand-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-xl flex-shrink-0">
                    {service.category?.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white mb-0.5">{service.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-1">{service.description}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-lg font-bold text-white">₹{service.price}</span>
                    <span className="text-xs text-slate-500 ml-1">/{service.priceType === 'hourly' ? 'hr' : 'fixed'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="pt-8 border-t border-white/10">
          <h2 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Reviews ({numReviews})
          </h2>

          {reviews.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
              <span className="text-4xl mb-3 block">💬</span>
              <p className="text-slate-400">No reviews yet for this provider.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.08] transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {review.customer?.profilePhoto ? (
                           <img src={review.customer.profilePhoto} className="w-full h-full rounded-full object-cover" />
                        ) : (
                           review.customer?.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{review.customer?.name}</p>
                        <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <StarRating value={review.rating} size="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">"{review.comment}"</p>
                  <p className="text-xs font-medium text-brand-400 mt-3 pt-3 border-t border-white/5">
                    Service: {review.service?.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
