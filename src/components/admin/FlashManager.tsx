import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function FlashManager() {
  const [flashes, setFlashes] = useState<any[]>([]);

  useEffect(() => {
    loadFlashes();
  }, []);

  const loadFlashes = async () => {
    const { data } = await supabase
      .from('flashes')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setFlashes(data);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
        Gestion des Flashs
      </h2>
      <button className="mb-6 flex items-center space-x-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg">
        <Plus className="w-5 h-5" />
        <span>Ajouter un flash</span>
      </button>
      <div className="grid md:grid-cols-3 gap-4">
        {flashes.map((flash) => (
          <div key={flash.id} className="bg-white rounded-2xl shadow-lg p-4">
            <img src={flash.image_url} alt={flash.title} className="w-full h-40 object-cover rounded-xl mb-3" />
            <h3 className="font-bold">{flash.title}</h3>
            <p className="text-sm text-gray-600">{flash.promo_price || flash.original_price}€</p>
          </div>
        ))}
      </div>
    </div>
  );
}
