import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX, FiYoutube, FiRefreshCw } from 'react-icons/fi';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import AnimatedFormPanel from '../../components/admin/AnimatedFormPanel';
import { AnimatedTableBody, AnimatedTableRow } from '../../components/admin/AnimatedTableRow';
import '../../styles/admin.css';

const EMPTY = { videoId: '', title: '', description: '', order: 0 };

function extractVideoId(input) {
  if (!input) return '';
  // Already a bare ID (11 chars, no slashes/dots)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  try {
    const url = new URL(input);
    if (url.hostname.includes('youtu.be')) return url.pathname.slice(1);
    if (url.searchParams.get('v')) return url.searchParams.get('v');
    const shortsMatch = url.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) return shortsMatch[1];
  } catch {
    // not a valid URL, fall through
  }
  return input.trim();
}

export default function AdminYoutube() {
  const [pinned, setPinned] = useState([]);
  const [auto, setAuto] = useState([]);
  const [channelInfo, setChannelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/youtube').then((res) => {
      setPinned(res.data.pinned);
      setAuto(res.data.auto);
      setChannelInfo({ channelUrl: res.data.channelUrl, channelHandle: res.data.channelHandle });
    }).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'order' ? Number(value) : value }));
  };

  const openNew = () => { setForm(EMPTY); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setForm(EMPTY); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const videoId = extractVideoId(form.videoId);
      const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      await api.post('/youtube', { ...form, videoId, thumbnailUrl });
      toast.success('Video pinned!');
      closeForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add video');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this pinned video?')) return;
    try {
      await api.delete(`/youtube/${id}`);
      toast.success('Video removed');
      load();
    } catch (err) {
      toast.error('Failed to remove video');
    }
  };

  return (
    <AdminLayout title="YouTube">
      <div className="admin-page__header">
        <div>
          <p>
            Pin specific videos to always show first, or let the site auto-fetch your latest uploads
            {channelInfo?.channelHandle ? ` from ${channelInfo.channelHandle}` : ''}.
            {' '}Auto-fetch requires <code>YOUTUBE_API_KEY</code> set in the backend .env.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline admin-btn-sm" onClick={load}>
            <FiRefreshCw /> Refresh
          </button>
          {!showForm && (
            <button className="btn btn-primary admin-btn-sm" onClick={openNew}>
              <FiPlus /> Pin a Video
            </button>
          )}
        </div>
      </div>

      <AnimatedFormPanel show={showForm}>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__grid">
            <div className="admin-form__field admin-form__field--full">
              <label>Video URL or ID</label>
              <input
                name="videoId"
                value={form.videoId}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=... or just the video ID"
                required
              />
              <small>Paste the full YouTube link — the video ID will be extracted automatically.</small>
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="admin-form__field admin-form__field--full">
              <label>Description (optional)</label>
              <textarea name="description" rows={2} value={form.description} onChange={handleChange} />
            </div>
            <div className="admin-form__field">
              <label>Display order</label>
              <input type="number" name="order" value={form.order} onChange={handleChange} />
            </div>
          </div>
          <div className="admin-form__actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Pin Video'}
            </button>
            <button type="button" className="btn btn-outline" onClick={closeForm}>
              <FiX /> Cancel
            </button>
          </div>
        </form>
      </AnimatedFormPanel>

      <h3 style={{ margin: '8px 0 12px', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>
        Pinned Videos ({pinned.length})
      </h3>
      <div className="admin-table-wrap" style={{ marginBottom: 28 }}>
        {loading ? (
          <div className="admin-empty-state">Loading...</div>
        ) : pinned.length === 0 ? (
          <div className="admin-empty-state">No pinned videos yet. Pin one above.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Video ID</th>
                <th></th>
              </tr>
            </thead>
            <AnimatedTableBody>
              {pinned.map((video) => (
                <AnimatedTableRow key={video._id}>
                  <td>
                    {video.thumbnailUrl ? (
                      <img src={video.thumbnailUrl} alt={video.title} className="admin-table__thumb" />
                    ) : (
                      <div className="admin-table__thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiYoutube />
                      </div>
                    )}
                  </td>
                  <td><strong>{video.title}</strong></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{video.videoId}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => handleDelete(video._id)} aria-label="Delete">
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

      <h3 style={{ margin: '8px 0 12px', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>
        Auto-fetched from channel ({auto.length})
      </h3>
      <div className="admin-table-wrap">
        {auto.length === 0 ? (
          <div className="admin-empty-state">
            No auto-fetched videos. Set <code>YOUTUBE_API_KEY</code> in the backend .env to enable this.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Video ID</th>
              </tr>
            </thead>
            <AnimatedTableBody>
              {auto.map((video) => (
                <AnimatedTableRow key={video.videoId}>
                  <td><img src={video.thumbnailUrl} alt={video.title} className="admin-table__thumb" /></td>
                  <td>{video.title}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{video.videoId}</td>
                </AnimatedTableRow>
              ))}
            </AnimatedTableBody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
