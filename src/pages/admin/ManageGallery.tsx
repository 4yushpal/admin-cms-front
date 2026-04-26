import { useState } from 'react';
import { Edit2, Trash2, Plus, ImageIcon, RefreshCw } from 'lucide-react';
import Modal from '../../components/admin/Modal';
import { useData } from '../../context/DataContext';
import type { GalleryImage } from '../../context/DataContext';

const emptyForm: Omit<GalleryImage, 'id' | 'created_at'> = {
  image_url: '', title: '', alt_text: '', category: 'Campus', uploaded_by: 1
};

const CATEGORIES = ['Campus', 'Events', 'Students', 'Facilities'];

export default function ManageGallery() {
  const { galleryImages: images, addGalleryImage, updateGalleryImage, deleteGalleryImage, isApiConnected, refresh } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<GalleryImage, 'id' | 'created_at'>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleOpenModal = (img?: GalleryImage) => {
    setError('');
    if (img) {
      setEditingId(img.id);
      setFormData({ image_url: img.image_url, title: img.title, alt_text: img.alt_text, category: img.category, uploaded_by: img.uploaded_by });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this image?')) return;
    try { await deleteGalleryImage(id); } catch (e: any) { alert('Error: ' + e.message); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editingId) { await updateGalleryImage(editingId, formData); }
      else { await addGalleryImage(formData); }
      setIsModalOpen(false);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><ImageIcon className="w-6 h-6" /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Gallery</h1>
            <p className="text-sm text-gray-500">{images.length} image{images.length !== 1 ? 's' : ''} across {[...new Set(images.map(i=>i.category))].length} categories.</p>
            <div className="flex items-center mt-1 space-x-2">
              <span className={`inline-block w-2 h-2 rounded-full ${isApiConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              <span className="text-xs text-gray-400">{isApiConnected ? 'Live — connected to database' : 'Offline — using local cache'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={refresh} className="p-2 text-gray-400 hover:text-uhs-maroon transition-colors rounded-lg hover:bg-gray-100" title="Refresh"><RefreshCw className="w-5 h-5" /></button>
          <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-uhs-maroon text-white rounded-lg hover:bg-red-900 transition-colors shadow-md font-medium">
            <Plus className="w-4 h-4 mr-2" /> Upload Image
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Preview', 'Title', 'Alt Text', 'Category', 'Image URL', 'Uploaded By', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {images.length === 0 ? (
                <tr><td colSpan={9} className="px-6 py-10 text-center text-gray-400 text-sm">No images uploaded yet.</td></tr>
              ) : images.map((img) => (
                <tr key={img.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{img.id}</td>
                  <td className="px-6 py-4">
                    <img src={img.image_url} alt={img.alt_text} className="w-14 h-14 object-cover rounded-md shadow-sm border border-gray-200" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{img.title || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-[150px] truncate">{img.alt_text}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">{img.category}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400 max-w-[150px] truncate font-mono">{img.image_url}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Admin #{img.uploaded_by}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{img.created_at ? String(img.created_at).split('T')[0] : '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button onClick={() => handleOpenModal(img)} className="text-indigo-600 hover:text-indigo-900"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(img.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Image' : 'Upload Image'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Image URL <span className="text-red-500">*</span></label>
            <input type="text" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
            {formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-2 h-28 rounded object-cover border" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Title</label><input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
              <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Alt Text <span className="text-red-500">*</span></label><input type="text" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.alt_text} onChange={e => setFormData({...formData, alt_text: e.target.value})} /></div>
          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border text-gray-600 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-uhs-maroon text-white rounded-lg hover:bg-red-900 font-medium shadow-sm disabled:opacity-50">{saving ? 'Saving...' : 'Save Image'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
