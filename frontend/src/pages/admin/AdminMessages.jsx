import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiTrash2, FiMail } from 'react-icons/fi';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { StaggerGroup, StaggerItem } from '../../components/shared/StaggerGroup';
import '../../styles/admin.css';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/messages').then((res) => setMessages(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const markRead = async (id) => {
    try {
      await api.put(`/messages/${id}/read`);
      load();
    } catch {
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      toast.success('Message deleted');
      load();
    } catch {
      toast.error('Failed to delete message');
    }
  };

  return (
    <AdminLayout title="Messages">
      <div className="admin-page__header">
        <p>Messages submitted through your contact form.</p>
      </div>

      {loading ? (
        <div className="admin-empty-state">Loading...</div>
      ) : messages.length === 0 ? (
        <div className="admin-empty-state">No messages yet.</div>
      ) : (
        <StaggerGroup style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AnimatePresence initial={false} mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                layout
                exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
              >
                <StaggerItem
                  className="card"
                  style={{
                    padding: 20,
                    borderLeft: msg.read ? '3px solid transparent' : '3px solid var(--accent)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <strong>{msg.name}</strong>
                      <span style={{ color: 'var(--text-faint)', fontSize: '0.85rem', marginLeft: 10 }}>{msg.email}</span>
                      {msg.phone && <span style={{ color: 'var(--text-faint)', fontSize: '0.85rem', marginLeft: 10 }}>{msg.phone}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                      {!msg.read && (
                        <button className="admin-icon-btn" onClick={() => markRead(msg._id)} aria-label="Mark as read" title="Mark as read">
                          <FiMail />
                        </button>
                      )}
                      <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => handleDelete(msg._id)} aria-label="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>{msg.message}</p>
                </StaggerItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </StaggerGroup>
      )}
    </AdminLayout>
  );
}
