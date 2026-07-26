import { Routes, Route } from 'react-router-dom';
import PortfolioSite from './pages/PortfolioSite';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSkills from './pages/admin/AdminSkills';
import AdminProjects from './pages/admin/AdminProjects';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminTimeline from './pages/admin/AdminTimeline';
import AdminYoutube from './pages/admin/AdminYoutube';
import AdminGallery from './pages/admin/AdminGallery';
import AdminMessages from './pages/admin/AdminMessages';
import ProtectedRoute from './components/admin/ProtectedRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<PortfolioSite />} />

      {/* Admin auth */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <AdminProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/skills"
        element={
          <ProtectedRoute>
            <AdminSkills />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute>
            <AdminProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/certificates"
        element={
          <ProtectedRoute>
            <AdminCertificates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/timeline"
        element={
          <ProtectedRoute>
            <AdminTimeline />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/youtube"
        element={
          <ProtectedRoute>
            <AdminYoutube />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/gallery"
        element={
          <ProtectedRoute>
            <AdminGallery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/messages"
        element={
          <ProtectedRoute>
            <AdminMessages />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
