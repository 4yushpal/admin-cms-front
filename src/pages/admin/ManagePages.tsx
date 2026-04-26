import { useState } from 'react';
import { Edit2, Trash2, Plus, FileText, RefreshCw } from 'lucide-react';
import Modal from '../../components/admin/Modal';
import { useData } from '../../context/DataContext';
import type { PageContent } from '../../context/DataContext';

const emptyForm: Omit<PageContent, 'id' | 'updated_at'> = {
  page_name: '', title: '', section_key: '', content_value: '', image_url: '', video_url: '', updated_by: 1
};

export default function ManagePages() {
  const { pageContent: pages, addPageContent, updatePageContent, deletePageContent, isApiConnected, refresh } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<PageContent, 'id' | 'updated_at'>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleOpenModal = (page?: PageContent) => {
    setError('');
    if (page) {
      setEditingId(page.id);
      setFormData({ 
        page_name: page.page_name, 
        title: page.title || '',
        section_key: page.section_key, 
        content_value: page.content_value, 
        image_url: page.image_url || '', 
        video_url: page.video_url || '', 
        updated_by: page.updated_by 
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this content block?')) return;
    try { await deletePageContent(id); } catch (e: any) { alert('Error: ' + e.message); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editingId) { await updatePageContent(editingId, formData); }
      else { await addPageContent(formData); }
      setIsModalOpen(false);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><FileText className="w-6 h-6" /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Page Content</h1>
            <p className="text-sm text-gray-500">Manage dynamic text content, background videos, and logos across the website.</p>
            <p className="text-xs text-uhs-maroon mt-1 font-medium">Hint: When adding content, use the Section Key dropdown to easily find settings like 'hero_video_url_bg'.</p>
            <div className="flex items-center mt-2 space-x-2">
              <span className={`inline-block w-2 h-2 rounded-full ${isApiConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              <span className="text-xs text-gray-400">{isApiConnected ? 'Live — connected to database' : 'Offline — using local cache'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={refresh} className="p-2 text-gray-400 hover:text-uhs-maroon transition-colors rounded-lg hover:bg-gray-100" title="Refresh"><RefreshCw className="w-5 h-5" /></button>
          <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-uhs-maroon text-white rounded-lg hover:bg-red-900 transition-colors shadow-md font-medium">
            <Plus className="w-4 h-4 mr-2" /> Add Content Block
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Page Name', 'Title', 'Section Key', 'Text Content', 'Image URL', 'Video URL', 'Updated At', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pages.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-gray-400 text-sm">No page content blocks found.</td></tr>
              ) : pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{page.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-uhs-maroon uppercase">{page.page_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{page.title || <span className="text-gray-300">—</span>}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-mono bg-gray-50">{page.section_key}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-[200px] truncate" title={page.content_value}>{page.content_value}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-[150px] truncate" title={page.image_url || ''}>
                    {page.image_url ? <a href={page.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Link</a> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-[150px] truncate" title={page.video_url || ''}>
                    {page.video_url ? <a href={page.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Link</a> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{page.updated_at ? String(page.updated_at).replace('T', ' ').slice(0, 19) : '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button onClick={() => handleOpenModal(page)} className="text-indigo-600 hover:text-indigo-900"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(page.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Content Block' : 'Add Content Block'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Page Name <span className="text-red-500">*</span></label>
              <input type="text" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" placeholder="e.g. home, about" value={formData.page_name} onChange={e => setFormData({...formData, page_name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Section Key <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required 
                list="predefined-keys"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon font-mono" 
                placeholder="e.g. hero_video_url_bg" 
                value={formData.section_key} 
                onChange={e => setFormData({...formData, section_key: e.target.value})} 
              />
              <datalist id="predefined-keys">
                <option value="hero_video_url_bg">Background Video URL</option>
                <option value="hero_logo_url">Top Left Logo URL</option>
                <option value="hero_video_url">Watch Video Button Link</option>
                <option value="school_name">Full School Name</option>
                <option value="school_short_name">Short School Name (UHS)</option>
                <option value="about_line1">About Section Line 1 (e.g. CREATING)</option>
                <option value="about_line2">About Section Line 2 (e.g. BRIGHT)</option>
                <option value="about_line3">About Section Line 3 (e.g. FUTURES)</option>
                <option value="about_description">About Section Description</option>
                <option value="contact_phone">Contact Phone</option>
                <option value="contact_email">Contact Email</option>
                <option value="contact_address">Postal Address</option>
                <option value="ack_country">Acknowledgement of Country</option>
              </datalist>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Title <span className="text-xs text-gray-500 font-normal">(Optional)</span></label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" placeholder="e.g. CREATING BRIGHT FUTURES" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Content Value <span className="text-red-500">*</span></label>
            <textarea required rows={6} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.content_value} onChange={e => setFormData({...formData, content_value: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Image URL <span className="text-xs text-gray-500 font-normal">(Optional)</span></label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.image_url || ''} onChange={e => setFormData({...formData, image_url: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Video URL <span className="text-xs text-gray-500 font-normal">(Optional)</span></label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.video_url || ''} onChange={e => setFormData({...formData, video_url: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border text-gray-600 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-uhs-maroon text-white rounded-lg hover:bg-red-900 font-medium shadow-sm disabled:opacity-50">{saving ? 'Saving...' : 'Save Content'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
