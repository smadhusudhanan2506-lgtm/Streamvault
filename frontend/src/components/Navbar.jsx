import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, LogOut, User, Crown, Menu, X } from 'lucide-react';

const PLAN_BADGE = {
  free:   { label: 'FREE',   color: '#888' },
  bronze: { label: 'BRONZE', color: '#CD7F32' },
  silver: { label: 'SILVER', color: '#C0C0C0' },
  gold:   { label: 'GOLD',   color: '#FFD700' },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const badge = user ? PLAN_BADGE[user.plan] : null;

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(5,5,0,0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,215,0,0.15)',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'linear-gradient(135deg,#FFD700,#B8860B)', borderRadius: 8, padding: '6px 8px', display: 'flex' }}>
            <Zap size={20} color="#0a0800" fill="#0a0800" />
          </div>
          <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 20, color: '#FFD700', letterSpacing: 2 }}>
            STREAM<span style={{ color: '#fff' }}>VAULT</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user ? (
            <>
              <Link to="/dashboard" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 600, fontSize: 14, letterSpacing: 0.5 }}>Dashboard</Link>
              <Link to="/upgrade" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 600, fontSize: 14, letterSpacing: 0.5 }}>Upgrade</Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 30, padding: '6px 14px' }}>
                <User size={14} color="#FFD700" />
                <span style={{ color: '#FFD700', fontSize: 13, fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
                <span style={{ background: badge.color, color: '#000', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 20, letterSpacing: 1 }}>{badge.label}</span>
              </div>
              <button onClick={handleLogout} style={{ background: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#ff8080', fontSize: 13 }}>
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"><button className="btn-outline" style={{ padding: '8px 20px' }}>Sign In</button></Link>
              <Link to="/register"><button className="btn-gold" style={{ padding: '8px 20px' }}>Get Started</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
