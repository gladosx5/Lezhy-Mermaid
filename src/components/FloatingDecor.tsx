import { Heart, Sparkles, Star } from 'lucide-react';

interface FloatingDecorProps {
  type?: 'heart' | 'sparkle' | 'star';
  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  opacity?: number;
  delay?: number;
}

export function FloatingDecor({
  type = 'heart',
  position = { top: '10%', left: '5%' },
  size = 'md',
  opacity = 0.1,
  delay = 0,
}: FloatingDecorProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const icons = {
    heart: Heart,
    sparkle: Sparkles,
    star: Star,
  };

  const Icon = icons[type];

  return (
    <div
      className={`absolute ${sizeClasses[size]} pointer-events-none animate-float-slow`}
      style={{
        ...position,
        opacity,
        animationDelay: `${delay}s`,
      }}
    >
      <Icon className={`w-full h-full ${type === 'heart' ? 'fill-pink-300' : ''} text-pink-300`} />
    </div>
  );
}

export function FloatingSticker({
  emoji,
  position,
  size = 'md',
  opacity = 0.08,
  delay = 0,
}: {
  emoji: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  size?: 'sm' | 'md' | 'lg';
  opacity?: number;
  delay?: number;
}) {
  const sizeClasses = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-7xl',
  };

  return (
    <div
      className={`absolute ${sizeClasses[size]} pointer-events-none animate-float-slow`}
      style={{
        ...position,
        opacity,
        animationDelay: `${delay}s`,
      }}
    >
      {emoji}
    </div>
  );
}
