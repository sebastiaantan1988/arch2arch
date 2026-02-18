'use client';
import { Nav, Footer } from '../../components/ui';

const MILESTONES = [
  { year: '2017', title: 'Shin Surgery', desc: 'Compartment syndrome — rebuilt from scratch', color: '#ef4444' },
  { year: '2020', title: 'First Triathlon', desc: 'Hooked on multi-sport', color: '#3b82f6' },
  { year: '2024', title: 'Serious Training', desc: 'Committed to Arch2Arch goal', color: '#f59e0b' },
  { year: '2025', title: 'Sleep Study', desc: 'Diagnosed moderate OSA — treatment begins', color: '#a78bfa' },
  { year: 'Nov 2026', title: 'Half A2A', desc: 'Lanzarote — the dress rehearsal', color: '#22c55e' },
  { year: '2027', title: 'ARCH2ARCH', desc: 'London → Channel → Paris', color: '#f59e0b' },
];

const SAMPLE_POSTS = [
  {
    date: 'February 14, 2026',
    title: 'First open water swim of the season',
    excerpt: 'Water temperature was 14°C off the coast near Cascais. Managed 45 minutes before the cold became too much. This is where the training gets real — the pool is comfortable, the ocean is honest.',
    tags: ['swimming', 'training'],
  },
  {
    date: 'February 7, 2026',
    title: 'Week 6 recap: shin splint prevention is working',
    excerpt: 'Six weeks into the new protocol — ground contact time drills, calf raises, and gradual mileage increases. Zero shin pain so far. After surgery in 2017, I know how important this is. The biomechanics data from Apple Watch helps me stay honest.',
    tags: ['running', 'injury prevention'],
  },
  {
    date: 'January 30, 2026',
    title: 'The dashboard goes live',
    excerpt: 'Built a real-time health and training dashboard to track my Arch2Arch preparation. Every metric from my Oura Ring and Apple Watch feeds directly into this site. Full transparency — if I skip a session, you\'ll know.',
    tags: ['project', 'tech'],
  },
];

export default function Journey() {
  return (
    <>
      <Nav current="/journey" />
      <div style={{ paddingTop: 72 }}>
        {/* Timeline */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '48px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ fontSize: 11, color: '#f59e0b', letterSpacing: 4, fontWeight: 700, marginBottom: 12 }}>THE JOURNEY</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 900, color: '#fff', margin: 0 }}>
                From Surgery to Ultra-Triathlon
              </h1>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 0, flexWrap: 'wrap', padding: '20px 0' }}>
              {MILESTONES.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', minWidth: 100, padding: '0 8px' }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%', background: m.color,
                      margin: '0 auto 8px', boxShadow: `0 0 12px ${m.color}44`,
                    }} />
                    <div style={{ fontSize: 13, fontWeight: 800, color: m.color }}>{m.year}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginTop: 4 }}>{m.title}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{m.desc}</div>
                  </div>
                  {i < MILESTONES.length - 1 && (
                    <div style={{ width: 40, height: 2, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blog posts */}
        <div style={{ background: '#f8fafc', padding: '48px 24px' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, margin: '0 0 32px', textAlign: 'center' }}>
              Latest Updates
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {SAMPLE_POSTS.map((post, i) => (
                <article key={i} style={{
                  background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9',
                  padding: '28px 28px', transition: 'box-shadow 0.2s',
                }}>
                  <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 8 }}>{post.date}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 12px', lineHeight: 1.3 }}>{post.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: '0 0 16px' }}>{post.excerpt}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {post.tags.map(t => (
                      <span key={t} style={{
                        background: 'rgba(245,158,11,0.1)', color: '#d97706', padding: '3px 10px',
                        borderRadius: 12, fontSize: 11, fontWeight: 600,
                      }}>{t}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
