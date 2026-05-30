import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Zap, User, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Fill all fields');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be 6+ characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to StreamVault 🎬');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: 460, animation: 'fadeInUp 0.5s ease' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', background: 'linear-gradient(135deg,#FFD700,#B8860B)', borderRadius: 14, padding: 14, marginBottom: 20 }}>
            <Zap size={28} color="#0a0800" fill="#0a0800" />
          </div>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 32, fontWeight: 900, color: '#FFD700', marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: '#a08040' }}>Join StreamVault — Start streaming today</p>
        </div>

        {/* Form */}
        <div className="card" style={{ padding: 36 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#6b5a2a" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="input-gold" style={{ paddingLeft: 44 }} placeholder="John Doe" value={form.name} onChange={set('name')} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#6b5a2a" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="input-gold" style={{ paddingLeft: 44 }} type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#6b5a2a" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="input-gold" style={{ paddingLeft: 44, paddingRight: 44 }} type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={set('password')} />
                <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b5a2a' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div style={{ marginBottom: 28 }}>
              <label>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#6b5a2a" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="input-gold" style={{ paddingLeft: 44 }} type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} />
              </div>
            </div>
            <button className="btn-gold" type="submit" disabled={loading} style={{ width: '100%', padding: 16, fontSize: 15 }}>
              {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', borderTop: '1px solid rgba(255,215,0,0.1)', paddingTop: 24 }}>
            <p style={{ color: '#a08040', fontSize: 14 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#FFD700', fontWeight: 600, textDecoration: 'none' }}>Sign In →</Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#6b5a2a', fontSize: 12, marginTop: 20 }}>
          A welcome email will be sent to your inbox upon registration ✉️
        </p>
      </div>
    </div>
  );
}
