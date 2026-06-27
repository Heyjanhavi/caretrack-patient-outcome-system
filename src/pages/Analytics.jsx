import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from 'recharts';
import { DOCTORS } from '../data/store';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

const tooltipStyle = {
  contentStyle: { background: '#162440', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 },
  labelStyle: { color: 'rgba(255,255,255,0.5)' },
  itemStyle: { color: '#fff' },
};

export default function Analytics({ patients }) {
  const responded = patients.filter(p => p.status === 'responded');

  // Outcome breakdown
  const outcomeData = [
    { name: 'Recovered', value: patients.filter(p => p.feedback?.improvement === 'recovered').length, color: '#10B981' },
    { name: 'Partial',   value: patients.filter(p => p.feedback?.improvement === 'partial').length, color: '#F59E0B' },
    { name: 'Worsened',  value: patients.filter(p => p.feedback?.improvement === 'worsened').length, color: '#EF4444' },
    { name: 'Pending',   value: patients.filter(p => !p.feedback).length, color: '#3B82F6' },
  ];

  // Doctor-wise recovery
  const doctorData = DOCTORS.map(d => {
    const docPatients = patients.filter(p => p.doctorId === d.id);
    const docResponded = docPatients.filter(p => p.feedback);
    const docRecovered = docPatients.filter(p => p.feedback?.improvement === 'recovered');
    return {
      name: d.name.replace('Dr. ', ''),
      patients: docPatients.length,
      recovered: docRecovered.length,
      rate: docResponded.length ? Math.round((docRecovered.length / docResponded.length) * 100) : 0,
    };
  });

  // Satisfaction
  const satisfactionData = [1,2,3,4,5].map(n => ({
    rating: `${n}★`,
    count: responded.filter(p => p.feedback?.satisfaction === n).length,
  }));

  // Side effects + referrals
  const sideEffects = responded.filter(p => p.feedback?.sideEffects).length;
  const referrals = responded.filter(p => p.feedback?.referredElsewhere).length;
  const avgSatisfaction = responded.length
    ? (responded.reduce((s, p) => s + (p.feedback?.satisfaction || 0), 0) / responded.length).toFixed(1)
    : '—';
  const avgRecovery = responded.filter(p => p.feedback?.daysToRecover).length
    ? (responded.filter(p => p.feedback?.daysToRecover).reduce((s, p) => s + p.feedback.daysToRecover, 0) / responded.filter(p => p.feedback?.daysToRecover).length).toFixed(1)
    : '—';

  const SCard = ({ label, value, sub, color = '#fff' }) => (
    <div style={{ background: '#0F1E35', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '18px 20px' }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, letterSpacing: '-0.02em', marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{sub}</div>}
    </div>
  );

  const ChartCard = ({ title, children }) => (
    <div style={{ background: '#0F1E35', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px' }}>
      <h3 style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="fade-in" style={{ padding: '32px 32px 60px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Treatment outcome insights across {patients.length} patients</p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <SCard label="Response rate" value={`${patients.length ? Math.round((responded.length / patients.length) * 100) : 0}%`} sub={`${responded.length} of ${patients.length} responded`} color="#3B82F6" />
        <SCard label="Avg satisfaction" value={avgSatisfaction} sub="out of 5.0" color="#F59E0B" />
        <SCard label="Avg recovery time" value={avgRecovery === '—' ? '—' : `${avgRecovery}d`} sub="for recovered patients" color="#10B981" />
        <SCard label="Side effects" value={sideEffects} sub={`${referrals} referred elsewhere`} color="#EF4444" />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        <ChartCard title="Outcome distribution">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={outcomeData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {outcomeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {outcomeData.map(d => (
                <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{d.name}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Doctor-wise recovery rate (%)">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={doctorData} barSize={28}>
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0,100]} />
              <Tooltip {...tooltipStyle} formatter={v => `${v}%`} />
              <Bar dataKey="rate" fill="#3B82F6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        <ChartCard title="Patient satisfaction distribution">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={satisfactionData} barSize={24}>
              <XAxis dataKey="rating" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" fill="#F59E0B" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Doctor patient load vs recovered">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={doctorData} barSize={18}>
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }} />
              <Bar dataKey="patients" name="Total" fill="#2A4070" radius={[4,4,0,0]} />
              <Bar dataKey="recovered" name="Recovered" fill="#10B981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
