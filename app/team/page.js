'use client';
import { useState } from 'react';
import { Nav, Footer } from '../../components/ui';

export default function Team() {
  const [form, setForm] = useState({ name: '', email: '', role: '', message: '' });
  const [sent, setSent] = useState(false);

  const roles = [
    { role: 'Support Swimmers', desc: 'Rotate alongside me in the Channel', emoji: '🏊', status: 'Looking' },
    { role: 'Bike Support', desc: 'Drive + navigate through France', emoji: '🚗', status: 'Looking' },
    { role: 'Crew & Logistics', desc: 'Nutrition, comms, planning', emoji: '📋', status: 'Looking' },
    { role: 'Media / Documentation', desc: 'Capture the journey', emoji: '📸', status: 'Looking' },
  ];

  return (
    <>
      <Nav current="/team" />
      <div style={{ paddingTop: 72 }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '64px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: 11, color: '#f59e0b', letterSpacing: 4, fontWeight: 700, marginBottom: 16 }}>CREW</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 900, color: '#fff', margin: '0 0 16px' }}>
              No one crosses the Channel alone.
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 600, margin: '0 auto 48px' }}>
              I&apos;m building a crew for the Arch2Arch in 2027. Whether you can swim alongside me in the Channel,
              drive the support vehicle through France, or help with logistics — I&apos;d love to hear from you.
            </p>

            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
              {roles.map((r, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16, padding: '24px 20px', minWidth: 180, flex: 1, maxWidth: 220, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 36 }}>{r.emoji}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginTop: 12 }}>{r.role}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6, lineHeight: 1.4 }}>{r.desc}</div>
                  <div style={{
                    display: 'inline-block', marginTop: 12, padding: '4px 12px', borderRadius: 12,
                    background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontSize: 11, fontWeight: 700,
                  }}>{r.status}</div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'left' }}>
              <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>Get in Touch</h3>
              {sent ? (
                <div style={{ textAlign: 'center', padding: 40, background: 'rgba(74,222,128,0.1)', borderRadius: 16, border: '1px solid rgba(74,222,128,0.2)' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
                  <div style={{ color: '#4ade80', fontWeight: 700 }}>Message sent! I&apos;ll be in touch.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['name', 'email'].map(f => (
                    <input key={f} type={f === 'email' ? 'email' : 'text'} placeholder={f === 'name' ? 'Your name' : 'Email'}
                      value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
                      style={{
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14,
                        fontFamily: 'inherit', outline: 'none',
                      }} />
                  ))}
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                    style={{
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10, padding: '12px 16px', color: form.role ? '#fff' : '#94a3b8', fontSize: 14,
                      fontFamily: 'inherit', outline: 'none',
                    }}>
                    <option value="">Interested in...</option>
                    {roles.map(r => <option key={r.role} value={r.role}>{r.role}</option>)}
                    <option value="other">Other</option>
                  </select>
                  <textarea placeholder="Your message" rows={4} value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14,
                      fontFamily: 'inherit', outline: 'none', resize: 'vertical',
                    }} />
                  <button onClick={() => setSent(true)} style={{
                    background: '#f59e0b', color: '#0f172a', border: 'none', padding: '14px 32px',
                    borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4,
                  }}>Send Message →</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
