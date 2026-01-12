import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function ProductManager() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
        Gestion de la Boutique
      </h2>
      <button className="mb-6 flex items-center space-x-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg">
        <Plus className="w-5 h-5" />
        <span>Ajouter un produit</span>
      </button>
      <div className="grid md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-lg p-4">
            <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover rounded-xl mb-3" />
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.price}€</p>
          </div>
        ))}
      </div>
    </div>
  );
}
