import { useEffect, useState } from 'react';
import { Heart, Sparkles, Star, Edit3, Save, X as CloseIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FloatingDecorations } from '../components/decorative/FloatingDecorations';
import { DecorativeSticker } from '../components/decorative/DecorativeSticker';
import { useAuth } from '../hooks/useAuth';

export function About() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [inspirations, setInspirations] = useState<string[]>([]);
  const { isAdmin } = useAuth();

  const [editingTitle, setEditingTitle] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [editingCard1, setEditingCard1] = useState(false);
  const [editingCard2, setEditingCard2] = useState(false);
  const [card1Title, setCard1Title] = useState('');
  const [card1Body, setCard1Body] = useState('');
  const [card2Title, setCard2Title] = useState('');
  const [card2Body, setCard2Body] = useState('');

  const [editingInspirations, setEditingInspirations] = useState(false);
  const [inspirationsEditor, setInspirationsEditor] = useState<string[]>([]);

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
      const inspRow = data.find((r: any) => r.key === 'inspirations');
      if (inspRow && inspRow.value) {
        try {
          const parsed = JSON.parse(inspRow.value);
          if (Array.isArray(parsed)) setInspirations(parsed);
        } catch (e) {
          // ignore
        }
      }
    }
  };

  const saveField = async (key: string, value: string) => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'about')
        .eq('key', key)
        .maybeSingle();

      if (error) throw error;

      if (data && data.id) {
        const { error: upErr } = await supabase.from('site_content').update({ value }).eq('id', data.id);
        if (upErr) throw upErr;
      } else {
        const { error: insErr } = await supabase.from('site_content').insert([{ section: 'about', key, value }]);
        if (insErr) throw insErr;
      }

      // refresh local content map
      setContent((c) => ({ ...c, [key]: value }));
    } catch (err) {
      console.error('Failed to save field', key, err);
      // show a simple alert to user in dev; keep app running
      // eslint-disable-next-line no-alert
      alert('Erreur lors de l\'enregistrement — regarde la console pour les détails.');
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
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mr-3">
              {content.title || 'À propos'}
            </h1>
            {isAdmin && !editingTitle && (
              <button onClick={() => { setTitleInput(content.title ?? ''); setEditingTitle(true); }} className="p-2 rounded-full bg-white/60">
                <Edit3 className="w-5 h-5 text-pink-500" />
              </button>
            )}
            {isAdmin && editingTitle && (
              <div className="flex items-center space-x-2">
                <input value={titleInput} onChange={(e) => setTitleInput(e.target.value)} className="px-3 py-2 rounded border" />
                <button onClick={async () => { await saveField('title', titleInput); setEditingTitle(false); }} className="p-2 rounded-full bg-green-100"><Save className="w-4 h-4" /></button>
                <button onClick={() => setEditingTitle(false)} className="p-2 rounded-full bg-red-100"><CloseIcon className="w-4 h-4" /></button>
              </div>
            )}
          </div>
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
            <div className="flex items-start">
              <p className="text-gray-700 text-lg leading-relaxed mb-6 mr-3">
                {content.bio || 'Passionnée par l\'univers kawaii, Disney et manga, je crée des tatouages doux et féériques qui racontent votre histoire.'}
              </p>
              {isAdmin && !editingBio && (
                <button onClick={() => { setBioInput(content.bio ?? ''); setEditingBio(true); }} className="p-2 rounded-full bg-white/60">
                  <Edit3 className="w-5 h-5 text-pink-500" />
                </button>
              )}
              {isAdmin && editingBio && (
                <div className="flex items-center space-x-2">
                  <input value={bioInput} onChange={(e) => setBioInput(e.target.value)} className="px-3 py-2 rounded border" />
                  <button onClick={async () => { await saveField('bio', bioInput); setEditingBio(false); }} className="p-2 rounded-full bg-green-100"><Save className="w-4 h-4" /></button>
                  <button onClick={() => setEditingBio(false)} className="p-2 rounded-full bg-red-100"><CloseIcon className="w-4 h-4" /></button>
                </div>
              )}
            </div>

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
            <div className="flex items-start justify-between">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{content.card_univers_title || 'Mon univers'}</h3>
              {isAdmin && !editingCard1 && (
                <button onClick={() => { setCard1Title(content.card_univers_title ?? 'Mon univers'); setCard1Body(content.card_univers_body ?? 'Inspirée par le monde kawaii, l\'univers Disney, les mangas et la pop culture, je crée des tatouages colorés et doux qui célèbrent la magie du quotidien.'); setEditingCard1(true); }} className="p-2 rounded-full bg-white/60">
                  <Edit3 className="w-5 h-5 text-pink-500" />
                </button>
              )}
            </div>
            {!editingCard1 && (
              <p className="text-gray-600 leading-relaxed">{content.card_univers_body || 'Inspirée par le monde kawaii, l\'univers Disney, les mangas et la pop culture, je crée des tatouages colorés et doux qui célèbrent la magie du quotidien.'}</p>
            )}
            {editingCard1 && (
              <div className="space-y-2">
                <input value={card1Title} onChange={(e) => setCard1Title(e.target.value)} className="w-full px-3 py-2 rounded border" />
                <textarea value={card1Body} onChange={(e) => setCard1Body(e.target.value)} className="w-full px-3 py-2 rounded border" />
                <div className="flex space-x-2">
                  <button onClick={async () => { await saveField('card_univers_title', card1Title); await saveField('card_univers_body', card1Body); setEditingCard1(false); }} className="px-4 py-2 bg-green-100 rounded">Enregistrer</button>
                  <button onClick={() => setEditingCard1(false)} className="px-4 py-2 bg-red-100 rounded">Annuler</button>
                </div>
              </div>
            )}
          </div>

          <div className="relative bg-white rounded-3xl shadow-lg p-8 transform hover:scale-105 transition-transform">
            <DecorativeSticker emoji="💫" position="top-left" size="sm" rotation={-20} />

            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mb-4 animate-float" style={{ animationDelay: '1s' }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-start justify-between">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{content.card_philosophie_title || 'Ma philosophie'}</h3>
              {isAdmin && !editingCard2 && (
                <button onClick={() => { setCard2Title(content.card_philosophie_title ?? 'Ma philosophie'); setCard2Body(content.card_philosophie_body ?? 'Chaque tatouage est une œuvre unique, créée dans une atmosphère bienveillante et respectueuse. Mon objectif: que vous repartiez avec un tatouage qui vous ressemble vraiment.'); setEditingCard2(true); }} className="p-2 rounded-full bg-white/60">
                  <Edit3 className="w-5 h-5 text-pink-500" />
                </button>
              )}
            </div>
            {!editingCard2 && (
              <p className="text-gray-600 leading-relaxed">{content.card_philosophie_body || 'Chaque tatouage est une œuvre unique, créée dans une atmosphère bienveillante et respectueuse. Mon objectif: que vous repartiez avec un tatouage qui vous ressemble vraiment.'}</p>
            )}
            {editingCard2 && (
              <div className="space-y-2">
                <input value={card2Title} onChange={(e) => setCard2Title(e.target.value)} className="w-full px-3 py-2 rounded border" />
                <textarea value={card2Body} onChange={(e) => setCard2Body(e.target.value)} className="w-full px-3 py-2 rounded border" />
                <div className="flex space-x-2">
                  <button onClick={async () => { await saveField('card_philosophie_title', card2Title); await saveField('card_philosophie_body', card2Body); setEditingCard2(false); }} className="px-4 py-2 bg-green-100 rounded">Enregistrer</button>
                  <button onClick={() => setEditingCard2(false)} className="px-4 py-2 bg-red-100 rounded">Annuler</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl shadow-2xl p-8 md:p-12 text-white text-center overflow-hidden">
          <div className="absolute top-4 left-4 text-4xl animate-float opacity-30">🌸</div>
          <div className="absolute bottom-4 right-4 text-4xl animate-float opacity-30" style={{ animationDelay: '1.5s' }}>💖</div>
          <div className="absolute top-1/2 right-8 text-3xl animate-sparkle opacity-20">✨</div>

          <div className="flex items-center justify-center mb-4">
            <h3 className="text-3xl font-bold mb-6">Inspirations</h3>
            {isAdmin && !editingInspirations && (
              <button onClick={() => { setInspirationsEditor(inspirations.length ? inspirations : ['🌸 Kawaii','✨ Disney','🎀 Manga','💕 Pop Culture','🧚 Féerie','🌈 Couleurs Pastals']); setEditingInspirations(true); }} className="ml-3 p-2 rounded-full bg-white/30">
                <Edit3 className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
          <p className="text-xl font-handwritten mb-6 text-white/90">
            Ce qui nourrit ma créativité au quotidien
          </p>
          <div className="flex flex-col items-center gap-4 text-lg">
            {!editingInspirations && (
              <div className="flex flex-wrap justify-center gap-4">
                {(inspirations.length ? inspirations : [
                  '🌸 Kawaii',
                  '✨ Disney',
                  '🎀 Manga',
                  '💕 Pop Culture',
                  '🧚 Féerie',
                  '🌈 Couleurs Pastals',
                ]).map((p, i) => (
                  <span key={i} className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all transform hover:scale-110 cursor-default shadow-lg">{p}</span>
                ))}
              </div>
            )}

            {editingInspirations && (
              <div className="w-full max-w-2xl bg-white/10 p-4 rounded space-y-3">
                {inspirationsEditor.map((pill, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input value={pill} onChange={(e) => setInspirationsEditor((s) => s.map((it, i) => i === idx ? e.target.value : it))} className="flex-1 px-3 py-2 rounded border border-gray-300 bg-white text-gray-900" />
                    <div className="flex items-center space-x-1">
                      <button onClick={() => setInspirationsEditor((s) => { const arr = [...s]; if (idx>0){ [arr[idx-1], arr[idx]] = [arr[idx], arr[idx-1]] } return arr; })} className="px-2 py-1 bg-gray-100 rounded">↑</button>
                      <button onClick={() => setInspirationsEditor((s) => { const arr = [...s]; if (idx < arr.length-1){ [arr[idx+1], arr[idx]] = [arr[idx], arr[idx+1]] } return arr; })} className="px-2 py-1 bg-gray-100 rounded">↓</button>
                      <button onClick={() => setInspirationsEditor((s) => s.filter((_,i)=>i!==idx))} className="px-2 py-1 bg-red-100 rounded">✕</button>
                    </div>
                  </div>
                ))}

                <div className="flex space-x-2">
                  <button onClick={() => setInspirationsEditor((s) => [...s, 'Nouvelle inspiration'])} className="px-4 py-2 bg-green-100 rounded">Ajouter</button>
                  <button onClick={async () => { try { await saveField('inspirations', JSON.stringify(inspirationsEditor)); setInspirations(inspirationsEditor); setEditingInspirations(false); } catch (e) { console.error(e); alert('Erreur lors de l\'enregistrement'); } }} className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded">Enregistrer</button>
                  <button onClick={() => setEditingInspirations(false)} className="px-4 py-2 bg-red-100 rounded">Annuler</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
