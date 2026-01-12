import { Heart, Sparkles, Star } from 'lucide-react';

interface FloatingDecorationsProps {
  variant?: 'hearts' | 'sparkles' | 'stars' | 'mixed';
  density?: 'low' | 'medium' | 'high';
}

export function FloatingDecorations({ variant = 'mixed', density = 'medium' }: FloatingDecorationsProps) {
  const count = density === 'low' ? 3 : density === 'medium' ? 5 : 8;

  const getIcon = (index: number) => {
    if (variant === 'hearts') return Heart;
    if (variant === 'sparkles') return Sparkles;
    if (variant === 'stars') return Star;

    const icons = [Heart, Sparkles, Star];
    return icons[index % icons.length];
  };

  const getColor = (index: number) => {
    const colors = ['text-pink-300', 'text-purple-300', 'text-blue-300'];
    return colors[index % colors.length];
  };

  const getPosition = (index: number) => {
    const positions = [
      'top-[10%] left-[5%]',
      'top-[20%] right-[8%]',
      'top-[40%] left-[3%]',
      'top-[60%] right-[5%]',
      'top-[75%] left-[7%]',
      'top-[15%] right-[15%]',
      'top-[50%] left-[12%]',
      'top-[85%] right-[10%]',
    ];
    return positions[index % positions.length];
  };

  const getDelay = (index: number) => {
    return `${index * 0.5}s`;
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, index) => {
        const Icon = getIcon(index);
        const color = getColor(index);
        const position = getPosition(index);
        const delay = getDelay(index);

        return (
          <div
            key={index}
            className={`absolute ${position} opacity-10`}
            style={{
              animation: `float ${6 + index}s ease-in-out infinite`,
              animationDelay: delay,
            }}
          >
            <Icon className={`w-8 h-8 md:w-12 md:h-12 ${color}`} />
          </div>
        );
      })}
    </div>
  );
}
