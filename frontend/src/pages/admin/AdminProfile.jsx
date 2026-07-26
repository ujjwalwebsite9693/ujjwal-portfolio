import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSave, FiUpload } from 'react-icons/fi';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/admin.css';

const EMPTY = {
  name: '', roles: '', tagline: '', bio: '', age: '', birthday: '', experience: '',
  freelance: '', languages: '', resumeUrl: '', location: '', email: '', phone: '',
  instagram: '', youtube: '', telegram: '', github: '', linkedin: '',
};

export default function AdminProfile() {
  const [form, setForm] = useState(EMPTY);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);

  useEffect(() => {
    api.get('/profile').then((res) => {
      const p = res.data;
      setForm({
        ...EMPTY,
        ...p,
        roles: Array.isArray(p.roles) ? p.roles.join(', ') : '',
      });
      setAvatarUrl(p.avatarUrl || '');
      setHeroImageUrl(p.heroImageUrl || '');
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        roles: form.roles.split(',').map((r) => r.trim()).filter(Boolean),
      };
      await api.put('/profile', payload);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (field, file) => {
    if (!file) return;
    setUploadingField(field);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post(`/profile/upload/${field}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (field === 'avatar') setAvatarUrl(res.data.avatarUrl);
      else setHeroImageUrl(res.data.heroImageUrl);
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Have you configured Cloudinary in .env?');
    } finally {
      setUploadingField(null);
    }
  };

  if (loading) return <AdminLayout title="Profile & Contact"><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout title="Profile & Contact">
      <div className="admin-page__header">
        <div>
          <p>Update your hero, about section, and contact details. Changes appear on the site immediately after saving.</p>
        </div>
      </div>

      <motion.form
        className="admin-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>Photos</h3>
        <div className="admin-form__grid">
          <div className="admin-form__field">
            <label>Profile / About photo</label>
            {avatarUrl && <img src={avatarUrl} alt="avatar" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 12, marginBottom: 8 }} />}
            <label className="btn btn-outline admin-btn-sm" style={{ width: 'fit-content', cursor: 'pointer' }}>
              <FiUpload /> {uploadingField === 'avatar' ? 'Uploading...' : 'Upload photo'}
              <input type="file" accept="image/*" hidden onChange={(e) => handleImageUpload('avatar', e.target.files[0])} />
            </label>
          </div>
          <div className="admin-form__field">
            <label>Hero background image (optional)</label>
            {heroImageUrl && <img src={heroImageUrl} alt="hero" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 12, marginBottom: 8 }} />}
            <label className="btn btn-outline admin-btn-sm" style={{ width: 'fit-content', cursor: 'pointer' }}>
              <FiUpload /> {uploadingField === 'hero' ? 'Uploading...' : 'Upload image'}
              <input type="file" accept="image/*" hidden onChange={(e) => handleImageUpload('hero', e.target.files[0])} />
            </label>
          </div>
        </div>

        <h3 style={{ margin: '24px 0 16px', fontFamily: 'var(--font-display)' }}>Hero &amp; About</h3>
        <div className="admin-form__grid">
          <div className="admin-form__field">
            <label>Full name</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="admin-form__field">
            <label>Roles (comma-separated, for typing effect)</label>
            <input name="roles" value={form.roles} onChange={handleChange} placeholder="Developer, Creator, Editor" />
          </div>
          <div className="admin-form__field admin-form__field--full">
            <label>Tagline</label>
            <input name="tagline" value={form.tagline} onChange={handleChange} />
          </div>
          <div className="admin-form__field admin-form__field--full">
            <label>Bio</label>
            <textarea name="bio" rows={4} value={form.bio} onChange={handleChange} />
          </div>
          <div className="admin-form__field">
            <label>Age</label>
            <input name="age" value={form.age} onChange={handleChange} />
          </div>
          <div className="admin-form__field">
            <label>Birthday</label>
            <input name="birthday" value={form.birthday} onChange={handleChange} />
          </div>
          <div className="admin-form__field">
            <label>Experience</label>
            <input name="experience" value={form.experience} onChange={handleChange} />
          </div>
          <div className="admin-form__field">
            <label>Freelance status</label>
            <input name="freelance" value={form.freelance} onChange={handleChange} />
          </div>
          <div className="admin-form__field">
            <label>Languages</label>
            <input name="languages" value={form.languages} onChange={handleChange} />
          </div>
          <div className="admin-form__field">
            <label>Resume URL</label>
            <input name="resumeUrl" value={form.resumeUrl} onChange={handleChange} placeholder="https://..." />
          </div>
        </div>

        <h3 style={{ margin: '24px 0 16px', fontFamily: 'var(--font-display)' }}>Contact Details</h3>
        <div className="admin-form__grid">
          <div className="admin-form__field admin-form__field--full">
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} />
          </div>
          <div className="admin-form__field">
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="admin-form__field">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>
        </div>

        <h3 style={{ margin: '24px 0 16px', fontFamily: 'var(--font-display)' }}>Social Links</h3>
        <div className="admin-form__grid">
          <div className="admin-form__field">
            <label>Instagram</label>
            <input name="instagram" value={form.instagram} onChange={handleChange} />
          </div>
          <div className="admin-form__field">
            <label>YouTube channel URL</label>
            <input name="youtube" value={form.youtube} onChange={handleChange} />
          </div>
          <div className="admin-form__field">
            <label>Telegram</label>
            <input name="telegram" value={form.telegram} onChange={handleChange} />
          </div>
          <div className="admin-form__field">
            <label>GitHub</label>
            <input name="github" value={form.github} onChange={handleChange} />
          </div>
          <div className="admin-form__field">
            <label>LinkedIn</label>
            <input name="linkedin" value={form.linkedin} onChange={handleChange} />
          </div>
        </div>

        <div className="admin-form__actions">
          <motion.button type="submit" className="btn btn-primary" disabled={saving} whileTap={{ scale: 0.96 }}>
            <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </motion.form>
    </AdminLayout>
  );
}
