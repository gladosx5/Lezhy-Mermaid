import { useEffect, useState } from 'react';
import { Heart, Sparkles, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DecorativeSection } from '../components/DecorativeSection';

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
    <DecorativeSection
      decorations={[
        { type: 'emoji', emoji: '🌸', position: { top: '5%', left: '3%' }, size: 'md', opacity: 0.06, delay: 0 },
        { type: 'emoji', emoji: '✨', position: { top: '30%', right: '5%' }, size: 'sm', opacity: 0.08, delay: 1 },
        { type: 'emoji', emoji: '💖', position: { bottom: '10%', left: '8%' }, size: 'md', opacity: 0.07, delay: 2 },
        { type: 'star', position: { top: '50%', right: '3%' }, size: 'sm', opacity: 0.1, delay: 1.5 },
      ]}
    >
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-20 texture-grain">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full mb-4 animate-float-gentle">
              <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Qui suis-je?</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6 text-shadow-glow">
              {content.title || 'À propos'}
            </h1>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12 card-kawaii relative overflow-hidden">
            <div className="absolute top-4 right-4 opacity-10">
              <Heart className="w-20 h-20 text-pink-300 fill-pink-300" />
            </div>
            <div className="flex justify-center mb-8 relative">
              <div className="w-32 h-32 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-full flex items-center justify-center shadow-lg animate-float-gentle">
                <Heart className="w-16 h-16 text-white fill-white" />
              </div>
            </div>

            <div className="absolute top-6 left-6">
              <span className="inline-block bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-xs font-medium badge-kawaii">
                Fait avec amour
              </span>
            </div>

            <div className="prose prose-lg max-w-none relative">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {content.bio || 'Passionnée par l\'univers kawaii, Disney et manga, je crée des tatouages doux et féériques qui racontent votre histoire.'}
              </p>
              <p className="handwritten text-pink-500 text-xl text-center">
                Créer de la magie, un tatouage à la fois
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-3xl shadow-lg p-8 card-kawaii relative overflow-hidden">
              <div className="absolute top-2 right-2 text-2xl opacity-10 animate-float-slow">🌸</div>
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mb-4 animate-float-gentle">
                <Star className="w-7 h-7 text-white fill-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Mon univers</h3>
              <p className="text-gray-600 leading-relaxed">
                Inspirée par le monde kawaii, l'univers Disney, les mangas et la pop culture, je crée des tatouages colorés et doux qui célèbrent la magie du quotidien.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8 card-kawaii relative overflow-hidden">
              <div className="absolute top-2 right-2 text-2xl opacity-10 animate-float-slow">✨</div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mb-4 animate-float-gentle">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Ma philosophie</h3>
              <p className="text-gray-600 leading-relaxed">
                Chaque tatouage est une œuvre unique, créée dans une atmosphère bienveillante et respectueuse. Mon objectif: que vous repartiez avec un tatouage qui vous ressemble vraiment.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl shadow-2xl p-8 md:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-4 left-4 text-4xl opacity-20 animate-float-slow">💫</div>
            <div className="absolute bottom-4 right-4 text-4xl opacity-20 animate-float-slow" style={{ animationDelay: '1s' }}>🌈</div>
            <h3 className="text-3xl font-bold mb-6 relative">Inspirations</h3>
            <div className="flex flex-wrap justify-center gap-3 text-lg relative">
              <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all cursor-pointer badge-kawaii">🌸 Kawaii</span>
              <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all cursor-pointer badge-kawaii">✨ Disney</span>
              <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all cursor-pointer badge-kawaii">🎀 Manga</span>
              <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all cursor-pointer badge-kawaii">💕 Pop Culture</span>
              <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all cursor-pointer badge-kawaii">🧚 Féerie</span>
              <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all cursor-pointer badge-kawaii">🌈 Couleurs Pastels</span>
            </div>
          </div>
        </div>
      </div>
    </DecorativeSection>
  );
}
