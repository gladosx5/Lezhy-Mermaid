interface PromoBadgeProps {
  type: 'promo' | 'new' | 'lastchance' | 'featured';
  className?: string;
}

export function PromoBadge({ type, className = '' }: PromoBadgeProps) {
  const badges = {
    promo: {
      text: 'Promo',
      emoji: '✨',
      gradient: 'from-pink-400 to-rose-400',
    },
    new: {
      text: 'Nouveau',
      emoji: '🌟',
      gradient: 'from-purple-400 to-pink-400',
    },
    lastchance: {
      text: 'Dernière chance',
      emoji: '💔',
      gradient: 'from-red-400 to-pink-400',
    },
    featured: {
      text: 'Coup de cœur',
      emoji: '⭐',
      gradient: 'from-yellow-400 to-orange-400',
    },
  };

  const badge = badges[type];

  return (
    <div
      className={`inline-flex items-center space-x-2 bg-gradient-to-r ${badge.gradient} text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg badge-kawaii animate-float-gentle ${className}`}
    >
      <span>{badge.emoji}</span>
      <span>{badge.text}</span>
    </div>
  );
}
