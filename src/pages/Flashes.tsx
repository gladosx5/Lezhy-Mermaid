import { useEffect, useMemo, useState } from 'react';
import { Tag, MapPin, Ruler } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { FlashManager } from '../components/admin/FlashManager';
import { supabase } from '../lib/supabase';
import bgPaper from '../image/206b86d0-0557-48d0-b2a5-90e81096dfa7.png';

interface Flash {
  id: string;
  title: string;
  image_url: string;
  description: string | null;
  original_price: number | null;
  promo_price: number | null;
  size: string | null;
  placement: string | null;
  status: string;
  is_featured: boolean;
}

export function Flashes() {
  const { isAdmin } = useAuth();
  const [flashes, setFlashes] = useState<Flash[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlash, setSelectedFlash] = useState<Flash | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadFlashes();
  }, []);

  useEffect(() => {
    if (showAddModal) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return;
  }, [showAddModal]);

  const loadFlashes = async () => {
    const { data } = await supabase
      .from('flashes')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (data) {
      setFlashes(data);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">Disponible</span>;
      case 'reserved':
        return <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">Réservé</span>;
      case 'done':
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">Réalisé</span>;
      default:
        return null;
    }
  };

  const filteredFlashes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return q ? flashes.filter((f) => (f.title || '').toLowerCase().includes(q)) : flashes;
  }, [searchQuery, flashes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Flashs Disponibles
          </h1>
          <p className="text-gray-600 text-lg">Des créations prêtes à être tatouées à prix spécial</p>
          {isAdmin && (
            <div className="mt-6">
              <button onClick={() => setShowAddModal(true)} className="px-4 py-2 mt-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full">Ajouter un flash</button>
            </div>
          )}
        </div>

        {flashes.length > 0 ? (
          <div className="bg-rose-50/80 rounded-3xl p-6 md:p-8 shadow-inner border border-rose-200 relative overflow-hidden" style={{ backgroundImage: `url(${bgPaper})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="mb-6 flex items-center justify-center">
              <div className="w-full max-w-xl">
                <label className="sr-only">Recherche</label>
                <div className="relative">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par titre..."
                    className="w-full border border-rose-200 bg-white/60 placeholder:text-rose-400 rounded-full px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-500 hover:text-rose-700"
                      aria-label="Effacer la recherche"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFlashes.map((flash) => {
                const parts: string[] = [];
                // @ts-ignore
                if ((flash as any).category) parts.push((flash as any).category);
                if (flash.placement) parts.push(flash.placement);
                if (flash.size) parts.push(flash.size);

                return (
                  <div
                    key={flash.id}
                    onClick={() => setSelectedFlash(flash)}
                    className="group bg-transparent rounded-3xl shadow-none cursor-pointer"
                  >
                    <div className="flex items-center justify-center p-6">
                      <div className="w-48 h-48 rounded-full overflow-hidden shadow-xl transform transition-transform group-hover:scale-105">
                        <img src={flash.image_url} alt={flash.title} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="text-center pb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{flash.title}</h3>
                      {flash.size && <p className="text-sm text-gray-600">{flash.size}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 rounded-full mb-4">
              <span className="text-4xl">✨</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun flash disponible</h3>
            <p className="text-gray-600">De nouveaux flashs arrivent bientôt!</p>
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Ajouter / Gérer les flashs</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <FlashManager />
            </div>
          </div>
        )}

        {selectedFlash && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedFlash(null)}
          >
            <div
              className="bg-rose-50/95 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-rose-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <img
                  src={selectedFlash.image_url}
                  alt={selectedFlash.title}
                  className="w-full rounded-2xl mb-6"
                />
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {selectedFlash.title}
                  </h2>
                  {getStatusBadge(selectedFlash.status)}
                </div>
                {selectedFlash.description && (
                  <p className="text-gray-600 mb-6">{selectedFlash.description}</p>
                )}
                <div className="space-y-3 mb-6">
                  {selectedFlash.size && (
                    <div className="flex items-center text-gray-700">
                      <Ruler className="w-5 h-5 mr-3 text-pink-400" />
                      <span>Taille approximative: {selectedFlash.size}</span>
                    </div>
                  )}
                  {selectedFlash.placement && (
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-purple-400" />
                      <span>Emplacement recommandé: {selectedFlash.placement}</span>
                    </div>
                  )}
                </div>
                {(selectedFlash.original_price || selectedFlash.promo_price) && (
                  <div className="flex items-center space-x-4 mb-6">
                    {selectedFlash.original_price && selectedFlash.promo_price && selectedFlash.original_price !== selectedFlash.promo_price ? (
                      <>
                        <span className="text-gray-400 line-through text-2xl">{selectedFlash.original_price}€</span>
                        <span className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                          {selectedFlash.promo_price}€
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                        {selectedFlash.promo_price || selectedFlash.original_price}€
                      </span>
                    )}
                  </div>
                )}
                {selectedFlash.status === 'available' && (
                  <button className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-4 rounded-xl font-medium text-lg hover:shadow-lg transform hover:scale-105 transition-all">
                    Réserver ce flash
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
