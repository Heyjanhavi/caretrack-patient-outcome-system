import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Star, Activity } from 'lucide-react';

const STEPS = ['Recovery', 'Side effects', 'Satisfaction', 'Done'];

export default function FeedbackForm({ patients, onSubmitFeedback }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = patients.find(p => p.id === id);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    improvement: '', daysToRecover: '', sideEffects: null,
    referredElsewhere: null, satisfaction: 0, notes: '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (!patient) return (
    <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
        Invalid or expired feedback link.
      </div>
    </div>
  );

  if (patient.feedback) return (
    <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 360 }}>
        <CheckCircle size={40} color="#10B981" style={{ marginBottom: 16 }} />
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Already submitted</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
          Your feedback has already been recorded. Thank you, {patient.name.split(' ')[0]}!
        </p>
      </div>
    </div>
  );

  const btnBase = {
    padding: '11px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500,
    cursor: 'pointer', transition: 'all 0.15s', border: 'none',
  };

  const OptionBtn = ({ val, selected, onClick, children }) => (
    <button onClick={onClick} style={{
      ...btnBase,
      width: '100%', marginBottom: 10, textAlign: 'left',
      background: selected ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.04)',
      color: selected ? '#60A5FA' : 'rgba(255,255,255,0.6)',
      border: selected ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
    }}>{children}</button>
  );

  const YesNo = ({ value, onChange }) => (
    <div style={{ display: 'flex', gap: 10 }}>
      {['Yes', 'No'].map(opt => (
        <button key={opt} onClick={() => onChange(opt === 'Yes')} style={{
          ...btnBase, flex: 1,
          background: value === (opt === 'Yes') ? (opt === 'Yes' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)') : 'rgba(255,255,255,0.04)',
          color: value === (opt === 'Yes') ? (opt === 'Yes' ? '#F87171' : '#34D399') : 'rgba(255,255,255,0.5)',
          border: `1px solid ${value === (opt === 'Yes') ? (opt === 'Yes' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)') : 'rgba(255,255,255,0.08)'}`,
        }}>{opt}</button>
      ))}
    </div>
  );

  const progress = (step / (STEPS.length - 1)) * 100;

  const handleNext = () => {
    if (step === STEPS.length - 2) {
      onSubmitFeedback(patient.id, {
        improvement: form.improvement,
        daysToRecover: form.improvement === 'recovered' ? (parseInt(form.daysToRecover) || null) : null,
        sideEffects: form.sideEffects === true,
        referredElsewhere: form.referredElsewhere === true,
        satisfaction: form.satisfaction,
        notes: form.notes,
      });
      setStep(s => s + 1);
    } else {
      setStep(s => s + 1);
    }
  };

  const canNext = () => {
    if (step === 0) return !!form.improvement;
    if (step === 1) return form.sideEffects !== null && form.referredElsewhere !== null;
    if (step === 2) return form.satisfaction > 0;
    return true;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#3B82F6,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Activity size={14} color="#fff" />
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>CareTrack</span>
      </div>

      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Progress bar */}
        {step < STEPS.length - 1 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              {STEPS.slice(0, -1).map((s, i) => (
                <span key={s} style={{ fontSize: 11, color: i <= step ? '#60A5FA' : 'rgba(255,255,255,0.25)', fontWeight: i === step ? 600 : 400 }}>{s}</span>
              ))}
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg,#3B82F6,#10B981)', borderRadius: 2, width: `${progress}%`, transition: 'width 0.4s ease' }} />
            </div>
          </div>
        )}

        {/* Card */}
        <div className="fade-in" style={{ background: '#0F1E35', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 28px' }}>

          {/* Greeting */}
          {step === 0 && (
            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Follow-up · {patient.complaint}</div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Hi {patient.name.split(' ')[0]}, how are you feeling?</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 22, lineHeight: 1.6 }}>This takes 60 seconds. Your doctor will review your response.</p>
              {['recovered', 'partial', 'no-improvement', 'worsened'].map(opt => (
                <OptionBtn key={opt} val={opt} selected={form.improvement === opt} onClick={() => set('improvement', opt)}>
                  {{ recovered: '✓ Fully recovered', partial: '↗ Getting better, not fully well', 'no-improvement': '→ No change yet', worsened: '↓ Feeling worse than before' }[opt]}
                </OptionBtn>
              ))}
              {form.improvement === 'recovered' && (
                <div style={{ marginTop: 4 }}>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>How many days did it take?</label>
                  <input
                    type="number" min={1} max={30} placeholder="e.g. 3"
                    value={form.daysToRecover} onChange={e => set('daysToRecover', e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                  />
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Any issues with the treatment?</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 22 }}>Be honest — this helps your doctor improve.</p>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 8 }}>Did you experience any side effects or allergic reactions?</label>
                <YesNo value={form.sideEffects} onChange={v => set('sideEffects', v)} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 8 }}>Did you visit another hospital or doctor after this?</label>
                <YesNo value={form.referredElsewhere} onChange={v => set('referredElsewhere', v)} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 8 }}>Any additional notes? (optional)</label>
                <textarea
                  value={form.notes} onChange={e => set('notes', e.target.value)}
                  placeholder="Describe any symptoms, reactions, or concerns..."
                  rows={3}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Rate your experience</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>How satisfied were you with the doctor's care?</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => set('satisfaction', n)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                    transform: n <= form.satisfaction ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.15s',
                  }}>
                    <Star size={32} fill={n <= form.satisfaction ? '#F59E0B' : 'none'} color={n <= form.satisfaction ? '#F59E0B' : 'rgba(255,255,255,0.2)'} />
                  </button>
                ))}
              </div>
              <div style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)', height: 20 }}>
                {['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'][form.satisfaction]}
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <CheckCircle size={28} color="#10B981" />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Thank you, {patient.name.split(' ')[0]}!</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
                Your feedback has been sent to your doctor. We hope you feel better soon.
              </p>
            </div>
          )}

          {/* Nav buttons */}
          {step < STEPS.length - 1 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} style={{ ...btnBase, flex: 1, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>Back</button>
              )}
              <button onClick={handleNext} disabled={!canNext()} style={{
                ...btnBase, flex: 2,
                background: canNext() ? 'linear-gradient(135deg,#3B82F6,#2563EB)' : 'rgba(255,255,255,0.06)',
                color: canNext() ? '#fff' : 'rgba(255,255,255,0.3)',
                boxShadow: canNext() ? '0 4px 14px rgba(59,130,246,0.25)' : 'none',
              }}>
                {step === STEPS.length - 2 ? 'Submit feedback' : 'Continue'}
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 18 }}>
          Powered by CareTrack · Your data is private and secure
        </p>
      </div>
    </div>
  );
}
