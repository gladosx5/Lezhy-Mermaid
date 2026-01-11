import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface MagicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  icon?: LucideIcon;
  iconEmoji?: string;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export function MagicButton({
  children,
  onClick,
  variant = 'primary',
  icon: Icon,
  iconEmoji,
  className = '',
  type = 'button',
  disabled = false,
}: MagicButtonProps) {
  const baseClasses = 'group relative px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white shadow-lg hover:shadow-2xl hover:shadow-pink-300/50',
    secondary: 'bg-white text-gray-700 shadow-lg hover:shadow-2xl border-2 border-pink-200 hover:border-pink-300',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <span className="flex items-center justify-center space-x-2">
        <span>{children}</span>
        {Icon && <Icon className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
        {iconEmoji && (
          <span className="inline-block group-hover:scale-125 transition-transform">
            {iconEmoji}
          </span>
        )}
      </span>
      <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping-slow pointer-events-none" />
    </button>
  );
}
