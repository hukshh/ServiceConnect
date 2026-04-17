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
    document.title = `ServiceConnect - Provider Profile`;
    const fetchProviderData = async () => {
      try {
        const [profileRes, reviewsRes] = await Promise.all([
           API.get(`/providers/${userId}`),
           API.get(`/reviews/provider/${userId}`)
        ]);
        setProfile(profileRes.data.profile);
        setServices(profileRes.data.services);
        setReviews(reviewsRes.data);
        if(profileRes.data.profile.user) {
           document.title = `ServiceConnect - ${profileRes.data.profile.user.name}'s Profile`;
        }
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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-6 w-full">
          <div className="flex gap-6 items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="space-y-3 flex-1">
              <div className="h-7 w-48 bg-gray-200 rounded-lg" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-56 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="h-24 w-full bg-gray-200 rounded-2xl" />
          <div className="grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <h2 className="text-2xl font-bold text-black mb-2">Provider not found</h2>
          <p className="text-gray-500 font-medium mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-md">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { user, bio, experience, location, availability, rating, numReviews, isVerified } = profile;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 space-y-8 animate-fade-in relative flex-1">
        
        <button onClick={() => navigate(-1)} className="absolute -top-4 left-4 sm:left-6 flex items-center gap-1 text-gray-500 hover:text-black transition-colors text-sm font-bold">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
           Back
        </button>

        {/* Profile Header */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-white text-4xl font-black flex-shrink-0 shadow-md">
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-2">
              <h1 className="text-2xl font-extrabold text-black">{user?.name}</h1>
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black rounded-full text-xs font-bold text-white">
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
                <span className="text-black font-bold">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
                {numReviews > 0 && <span className="text-gray-500 font-medium">({numReviews} reviews)</span>}
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {experience} yr{experience !== 1 ? 's' : ''} experience
              </div>
              {location?.city && (
                <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {location.city}{location.state ? `, ${location.state}` : ''}
                </div>
              )}
            </div>

            {/* Bio */}
            {bio && <p className="text-gray-600 font-medium text-sm leading-relaxed max-w-xl">{bio}</p>}
          </div>

          {/* Book Button */}
          <button
            onClick={() => navigate(`/book/${userId}`)}
            className="flex-shrink-0 px-6 py-3 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:-translate-y-0.5"
          >
            Book this Provider
          </button>
        </div>

        {/* Availability Grid */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
          <h2 className="text-base font-extrabold text-black mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Availability
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {availability?.map((slot) => (
              <div
                key={slot.day}
                className={`rounded-xl p-3 text-center border ${
                  slot.isAvailable
                    ? 'bg-gray-50 border-gray-200 text-black'
                    : 'bg-white border-gray-100 text-gray-400'
                }`}
              >
                <div className="text-xs font-bold mb-1">{slot.day}</div>
                {slot.isAvailable ? (
                  <div className="text-xs font-bold leading-tight">
                    {slot.startTime}–{slot.endTime}
                  </div>
                ) : (
                  <div className="text-xs font-bold">Off</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Services Offered */}
        <div>
          <h2 className="text-base font-extrabold text-black mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Services Offered ({services.length})
          </h2>

          {services.length === 0 ? (
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-10 text-center">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
              <p className="text-gray-500 font-medium">No services listed yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service._id} className="bg-white border border-gray-200 hover:border-gray-400 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-200 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-xl flex-shrink-0 text-black">
                    {service.category?.icon ? service.category.icon : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-extrabold text-black mb-0.5">{service.title}</h3>
                    <p className="text-sm font-medium text-gray-500 line-clamp-1">{service.description}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-lg font-black text-black">₹{service.price}</span>
                    <span className="text-xs font-bold text-gray-400 ml-1">/{service.priceType === 'hourly' ? 'hr' : 'fixed'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="pt-8 border-t border-gray-200">
          <h2 className="text-base font-extrabold text-black mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Reviews ({numReviews})
          </h2>

          {reviews.length === 0 ? (
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-10 text-center">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              <p className="text-gray-500 font-medium">No reviews yet for this provider.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 hover:border-gray-300 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-black flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {review.customer?.profilePhoto ? (
                           <img src={review.customer.profilePhoto} className="w-full h-full rounded-full object-cover" />
                        ) : (
                           review.customer?.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-black">{review.customer?.name}</p>
                        <p className="text-xs font-medium text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <StarRating value={review.rating} size="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 leading-relaxed">"{review.comment}"</p>
                  <p className="text-xs font-bold text-black mt-3 pt-3 border-t border-gray-100">
                    Service: <span className="text-gray-500 font-medium">{review.service?.title}</span>
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
