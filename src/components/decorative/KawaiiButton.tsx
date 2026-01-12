import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface KawaiiButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  icon?: LucideIcon;
  type?: 'button' | 'submit';
  disabled?: boolean;
  fullWidth?: boolean;
}

export function KawaiiButton({
  children,
  onClick,
  variant = 'primary',
  icon: Icon,
  type = 'button',
  disabled = false,
  fullWidth = false,
}: KawaiiButtonProps) {
  const baseClasses = 'px-8 py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden group';

  const variantClasses = variant === 'primary'
    ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white hover:from-pink-500 hover:via-purple-500 hover:to-blue-500'
    : 'bg-white text-gray-700 border-2 border-pink-200 hover:border-pink-300';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
    >
      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
      <span className="relative z-10 flex items-center space-x-2">
        <span>{children}</span>
        {Icon && <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
      </span>
    </button>
  );
}
