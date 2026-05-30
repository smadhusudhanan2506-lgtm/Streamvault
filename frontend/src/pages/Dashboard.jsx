import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Crown, Clock, Play, Pause, RotateCcw, TrendingUp } from 'lucide-react';
import axios from 'axios';

const PLAN_INFO = {
  free:   { name: 'Free',   limitSec: 300,  color: '#888',    icon: '🎬', price: 0 },
  bronze: { name: 'Bronze', limitSec: 420,  color: '#CD7F32', icon: '🥉', price: 10 },
  silver: { name: 'Silver', limitSec: 600,  color: '#C0C0C0', icon: '🥈', price: 50 },
  gold:   { name: 'Gold',   limitSec: null, color: '#FFD700', icon: '👑', price: 100 },
};

const DEMO_VIDEOS = [
  { id: 1, title: 'Big Buck Bunny', thumb: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&q=80', duration: '9:56' },
  { id: 2, title: 'Nature Documentary', thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80', duration: '12:30' },
  { id: 3, title: 'City Timelapse', thumb: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80', duration: '8:15' },
  { id: 4, title: 'Ocean Waves', thumb: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80', duration: '15:00' },
];

export default function Dashboard() {
  const { user, API } = useAuth();
  const plan = PLAN_INFO[user?.plan || 'free'];
  const [watching, setWatching] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [limitHit, setLimitHit] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    axios.get(`${API}/api/payment/history`).then(r => setTransactions(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (watching) {
      timerRef.current = setInterval(() => {
        setElapsed(e => {
          const next = e + 1;
          if (plan.limitSec !== null && next >= plan.limitSec) {
            setWatching(false);
            setLimitHit(true);
            clearInterval(timerRef.current);
            return plan.limitSec;
          }
          return next;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [watching]);

  const fmt = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  const pct = plan.limitSec ? Math.min(elapsed / plan.limitSec * 100, 100) : 0;

  const startVideo = (v) => {
    setSelectedVideo(v);
    setElapsed(0);
    setLimitHit(false);
    setWatching(true);
  };

  const reset = () => { setWatching(false); setElapsed(0); setLimitHit(false); setSelectedVideo(null); };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      {/* Welcome */}
      <div style={{ marginBottom: 40, animation: 'fadeInUp 0.5s ease' }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 32, fontWeight: 700, color: '#FFD700', marginBottom: 8 }}>
          Welcome, {user?.name} 👋
        </h1>
        <p style={{ color: '#a08040' }}>Your streaming dashboard</p>
      </div>

      {/* Plan card */}
      <div className="card" style={{
        padding: '28px 32px', marginBottom: 32,
        background: `linear-gradient(135deg, rgba(${user?.plan === 'gold' ? '255,215,0' : '255,255,255'},0.06), rgba(0,0,0,0.3))`,
        border: `1px solid ${plan.color}40`,
        animation: 'fadeInUp 0.5s ease 0.1s both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 48 }}>{plan.icon}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h2 style={{ fontFamily: 'Cinzel, serif', color: plan.color, fontSize: 22, margin: 0 }}>{plan.name} Plan</h2>
                <span style={{ background: plan.color, color: '#000', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 20, letterSpacing: 1 }}>ACTIVE</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#a08040', fontSize: 14 }}>
                <Clock size={14} />
                <span>Watch limit: <strong style={{ color: plan.color }}>{plan.limitSec === null ? 'Unlimited ♾️' : `${plan.limitSec/60} minutes`}</strong></span>
              </div>
            </div>
          </div>
          {user?.plan !== 'gold' && (
            <Link to="/upgrade">
              <button className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={16} /> Upgrade Plan
              </button>
            </Link>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, marginBottom: 32 }}>
        {/* Video Player Simulation */}
        <div className="card" style={{ padding: 28, animation: 'fadeInUp 0.5s ease 0.2s both' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', color: '#FFD700', marginBottom: 20, fontSize: 18 }}>🎬 Video Player</h3>

          {/* Screen */}
          <div style={{
            background: '#000',
            borderRadius: 12,
            aspectRatio: '16/9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,215,0,0.1)',
          }}>
            {selectedVideo ? (
              <>
                <img src={selectedVideo.thumb} alt={selectedVideo.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: watching ? 0.8 : 0.4 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                  <p style={{ color: '#fff', fontWeight: 700, marginBottom: 8, fontSize: 16 }}>{selectedVideo.title}</p>
                  {watching && <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}><div style={{ height: '100%', background: '#FFD700', borderRadius: 2, width: `${plan.limitSec ? pct : (elapsed/900*100)}%`, transition: 'width 1s linear' }} /></div>}
                </div>
                {limitHit && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                    <div style={{ fontSize: 40 }}>⏱️</div>
                    <p style={{ color: '#FFD700', fontFamily: 'Cinzel, serif', fontSize: 18, fontWeight: 700 }}>Time Limit Reached!</p>
                    <p style={{ color: '#a08040', fontSize: 13 }}>Upgrade your plan to watch more</p>
                    <Link to="/upgrade"><button className="btn-gold" style={{ marginTop: 8 }}>Upgrade Now 👑</button></Link>
                  </div>
                )}
                {!watching && !limitHit && <button onClick={() => setWatching(true)} style={{ position: 'absolute', background: 'rgba(255,215,0,0.9)', border: 'none', borderRadius: '50%', width: 60, height: 60, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Play size={24} color="#0a0800" fill="#0a0800" /></button>}
              </>
            ) : (
              <div style={{ textAlign: 'center', color: '#6b5a2a' }}>
                <Play size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
                <p>Select a video below to start watching</p>
              </div>
            )}
          </div>

          {/* Controls */}
          {selectedVideo && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <button onClick={() => setWatching(v => !v)} disabled={limitHit} style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', color: '#FFD700', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                {watching ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Play</>}
              </button>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: 24, fontWeight: 700, color: '#FFD700' }}>{fmt(elapsed)}</div>
                <div style={{ color: '#6b5a2a', fontSize: 12 }}>/ {plan.limitSec ? fmt(plan.limitSec) : '∞'}</div>
              </div>
              <button onClick={reset} style={{ background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', color: '#ff8080', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          )}

          {/* Progress bar */}
          {plan.limitSec && selectedVideo && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#a08040', fontSize: 12 }}>Watch Time Used</span>
                <span style={{ color: pct > 80 ? '#ff8080' : '#FFD700', fontSize: 12, fontWeight: 700 }}>{pct.toFixed(0)}%</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>
                <div style={{ height: '100%', borderRadius: 4, width: `${pct}%`, transition: 'width 0.3s ease', background: pct > 80 ? 'linear-gradient(90deg,#ff6b6b,#ff4757)' : 'linear-gradient(90deg,#FFD700,#B8860B)' }} />
              </div>
            </div>
          )}
        </div>

        {/* Video List */}
        <div className="card" style={{ padding: 24, animation: 'fadeInUp 0.5s ease 0.3s both' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', color: '#FFD700', marginBottom: 20, fontSize: 16 }}>📺 Available Videos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DEMO_VIDEOS.map(v => (
              <div key={v.id} onClick={() => startVideo(v)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: selectedVideo?.id === v.id ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedVideo?.id === v.id ? 'rgba(255,215,0,0.4)' : 'rgba(255,215,0,0.1)'}`,
                borderRadius: 10, padding: 10, cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <img src={v.thumb} alt={v.title} style={{ width: 70, height: 50, objectFit: 'cover', borderRadius: 6 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{v.title}</p>
                  <span style={{ color: '#6b5a2a', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={10} /> {v.duration}
                  </span>
                </div>
                <Play size={16} color="#FFD700" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className="card" style={{ padding: 28, animation: 'fadeInUp 0.5s ease 0.4s both' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', color: '#FFD700', marginBottom: 20, fontSize: 18 }}>💳 Transaction History</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Plan', 'Amount', 'Method', 'UTR', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#6b5a2a', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,215,0,0.1)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => {
                  const p = PLAN_INFO[t.plan];
                  return (
                    <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,215,0,0.06)' }}>
                      <td style={{ padding: '12px 16px' }}><span style={{ background: p.color, color: '#000', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>{p.name.toUpperCase()}</span></td>
                      <td style={{ padding: '12px 16px', color: '#FFD700', fontWeight: 700 }}>₹{t.amount}</td>
                      <td style={{ padding: '12px 16px', color: '#d4af37', textTransform: 'uppercase', fontSize: 13 }}>{t.paymentMethod}</td>
                      <td style={{ padding: '12px 16px', color: '#a08040', fontFamily: 'monospace', fontSize: 13 }}>{t.utr}</td>
                      <td style={{ padding: '12px 16px', color: '#6b5a2a', fontSize: 12 }}>{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
