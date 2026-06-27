import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle } from 'lucide-react';
import { DOCTORS } from '../data/store';
import { format } from 'date-fns';

const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, color: '#fff', fontSize: 13,
  outline: 'none', transition: 'border-color 0.15s',
};

const labelStyle = {
  display: 'block', fontSize: 11, fontWeight: 500,
  color: 'rgba(255,255,255,0.45)', marginBottom: 6,
  textTransform: 'uppercase', letterSpacing: '0.06em',
};

export default function RegisterPatient({ onRegister }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', phone: '', visitDate: format(new Date(), 'yyyy-MM-dd'),
    doctorId: 'd1', complaint: '', followupDays: '4',
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState('');
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim()) { setError('Patient name is required'); return; }
    if (!/^\d{10}$/.test(form.phone)) { setError('Enter a valid 10-digit mobile number'); return; }
    if (!form.complaint.trim()) { setError('Complaint is required'); return; }
    setError('');
    onRegister({
      id: 'p' + Date.now(),
      ...form,
      status: 'scheduled',
      linkSent: false,
      feedback: null,
    });
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="fade-in" style={{ padding: '80px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(16,185,129,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <CheckCircle size={28} color="#10B981" />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Patient registered</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 28 }}>
          {form.name} has been added. A follow-up link will be sent automatically in {form.followupDays} days via SMS.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', visitDate: format(new Date(), 'yyyy-MM-dd'), doctorId: 'd1', complaint: '', followupDays: '4' }); }} style={{
            padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: 'rgba(59,130,246,0.15)', color: '#60A5FA',
            border: '1px solid rgba(59,130,246,0.25)', cursor: 'pointer',
          }}>Register another</button>
          <button onClick={() => navigate('/')} style={{
            padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: '#3B82F6', color: '#fff', border: 'none', cursor: 'pointer',
          }}>Go to dashboard</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fade-in" style={{ padding: '32px 32px 60px', maxWidth: 640 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserPlus size={15} color="#3B82F6" />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>Register patient</h1>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginLeft: 42 }}>
          Fill in visit details. A follow-up SMS will be sent automatically.
        </p>
      </div>

      <div style={{ background: '#0F1E35', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '28px 28px' }}>

        {/* Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
          <div>
            <label style={labelStyle}>Patient name</label>
            <input
              value={form.name} onChange={e => set('name', e.target.value)}
              onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
              placeholder="Full name"
              style={{ ...inputStyle, borderColor: focused === 'name' ? '#3B82F6' : 'rgba(255,255,255,0.1)' }}
            />
          </div>
          <div>
            <label style={labelStyle}>Mobile number</label>
            <input
              value={form.phone} onChange={e => set('phone', e.target.value)}
              onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
              placeholder="10-digit number" maxLength={10}
              style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace', borderColor: focused === 'phone' ? '#3B82F6' : 'rgba(255,255,255,0.1)' }}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
          <div>
            <label style={labelStyle}>Visit date</label>
            <input
              type="date" value={form.visitDate} onChange={e => set('visitDate', e.target.value)}
              onFocus={() => setFocused('date')} onBlur={() => setFocused('')}
              style={{ ...inputStyle, colorScheme: 'dark', borderColor: focused === 'date' ? '#3B82F6' : 'rgba(255,255,255,0.1)' }}
            />
          </div>
          <div>
            <label style={labelStyle}>Doctor</label>
            <select
              value={form.doctorId} onChange={e => set('doctorId', e.target.value)}
              onFocus={() => setFocused('doc')} onBlur={() => setFocused('')}
              style={{ ...inputStyle, borderColor: focused === 'doc' ? '#3B82F6' : 'rgba(255,255,255,0.1)' }}
            >
              {DOCTORS.map(d => (
                <option key={d.id} value={d.id} style={{ background: '#0F1E35' }}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Complaint */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Chief complaint</label>
          <textarea
            value={form.complaint} onChange={e => set('complaint', e.target.value)}
            onFocus={() => setFocused('complaint')} onBlur={() => setFocused('')}
            placeholder="Describe the patient's main symptoms..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, borderColor: focused === 'complaint' ? '#3B82F6' : 'rgba(255,255,255,0.1)' }}
          />
        </div>

        {/* Followup days */}
        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Send follow-up after</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['3', '4', '5', '7'].map(d => (
              <button
                key={d}
                onClick={() => set('followupDays', d)}
                style={{
                  padding: '8px 18px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                  fontWeight: form.followupDays === d ? 600 : 400,
                  background: form.followupDays === d ? '#3B82F6' : 'rgba(255,255,255,0.04)',
                  color: form.followupDays === d ? '#fff' : 'rgba(255,255,255,0.45)',
                  border: form.followupDays === d ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.15s',
                }}
              >{d} days</button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ fontSize: 12, color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 18 }}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} style={{
          width: '100%', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600,
          background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          color: '#fff', border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
          transition: 'opacity 0.15s',
        }}>
          Register & schedule follow-up
        </button>
      </div>
    </div>
  );
}
