import { useEffect, useState } from 'react';
import { Sparkles, Heart, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Reviews } from '../components/Reviews';
import { DecorativeSection } from '../components/DecorativeSection';
import { MagicButton } from '../components/MagicButton';

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

export function Home() {
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
      <DecorativeSection
        decorations={[
          { type: 'emoji', emoji: '🌸', position: { top: '10%', left: '5%' }, size: 'lg', opacity: 0.08, delay: 0 },
          { type: 'emoji', emoji: '✨', position: { top: '20%', right: '8%' }, size: 'md', opacity: 0.1, delay: 2 },
          { type: 'emoji', emoji: '💖', position: { bottom: '15%', left: '10%' }, size: 'md', opacity: 0.08, delay: 1 },
          { type: 'emoji', emoji: '🦋', position: { top: '40%', right: '5%' }, size: 'sm', opacity: 0.06, delay: 3 },
          { type: 'heart', position: { top: '60%', left: '3%' }, size: 'sm', opacity: 0.1, delay: 1.5 },
          { type: 'sparkle', position: { bottom: '20%', right: '12%' }, size: 'sm', opacity: 0.08, delay: 2.5 },
        ]}
      >
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 py-20 md:py-32 texture-grain">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-20 h-20 bg-pink-300 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-40 right-40 w-24 h-24 bg-blue-300 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full mb-8 animate-float-gentle">
              <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Bienvenue dans mon univers magique</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent text-shadow-glow">
              {content.title || 'Lézhy Mermaid'}
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium">
              {content.subtitle || 'Tattoo kawaii & féérique'}
            </p>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {content.description || 'Bienvenue dans mon univers pastel et magique'}
            </p>

            <p className="handwritten text-pink-500 text-xl mb-12 animate-float-gentle">
              Entre dans mon univers
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <MagicButton variant="primary" iconEmoji="💖">
                Voir la galerie
              </MagicButton>
              <MagicButton variant="secondary" iconEmoji="✨">
                Me contacter
              </MagicButton>
            </div>
          </div>
        </section>
      </DecorativeSection>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-pink-50 px-6 py-3 rounded-full mb-4">
              <Star className="w-5 h-5 text-purple-400 fill-purple-400" />
              <span className="text-sm font-medium text-gray-700">Mes créations récentes</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Galerie
            </h2>
          </div>

          {featuredTattoos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {featuredTattoos.map((tattoo) => (
                <div
                  key={tattoo.id}
                  className="group relative aspect-square rounded-3xl overflow-hidden shadow-lg card-kawaii cursor-pointer"
                >
                  <img
                    src={tattoo.image_url}
                    alt={tattoo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-6 h-6 text-pink-400 fill-pink-400 animate-pulse" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-medium">{tattoo.title}</p>
                      <p className="text-white/80 text-sm">{tattoo.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl border-2 border-pink-200 border-dashed">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 rounded-full mb-4 animate-float-gentle">
                <Heart className="w-10 h-10 text-pink-400 fill-pink-400 animate-pulse" />
              </div>
              <p className="text-gray-700 font-medium text-lg mb-2">Bientôt de magnifiques créations ici</p>
              <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span className="text-sm text-gray-600">En cours de création</span>
              </div>
            </div>
          )}

          <div className="text-center mt-12">
            <MagicButton variant="primary" iconEmoji="✨">
              Voir toute la galerie
            </MagicButton>
          </div>
        </div>
      </section>

      <Reviews />

      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50 texture-grain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-3xl p-8 shadow-lg card-kawaii">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-float-gentle">
                <span className="text-4xl">🌸</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Style Kawaii</h3>
              <p className="text-gray-600">Des créations douces et mignonnes inspirées de l'univers kawaii et pastel</p>
            </div>

            <div className="text-center bg-white rounded-3xl p-8 shadow-lg card-kawaii" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-float-gentle">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Univers Féérique</h3>
              <p className="text-gray-600">Inspirée par Disney, les mangas et la pop culture</p>
            </div>

            <div className="text-center bg-white rounded-3xl p-8 shadow-lg card-kawaii" style={{ animationDelay: '0.4s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-float-gentle">
                <span className="text-4xl">💖</span>
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
