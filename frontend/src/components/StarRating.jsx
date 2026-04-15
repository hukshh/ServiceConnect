import { useState } from 'react';

// Star rating component, supports interactive mode with value/onChange or read-only mode if no onChange passed
const StarRating = ({ value = 0, onChange, size = 'w-6 h-6' }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const isReadOnly = !onChange;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoverValue || value) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={isReadOnly}
            onClick={() => !isReadOnly && onChange(star)}
            onMouseEnter={() => !isReadOnly && setHoverValue(star)}
            onMouseLeave={() => !isReadOnly && setHoverValue(0)}
            className={`${isReadOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-all duration-150 focus:outline-none`}
            aria-label={`Rate ${star} out of 5 stars`}
          >
            <svg
              className={`${size} ${isFilled ? 'text-amber-400' : 'text-slate-600 hover:text-amber-400/50'}`}
              fill={isFilled ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
