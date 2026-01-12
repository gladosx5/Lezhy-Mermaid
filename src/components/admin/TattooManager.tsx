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

interface TattooManagerProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function TattooManager({ forceOpen = false, onClose }: TattooManagerProps) {
  const [tattoos, setTattoos] = useState<Tattoo[]>([]);
  const [inspirations, setInspirations] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(!!forceOpen);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'kawaii',
    is_featured: false,
    price_range: '',
  });

  // tag input helper: keep a separate tag state so it's easy to add new tag
  const [tagInput, setTagInput] = useState('kawaii');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [displayDate, setDisplayDate] = useState<string>('');

  useEffect(() => {
    loadTattoos();
    loadInspirations();
    if (forceOpen) setIsEditing(true);
  }, []);

  const loadTattoos = async () => {
    const { data } = await supabase
      .from('tattoos')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setTattoos(data);
  };

  const loadInspirations = async () => {
    const { data } = await supabase
      .from('site_content')
      .select('*')
      .eq('section', 'about')
      .eq('key', 'inspirations')
      .maybeSingle();

    if (data && data.value) {
      try {
        const parsed = JSON.parse(data.value);
        if (Array.isArray(parsed)) setInspirations(parsed);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Save tattoo (category will be used as tag)
    try {
      let imageUrl = formData.image_url;

      // if a file was selected, upload it to Supabase Storage
      if (selectedFile) {
        const ext = selectedFile.name.split('.').pop();
        const filename = (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
          ? (crypto as any).randomUUID() + '.' + ext
          : `${Date.now()}.${ext}`;

        const path = `tattoos/${filename}`;
        const { error: uploadError } = await supabase.storage.from('tattoos').upload(path, selectedFile);
        if (uploadError) throw uploadError;

        // get public url
        const { data: urlData } = supabase.storage.from('tattoos').getPublicUrl(path);
        // getPublicUrl returns { data: { publicUrl } } or { data: { publicURL } }
        imageUrl = (urlData as any).publicUrl || (urlData as any).publicURL || '';
      }

      // append displayDate into description (safe storage without DB schema change)
      let finalDescription = formData.description || '';
      if (displayDate) {
        finalDescription = `${finalDescription}${finalDescription ? '\n\n' : ''}Date: ${displayDate}`;
      }

      const payload: any = {
        title: formData.title,
        description: finalDescription || null,
        image_url: imageUrl,
        category: formData.category,
        is_featured: formData.is_featured,
        price_range: formData.price_range || null,
      };

      if (editingId) {
        await supabase.from('tattoos').update(payload).eq('id', editingId);
      } else {
        await supabase.from('tattoos').insert([payload]);
      }
    } catch (err) {
      console.error('Failed to save tattoo', err);
      // eslint-disable-next-line no-alert
      alert('Erreur lors de l\'enregistrement du tatouage. Voir la console.');
      return;
    }

    // if the selected tag/category is new, append to inspirations pills
    const tag = formData.category?.trim();
    if (tag) {
      const normalized = tag;
      if (!inspirations.includes(normalized)) {
        const next = [...inspirations, normalized];
        try {
          // upsert inspirations into site_content
          const { data } = await supabase
            .from('site_content')
            .select('*')
            .eq('section', 'about')
            .eq('key', 'inspirations')
            .maybeSingle();

          if (data && data.id) {
            await supabase.from('site_content').update({ value: JSON.stringify(next) }).eq('id', data.id);
          } else {
            await supabase.from('site_content').insert([{ section: 'about', key: 'inspirations', value: JSON.stringify(next) }]);
          }
          setInspirations(next);
        } catch (e) {
          console.error('Failed to update inspirations', e);
        }
      }
    }

    resetForm();
    loadTattoos();
    if (forceOpen && onClose) onClose();
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
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setSelectedFile(f);
                  if (f) setPreviewUrl(URL.createObjectURL(f));
                }}
                className="w-full"
                required={!editingId}
              />
              {previewUrl && (
                <img src={previewUrl} alt="preview" className="mt-3 max-h-48 object-cover rounded" />
              )}
              {formData.image_url && !previewUrl && (
                <img src={formData.image_url} alt="preview" className="mt-3 max-h-48 object-cover rounded" />
              )}
              <p className="text-xs text-gray-500 mt-1">Tu peux uploader une image locale; elle sera stockée dans Supabase Storage.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input type="date" value={displayDate} onChange={(e) => setDisplayDate(e.target.value)} className="px-4 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400" />
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
                    {inspirations.length > 0 ? (
                      inspirations.map((t) => <option key={t} value={t}>{t}</option>)
                    ) : (
                      <>
                        <option value="kawaii">Kawaii</option>
                        <option value="disney">Disney</option>
                        <option value="manga">Manga</option>
                        <option value="color">Couleur</option>
                        <option value="blackwork">Noir</option>
                      </>
                    )}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tag (nouveau ou existant)</label>
              <div className="flex gap-2">
                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="flex-1 px-4 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none" />
                <button type="button" onClick={() => { setFormData({ ...formData, category: tagInput }); }} className="px-4 py-2 bg-pink-100 rounded">Appliquer</button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Le tag sera enregistré comme `category` du tatouage et ajouté aux inspirations s'il est nouveau.</p>
            </div>

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
