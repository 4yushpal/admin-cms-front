import { useState } from 'react';
import { Edit2, Trash2, Plus, MessageSquare, Mail, Eye, RefreshCw } from 'lucide-react';
import Modal from '../../components/admin/Modal';
import { useData } from '../../context/DataContext';
import type { ContactMessage } from '../../context/DataContext';

const emptyForm: Omit<ContactMessage, 'id' | 'created_at'> = {
  sender_name: '', sender_email: '', phone_number: '', subject: '', message_body: '', is_read: false
};

export default function ManageMessages() {
  const { messages, addMessage, updateMessage, deleteMessage, isApiConnected, refresh } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<ContactMessage, 'id' | 'created_at'>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleOpenModal = (msg?: ContactMessage) => {
    setError('');
    if (msg) {
      setEditingId(msg.id);
      setFormData({ sender_name: msg.sender_name, sender_email: msg.sender_email, phone_number: msg.phone_number, subject: msg.subject, message_body: msg.message_body, is_read: msg.is_read });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try { await deleteMessage(id); } catch (e: any) { alert('Error: ' + e.message); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editingId) { await updateMessage(editingId, formData); }
      else { await addMessage(formData); }
      setIsModalOpen(false);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-[clamp(1.5rem,2vw,4rem)] max-w-[clamp(80rem,90vw,300rem)] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-[clamp(1.5rem,2vw,4rem)] rounded-[clamp(0.5rem,1vw,2rem)] shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center gap-[clamp(1rem,2vw,4rem)]">
          <div className="relative p-[clamp(0.5rem,1vw,2rem)] bg-orange-100 text-uhs-orange rounded-lg">
            <MessageSquare className="w-[clamp(1.5rem,2vw,4rem)] h-[clamp(1.5rem,2vw,4rem)]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-[clamp(1.25rem,1.5vw,3rem)] h-[clamp(1.25rem,1.5vw,3rem)] bg-red-500 text-white text-[clamp(0.65rem,0.8vw,1.5rem)] rounded-full flex items-center justify-center font-bold">{unreadCount}</span>
            )}
          </div>
          <div>
            <h1 className="text-[clamp(1.5rem,2vw,4rem)] font-bold text-gray-800">Contact Messages</h1>
            <p className="text-[clamp(0.875rem,1vw,2rem)] text-gray-500">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}.</p>
            <div className="flex items-center mt-1 gap-[clamp(0.25rem,0.5vw,1rem)]">
              <span className={`inline-block w-[clamp(0.5rem,0.7vw,1.5rem)] h-[clamp(0.5rem,0.7vw,1.5rem)] rounded-full ${isApiConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              <span className="text-[clamp(0.75rem,0.8vw,1.5rem)] text-gray-400">{isApiConnected ? 'Live — connected to database' : 'Offline — using local cache'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[clamp(0.75rem,1.5vw,3rem)]">
          <button onClick={refresh} className="p-[clamp(0.5rem,1vw,2rem)] text-gray-400 hover:text-uhs-maroon transition-colors rounded-lg hover:bg-gray-100" title="Refresh"><RefreshCw className="w-[clamp(1.25rem,1.5vw,3rem)] h-[clamp(1.25rem,1.5vw,3rem)]" /></button>
          <button onClick={() => handleOpenModal()} className="flex items-center px-[clamp(1rem,2vw,4rem)] py-[clamp(0.5rem,1vw,2rem)] bg-uhs-maroon text-white rounded-[clamp(0.5rem,1vw,2rem)] hover:bg-red-900 transition-colors shadow-md font-medium text-[clamp(0.875rem,1vw,2rem)]">
            <Plus className="w-[clamp(1rem,1.5vw,3rem)] h-[clamp(1rem,1.5vw,3rem)] mr-[clamp(0.5rem,1vw,2rem)]" /> Add Message
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[clamp(0.5rem,1vw,2rem)] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Status', 'Sender Name', 'Sender Email', 'Phone', 'Subject', 'Message Body', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-[clamp(1.5rem,2vw,4rem)] py-[clamp(1rem,1.5vw,3rem)] text-left text-[clamp(0.75rem,0.8vw,1.5rem)] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messages.length === 0 ? (
                <tr><td colSpan={9} className="px-[clamp(1.5rem,2vw,4rem)] py-[clamp(2.5rem,4vw,8rem)] text-center text-gray-400 text-[clamp(0.875rem,1vw,2rem)]">No messages received yet.</td></tr>
              ) : messages.map((msg) => (
                <tr key={msg.id} className={`hover:bg-gray-50 transition-colors ${!msg.is_read ? 'bg-orange-50/40' : ''}`}>
                  <td className="px-[clamp(1.5rem,2vw,4rem)] py-[clamp(1rem,1.5vw,3rem)] whitespace-nowrap text-[clamp(0.875rem,1vw,2rem)] font-medium text-gray-900">#{msg.id}</td>
                  <td className="px-[clamp(1.5rem,2vw,4rem)] py-[clamp(1rem,1.5vw,3rem)] whitespace-nowrap">
                    {!msg.is_read ? (
                      <span className="flex items-center text-uhs-orange text-[clamp(0.75rem,0.8vw,1.5rem)] font-bold gap-1"><Mail className="w-[clamp(0.875rem,1vw,2rem)] h-[clamp(0.875rem,1vw,2rem)]"/>New</span>
                    ) : (
                      <span className="flex items-center text-gray-400 text-[clamp(0.75rem,0.8vw,1.5rem)] gap-1"><Eye className="w-[clamp(0.875rem,1vw,2rem)] h-[clamp(0.875rem,1vw,2rem)]"/>Read</span>
                    )}
                  </td>
                  <td className="px-[clamp(1.5rem,2vw,4rem)] py-[clamp(1rem,1.5vw,3rem)] whitespace-nowrap text-[clamp(0.875rem,1vw,2rem)] text-gray-800 font-semibold">{msg.sender_name}</td>
                  <td className="px-[clamp(1.5rem,2vw,4rem)] py-[clamp(1rem,1.5vw,3rem)] whitespace-nowrap text-[clamp(0.875rem,1vw,2rem)] text-gray-500">{msg.sender_email}</td>
                  <td className="px-[clamp(1.5rem,2vw,4rem)] py-[clamp(1rem,1.5vw,3rem)] whitespace-nowrap text-[clamp(0.875rem,1vw,2rem)] text-gray-500">{msg.phone_number || '—'}</td>
                  <td className="px-[clamp(1.5rem,2vw,4rem)] py-[clamp(1rem,1.5vw,3rem)] whitespace-nowrap text-[clamp(0.875rem,1vw,2rem)] text-gray-700 font-medium">{msg.subject}</td>
                  <td className="px-[clamp(1.5rem,2vw,4rem)] py-[clamp(1rem,1.5vw,3rem)] text-[clamp(0.875rem,1vw,2rem)] text-gray-500 max-w-[clamp(15rem,20vw,40rem)] truncate">{msg.message_body}</td>
                  <td className="px-[clamp(1.5rem,2vw,4rem)] py-[clamp(1rem,1.5vw,3rem)] whitespace-nowrap text-[clamp(0.75rem,0.8vw,1.5rem)] text-gray-500">{msg.created_at ? String(msg.created_at).split('T')[0] : '—'}</td>
                  <td className="px-[clamp(1.5rem,2vw,4rem)] py-[clamp(1rem,1.5vw,3rem)] whitespace-nowrap text-[clamp(0.875rem,1vw,2rem)] font-medium">
                    <div className="flex gap-[clamp(0.75rem,1vw,2rem)]">
                      <button onClick={() => handleOpenModal(msg)} className="text-indigo-600 hover:text-indigo-900"><Edit2 className="w-[clamp(1rem,1.5vw,3rem)] h-[clamp(1rem,1.5vw,3rem)]" /></button>
                      <button onClick={() => handleDelete(msg.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-[clamp(1rem,1.5vw,3rem)] h-[clamp(1rem,1.5vw,3rem)]" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Message' : 'Add Message'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Sender Name <span className="text-red-500">*</span></label><input type="text" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.sender_name} onChange={e => setFormData({...formData, sender_name: e.target.value})} /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Sender Email <span className="text-red-500">*</span></label><input type="email" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.sender_email} onChange={e => setFormData({...formData, sender_email: e.target.value})} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label><input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label><input type="text" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} /></div>
          </div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Message Body <span className="text-red-500">*</span></label><textarea required rows={5} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-uhs-maroon" value={formData.message_body} onChange={e => setFormData({...formData, message_body: e.target.value})} /></div>
          <div className="flex items-center"><input type="checkbox" id="isRead" className="h-4 w-4 text-uhs-maroon focus:ring-uhs-maroon border-gray-300 rounded" checked={formData.is_read} onChange={e => setFormData({...formData, is_read: e.target.checked})} /><label htmlFor="isRead" className="ml-2 block text-sm font-bold text-gray-700">Mark as Read</label></div>
          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border text-gray-600 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-uhs-maroon text-white rounded-lg hover:bg-red-900 font-medium shadow-sm disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
