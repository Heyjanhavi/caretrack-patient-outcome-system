import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { differenceInDays, format, parseISO } from 'date-fns';
import { TrendingUp, Users, CheckCircle, AlertCircle, Clock, ArrowRight, Send } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { DOCTORS } from '../data/store';

export default function Dashboard({ patients, onSendLink }) {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const responded = patients.filter(p => p.status === 'responded');
  const recovered = patients.filter(p => p.feedback?.improvement === 'recovered');
  const pending = patients.filter(p => p.status === 'pending' || p.status === 'no-response');
  const worsened = patients.filter(p => p.feedback?.improvement === 'worsened');
  const recoveryRate = responded.length ? Math.round((recovered.length / responded.length) * 100) : 0;

  const stats = [
    { label: 'Total patients', value: patients.length, icon: Users, color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
    { label: 'Recovery rate', value: `${recoveryRate}%`, icon: TrendingUp, color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
    { label: 'Awaiting response', value: pending.length, icon: Clock, color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
    { label: 'Need attention', value: worsened.length, icon: AlertCircle, color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  ];

  const getDoctor = (id) => DOCTORS.find(d => d.id === id);
  const daysSince = (date) => differenceInDays(new Date(), parseISO(date));

  const getCardBorder = (p) => {
    if (p.feedback?.improvement === 'recovered') return '1px solid rgba(16,185,129,0.25)';
    if (p.feedback?.improvement === 'worsened' || p.status === 'no-response') return '1px solid rgba(239,68,68,0.25)';
    if (p.status === 'pending') return '1px solid rgba(245,158,11,0.2)';
    return '1px solid rgba(255,255,255,0.06)';
  };

  const recentPatients = [...patients].sort((a, b) =>
    new Date(b.visitDate) - new Date(a.visitDate)
  ).slice(0, 6);

  return (
    <div className="fade-in" style={{ padding: '32px 32px 48px' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
          {format(new Date(), 'EEEE, dd MMMM yyyy')}
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>
          Good morning, Clinic
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          {pending.length} patient{pending.length !== 1 ? 's' : ''} awaiting follow-up response today
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: '#0F1E35', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: '18px 20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{s.label}</span>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={14} color={s.color} />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Patient Board */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>

        {/* Left: Patient cards */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Recent patients</h2>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Live outcome status board</p>
            </div>
            <button onClick={() => navigate('/patients')} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 12, color: '#60A5FA', background: 'none',
              border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8,
              padding: '6px 12px', cursor: 'pointer',
            }}>
              View all <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentPatients.map(p => {
              const doc = getDoctor(p.doctorId);
              const days = daysSince(p.visitDate);
              const isHovered = hoveredCard === p.id;
              return (
                <div
                  key={p.id}
                  onMouseEnter={() => setHoveredCard(p.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate('/patients')}
                  style={{
                    background: isHovered ? '#162440' : '#0F1E35',
                    border: getCardBorder(p),
                    borderRadius: 12, padding: '14px 18px',
                    cursor: 'pointer', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(59,130,246,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 600, color: '#60A5FA', letterSpacing: '0.02em',
                  }}>
                    {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{p.name}</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>· {p.phone}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                      {p.complaint} · {doc?.name} · {days}d ago
                    </div>
                  </div>

                  {/* Status + action */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <StatusBadge
                      status={p.status}
                      improvement={p.feedback?.improvement}
                    />
                    {(p.status === 'scheduled') && (
                      <button
                        onClick={e => { e.stopPropagation(); onSendLink(p.id); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          fontSize: 11, color: '#3B82F6',
                          background: 'rgba(59,130,246,0.12)',
                          border: '1px solid rgba(59,130,246,0.2)',
                          borderRadius: 6, padding: '4px 10px',
                        }}
                      >
                        <Send size={10} /> Send link
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Summary panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Recovery breakdown */}
          <div style={{ background: '#0F1E35', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '18px 20px' }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Outcomes breakdown</h3>
            {[
              { label: 'Recovered', count: recovered.length, color: '#10B981', total: responded.length },
              { label: 'Partial', count: patients.filter(p => p.feedback?.improvement === 'partial').length, color: '#F59E0B', total: responded.length },
              { label: 'Worsened', count: worsened.length, color: '#EF4444', total: responded.length },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{item.count}</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                  <div style={{
                    height: '100%', borderRadius: 2, background: item.color,
                    width: item.total ? `${Math.round((item.count / item.total) * 100)}%` : '0%',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Attention needed */}
          <div style={{ background: '#0F1E35', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12, padding: '18px 20px' }}>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: 'rgba(239,68,68,0.7)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Needs attention
            </h3>
            {patients.filter(p => p.feedback?.improvement === 'worsened' || p.status === 'no-response').length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={14} color="#10B981" />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>All patients accounted for</span>
              </div>
            ) : (
              patients.filter(p => p.feedback?.improvement === 'worsened' || p.status === 'no-response').map(p => (
                <div key={p.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#fff', marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(239,68,68,0.7)' }}>
                    {p.status === 'no-response' ? 'No response after 7 days' : 'Condition worsened'}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Side effect alert */}
          {patients.filter(p => p.feedback?.sideEffects).length > 0 && (
            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ fontSize: 11, color: '#F59E0B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Side effects reported</div>
              {patients.filter(p => p.feedback?.sideEffects).map(p => (
                <div key={p.id} style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                  · {p.name}: {p.feedback.notes}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
