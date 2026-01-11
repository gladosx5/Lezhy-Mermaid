import { ReactNode } from 'react';
import { FloatingDecor, FloatingSticker } from './FloatingDecor';

interface DecorativeSectionProps {
  children: ReactNode;
  className?: string;
  decorations?: Array<{
    type: 'heart' | 'sparkle' | 'star' | 'emoji';
    emoji?: string;
    position: { top?: string; bottom?: string; left?: string; right?: string };
    size?: 'sm' | 'md' | 'lg';
    opacity?: number;
    delay?: number;
  }>;
}

export function DecorativeSection({
  children,
  className = '',
  decorations = [],
}: DecorativeSectionProps) {
  return (
    <div className={`relative ${className}`}>
      {decorations.map((decor, index) => (
        decor.type === 'emoji' ? (
          <FloatingSticker
            key={index}
            emoji={decor.emoji || '✨'}
            position={decor.position}
            size={decor.size}
            opacity={decor.opacity}
            delay={decor.delay}
          />
        ) : (
          <FloatingDecor
            key={index}
            type={decor.type}
            position={decor.position}
            size={decor.size}
            opacity={decor.opacity}
            delay={decor.delay}
          />
        )
      ))}
      {children}
    </div>
  );
}
