import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Zap, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Fill all fields');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: 440, animation: 'fadeInUp 0.5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', background: 'linear-gradient(135deg,#FFD700,#B8860B)', borderRadius: 14, padding: 14, marginBottom: 20 }}>
            <Zap size={28} color="#0a0800" fill="#0a0800" />
          </div>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 32, fontWeight: 900, color: '#FFD700', marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: '#a08040' }}>Sign in to your StreamVault account</p>
        </div>

        <div className="card" style={{ padding: 36 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#6b5a2a" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="input-gold" style={{ paddingLeft: 44 }} type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} autoFocus />
              </div>
            </div>
            <div style={{ marginBottom: 28 }}>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#6b5a2a" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="input-gold" style={{ paddingLeft: 44, paddingRight: 44 }} type={showPass ? 'text' : 'password'} placeholder="Your password" value={form.password} onChange={set('password')} />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b5a2a' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button className="btn-gold" type="submit" disabled={loading} style={{ width: '100%', padding: 16, fontSize: 15 }}>
              {loading ? '⏳ Signing In...' : '🔑 Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', borderTop: '1px solid rgba(255,215,0,0.1)', paddingTop: 24 }}>
            <p style={{ color: '#a08040', fontSize: 14 }}>
              New to StreamVault?{' '}
              <Link to="/register" style={{ color: '#FFD700', fontWeight: 600, textDecoration: 'none' }}>Create Account →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
