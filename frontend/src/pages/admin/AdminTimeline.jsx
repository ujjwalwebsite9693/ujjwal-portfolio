import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import AnimatedFormPanel from '../../components/admin/AnimatedFormPanel';
import { AnimatedTableBody, AnimatedTableRow } from '../../components/admin/AnimatedTableRow';
import '../../styles/admin.css';

const EMPTY = { type: 'education', title: '', organization: '', period: '', description: '', order: 0 };

export default function AdminTimeline() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get('/timeline').then((res) => setItems(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'order' ? Number(value) : value }));
  };

  const openNew = () => { setForm(EMPTY); setEditingId(null); setShowForm(true); };
  const openEdit = (item) => { setForm(item); setEditingId(item._id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setForm(EMPTY); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/timeline/${editingId}`, form);
        toast.success('Entry updated!');
      } else {
        await api.post('/timeline', form);
        toast.success('Entry added!');
      }
      closeForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this timeline entry?')) return;
    try {
      await api.delete(`/timeline/${id}`);
      toast.success('Entry deleted');
      load();
    } catch (err) {
      toast.error('Failed to delete entry');
    }
  };

  return (
    <AdminLayout title="Education & Experience">
      <div className="admin-page__header">
        <p>Manage your education history and work experience shown in the timeline section.</p>
        {!showForm && (
          <button className="btn btn-primary admin-btn-sm" onClick={openNew}>
            <FiPlus /> Add Entry
          </button>
        )}
      </div>

      <AnimatedFormPanel show={showForm}>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__grid">
            <div className="admin-form__field">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="education">Education</option>
                <option value="experience">Experience</option>
              </select>
            </div>
            <div className="admin-form__field">
              <label>Period</label>
              <input name="period" value={form.period} onChange={handleChange} placeholder="2025 - 2028" required />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Bachelor of Computer Applications" required />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label>Organization</label>
              <input name="organization" value={form.organization} onChange={handleChange} required />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label>Description</label>
              <textarea name="description" rows={3} value={form.description} onChange={handleChange} />
            </div>
            <div className="admin-form__field">
              <label>Display order</label>
              <input type="number" name="order" value={form.order} onChange={handleChange} />
            </div>
          </div>
          <div className="admin-form__actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Entry' : 'Add Entry'}
            </button>
            <button type="button" className="btn btn-outline" onClick={closeForm}>
              <FiX /> Cancel
            </button>
          </div>
        </form>
        </AnimatedFormPanel>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-empty-state">Loading...</div>
        ) : items.length === 0 ? (
          <div className="admin-empty-state">No entries yet. Add your first one above.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Organization</th>
                <th>Period</th>
                <th></th>
              </tr>
            </thead>
            <AnimatedTableBody>
              {items.map((item) => (
                <AnimatedTableRow key={item._id}>
                  <td><span className="admin-badge">{item.type}</span></td>
                  <td><strong>{item.title}</strong></td>
                  <td>{item.organization}</td>
                  <td>{item.period}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-icon-btn" onClick={() => openEdit(item)} aria-label="Edit">
                        <FiEdit2 />
                      </button>
                      <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => handleDelete(item._id)} aria-label="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </AnimatedTableRow>
              ))}
            </AnimatedTableBody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
