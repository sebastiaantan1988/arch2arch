'use client';

export function Sparkline({ data, color, width = 80, height = 24 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

export function StatCard({ label, value, unit, spark, sparkColor, status }) {
  const cls = status === 'good' ? 'status-good' : status === 'watch' ? 'status-watch' : 'status-attention';
  return (
    <div className={cls} style={{ borderRadius: 16, padding: '20px 16px', flex: 1, minWidth: 140 }}>
      <div style={{ color: '#94a3b8', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
        <span style={{ fontSize: 32, fontWeight: 800 }}>{value}</span>
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{unit}</span>
      </div>
      {spark && <div style={{ marginTop: 10 }}><Sparkline data={spark} color={sparkColor} /></div>}
    </div>
  );
}

export function CountdownRing({ label, current, target, unit, color, icon }) {
  const pct = Math.min((current / target) * 100, 100);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ textAlign: 'center', flex: 1, minWidth: 160 }}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
        <text x="65" y="55" textAnchor="middle" fill="white" style={{ fontSize: '28px', fontWeight: 700 }}>{icon}</text>
        <text x="65" y="80" textAnchor="middle" fill="white" style={{ fontSize: '13px', fontWeight: 500 }}>{current}/{target}</text>
        <text x="65" y="96" textAnchor="middle" fill="rgba(255,255,255,0.5)" style={{ fontSize: '10px' }}>{unit}</text>
      </svg>
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4, fontWeight: 500 }}>{label}</div>
      <div style={{ color, fontSize: 14, fontWeight: 700 }}>{pct.toFixed(0)}%</div>
    </div>
  );
}

export function ProgressBar({ label, pct, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>
        <span>{label}</span><span style={{ color: '#e2e8f0', fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)' }}>
        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: color, transition: 'width 1.5s ease' }} />
      </div>
    </div>
  );
}

export function Nav({ current }) {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/training', label: 'Training' },
    { href: '/journey', label: 'Journey' },
    { href: '/challenge', label: 'The Challenge' },
    { href: '/team', label: 'Join the Team' },
  ];
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>A</span>
          <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700, letterSpacing: 2 }}>2</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>A</span>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginLeft: 8 }}>SEBASTIAAN TAN</span>
        </a>
        <div className="nav-links" style={{ display: 'flex', gap: 4 }}>
          {links.map(l => (
            <a key={l.href} href={l.href} style={{
              background: current === l.href ? 'rgba(245,158,11,0.15)' : 'transparent',
              color: current === l.href ? '#f59e0b' : '#94a3b8',
              padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            }}>{l.label}</a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer style={{
      background: '#0f172a', padding: '32px 24px',
      borderTop: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>© 2026 Sebastiaan Tan — Arch2Arch Ultra-Triathlon</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Data: Oura Ring + Apple Watch</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <a href="/private" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>🔒 Private Dashboard</a>
        </div>
      </div>
    </footer>
  );
}
