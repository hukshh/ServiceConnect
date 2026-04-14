import { Link } from 'react-router-dom';

// Renders a filled or empty star based on the rating value and index
const Star = ({ filled, half }) => (
  <svg className={`w-4 h-4 ${filled || half ? 'text-amber-400' : 'text-slate-600'}`} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

// Renders a row of 5 stars based on the numeric rating value
const StarRow = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} filled={rating >= star} />
      ))}
    </div>
  );
};

// Service card showing category, title, rating, provider, and price
const ServiceCard = ({ service }) => {
  const { _id, title, description, category, provider, price, priceType, rating, numReviews } = service;

  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.08] hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col">
      {/* Category Badge */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full text-xs font-medium text-brand-300">
            <span>{category?.icon}</span>
            <span>{category?.name}</span>
          </span>
          {/* Price */}
          <div className="text-right">
            <span className="text-lg font-bold text-white">₹{price}</span>
            <span className="text-xs text-slate-500 ml-1">/{priceType === 'hourly' ? 'hr' : 'fixed'}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors duration-200 line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <StarRow rating={rating} />
          <span className="text-sm font-medium text-amber-400">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
          {numReviews > 0 && (
            <span className="text-xs text-slate-500">({numReviews} reviews)</span>
          )}
        </div>
      </div>

      {/* Provider + Action */}
      <div className="mt-auto px-5 pb-5 border-t border-white/5 pt-4 flex items-center justify-between">
        {/* Provider info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {provider?.profilePhoto ? (
              <img src={provider.profilePhoto} alt={provider.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              provider?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <span className="text-sm text-slate-300 font-medium max-w-[100px] truncate">
            {provider?.name}
          </span>
        </div>

        {/* View Provider Button */}
        <Link
          to={`/provider/${provider?._id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-400 hover:text-white bg-brand-500/10 hover:bg-brand-500 border border-brand-500/20 hover:border-brand-500 rounded-xl transition-all duration-200"
        >
          View Provider
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
