import { useState } from 'react';
import { differenceInDays, format, parseISO } from 'date-fns';
import { Search, X, Star, Phone, Calendar, User, MessageSquare } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { DOCTORS } from '../data/store';

const FILTERS = ['All', 'Responded', 'Pending', 'No response', 'Recovered', 'Worsened'];

export default function Patients({ patients }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const getDoctor = id => DOCTORS.find(d => d.id === id);

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search);
    const matchFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Responded' && p.status === 'responded') ||
      (activeFilter === 'Pending' && p.status === 'pending') ||
      (activeFilter === 'No response' && p.status === 'no-response') ||
      (activeFilter === 'Recovered' && p.feedback?.improvement === 'recovered') ||
      (activeFilter === 'Worsened' && p.feedback?.improvement === 'worsened');
    return matchSearch && matchFilter;
  });

  const Stars = ({ n }) => (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} fill={i <= n ? '#F59E0B' : 'none'} color={i <= n ? '#F59E0B' : 'rgba(255,255,255,0.2)'} />
      ))}
    </div>
  );

  return (
    <div className="fade-in" style={{ padding: '32px 0', display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* Left pane */}
      <div style={{ flex: 1, padding: '0 24px', overflowY: 'auto', maxHeight: '100%' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Patients</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{filtered.length} records</p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            style={{
              width: '100%', padding: '10px 14px 10px 34px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none',
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: 'pointer',
              background: activeFilter === f ? '#3B82F6' : 'rgba(255,255,255,0.04)',
              color: activeFilter === f ? '#fff' : 'rgba(255,255,255,0.4)',
              border: activeFilter === f ? 'none' : '1px solid rgba(255,255,255,0.08)',
              transition: 'all 0.15s',
            }}>{f}</button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#0F1E35', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.5fr 120px 1fr 1fr 110px',
            padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <span>Patient</span><span>Phone</span><span>Doctor</span><span>Visit</span><span>Status</span>
          </div>
          {filtered.map((p, i) => {
            const doc = getDoctor(p.doctorId);
            const isSelected = selected?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelected(isSelected ? null : p)}
                style={{
                  display: 'grid', gridTemplateColumns: '1.5fr 120px 1fr 1fr 110px',
                  padding: '13px 18px', cursor: 'pointer', transition: 'background 0.12s',
                  background: isSelected ? 'rgba(59,130,246,0.08)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  borderLeft: isSelected ? '2px solid #3B82F6' : '2px solid transparent',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{p.complaint}</div>
                </div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {p.phone}
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{doc?.name.replace('Dr. ', '')}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                  {format(parseISO(p.visitDate), 'dd MMM yyyy')}
                </span>
                <StatusBadge status={p.status} improvement={p.feedback?.improvement} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="slide-in" style={{
          width: 320, borderLeft: '1px solid rgba(255,255,255,0.06)',
          background: '#0A1628', overflowY: 'auto', padding: '24px 20px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Patient detail</h3>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>

          {/* Avatar + name */}
          <div style={{ textAlign: 'center', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%', margin: '0 auto 12px',
              background: 'rgba(59,130,246,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 600, color: '#60A5FA',
            }}>
              {selected.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{selected.name}</div>
            <StatusBadge status={selected.status} improvement={selected.feedback?.improvement} size="lg" />
          </div>

          {/* Details */}
          {[
            { icon: Phone, label: 'Mobile', val: selected.phone },
            { icon: Calendar, label: 'Visit date', val: format(parseISO(selected.visitDate), 'dd MMM yyyy') },
            { icon: User, label: 'Doctor', val: getDoctor(selected.doctorId)?.name },
            { icon: MessageSquare, label: 'Complaint', val: selected.complaint },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
              <Icon size={13} color="rgba(255,255,255,0.3)" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{val}</div>
              </div>
            </div>
          ))}

          {/* Feedback */}
          {selected.feedback && (
            <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Feedback received</div>

              {selected.feedback.daysToRecover && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>
                  Recovered in <strong style={{ color: '#10B981' }}>{selected.feedback.daysToRecover} days</strong>
                </div>
              )}
              {selected.feedback.sideEffects && (
                <div style={{ fontSize: 12, color: '#F59E0B', marginBottom: 10 }}>⚠ Side effects reported</div>
              )}
              {selected.feedback.referredElsewhere && (
                <div style={{ fontSize: 12, color: '#EF4444', marginBottom: 10 }}>→ Referred to another hospital</div>
              )}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 5 }}>Satisfaction</div>
                <Stars n={selected.feedback.satisfaction} />
              </div>
              {selected.feedback.notes && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', lineHeight: 1.6, background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
                  "{selected.feedback.notes}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
