interface DecorativeStickerProps {
  emoji: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'sm' | 'md' | 'lg';
  rotation?: number;
  animate?: boolean;
}

export function DecorativeSticker({
  emoji,
  position,
  size = 'md',
  rotation = 0,
  animate = true,
}: DecorativeStickerProps) {
  const positionClasses = {
    'top-left': '-top-3 -left-3',
    'top-right': '-top-3 -right-3',
    'bottom-left': '-bottom-3 -left-3',
    'bottom-right': '-bottom-3 -right-3',
  };

  const sizeClasses = {
    sm: 'text-2xl w-10 h-10',
    md: 'text-3xl w-14 h-14',
    lg: 'text-4xl w-16 h-16',
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} ${sizeClasses[size]} bg-white rounded-full shadow-lg flex items-center justify-center z-10 ${animate ? 'animate-bounce-slow' : ''}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <span className="block">{emoji}</span>
    </div>
  );
}
