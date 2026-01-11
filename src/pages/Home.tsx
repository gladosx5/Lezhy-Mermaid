import { useEffect, useState } from 'react';
import { Sparkles, Heart, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Reviews } from '../components/Reviews';

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
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 py-20 md:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-pink-300 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-40 right-40 w-24 h-24 bg-blue-300 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span className="text-sm font-medium text-gray-700">Bienvenue dans mon univers magique</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            {content.title || 'Lézhy Mermaid'}
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium">
            {content.subtitle || 'Tattoo kawaii & féérique'}
          </p>

          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            {content.description || 'Bienvenue dans mon univers pastel et magique'}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="group bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white px-8 py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
              Voir la galerie
              <Heart className="inline-block ml-2 w-5 h-5 group-hover:fill-white transition-all" />
            </button>
            <button className="bg-white text-gray-700 px-8 py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all border-2 border-pink-200">
              Me contacter
            </button>
          </div>
        </div>
      </section>

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
                  className="group relative aspect-square rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                >
                  <img
                    src={tattoo.image_url}
                    alt={tattoo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
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
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
                <Heart className="w-8 h-8 text-pink-400" />
              </div>
              <p className="text-gray-500">Bientôt de magnifiques créations ici!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
              Voir toute la galerie
            </button>
          </div>
        </div>
      </section>

      <Reviews />

      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">🌸</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Style Kawaii</h3>
              <p className="text-gray-600">Des créations douces et mignonnes inspirées de l'univers kawaii et pastel</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Univers Féérique</h3>
              <p className="text-gray-600">Inspirée par Disney, les mangas et la pop culture</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">💖</span>
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
