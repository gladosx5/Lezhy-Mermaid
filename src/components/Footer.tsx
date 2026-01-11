import { useState } from 'react';
import { Heart, Instagram, Mail, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenAdminLogin: () => void;
}

export function Footer({ onOpenAdminLogin }: FooterProps) {
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount + 1 === 5) {
      onOpenAdminLogin();
      setClickCount(0);
    }
    setTimeout(() => setClickCount(0), 3000);
  };

  return (
    <footer className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 border-t border-pink-100 texture-grain overflow-hidden">
      <div className="absolute top-4 right-4 text-6xl opacity-5 animate-float-slow">🌸</div>
      <div className="absolute bottom-4 left-4 text-5xl opacity-5 animate-float-slow" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute top-1/2 left-1/4 text-4xl opacity-5 animate-float-slow" style={{ animationDelay: '2s' }}>💖</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="text-center mb-12">
          <p className="handwritten text-pink-500 text-2xl md:text-3xl mb-2 animate-float-gentle">
            Créer de la magie, ensemble
          </p>
          <div className="flex justify-center space-x-2">
            <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-3 group mb-4"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-full flex items-center justify-center shadow-lg animate-float-gentle group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 text-white fill-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Lézhy Mermaid
                </h3>
                <p className="text-xs text-gray-500">Tattoo kawaii & féérique</p>
              </div>
            </button>
            <p className="text-sm text-gray-600 leading-relaxed">
              Bienvenue dans mon univers pastel et magique où chaque tatouage raconte une histoire unique.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>À propos</li>
              <li>Galerie</li>
              <li>Flashs disponibles</li>
              <li>Disponibilités</li>
              <li>Événements</li>
              <li>Boutique</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Suivez-moi</h4>
            <div className="flex space-x-3 mb-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white hover:shadow-xl transition-all transform hover:scale-110 animate-float-gentle"
              >
                <Instagram size={22} />
              </a>
              <a
                href="mailto:contact@lezhymermaid.com"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white hover:shadow-xl transition-all transform hover:scale-110 animate-float-gentle"
                style={{ animationDelay: '0.5s' }}
              >
                <Mail size={22} />
              </a>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Pour toute demande de rendez-vous ou question, n'hésitez pas à me contacter!
            </p>
          </div>
        </div>

        <div className="border-t border-pink-200 pt-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full mb-4">
              <span className="text-sm text-gray-600">
                © {new Date().getFullYear()} Lézhy Mermaid Tattoo
              </span>
              <span className="text-pink-400">•</span>
              <span className="text-sm text-gray-600">Tous droits réservés</span>
            </div>
            <p className="text-xs text-gray-400">Fait avec amour et magie</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
