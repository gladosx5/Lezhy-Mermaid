import { useState } from 'react';
import { Heart, Instagram, Mail, Sparkles } from 'lucide-react';
import { FloatingDecorations } from './decorative/FloatingDecorations';

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
    <footer className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 border-t-2 border-pink-200 overflow-hidden">
      <FloatingDecorations variant="hearts" density="low" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-3 group mb-4"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl animate-float">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Lézhy Mermaid
                </h3>
                <p className="text-xs text-gray-500">Tattoo kawaii & féérique</p>
              </div>
            </button>
            <p className="text-sm text-gray-600 mb-4">
              Bienvenue dans mon univers pastel et magique où chaque tatouage raconte une histoire unique.
            </p>
            <p className="text-lg font-handwritten text-pink-500 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 animate-sparkle" />
              <span>Créé avec amour</span>
              <Sparkles className="w-4 h-4 animate-sparkle" />
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
                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all animate-float"
              >
                <Instagram size={20} />
              </a>
              <a
                href="mailto:contact@lezhymermaid.com"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all animate-float"
                style={{ animationDelay: '0.5s' }}
              >
                <Mail size={20} />
              </a>
            </div>
            <p className="text-sm text-gray-600">
              Pour toute demande de rendez-vous ou question, n'hésitez pas à me contacter!
            </p>
          </div>
        </div>

        <div className="border-t-2 border-pink-200 pt-8 text-center">
          <p className="text-lg font-handwritten text-pink-500 mb-2">
            Merci de faire partie de mon univers magique
          </p>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Lézhy Mermaid Tattoo. Tous droits réservés. ✨
          </p>
        </div>
      </div>
    </footer>
  );
}
