import { useState } from 'react';
import { Edit2, Trash2, Plus, Briefcase, Check, X as XIcon, RefreshCw } from 'lucide-react';
import Modal from '../../components/admin/Modal';
import { useData } from '../../context/DataContext';
import type { Service } from '../../context/DataContext';

const emptyForm: Omit<Service, 'id' | 'created_at' | 'updated_at'> = {
  title: '', slug: '', short_description: '', detailed_content: '', icon_or_image_url: '', is_active: true, display_order: 0
};

export default function ManageServices() {
  const { services, addService, updateService, deleteService, isApiConnected, refresh } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Service, 'id' | 'created_at' | 'updated_at'>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleOpenModal = (service?: Service) => {
    setError('');
    if (service) {
      setEditingId(service.id);
      setFormData({ title: service.title, slug: service.slug, short_description: service.short_description, detailed_content: service.detailed_content, icon_or_image_url: service.icon_or_image_url, is_active: service.is_active, display_order: service.display_order });
    } else {
      setEditingId(null);
      setFormData({ ...emptyForm, display_order: services.length + 1 });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try { await deleteService(id); } catch (e: any) { alert('Error: ' + e.message); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editingId) { await updateService(editingId, formData); }
      else { await addService(formData); }
      setIsModalOpen(false);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Services</h1>
            <p className="text-sm text-gray-500">Add or update school services and facilities.</p>
            <div className="flex items-center mt-1 space-x-2">
              <span className={`inline-block w-2 h-2 rounded-full ${isApiConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              <span className="text-xs text-gray-400">{isApiConnected ? 'Live — connected to database' : 'Offline — using local cache'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={refresh} className="p-2 text-gray-400 hover:text-uhs-maroon transition-colors rounded-lg hover:bg-gray-100" title="Refresh">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-uhs-maroon text-white rounded-lg hover:bg-red-900 transition-colors shadow-md font-medium">
            <Plus className="w-4 h-4 mr-2" /> Add Service
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Title', 'Slug', 'Short Description', 'Order', 'Active', 'Created At', 'Updated At', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.length === 0 ? (
                <tr><td colSpan={9} className="px-6 py-10 text-center text-gray-400 text-sm">No services found. Add one to get started.</td></tr>
              ) : services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{service.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{service.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">{service.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{service.short_description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{service.display_order}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {service.is_active ? <Check className="text-green-500 w-5 h-5" /> : <XIcon className="text-red-500 w-5 h-5" />}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{service.created_at ? String(service.created_at).split('T')[0] : '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{service.updated_at ? String(service.updated_at).split('T')[0] : '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button onClick={() => handleOpenModal(service)} className="text-indigo-600 hover:text-indigo-900 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-900 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Service' : 'Add New Service'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
              <input type="text" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
              <input type="text" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" placeholder="e.g. computer-labs" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Short Description <span className="text-red-500">*</span></label>
            <input type="text" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Detailed Content</label>
            <textarea required rows={4} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.detailed_content} onChange={e => setFormData({...formData, detailed_content: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Icon / Image URL</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.icon_or_image_url} onChange={e => setFormData({...formData, icon_or_image_url: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Display Order <span className="text-red-500">*</span></label>
              <input type="number" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value)})} />
            </div>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="isActive" className="h-4 w-4 text-uhs-maroon focus:ring-uhs-maroon border-gray-300 rounded" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} />
            <label htmlFor="isActive" className="ml-2 block text-sm font-bold text-gray-700">Service is Active (visible on public site)</label>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border text-gray-600 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-uhs-maroon text-white rounded-lg hover:bg-red-900 font-medium shadow-sm disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
