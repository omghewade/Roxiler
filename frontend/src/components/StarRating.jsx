import React, { useState } from 'react';
import { Star } from 'lucide-react';

export function StarRating({
  rating = 0,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showLabel = false,
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
  };

  const currentDisplay = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = currentDisplay >= starValue;

          return (
            <button
              key={starValue}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`${
                interactive
                  ? 'cursor-pointer transform hover:scale-110 transition-transform p-0.5 focus:outline-none'
                  : 'cursor-default p-0.5'
              }`}
              aria-label={`${starValue} star`}
            >
              <Star
                className={`${starSizes[size] || starSizes.md} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                    : 'text-slate-300 fill-slate-100'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showLabel && (
        <span className="text-sm font-semibold text-slate-700 ml-1">
          {rating ? Number(rating).toFixed(1) : 'No ratings'}
        </span>
      )}
    </div>
  );
}
