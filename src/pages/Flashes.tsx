import { useEffect, useState } from 'react';
import { Tag, MapPin, Ruler } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  const [flashes, setFlashes] = useState<Flash[]>([]);
  const [selectedFlash, setSelectedFlash] = useState<Flash | null>(null);

  useEffect(() => {
    loadFlashes();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Flashs Disponibles
          </h1>
          <p className="text-gray-600 text-lg">Des créations prêtes à être tatouées à prix spécial</p>
        </div>

        {flashes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashes.map((flash) => (
              <div
                key={flash.id}
                onClick={() => setSelectedFlash(flash)}
                className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
              >
                {flash.is_featured && (
                  <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    ⭐ Coup de cœur
                  </div>
                )}

                <div className="relative aspect-square">
                  <img
                    src={flash.image_url}
                    alt={flash.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(flash.status)}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{flash.title}</h3>

                  {flash.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{flash.description}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    {flash.size && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Ruler className="w-4 h-4 mr-2 text-pink-400" />
                        <span>Taille: {flash.size}</span>
                      </div>
                    )}
                    {flash.placement && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                        <span>Emplacement: {flash.placement}</span>
                      </div>
                    )}
                  </div>

                  {(flash.original_price || flash.promo_price) && (
                    <div className="flex items-center space-x-3">
                      {flash.original_price && flash.promo_price && flash.original_price !== flash.promo_price ? (
                        <>
                          <span className="text-gray-400 line-through text-lg">{flash.original_price}€</span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                            {flash.promo_price}€
                          </span>
                          <Tag className="w-5 h-5 text-pink-400" />
                        </>
                      ) : (
                        <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                          {flash.promo_price || flash.original_price}€
                        </span>
                      )}
                    </div>
                  )}

                  {flash.status === 'available' && (
                    <button className="w-full mt-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all">
                      Je veux ce flash
                    </button>
                  )}
                </div>
              </div>
            ))}
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

        {selectedFlash && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedFlash(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
