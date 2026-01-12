import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function ContentManager() {
  const [content, setContent] = useState<any[]>([]);
  const [inspirations, setInspirations] = useState<string[]>([]);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data } = await supabase
      .from('site_content')
      .select('*')
      .order('section');
    if (data) setContent(data);
    // load inspirations if present
    const inspRow = data?.find((r: any) => r.section === 'about' && r.key === 'inspirations');
    if (inspRow && inspRow.value) {
      try {
        const parsed = JSON.parse(inspRow.value);
        if (Array.isArray(parsed)) setInspirations(parsed);
      } catch (e) {
        // ignore parse errors
      }
    }
  };

  const updateContent = async (id: string, value: string) => {
    await supabase
      .from('site_content')
      .update({ value })
      .eq('id', id);
  };

  const saveInspirations = async () => {
    const { data } = await supabase
      .from('site_content')
      .select('*')
      .eq('section', 'about')
      .eq('key', 'inspirations')
      .limit(1)
      .single();

    const value = JSON.stringify(inspirations);
    if (data && data.id) {
      await supabase.from('site_content').update({ value }).eq('id', data.id);
    } else {
      await supabase.from('site_content').insert([{ section: 'about', key: 'inspirations', value }]);
    }
  };

  const addInspiration = () => setInspirations((s) => [...s, 'Nouvelle inspiration']);
  const updateInspiration = (index: number, value: string) => setInspirations((s) => s.map((it, i) => (i === index ? value : it)));
  const removeInspiration = (index: number) => setInspirations((s) => s.filter((_, i) => i !== index));
  const moveInspiration = (index: number, dir: -1 | 1) => {
    setInspirations((s) => {
      const arr = [...s];
      const to = index + dir;
      if (to < 0 || to >= arr.length) return s;
      const tmp = arr[to];
      arr[to] = arr[index];
      arr[index] = tmp;
      return arr;
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
        Gestion du Contenu
      </h2>
      <div className="space-y-4">
        {content.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {item.section} - {item.key}
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                defaultValue={item.value}
                onBlur={(e) => updateContent(item.id, e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl hover:shadow-lg transition-all">
                <Save className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-medium mb-3">Inspirations (pills)</h3>
          <div className="space-y-2">
            {inspirations.map((pill, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input
                  value={pill}
                  onChange={(e) => updateInspiration(idx, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400"
                />
                <div className="flex items-center space-x-1">
                  <button onClick={() => moveInspiration(idx, -1)} className="px-2 py-1 bg-gray-100 rounded">↑</button>
                  <button onClick={() => moveInspiration(idx, 1)} className="px-2 py-1 bg-gray-100 rounded">↓</button>
                  <button onClick={() => removeInspiration(idx)} className="px-2 py-1 bg-red-100 rounded">✕</button>
                </div>
              </div>
            ))}
            <div className="flex space-x-2 mt-3">
              <button onClick={addInspiration} className="px-4 py-2 bg-green-100 rounded-xl">Ajouter</button>
              <button onClick={saveInspirations} className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl">Enregistrer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
