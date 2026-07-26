import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiAward } from 'react-icons/fi';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import AnimatedFormPanel from '../../components/admin/AnimatedFormPanel';
import { AnimatedTableBody, AnimatedTableRow } from '../../components/admin/AnimatedTableRow';
import '../../styles/admin.css';

const EMPTY = { title: '', issuer: '', year: '', verifyUrl: '', order: 0 };

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get('/certificates').then((res) => setCertificates(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openNew = () => { setForm(EMPTY); setImageFile(null); setEditingId(null); setShowForm(true); };
  const openEdit = (cert) => { setForm(cert); setImageFile(null); setEditingId(cert._id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setForm(EMPTY); setImageFile(null); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      if (imageFile) fd.append('image', imageFile);

      if (editingId) {
        await api.put(`/certificates/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Certificate updated!');
      } else {
        await api.post('/certificates', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Certificate added!');
      }
      closeForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save certificate');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this certificate?')) return;
    try {
      await api.delete(`/certificates/${id}`);
      toast.success('Certificate deleted');
      load();
    } catch (err) {
      toast.error('Failed to delete certificate');
    }
  };

  return (
    <AdminLayout title="Certificates">
      <div className="admin-page__header">
        <p>Manage the certificates and courses shown on your portfolio.</p>
        {!showForm && (
          <button className="btn btn-primary admin-btn-sm" onClick={openNew}>
            <FiPlus /> Add Certificate
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
            <div className="admin-form__field">
              <label>Issuer</label>
              <input name="issuer" value={form.issuer} onChange={handleChange} placeholder="Google, LinkedIn Learning..." required />
            </div>
            <div className="admin-form__field">
              <label>Year</label>
              <input name="year" value={form.year} onChange={handleChange} placeholder="2026" required />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label>Verify URL (optional)</label>
              <input name="verifyUrl" value={form.verifyUrl} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="admin-form__field">
              <label>Certificate image</label>
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
              {saving ? 'Saving...' : editingId ? 'Update Certificate' : 'Add Certificate'}
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
        ) : certificates.length === 0 ? (
          <div className="admin-empty-state">No certificates yet. Add your first one above.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Issuer</th>
                <th>Year</th>
                <th></th>
              </tr>
            </thead>
            <AnimatedTableBody>
              {certificates.map((cert) => (
                <AnimatedTableRow key={cert._id}>
                  <td>
                    {cert.imageUrl ? (
                      <img src={cert.imageUrl} alt={cert.title} className="admin-table__thumb" />
                    ) : (
                      <div className="admin-table__thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiAward />
                      </div>
                    )}
                  </td>
                  <td><strong>{cert.title}</strong></td>
                  <td>{cert.issuer}</td>
                  <td>{cert.year}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-icon-btn" onClick={() => openEdit(cert)} aria-label="Edit">
                        <FiEdit2 />
                      </button>
                      <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => handleDelete(cert._id)} aria-label="Delete">
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
