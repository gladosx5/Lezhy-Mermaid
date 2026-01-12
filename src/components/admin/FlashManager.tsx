import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function FlashManager() {
  const [flashes, setFlashes] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    size: '',
    placement: '',
    original_price: '' as any,
    promo_price: '' as any,
    status: 'available',
    is_featured: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

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

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      size: '',
      placement: '',
      original_price: '',
      promo_price: '',
      status: 'available',
      is_featured: false,
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsEditing(false);
    setEditingId(null);
    setTagInput('');
  };

  const handleEdit = (flash: any) => {
    setEditingId(flash.id);
    setFormData({
      title: flash.title,
      description: flash.description || '',
      image_url: flash.image_url,
      size: flash.size || '',
      placement: flash.placement || '',
      original_price: flash.original_price || '',
      promo_price: flash.promo_price || '',
      status: flash.status || 'available',
      is_featured: flash.is_featured || false,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce flash ?')) return;
    await supabase.from('flashes').delete().eq('id', id);
    loadFlashes();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = formData.image_url;
      if (selectedFile) {
        const BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'tattoos';
        const ext = selectedFile.name.split('.').pop();
        const filename = (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
          ? (crypto as any).randomUUID() + '.' + ext
          : `${Date.now()}.${ext}`;
        const path = filename;
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, selectedFile);
        if (uploadError) {
          console.error('Storage upload error', uploadError);
          if ((uploadError as any).status === 404 || /Bucket not found/i.test(String((uploadError as any).message || '')) ) {
            // eslint-disable-next-line no-alert
            alert(`Bucket \"${BUCKET}\" introuvable dans Supabase Storage.`);
          }
          throw uploadError;
        }
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
        imageUrl = (urlData as any).publicUrl || (urlData as any).publicURL || '';
      }

      const payload: any = {
        title: formData.title,
        description: formData.description || null,
        image_url: imageUrl,
        size: formData.size || null,
        placement: formData.placement || null,
        original_price: formData.original_price ? Number(formData.original_price) : null,
        promo_price: formData.promo_price ? Number(formData.promo_price) : null,
        status: formData.status,
        is_featured: formData.is_featured,
      };

      if (editingId) {
        await supabase.from('flashes').update(payload).eq('id', editingId);
      } else {
        await supabase.from('flashes').insert([payload]);
      }

      // if a tag was provided, append to inspirations in site_content (keeps pill sync)
      const tag = tagInput?.trim();
      if (tag) {
        try {
          const { data } = await supabase
            .from('site_content')
            .select('*')
            .eq('section', 'about')
            .eq('key', 'inspirations')
            .maybeSingle();

          let next: string[] = [];
          if (data && data.value) {
            try { next = JSON.parse(data.value); } catch { next = []; }
          }
          if (!next.includes(tag)) {
            next.push(tag);
            if (data && data.id) {
              await supabase.from('site_content').update({ value: JSON.stringify(next) }).eq('id', data.id);
            } else {
              await supabase.from('site_content').insert([{ section: 'about', key: 'inspirations', value: JSON.stringify(next) }]);
            }
          }
        } catch (e) {
          console.error('Failed to update inspirations', e);
        }
      }

    } catch (err) {
      console.error('Failed to save flash', err);
      // eslint-disable-next-line no-alert
      alert('Erreur lors de l\'enregistrement du flash. Voir la console.');
      return;
    }

    resetForm();
    loadFlashes();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
        Gestion des Flashs
      </h2>

      {!isEditing ? (
        <button onClick={() => setIsEditing(true)} className="mb-6 flex items-center space-x-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg">
          <Plus className="w-5 h-5" />
          <span>Ajouter un flash</span>
        </button>
      ) : (
        <div className="mb-6 bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">{editingId ? 'Modifier' : 'Nouveau'} flash</h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400 resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0] ?? null; setSelectedFile(f); if (f) setPreviewUrl(URL.createObjectURL(f)); }} className="w-full" required={!editingId} />
              {previewUrl && <img src={previewUrl} alt="preview" className="mt-3 max-h-48 object-cover rounded" />}
              {formData.image_url && !previewUrl && <img src={formData.image_url} alt="preview" className="mt-3 max-h-48 object-cover rounded" />}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Taille</label>
                <input type="text" value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} className="w-full px-4 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emplacement</label>
                <input type="text" value={formData.placement} onChange={(e) => setFormData({ ...formData, placement: e.target.value })} className="w-full px-4 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix initial</label>
                <input type="number" value={formData.original_price} onChange={(e) => setFormData({ ...formData, original_price: e.target.value })} className="w-full px-4 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix promo</label>
                <input type="number" value={formData.promo_price} onChange={(e) => setFormData({ ...formData, promo_price: e.target.value })} className="w-full px-4 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tag (optionnel)</label>
              <div className="flex gap-2">
                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="flex-1 px-4 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400" />
                <button type="button" onClick={() => { /* apply tag to be saved on submit */ }} className="px-4 py-2 bg-pink-100 rounded">Ajouter</button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Le tag sera ajouté aux pillules d'inspiration si nouveau.</p>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="flex-1 bg-gradient-to-r from-pink-400 to-purple-400 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all">{editingId ? 'Mettre à jour' : 'Ajouter'} ✨</button>
              <button type="button" onClick={resetForm} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl">Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {flashes.map((flash) => (
          <div key={flash.id} className="bg-rose-50/90 rounded-2xl shadow-lg p-4 border border-rose-200">
            <img src={flash.image_url} alt={flash.title} className="w-full h-40 object-cover rounded-xl mb-3" />
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold">{flash.title}</h3>
                <p className="text-sm text-gray-600">{[(flash as any).category, flash.placement, flash.size].filter(Boolean).join(' / ')}</p>
                <p className="text-sm text-gray-600 mt-2">{flash.promo_price || flash.original_price}€</p>
              </div>
              <div className="flex flex-col space-y-2">
                <button onClick={() => handleEdit(flash)} className="w-10 h-10 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center"><Edit2 className="w-4 h-4 text-blue-600" /></button>
                <button onClick={() => handleDelete(flash.id)} className="w-10 h-10 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center"><Trash2 className="w-4 h-4 text-red-600" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
