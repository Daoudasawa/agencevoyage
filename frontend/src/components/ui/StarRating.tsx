import React from 'react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  className?: string;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  className = '',
  size = 18,
}) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        
        return (
          <svg
            key={index}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={isFilled ? '#c9a84c' : 'none'}
            stroke={isFilled ? '#c9a84c' : '#d1d5db'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors duration-150"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;
