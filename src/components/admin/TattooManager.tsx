import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Tattoo {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  is_featured: boolean;
  price_range: string | null;
}

export function TattooManager() {
  const [tattoos, setTattoos] = useState<Tattoo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'kawaii',
    is_featured: false,
    price_range: '',
  });

  useEffect(() => {
    loadTattoos();
  }, []);

  const loadTattoos = async () => {
    const { data } = await supabase
      .from('tattoos')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setTattoos(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await supabase
        .from('tattoos')
        .update(formData)
        .eq('id', editingId);
    } else {
      await supabase
        .from('tattoos')
        .insert([formData]);
    }

    resetForm();
    loadTattoos();
  };

  const handleEdit = (tattoo: Tattoo) => {
    setEditingId(tattoo.id);
    setFormData({
      title: tattoo.title,
      description: tattoo.description || '',
      image_url: tattoo.image_url,
      category: tattoo.category,
      is_featured: tattoo.is_featured,
      price_range: tattoo.price_range || '',
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce tatouage?')) {
      await supabase.from('tattoos').delete().eq('id', id);
      loadTattoos();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: 'kawaii',
      is_featured: false,
      price_range: '',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Galerie de Tatouages
        </h2>
        <p className="text-gray-600 font-handwritten">Gère tes magnifiques créations</p>
      </div>

      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="mb-6 flex items-center space-x-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter un tatouage</span>
        </button>
      ) : (
        <div className="mb-6 bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {editingId ? 'Modifier' : 'Nouveau'} tatouage
            </h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de l'image
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
                >
                  <option value="kawaii">Kawaii</option>
                  <option value="disney">Disney</option>
                  <option value="manga">Manga</option>
                  <option value="color">Couleur</option>
                  <option value="blackwork">Noir</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fourchette de prix
                </label>
                <input
                  type="text"
                  value={formData.price_range}
                  onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                  placeholder="80-120€"
                  className="w-full px-4 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none"
                />
              </div>
            </div>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-5 h-5 text-pink-500 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Mettre en vedette
              </span>
            </label>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
              >
                {editingId ? 'Mettre à jour' : 'Ajouter'} ✨
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tattoos.map((tattoo) => (
          <div
            key={tattoo.id}
            className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            {tattoo.is_featured && (
              <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center space-x-1">
                <Star className="w-3 h-3 fill-white" />
                <span>Vedette</span>
              </div>
            )}

            <div className="aspect-square overflow-hidden">
              <img
                src={tattoo.image_url}
                alt={tattoo.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{tattoo.title}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{tattoo.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
                  {tattoo.category}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(tattoo)}
                    className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(tattoo.id)}
                    className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
