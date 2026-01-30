import React, { useState } from 'react';
import { IconStar } from './Icons.tsx';

interface ReviewModalProps {
  stationName: string;
  onSubmit: (rating: number, comment: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ stationName, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, comment);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-gray-600">How was your experience with <span className="font-bold">{stationName}</span>?</p>
      <div className="flex justify-center items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            className="focus:outline-none transform transition-transform duration-200 hover:scale-110"
          >
            <IconStar 
              className={`w-10 h-10 transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}`} 
            />
          </button>
        ))}
      </div>
      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience (optional)"
          className="w-full h-28 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        />
      </div>
      <button 
        onClick={handleSubmit}
        disabled={rating === 0}
        className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Submit Review
      </button>
    </div>
  );
};

export default ReviewModal;
