import { useEffect, useState } from 'react';
import { Heart, Sparkles, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FloatingDecorations } from '../components/decorative/FloatingDecorations';
import { DecorativeSticker } from '../components/decorative/DecorativeSticker';

export function About() {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data } = await supabase
      .from('site_content')
      .select('*')
      .eq('section', 'about');

    if (data) {
      const contentMap: Record<string, string> = {};
      data.forEach((item) => {
        contentMap[item.key] = item.value;
      });
      setContent(contentMap);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-20">
      <FloatingDecorations variant="mixed" density="medium" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-5 h-5 text-pink-400 animate-sparkle" />
            <span className="text-sm font-medium text-gray-700">Qui suis-je?</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
            {content.title || 'À propos'}
          </h1>
          <p className="text-2xl font-handwritten text-pink-500 animate-bounce-slow">
            Laisse-moi te raconter mon histoire
          </p>
        </div>

        <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12">
          <DecorativeSticker emoji="🌸" position="top-left" size="md" rotation={-15} />
          <DecorativeSticker emoji="💖" position="top-right" size="md" rotation={15} />
          <DecorativeSticker emoji="✨" position="bottom-right" size="sm" rotation={-10} />

          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-full flex items-center justify-center shadow-lg animate-float">
              <Heart className="w-16 h-16 text-white fill-white" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center animate-bounce-slow">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {content.bio || 'Passionnée par l\'univers kawaii, Disney et manga, je crée des tatouages doux et féériques qui racontent votre histoire.'}
            </p>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl p-6 my-6">
              <p className="text-xl font-handwritten text-center text-pink-600 m-0">
                Chaque tatouage est créé avec amour et attention
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="relative bg-white rounded-3xl shadow-lg p-8 transform hover:scale-105 transition-transform">
            <DecorativeSticker emoji="🎀" position="top-right" size="sm" rotation={20} />

            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mb-4 animate-float">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Mon univers</h3>
            <p className="text-gray-600 leading-relaxed">
              Inspirée par le monde kawaii, l'univers Disney, les mangas et la pop culture, je crée des tatouages colorés et doux qui célèbrent la magie du quotidien.
            </p>
          </div>

          <div className="relative bg-white rounded-3xl shadow-lg p-8 transform hover:scale-105 transition-transform">
            <DecorativeSticker emoji="💫" position="top-left" size="sm" rotation={-20} />

            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mb-4 animate-float" style={{ animationDelay: '1s' }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Ma philosophie</h3>
            <p className="text-gray-600 leading-relaxed">
              Chaque tatouage est une œuvre unique, créée dans une atmosphère bienveillante et respectueuse. Mon objectif: que vous repartiez avec un tatouage qui vous ressemble vraiment.
            </p>
          </div>
        </div>

        <div className="relative bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl shadow-2xl p-8 md:p-12 text-white text-center overflow-hidden">
          <div className="absolute top-4 left-4 text-4xl animate-float opacity-30">🌸</div>
          <div className="absolute bottom-4 right-4 text-4xl animate-float opacity-30" style={{ animationDelay: '1.5s' }}>💖</div>
          <div className="absolute top-1/2 right-8 text-3xl animate-sparkle opacity-20">✨</div>

          <h3 className="text-3xl font-bold mb-6">Inspirations</h3>
          <p className="text-xl font-handwritten mb-6 text-white/90">
            Ce qui nourrit ma créativité au quotidien
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-lg">
            <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all transform hover:scale-110 cursor-default shadow-lg">🌸 Kawaii</span>
            <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all transform hover:scale-110 cursor-default shadow-lg">✨ Disney</span>
            <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all transform hover:scale-110 cursor-default shadow-lg">🎀 Manga</span>
            <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all transform hover:scale-110 cursor-default shadow-lg">💕 Pop Culture</span>
            <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all transform hover:scale-110 cursor-default shadow-lg">🧚 Féerie</span>
            <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all transform hover:scale-110 cursor-default shadow-lg">🌈 Couleurs Pastels</span>
          </div>
        </div>
      </div>
    </div>
  );
}
