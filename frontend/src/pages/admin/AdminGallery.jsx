import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiUpload, FiTrash2 } from 'react-icons/fi';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { StaggerGroup, StaggerItem } from '../../components/shared/StaggerGroup';
import '../../styles/admin.css';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = () => {
    api.get('/gallery').then((res) => setImages(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please choose an image first');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('caption', caption);
      await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Image uploaded!');
      setCaption('');
      setFile(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Image deleted');
      load();
    } catch (err) {
      toast.error('Failed to delete image');
    }
  };

  return (
    <AdminLayout title="Gallery">
      <div className="admin-page__header">
        <p>Optional photo gallery section shown on your portfolio.</p>
      </div>

      <form className="admin-form" onSubmit={handleUpload}>
        <div className="admin-form__grid">
          <div className="admin-form__field">
            <label>Image</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
          </div>
          <div className="admin-form__field">
            <label>Caption (optional)</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} />
          </div>
        </div>
        <div className="admin-form__actions">
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            <FiUpload /> {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="admin-empty-state">Loading...</div>
      ) : images.length === 0 ? (
        <div className="admin-empty-state">No gallery images yet.</div>
      ) : (
        <StaggerGroup style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          {images.map((img) => (
            <StaggerItem key={img._id} className="card" style={{ overflow: 'hidden' }}>
              <img src={img.imageUrl} alt={img.caption} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
              <div style={{ padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{img.caption || '—'}</span>
                <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => handleDelete(img._id)} aria-label="Delete">
                  <FiTrash2 />
                </button>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </AdminLayout>
  );
}
