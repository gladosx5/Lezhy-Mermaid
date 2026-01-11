import { useEffect, useState } from 'react';
import { ShoppingBag, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  price: number;
  stock_quantity: number;
  category: string;
  is_available: boolean;
}

export function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = [
    { id: 'all', label: 'Tout', emoji: '✨' },
    { id: 'stickers', label: 'Stickers', emoji: '🌸' },
    { id: 'prints', label: 'Prints', emoji: '🎨' },
    { id: 'goodies', label: 'Goodies', emoji: '💖' },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (data) {
      setProducts(data);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full mb-4">
            <ShoppingBag className="w-5 h-5 text-pink-400" />
            <span className="text-sm font-medium text-gray-700">Stickers, prints & goodies</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Boutique
          </h1>
          <p className="text-gray-600 text-lg">Découvrez mes créations kawaii à emporter partout</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
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

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="aspect-square overflow-hidden bg-pink-50">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>

                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                      {product.price}€
                    </span>
                    {product.stock_quantity > 0 && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        En stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 rounded-full mb-4">
              <Package className="w-10 h-10 text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun produit disponible</h3>
            <p className="text-gray-600">De nouveaux produits arrivent bientôt!</p>
          </div>
        )}

        {selectedProduct && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="aspect-square overflow-hidden rounded-2xl bg-pink-50 mb-6">
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  {selectedProduct.name}
                </h2>

                {selectedProduct.description && (
                  <p className="text-gray-600 mb-6 leading-relaxed">{selectedProduct.description}</p>
                )}

                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {selectedProduct.price}€
                  </span>
                  <span className="px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-medium">
                    {selectedProduct.category}
                  </span>
                </div>

                {selectedProduct.stock_quantity > 0 ? (
                  <>
                    <p className="text-sm text-green-600 mb-4">✓ En stock ({selectedProduct.stock_quantity} disponible{selectedProduct.stock_quantity > 1 ? 's' : ''})</p>
                    <button className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white py-4 rounded-xl font-medium text-lg hover:shadow-lg transform hover:scale-105 transition-all">
                      Commander
                    </button>
                  </>
                ) : (
                  <div className="bg-gray-50 text-gray-600 py-4 rounded-xl text-center font-medium">
                    Rupture de stock
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl shadow-xl p-8 text-white text-center">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Une question sur un produit?</h3>
          <p className="mb-6 text-white/90">
            Contactez-moi sur Instagram ou par email pour toute demande
          </p>
          <button className="bg-white text-pink-600 px-8 py-3 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all">
            Me contacter
          </button>
        </div>
      </div>
    </div>
  );
}
