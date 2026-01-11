import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Review {
  id: string;
  author_name: string;
  author_avatar: string | null;
  rating: number;
  review_text: string | null;
  review_date: string;
}

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_hidden', false)
      .order('is_featured', { ascending: false })
      .order('display_order', { ascending: true })
      .limit(6);

    if (data) {
      setReviews(data);
    }
  };

  if (reviews.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-pink-50 px-6 py-3 rounded-full mb-4">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-700">Avis clients</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Ce qu'ils en pensent
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-6 border-2 border-pink-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center space-x-3 mb-4">
                {review.author_avatar ? (
                  <img
                    src={review.author_avatar}
                    alt={review.author_name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center text-white font-bold">
                    {review.author_name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{review.author_name}</h4>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {review.review_text && (
                <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
