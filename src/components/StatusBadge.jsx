import { STATUS_META } from '../data/store';

export default function StatusBadge({ status, improvement, size = 'sm' }) {
  const key = improvement || status;
  const meta = STATUS_META[key] || STATUS_META['scheduled'];
  const pad = size === 'lg' ? '6px 14px' : '3px 10px';
  const fs = size === 'lg' ? 12 : 11;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: pad, borderRadius: 20, fontSize: fs, fontWeight: 500,
      color: meta.color, background: meta.bg,
    }}>
      <span style={{
        width: size === 'lg' ? 7 : 6, height: size === 'lg' ? 7 : 6,
        borderRadius: '50%', background: meta.color, flexShrink: 0,
        animation: meta.pulse ? `${meta.pulse} 2s ease-in-out infinite` : 'none',
      }} />
      {meta.label}
    </span>
  );
}
