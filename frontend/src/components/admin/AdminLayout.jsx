import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome, FiUser, FiCode, FiFolder, FiAward, FiClock,
  FiYoutube, FiImage, FiMail, FiLogOut, FiExternalLink,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../shared/ThemeToggle';
import './AdminLayout.css';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: FiHome, end: true },
  { to: '/admin/profile', label: 'Profile & Contact', icon: FiUser },
  { to: '/admin/skills', label: 'Skills', icon: FiCode },
  { to: '/admin/timeline', label: 'Timeline', icon: FiClock },
  { to: '/admin/projects', label: 'Projects', icon: FiFolder },
  { to: '/admin/certificates', label: 'Certificates', icon: FiAward },
  { to: '/admin/youtube', label: 'YouTube', icon: FiYoutube },
  { to: '/admin/gallery', label: 'Gallery', icon: FiImage },
  { to: '/admin/messages', label: 'Messages', icon: FiMail },
];

export default function AdminLayout({ title, children }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__brand-dot" />
          Admin Panel
        </div>

        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`}
            >
              <Icon /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" rel="noreferrer" className="admin-sidebar__link">
            <FiExternalLink /> View Site
          </a>
          <button onClick={handleLogout} className="admin-sidebar__link admin-sidebar__logout">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <h1>{title}</h1>
          <div className="admin-topbar__right">
            <ThemeToggle />
            <span className="admin-topbar__admin">{admin?.name || admin?.email}</span>
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
