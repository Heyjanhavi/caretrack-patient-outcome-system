import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, UserPlus, ClipboardList,
  BarChart3, Settings, Activity, LogOut
} from 'lucide-react';

const navItems = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard'      },
  { to: '/register',   icon: UserPlus,         label: 'Register Patient'},
  { to: '/patients',   icon: ClipboardList,    label: 'Patients'       },
  { to: '/analytics',  icon: BarChart3,        label: 'Analytics'      },
];

export default function Sidebar() {
  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: '#0A1628',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #3B82F6, #10B981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Activity size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>CareTrack</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>Patient Outcomes</div>
          </div>
        </div>
      </div>

      {/* Clinic badge */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Clinic</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>Shree Care Clinic</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Pune, Maharashtra</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8, marginBottom: 2,
              textDecoration: 'none', fontSize: 13, fontWeight: 500,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
              background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
              borderLeft: isActive ? '2px solid #3B82F6' : '2px solid transparent',
              transition: 'all 0.15s',
            })}
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 12px', borderRadius: 8,
          color: 'rgba(255,255,255,0.35)', fontSize: 13,
          cursor: 'pointer',
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'rgba(59,130,246,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 600, color: '#60A5FA'
          }}>DR</div>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Reception</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
