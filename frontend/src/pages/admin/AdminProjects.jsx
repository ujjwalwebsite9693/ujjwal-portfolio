import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiFolder } from 'react-icons/fi';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import AnimatedFormPanel from '../../components/admin/AnimatedFormPanel';
import { AnimatedTableBody, AnimatedTableRow } from '../../components/admin/AnimatedTableRow';
import '../../styles/admin.css';

const EMPTY = { title: '', description: '', tags: '', codeUrl: '', liveUrl: '', featured: true, order: 0 };

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get('/projects').then((res) => setProjects(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const openNew = () => { setForm(EMPTY); setImageFile(null); setEditingId(null); setShowForm(true); };
  const openEdit = (project) => {
    setForm({ ...project, tags: project.tags?.join(', ') || '' });
    setImageFile(null);
    setEditingId(project._id);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setForm(EMPTY); setImageFile(null); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      if (imageFile) fd.append('image', imageFile);

      if (editingId) {
        await api.put(`/projects/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Project updated!');
      } else {
        await api.post('/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Project added!');
      }
      closeForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      load();
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <AdminLayout title="Projects">
      <div className="admin-page__header">
        <p>Manage the featured projects shown on your portfolio.</p>
        {!showForm && (
          <button className="btn btn-primary admin-btn-sm" onClick={openNew}>
            <FiPlus /> Add Project
          </button>
        )}
      </div>

      <AnimatedFormPanel show={showForm}>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__grid">
            <div className="admin-form__field admin-form__field--full">
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label>Description</label>
              <textarea name="description" rows={3} value={form.description} onChange={handleChange} required />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label>Tags (comma-separated)</label>
              <input name="tags" value={form.tags} onChange={handleChange} placeholder="HTML, CSS, JavaScript" />
            </div>
            <div className="admin-form__field">
              <label>Code URL</label>
              <input name="codeUrl" value={form.codeUrl} onChange={handleChange} placeholder="https://github.com/..." />
            </div>
            <div className="admin-form__field">
              <label>Live demo URL</label>
              <input name="liveUrl" value={form.liveUrl} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="admin-form__field">
              <label>Project image</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
              <small>Leave empty to keep current image when editing.</small>
            </div>
            <div className="admin-form__field">
              <label>Display order</label>
              <input type="number" name="order" value={form.order} onChange={handleChange} />
            </div>
          </div>
          <div className="admin-form__actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Project' : 'Add Project'}
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
        ) : projects.length === 0 ? (
          <div className="admin-empty-state">No projects yet. Add your first one above.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Tags</th>
                <th></th>
              </tr>
            </thead>
            <AnimatedTableBody>
              {projects.map((project) => (
                <AnimatedTableRow key={project._id}>
                  <td>
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} className="admin-table__thumb" />
                    ) : (
                      <div className="admin-table__thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiFolder />
                      </div>
                    )}
                  </td>
                  <td><strong>{project.title}</strong></td>
                  <td>{project.tags?.join(', ')}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-icon-btn" onClick={() => openEdit(project)} aria-label="Edit">
                        <FiEdit2 />
                      </button>
                      <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => handleDelete(project._id)} aria-label="Delete">
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
