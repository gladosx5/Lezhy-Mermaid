import { Heart, Instagram, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { isAdmin, signOut, signInAdmin } = useAuth();
  const [logoClickCount, setLogoClickCount] = useState(0);

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'about', label: 'À propos' },
    { id: 'gallery', label: 'Galerie' },
    { id: 'flashes', label: 'Flashs' },
    { id: 'availability', label: 'Disponibilités' },
    { id: 'events', label: 'Événements' },
    { id: 'shop', label: 'Boutique' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => {
              const newCount = logoClickCount + 1;
              setLogoClickCount(newCount);
              if (newCount === 5) {
                try {
                  signInAdmin();
                } catch (error) {
                  console.error('Admin login failed:', error);
                }
                setLogoClickCount(0); // Reset after attempt
              } else {
                onNavigate('home');
              }
            }}
            className="flex items-center space-x-3 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Lézhy Mermaid
              </h1>
              <p className="text-xs text-gray-500">Tattoo kawaii & féérique</p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md'
                    : 'text-gray-600 hover:text-pink-400 hover:bg-pink-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white hover:shadow-lg transition-shadow"
            >
              <Instagram size={20} />
            </a>

            {!isAdmin && (
              <button
                onClick={() => {
                  try {
                    signInAdmin();
                  } catch (e) {
                    console.error('Failed to activate admin:', e);
                  }
                }}
                className="flex items-center space-x-2 px-3 py-2 bg-pink-50 hover:bg-pink-100 rounded-full text-sm font-medium text-pink-600 transition-colors"
              >
                <span>Admin</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={signOut}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
              >
                <LogOut size={16} />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>

        <nav className="lg:hidden flex overflow-x-auto pb-4 -mb-px space-x-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                currentPage === item.id
                  ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md'
                  : 'text-gray-600 hover:text-pink-400 hover:bg-pink-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
