import { useState } from 'react';
import { Edit2, Trash2, Plus, Shield, RefreshCw } from 'lucide-react';
import Modal from '../../components/admin/Modal';
import { useData } from '../../context/DataContext';
import type { Admin } from '../../context/DataContext';

const emptyForm = { username: '', email: '', password_hash: '', role: 'editor' as Admin['role'] };

export default function ManageAdmins() {
  const { admins, addAdmin, updateAdmin, deleteAdmin, isApiConnected, refresh } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleOpenModal = (admin?: Admin) => {
    setError('');
    if (admin) {
      setEditingId(admin.id);
      setFormData({ username: admin.username, email: admin.email, password_hash: '********', role: admin.role });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    try { await deleteAdmin(id); } catch (e: any) { alert('Error: ' + e.message); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editingId) { await updateAdmin(editingId, formData); }
      else { await addAdmin(formData); }
      setIsModalOpen(false);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Shield className="w-6 h-6" /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Admins</h1>
            <p className="text-sm text-gray-500">View, add, edit, and delete administrator accounts.</p>
            <div className="flex items-center mt-1 space-x-2">
              <span className={`inline-block w-2 h-2 rounded-full ${isApiConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              <span className="text-xs text-gray-400">{isApiConnected ? 'Live — connected to database' : 'Offline — using local cache'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={refresh} className="p-2 text-gray-400 hover:text-uhs-maroon transition-colors rounded-lg hover:bg-gray-100" title="Refresh"><RefreshCw className="w-5 h-5" /></button>
          <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-uhs-maroon text-white rounded-lg hover:bg-red-900 transition-colors shadow-md font-medium">
            <Plus className="w-4 h-4 mr-2" /> Add New Admin
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Username', 'Email', 'Role', 'Password Hash', 'Last Login', 'Created At', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-gray-400 text-sm">No admins found.</td></tr>
              ) : admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{admin.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{admin.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${admin.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                      {admin.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-mono">••••••••</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{admin.last_login ? String(admin.last_login).replace('T', ' ').slice(0,19) : 'Never'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{admin.created_at ? String(admin.created_at).replace('T', ' ').slice(0,19) : '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button onClick={() => handleOpenModal(admin)} className="text-indigo-600 hover:text-indigo-900"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(admin.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Admin' : 'Add New Admin'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Username <span className="text-red-500">*</span></label>
              <input type="text" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
              <input type="email" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
            <input type="password" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" placeholder={editingId ? "Leave as ••••••• to keep existing" : "Enter password"} value={formData.password_hash} onChange={e => setFormData({...formData, password_hash: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Role <span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as Admin['role']})}>
              <option value="super_admin">Super Admin</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border text-gray-600 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-uhs-maroon text-white rounded-lg hover:bg-red-900 font-medium shadow-sm disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Admin'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
