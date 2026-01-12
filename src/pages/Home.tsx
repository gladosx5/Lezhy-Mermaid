import { useEffect, useState } from 'react';
import { Sparkles, Heart, Star, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Reviews } from '../components/Reviews';
import { FloatingDecorations } from '../components/decorative/FloatingDecorations';
import { KawaiiButton } from '../components/decorative/KawaiiButton';

interface SiteContent {
  section: string;
  key: string;
  value: string;
}

interface Tattoo {
  id: string;
  title: string;
  image_url: string;
  category: string;
}

interface HomeProps {
  onNavigate?: (page: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [featuredTattoos, setFeaturedTattoos] = useState<Tattoo[]>([]);

  useEffect(() => {
    loadContent();
    loadFeaturedTattoos();
  }, []);

  const loadContent = async () => {
    const { data } = await supabase
      .from('site_content')
      .select('*')
      .eq('section', 'hero');

    if (data) {
      const contentMap: Record<string, string> = {};
      data.forEach((item: SiteContent) => {
        contentMap[item.key] = item.value;
      });
      setContent(contentMap);
    }
  };

  const loadFeaturedTattoos = async () => {
    const { data } = await supabase
      .from('tattoos')
      .select('id, title, image_url, category')
      .eq('is_featured', true)
      .limit(6);

    if (data) {
      setFeaturedTattoos(data);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 py-20 md:py-32">
        <div className="absolute inset-0 opacity-20 animate-gradient bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200">
          <div className="absolute top-10 left-10 w-20 h-20 bg-pink-300 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-40 right-40 w-24 h-24 bg-blue-300 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <FloatingDecorations variant="mixed" density="medium" />

        <div className="absolute top-20 right-10 animate-float opacity-30">
          <div className="text-6xl md:text-8xl">🌸</div>
        </div>

        <div className="absolute bottom-20 left-10 animate-float opacity-30" style={{ animationDelay: '1s' }}>
          <div className="text-6xl md:text-8xl">💖</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full mb-8 shadow-lg">
            <Sparkles className="w-5 h-5 text-pink-400 animate-sparkle" />
            <span className="text-sm font-medium text-gray-700">Bienvenue dans mon univers magique</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
            {content.title || 'Lézhy Mermaid'}
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium">
            {content.subtitle || 'Tattoo kawaii & féérique'}
          </p>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {content.description || 'Bienvenue dans mon univers pastel et magique'}
          </p>

          <p className="text-2xl md:text-3xl font-handwritten text-pink-500 mb-12 animate-bounce-slow">
            Entre dans mon univers magique
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <KawaiiButton variant="primary" icon={Heart} onClick={() => onNavigate?.('gallery') }>
              Voir la galerie
            </KawaiiButton>
            <KawaiiButton variant="secondary" icon={ArrowRight} onClick={() => onNavigate?.('contact') }>
              Me contacter
            </KawaiiButton>
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-white overflow-hidden">
        <FloatingDecorations variant="hearts" density="low" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-pink-50 px-6 py-3 rounded-full mb-4 shadow-md">
              <Star className="w-5 h-5 text-purple-400 fill-purple-400 animate-sparkle" />
              <span className="text-sm font-medium text-gray-700">Mes créations récentes</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Galerie
            </h2>
          </div>

          {featuredTattoos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {featuredTattoos.map((tattoo, index) => (
                <div
                  key={tattoo.id}
                  className="group relative aspect-square rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg animate-bounce-slow">
                      Nouveau
                    </div>
                  )}

                  <img
                    src={tattoo.image_url}
                    alt={tattoo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-2">
                    <span className="px-3 py-1 bg-white/90 text-pink-600 rounded-full text-xs font-medium shadow-lg select-none pointer-events-none">{tattoo.category}</span>
                    <span className="px-3 py-1 bg-white/80 text-gray-800 rounded-full text-xs font-medium shadow-lg select-none pointer-events-none max-w-[10rem] truncate">{tattoo.title}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-medium">{tattoo.title}</p>
                      <p className="text-white/80 text-sm">{tattoo.category}</p>
                    </div>
                  </div>

                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Star className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-sparkle" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative text-center py-20 bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl border-2 border-pink-200">
              <div className="absolute top-4 right-4 text-4xl animate-bounce-slow">🌸</div>
              <div className="absolute bottom-4 left-4 text-4xl animate-bounce-slow" style={{ animationDelay: '1s' }}>✨</div>

              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mb-4 animate-glow">
                <Heart className="w-10 h-10 text-pink-500 fill-pink-500 animate-bounce-slow" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">Galerie en construction</h3>
              <p className="text-gray-600 mb-4">Bientôt de magnifiques créations ici</p>
              <div className="inline-block bg-white px-4 py-2 rounded-full text-pink-500 font-handwritten text-xl shadow-md">
                Coming soon
              </div>
            </div>
          )}

          <div className="text-center mt-12">
            <KawaiiButton variant="primary" icon={ArrowRight} onClick={() => onNavigate?.('gallery')}>
              Voir toute la galerie
            </KawaiiButton>
          </div>
        </div>
      </section>

      <Reviews />

      <section className="relative py-20 bg-gradient-to-br from-pink-50 to-purple-50 overflow-hidden">
        <FloatingDecorations variant="sparkles" density="low" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="relative w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-float">
                <span className="text-3xl">🌸</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Style Kawaii</h3>
              <p className="text-gray-600">Des créations douces et mignonnes inspirées de l'univers kawaii et pastel</p>
            </div>

            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="relative w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <span className="text-3xl">✨</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Univers Féérique</h3>
              <p className="text-gray-600">Inspirée par Disney, les mangas et la pop culture</p>
            </div>

            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-float" style={{ animationDelay: '2s' }}>
                <span className="text-3xl">💖</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Passion & Créativité</h3>
              <p className="text-gray-600">Chaque tatouage est unique et raconte votre histoire</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
