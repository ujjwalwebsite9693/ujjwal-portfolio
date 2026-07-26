import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import AnimatedFormPanel from '../../components/admin/AnimatedFormPanel';
import { AnimatedTableBody, AnimatedTableRow } from '../../components/admin/AnimatedTableRow';
import '../../styles/admin.css';

const EMPTY = { name: '', category: '', proficiency: 80, level: 'Intermediate', description: '', order: 0 };

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get('/skills').then((res) => setSkills(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'proficiency' || name === 'order' ? Number(value) : value }));
  };

  const openNew = () => { setForm(EMPTY); setEditingId(null); setShowForm(true); };
  const openEdit = (skill) => { setForm(skill); setEditingId(skill._id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setForm(EMPTY); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/skills/${editingId}`, form);
        toast.success('Skill updated!');
      } else {
        await api.post('/skills', form);
        toast.success('Skill added!');
      }
      closeForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save skill');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      toast.success('Skill deleted');
      load();
    } catch (err) {
      toast.error('Failed to delete skill');
    }
  };

  return (
    <AdminLayout title="Skills">
      <div className="admin-page__header">
        <p>Manage the skills shown in your Skills section, including category and proficiency level.</p>
        {!showForm && (
          <button className="btn btn-primary admin-btn-sm" onClick={openNew}>
            <FiPlus /> Add Skill
          </button>
        )}
      </div>

      <AnimatedFormPanel show={showForm}>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__grid">
            <div className="admin-form__field">
              <label>Skill name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="admin-form__field">
              <label>Category</label>
              <input name="category" value={form.category} onChange={handleChange} placeholder="Frontend, Backend, Design..." required />
            </div>
            <div className="admin-form__field">
              <label>Proficiency (%)</label>
              <input type="number" name="proficiency" min="0" max="100" value={form.proficiency} onChange={handleChange} />
            </div>
            <div className="admin-form__field">
              <label>Level</label>
              <select name="level" value={form.level} onChange={handleChange}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label>Description</label>
              <textarea name="description" rows={2} value={form.description} onChange={handleChange} />
            </div>
            <div className="admin-form__field">
              <label>Display order</label>
              <input type="number" name="order" value={form.order} onChange={handleChange} />
            </div>
          </div>
          <div className="admin-form__actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Skill' : 'Add Skill'}
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
        ) : skills.length === 0 ? (
          <div className="admin-empty-state">No skills yet. Add your first one above.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Proficiency</th>
                <th>Level</th>
                <th></th>
              </tr>
            </thead>
            <AnimatedTableBody>
              {skills.map((skill) => (
                <AnimatedTableRow key={skill._id}>
                  <td><strong>{skill.name}</strong></td>
                  <td><span className="admin-badge">{skill.category}</span></td>
                  <td>{skill.proficiency}%</td>
                  <td>{skill.level}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-icon-btn" onClick={() => openEdit(skill)} aria-label="Edit">
                        <FiEdit2 />
                      </button>
                      <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => handleDelete(skill._id)} aria-label="Delete">
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
