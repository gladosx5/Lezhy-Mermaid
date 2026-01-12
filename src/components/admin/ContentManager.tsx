import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function ContentManager() {
  const [content, setContent] = useState<any[]>([]);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const { data } = await supabase
      .from('site_content')
      .select('*')
      .order('section');
    if (data) setContent(data);
  };

  const updateContent = async (id: string, value: string) => {
    await supabase
      .from('site_content')
      .update({ value })
      .eq('id', id);
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
      </div>
    </div>
  );
}
