import React from 'react';
import { FiStar } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

export default function StarRating({ rating = 0, maxStars = 5, onRatingChange = null, size = 16, interactive = false }) {
  const starsArray = Array.from({ length: maxStars }, (_, index) => index + 1);

  return (
    <div className="flex items-center space-x-1">
      {starsArray.map((star) => {
        const isFilled = star <= rating;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onRatingChange && onRatingChange(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform focus:outline-none' : 'cursor-default'}`}
          >
            {isFilled ? (
              <FaStar className="text-amber-450 fill-amber-400" style={{ width: size, height: size }} />
            ) : (
              <FiStar className="text-slate-300 dark:text-slate-600" style={{ width: size, height: size }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
