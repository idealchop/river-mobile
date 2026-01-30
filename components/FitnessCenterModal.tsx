
import React, { useState } from 'react';
import { IconStar, IconMapPin } from './Icons.tsx';
import type { Gym, Review } from '../types.ts';

const mockGyms: Gym[] = [
  {
    id: 'gym-1',
    name: 'Flex Fitness',
    location: 'Makati Central',
    rating: 4.8,
    reviews: [
      { author: 'Chris P.', rating: 5, comment: 'Great equipment and friendly staff!', date: '2024-05-15' },
      { author: 'Sarah L.', rating: 4, comment: 'Clean and well-maintained. Can get crowded during peak hours.', date: '2024-05-12' },
    ],
    coaches: [
        { id: 'c1', name: 'John Carter', specialty: 'Strength Training', imageUrl: 'https://i.pravatar.cc/150?u=john' },
        { id: 'c2', name: 'Jane Doe', specialty: 'Yoga & Flexibility', imageUrl: 'https://i.pravatar.cc/150?u=jane' },
    ]
  },
  {
    id: 'gym-2',
    name: 'Iron Paradise',
    location: 'BGC, Taguig',
    rating: 4.9,
    reviews: [
        { author: 'Mike T.', rating: 5, comment: 'Best gym for serious lifters!', date: '2024-05-20' },
    ],
    coaches: [
        { id: 'c3', name: 'Coach Rex', specialty: 'Bodybuilding', imageUrl: 'https://i.pravatar.cc/150?u=rex' },
    ]
  },
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <IconStar key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
    ))}
  </div>
);

const FitnessCenterModal: React.FC<{ onSelectGym: (gym: Gym) => void }> = ({ onSelectGym }) => {
  const [expandedGym, setExpandedGym] = useState<string | null>(null);

  const toggleGym = (id: string) => {
    setExpandedGym(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Choose your preferred partner gym to access exclusive schedules and coaches.</p>
      <div className="space-y-3">
        {mockGyms.map(gym => (
          <div key={gym.id} className="bg-gray-100 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{gym.name}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <IconMapPin className="w-3 h-3" />
                  <span>{gym.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={gym.rating} />
                <span className="text-xs font-bold">{gym.rating.toFixed(1)}</span>
              </div>
            </div>
            {expandedGym === gym.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 animate-fade-in">
                <h4 className="font-semibold text-sm">Reviews</h4>
                {gym.reviews.map((review, i) => (
                  <div key={i} className="text-xs bg-white p-2 rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{review.author}</span>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-gray-600 mt-1">{review.comment}</p>
                  </div>
                ))}
                <button onClick={() => onSelectGym(gym)} className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg mt-2">Select this Gym</button>
              </div>
            )}
            <button onClick={() => toggleGym(gym.id)} className="text-xs text-blue-600 font-semibold mt-2">
              {expandedGym === gym.id ? 'Show Less' : 'Show More'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FitnessCenterModal;
