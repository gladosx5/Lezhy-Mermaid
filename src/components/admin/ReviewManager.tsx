import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function ReviewManager() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('review_date', { ascending: false });
    if (data) setReviews(data);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
        Gestion des Avis
      </h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">{review.author_name}</h3>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600">{review.review_text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
