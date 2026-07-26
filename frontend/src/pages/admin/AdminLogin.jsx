import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiMail, FiTerminal } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const { admin, login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  if (!loading && admin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <motion.div
        className="admin-login__card"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: shake ? [0, -10, 10, -8, 8, -4, 4, 0] : 0,
        }}
        transition={{
          duration: shake ? 0.5 : 0.6,
          ease: shake ? 'easeInOut' : [0.22, 1, 0.36, 1],
        }}
      >
        <div className="admin-login__brand">
          <FiTerminal />
          <span>Admin Login</span>
        </div>
        <p className="admin-login__subtitle">Sign in to manage your portfolio content.</p>

        <form onSubmit={handleSubmit}>
          <div className="admin-login__field">
            <FiMail />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="admin-login__field">
            <FiLock />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <motion.button
            type="submit"
            className="btn btn-primary admin-login__submit"
            disabled={submitting}
            whileTap={{ scale: 0.97 }}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
