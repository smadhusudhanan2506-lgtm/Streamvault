import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Crown, Clock, CheckCircle, Smartphone, Copy, ArrowRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PLANS = [
  { key: 'bronze', name: 'Bronze', price: 10,  limit: '7 minutes',    color: '#CD7F32', icon: '🥉', desc: 'Great for casual viewers' },
  { key: 'silver', name: 'Silver', price: 50,  limit: '10 minutes',   color: '#C0C0C0', icon: '🥈', desc: 'Perfect for regular watchers' },
  { key: 'gold',   name: 'Gold',   price: 100, limit: 'Unlimited ♾️', color: '#FFD700', icon: '👑', desc: 'No limits, pure streaming', featured: true },
];

const PAYMENT_METHODS = [
  { key: 'gpay',    name: 'Google Pay', color: '#4285f4', emoji: '💳' },
  { key: 'paytm',   name: 'Paytm',     color: '#002970', emoji: '📱' },
  { key: 'phonepe', name: 'PhonePe',   color: '#5f259f', emoji: '📲' },
];

export default function Upgrade() {
  const { user, updateUser, API } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=choose plan, 2=choose payment, 3=pay, 4=verify, 5=success
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [utr, setUtr] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const availablePlans = PLANS.filter(p => {
    const order = { free: 0, bronze: 1, silver: 2, gold: 3 };
    return order[p.key] > order[user?.plan || 'free'];
  });

  const initiatePayment = async () => {
    try {
      const { data } = await axios.post(`${API}/api/payment/initiate`, {
        plan: selectedPlan.key,
        paymentMethod: paymentMethod.key,
      });
      setPaymentInfo(data);
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to initiate payment');
    }
  };

  const verifyPayment = async () => {
    if (!utr.trim() || utr.trim().length < 6) return toast.error('Enter a valid UTR number (min 6 chars)');
    setVerifying(true);
    try {
      const { data } = await axios.post(`${API}/api/payment/verify`, {
        utr: utr.trim(),
        plan: selectedPlan.key,
        paymentMethod: paymentMethod.key,
      });
      updateUser({ plan: data.user.plan });
      setSuccessData(data);
      setStep(5);
      toast.success('Payment verified! Plan upgraded! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const copyUPI = (id) => { navigator.clipboard.writeText(id); toast.success('UPI ID copied!'); };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeInUp 0.5s ease' }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 36, fontWeight: 900, color: '#FFD700', marginBottom: 12 }}>
          <Crown size={32} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 12 }} />
          Upgrade Your Plan
        </h1>
        <p style={{ color: '#a08040' }}>Unlock more streaming time with a plan upgrade</p>
      </div>

      {/* Step Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 48 }}>
        {['Choose Plan', 'Payment Method', 'Pay', 'Enter UTR', 'Success'].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: step > i + 1 ? 'linear-gradient(135deg,#FFD700,#B8860B)' : step === i + 1 ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)',
              border: `2px solid ${step >= i + 1 ? '#FFD700' : 'rgba(255,215,0,0.2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: step > i + 1 ? '#0a0800' : step === i + 1 ? '#FFD700' : '#6b5a2a',
              fontSize: 13, fontWeight: 700, transition: 'all 0.3s',
            }}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            {i < 4 && <div style={{ width: 32, height: 2, background: step > i + 1 ? '#FFD700' : 'rgba(255,215,0,0.2)', transition: 'background 0.3s' }} />}
          </div>
        ))}
      </div>

      {/* Step 1: Choose Plan */}
      {step === 1 && (
        <div style={{ animation: 'fadeInUp 0.4s ease' }}>
          {availablePlans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 60, marginBottom: 20 }}>👑</div>
              <h2 style={{ color: '#FFD700', fontFamily: 'Cinzel, serif', marginBottom: 12 }}>You're on the Gold Plan!</h2>
              <p style={{ color: '#a08040', marginBottom: 28 }}>You already have the best plan — enjoy unlimited streaming!</p>
              <button className="btn-gold" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: 'Cinzel, serif', color: '#d4af37', marginBottom: 28, fontSize: 20 }}>Select a plan to upgrade to:</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 36 }}>
                {availablePlans.map(plan => (
                  <div key={plan.key} onClick={() => setSelectedPlan(plan)} style={{
                    background: selectedPlan?.key === plan.key
                      ? `linear-gradient(135deg, rgba(${plan.key==='gold'?'255,215,0':'255,255,255'},0.12), rgba(0,0,0,0.3))`
                      : 'linear-gradient(135deg, #110e00, #1a1500)',
                    border: `2px solid ${selectedPlan?.key === plan.key ? plan.color : 'rgba(255,215,0,0.15)'}`,
                    borderRadius: 16, padding: '28px 24px', cursor: 'pointer', transition: 'all 0.3s',
                    transform: selectedPlan?.key === plan.key ? 'scale(1.03)' : 'scale(1)',
                    position: 'relative',
                  }}>
                    {plan.featured && <div style={{ position: 'absolute', top: -12, right: 16, background: 'linear-gradient(135deg,#FFD700,#B8860B)', color: '#0a0800', fontSize: 10, fontWeight: 800, padding: '4px 14px', borderRadius: 20, letterSpacing: 1 }}>BEST VALUE</div>}
                    <div style={{ fontSize: 40, marginBottom: 12 }}>{plan.icon}</div>
                    <h3 style={{ fontFamily: 'Cinzel, serif', color: plan.color, fontSize: 22, marginBottom: 6 }}>{plan.name}</h3>
                    <p style={{ color: '#6b5a2a', fontSize: 13, marginBottom: 16 }}>{plan.desc}</p>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 12 }}>₹{plan.price}<span style={{ fontSize: 13, fontWeight: 400, color: '#a08040' }}>/month</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: plan.color, fontSize: 14, fontWeight: 700 }}>
                      <Clock size={14} /> {plan.limit}
                    </div>
                    {selectedPlan?.key === plan.key && (
                      <div style={{ position: 'absolute', top: 16, right: 16, background: plan.color, borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={16} color="#000" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button className="btn-gold" disabled={!selectedPlan} onClick={() => setStep(2)} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto' }}>
                Continue <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      )}

      {/* Step 2: Payment Method */}
      {step === 2 && (
        <div style={{ animation: 'fadeInUp 0.4s ease', maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Cinzel, serif', color: '#d4af37', marginBottom: 28, fontSize: 20, textAlign: 'center' }}>Choose Payment Method</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
            {PAYMENT_METHODS.map(m => (
              <div key={m.key} onClick={() => setPaymentMethod(m)} style={{
                display: 'flex', alignItems: 'center', gap: 20,
                background: paymentMethod?.key === m.key ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.03)',
                border: `2px solid ${paymentMethod?.key === m.key ? '#FFD700' : 'rgba(255,215,0,0.15)'}`,
                borderRadius: 14, padding: '18px 24px', cursor: 'pointer', transition: 'all 0.3s',
              }}>
                <span style={{ fontSize: 32 }}>{m.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 }}>{m.name}</p>
                  <p style={{ color: '#6b5a2a', fontSize: 12, margin: '4px 0 0' }}>UPI payment via {m.name}</p>
                </div>
                {paymentMethod?.key === m.key && <CheckCircle size={22} color="#FFD700" />}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn-outline" onClick={() => setStep(1)}>← Back</button>
            <button className="btn-gold" disabled={!paymentMethod} onClick={initiatePayment} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              Proceed to Pay ₹{selectedPlan?.price} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Pay */}
      {step === 3 && paymentInfo && (
        <div style={{ animation: 'fadeInUp 0.4s ease', maxWidth: 500, margin: '0 auto' }}>
          <div className="card" style={{ padding: 36, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💸</div>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: '#FFD700', marginBottom: 8 }}>Complete Payment</h2>
            <div style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 12, padding: '20px', marginBottom: 28 }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: '#FFD700', marginBottom: 4 }}>₹{paymentInfo.amount}</div>
              <div style={{ color: '#a08040', fontSize: 14 }}>for {paymentInfo.planName} Plan</div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <p style={{ color: '#a08040', fontSize: 13, marginBottom: 12 }}>Pay to this UPI ID via <strong style={{ color: '#FFD700' }}>{paymentInfo.paymentMethod.toUpperCase()}</strong>:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 10, padding: '14px 18px' }}>
                <Smartphone size={18} color="#FFD700" />
                <span style={{ flex: 1, color: '#fff', fontFamily: 'monospace', fontSize: 16, fontWeight: 700 }}>{paymentInfo.upiId}</span>
                <button onClick={() => copyUPI(paymentInfo.upiId)} style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', color: '#FFD700' }}>
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div style={{ background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.2)', borderRadius: 10, padding: 16, marginBottom: 28, textAlign: 'left' }}>
              <p style={{ color: '#ffa500', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>📋 Instructions:</p>
              <ol style={{ color: '#d4af37', fontSize: 13, paddingLeft: 18, lineHeight: 1.8 }}>
                <li>Open {paymentInfo.paymentMethod.toUpperCase()} app</li>
                <li>Send ₹{paymentInfo.amount} to the UPI ID above</li>
                <li>Note the UTR/Reference number from your app</li>
                <li>Click "I've Paid" and enter the UTR</li>
              </ol>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-outline" onClick={() => setStep(2)}>← Back</button>
              <button className="btn-gold" onClick={() => setStep(4)} style={{ flex: 1 }}>I've Paid ✓</button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Enter UTR */}
      {step === 4 && (
        <div style={{ animation: 'fadeInUp 0.4s ease', maxWidth: 500, margin: '0 auto' }}>
          <div className="card" style={{ padding: 36 }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔑</div>
              <h2 style={{ fontFamily: 'Cinzel, serif', color: '#FFD700', marginBottom: 8 }}>Enter UTR Number</h2>
              <p style={{ color: '#a08040', fontSize: 14 }}>Enter the UTR/Reference number from your payment app to confirm your payment</p>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label>UTR / Reference Number</label>
              <input
                className="input-gold"
                placeholder="e.g. 412345678901 or GPAY1234567890"
                value={utr}
                onChange={e => setUtr(e.target.value)}
                style={{ fontFamily: 'monospace', letterSpacing: 1 }}
              />
              <p style={{ color: '#6b5a2a', fontSize: 12, marginTop: 8 }}>📍 Find this in your payment app under transaction details</p>
            </div>

            <div style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: 10, padding: 16, marginBottom: 24 }}>
              <p style={{ color: '#d4af37', fontSize: 13, margin: 0 }}>
                Plan: <strong style={{ color: '#FFD700' }}>{selectedPlan?.name}</strong> &nbsp;|&nbsp;
                Amount: <strong style={{ color: '#FFD700' }}>₹{selectedPlan?.price}</strong> &nbsp;|&nbsp;
                Via: <strong style={{ color: '#FFD700' }}>{paymentMethod?.name}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-outline" onClick={() => setStep(3)}>← Back</button>
              <button className="btn-gold" disabled={verifying || !utr.trim()} onClick={verifyPayment} style={{ flex: 1 }}>
                {verifying ? '⏳ Verifying...' : '✅ Verify & Upgrade'}
              </button>
            </div>

            <p style={{ color: '#6b5a2a', fontSize: 12, marginTop: 16, textAlign: 'center' }}>
              After verification, an invoice will be sent to {user?.email} 📧
            </p>
          </div>
        </div>
      )}

      {/* Step 5: Success */}
      {step === 5 && successData && (
        <div style={{ animation: 'fadeInUp 0.4s ease', maxWidth: 540, margin: '0 auto', textAlign: 'center' }}>
          <div className="card" style={{ padding: 48 }}>
            <div style={{ fontSize: 72, marginBottom: 20, animation: 'pulse-gold 2s ease infinite' }}>🎉</div>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 28, color: '#FFD700', marginBottom: 12 }}>Payment Successful!</h2>
            <p style={{ color: '#d4af37', fontSize: 16, marginBottom: 32 }}>
              Welcome to the <strong style={{ color: PLANS.find(p=>p.key===selectedPlan?.key)?.color }}>{selectedPlan?.name} Plan</strong>!
            </p>

            <div style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 14, padding: 24, marginBottom: 28 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, textAlign: 'left' }}>
                {[
                  ['Plan', selectedPlan?.name],
                  ['Watch Limit', selectedPlan?.limit],
                  ['Amount Paid', `₹${selectedPlan?.price}`],
                  ['UTR', utr],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p style={{ color: '#6b5a2a', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{k}</p>
                    <p style={{ color: '#FFD700', fontWeight: 700, fontSize: 15 }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(0,200,80,0.08)', border: '1px solid rgba(0,200,80,0.2)', borderRadius: 10, padding: 16, marginBottom: 28 }}>
              <p style={{ color: '#00c851', fontSize: 14, margin: 0 }}>
                📧 Invoice sent to <strong>{user?.email}</strong>
              </p>
            </div>

            <button className="btn-gold" onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: 16, fontSize: 16 }}>
              🎬 Start Streaming Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
