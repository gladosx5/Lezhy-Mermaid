import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Tattoo {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  price_range: string | null;
}

export function Gallery() {
  const [tattoos, setTattoos] = useState<Tattoo[]>([]);
  const [filteredTattoos, setFilteredTattoos] = useState<Tattoo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTattoo, setSelectedTattoo] = useState<Tattoo | null>(null);

  const categories = [
    { id: 'all', label: 'Tout', emoji: '✨' },
    { id: 'kawaii', label: 'Kawaii', emoji: '🌸' },
    { id: 'disney', label: 'Disney', emoji: '🏰' },
    { id: 'manga', label: 'Manga', emoji: '🎌' },
    { id: 'color', label: 'Couleur', emoji: '🎨' },
    { id: 'blackwork', label: 'Noir', emoji: '🖤' },
  ];

  useEffect(() => {
    loadTattoos();
  }, []);

  useEffect(() => {
    filterTattoos();
  }, [tattoos, selectedCategory, searchQuery]);

  const loadTattoos = async () => {
    const { data } = await supabase
      .from('tattoos')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setTattoos(data);
    }
  };

  const filterTattoos = () => {
    let filtered = tattoos;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTattoos(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Galerie
          </h1>
          <p className="text-gray-600 text-lg">Découvrez mes créations kawaii et féériques</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <span className="text-sm font-medium text-gray-600">Filtrer:</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md'
                    : 'bg-pink-50 text-gray-700 hover:bg-pink-100'
                }`}
              >
                <span className="mr-2">{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {filteredTattoos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredTattoos.map((tattoo) => (
              <div
                key={tattoo.id}
                onClick={() => setSelectedTattoo(tattoo)}
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
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 rounded-full mb-4">
              <span className="text-4xl">💫</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun tatouage trouvé</h3>
            <p className="text-gray-600">Essayez un autre filtre ou une autre recherche</p>
          </div>
        )}

        {selectedTattoo && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTattoo(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <img
                  src={selectedTattoo.image_url}
                  alt={selectedTattoo.title}
                  className="w-full rounded-2xl mb-6"
                />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  {selectedTattoo.title}
                </h2>
                {selectedTattoo.description && (
                  <p className="text-gray-600 mb-4">{selectedTattoo.description}</p>
                )}
                <div className="flex items-center space-x-4">
                  <span className="px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-medium">
                    {selectedTattoo.category}
                  </span>
                  {selectedTattoo.price_range && (
                    <span className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                      {selectedTattoo.price_range}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
