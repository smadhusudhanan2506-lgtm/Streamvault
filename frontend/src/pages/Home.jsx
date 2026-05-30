import { Link } from 'react-router-dom';
import { Play, Crown, Clock, Zap, Star, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const plans = [
  { key: 'free',   name: 'Free',   price: 0,   limit: '5 min',     color: '#888',    icon: '🎬', features: ['Basic streaming', '5 min per video', 'Standard quality'] },
  { key: 'bronze', name: 'Bronze', price: 10,  limit: '7 min',     color: '#CD7F32', icon: '🥉', features: ['Extended streaming', '7 min per video', 'HD quality'] },
  { key: 'silver', name: 'Silver', price: 50,  limit: '10 min',    color: '#C0C0C0', icon: '🥈', features: ['Premium streaming', '10 min per video', 'Full HD quality', 'Priority support'] },
  { key: 'gold',   name: 'Gold',   price: 100, limit: 'Unlimited', color: '#FFD700', icon: '👑', features: ['Unlimited streaming', 'No time limits', '4K Ultra HD', 'Priority support', 'Early access'], featured: true },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: '100px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 70% at 50% 0%, rgba(255,215,0,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', animation: 'fadeInUp 0.7s ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 30, padding: '6px 18px', marginBottom: 32 }}>
            <Crown size={14} color="#FFD700" />
            <span style={{ color: '#FFD700', fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>PREMIUM STREAMING PLATFORM</span>
          </div>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(36px, 7vw, 72px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
            <span style={{ background: 'linear-gradient(135deg, #FFD700, #B8860B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Stream Without</span>
            <br /><span style={{ color: '#fff' }}>Limits</span>
          </h1>
          <p style={{ color: '#a08040', fontSize: 18, lineHeight: 1.7, marginBottom: 48, maxWidth: 560, margin: '0 auto 48px' }}>
            Choose your perfect plan and enjoy premium video streaming. From free to unlimited — your content, your rules.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to="/dashboard"><button className="btn-gold" style={{ fontSize: 16, padding: '16px 40px' }}>Go to Dashboard</button></Link>
            ) : (
              <>
                <Link to="/register"><button className="btn-gold" style={{ fontSize: 16, padding: '16px 40px' }}>Start for Free</button></Link>
                <Link to="/login"><button className="btn-outline" style={{ fontSize: 16, padding: '16px 40px' }}>Sign In</button></Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {[
            { icon: <Play size={24} color="#FFD700" />, value: '10,000+', label: 'Videos Available' },
            { icon: <Star size={24} color="#FFD700" />, value: '4.9/5', label: 'User Rating' },
            { icon: <Shield size={24} color="#FFD700" />, value: '100%', label: 'Secure Payments' },
            { icon: <Zap size={24} color="#FFD700" />, value: '4K UHD', label: 'Max Resolution' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: '28px 24px', textAlign: 'center', animation: `fadeInUp 0.5s ease ${i * 0.1}s both` }}>
              <div style={{ marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: 28, fontWeight: 700, color: '#FFD700', marginBottom: 4 }}>{s.value}</div>
              <div style={{ color: '#a08040', fontSize: 13 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section id="plans" style={{ padding: '0 24px 100px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#FFD700', marginBottom: 16 }}>Choose Your Plan</h2>
            <p style={{ color: '#a08040', fontSize: 16 }}>Flexible plans for every type of viewer</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {plans.map((plan, i) => (
              <div key={plan.key} style={{
                background: plan.featured ? 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(184,134,11,0.08))' : 'linear-gradient(135deg, #110e00, #1a1500)',
                border: `1px solid ${plan.featured ? plan.color : 'rgba(255,215,0,0.15)'}`,
                borderRadius: 20,
                padding: '32px 28px',
                position: 'relative',
                animation: `fadeInUp 0.5s ease ${i * 0.1 + 0.2}s both`,
                transform: plan.featured ? 'scale(1.03)' : 'scale(1)',
              }}>
                {plan.featured && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#FFD700,#B8860B)', color: '#0a0800', fontSize: 11, fontWeight: 800, padding: '5px 20px', borderRadius: 20, letterSpacing: 1.5, whiteSpace: 'nowrap' }}>
                    ⭐ MOST POPULAR
                  </div>
                )}
                <div style={{ fontSize: 36, marginBottom: 12 }}>{plan.icon}</div>
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: 22, fontWeight: 700, color: plan.color, marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ marginBottom: 20 }}>
                  {plan.price === 0 ? (
                    <span style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>Free</span>
                  ) : (
                    <span style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>₹{plan.price}<span style={{ fontSize: 14, color: '#a08040', fontWeight: 400 }}>/month</span></span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '10px 14px', background: `rgba(${plan.key === 'gold' ? '255,215,0' : '255,255,255'},0.08)`, borderRadius: 8 }}>
                  <Clock size={16} color={plan.color} />
                  <span style={{ color: plan.color, fontWeight: 700, fontSize: 14 }}>Watch limit: {plan.limit}</span>
                </div>
                <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ color: '#d4af37', fontSize: 14, padding: '6px 0', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,215,0,0.08)' }}>
                      <span style={{ color: plan.color, fontSize: 16 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                {plan.key === 'free' ? (
                  <Link to="/register" style={{ display: 'block', textDecoration: 'none' }}>
                    <button className="btn-outline" style={{ width: '100%' }}>Get Started Free</button>
                  </Link>
                ) : (
                  <Link to={user ? '/upgrade' : '/register'} style={{ display: 'block', textDecoration: 'none' }}>
                    <button className="btn-gold" style={{ width: '100%', background: `linear-gradient(135deg, ${plan.color}, ${plan.key === 'silver' ? '#888' : plan.key === 'bronze' ? '#8B4513' : '#B8860B'})` }}>
                      Upgrade to {plan.name}
                    </button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
