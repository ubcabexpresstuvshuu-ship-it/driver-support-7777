// ub-ui.jsx — shared atoms + icon set for UBCAB Express
// Lucide-style inline icons (outline, 1.75 stroke, round caps) + brand components.
// All theming via CSS custom properties scoped to .ub root.

const I = ({ d, size = 22, sw = 1.75, fill = 'none', children, vb = 24 }) => (
  <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} fill={fill}
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'block', flexShrink: 0 }}>
    {d ? <path d={d} /> : children}
  </svg>
);

const Icon = {
  home:    (p) => <I {...p}>{<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" /></>}</I>,
  box:     (p) => <I {...p}>{<><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><path d="m3 8 9 5 9-5" /><path d="M12 13v8" /></>}</I>,
  wallet:  (p) => <I {...p}>{<><rect x="3" y="6" width="18" height="14" rx="2.5" /><path d="M3 10h18" /><circle cx="17" cy="14" r="1.2" fill="currentColor" stroke="none" /></>}</I>,
  user:    (p) => <I {...p}>{<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></>}</I>,
  pin:     (p) => <I {...p}>{<><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></>}</I>,
  phone:   (p) => <I {...p}>{<><path d="M5 4h3l2 5-2.5 1.5a12 12 0 0 0 5 5L19 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2Z" /></>}</I>,
  clock:   (p) => <I {...p}>{<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>}</I>,
  check:   (p) => <I {...p} d="M4 12.5 9.5 18 20 6.5" />,
  chevR:   (p) => <I {...p} d="M9 5l7 7-7 7" />,
  chevL:   (p) => <I {...p} d="M15 5l-7 7 7 7" />,
  plus:    (p) => <I {...p}>{<><path d="M12 5v14" /><path d="M5 12h14" /></>}</I>,
  send:    (p) => <I {...p}>{<><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7Z" /></>}</I>,
  bell:    (p) => <I {...p}>{<><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>}</I>,
  doc:     (p) => <I {...p}>{<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5" /></>}</I>,
  upload:  (p) => <I {...p}>{<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /></>}</I>,
  grid:    (p) => <I {...p}>{<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>}</I>,
  inbox:   (p) => <I {...p}>{<><path d="M3 12h5l2 3h4l2-3h5" /><path d="M5 5h14l2 7v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6Z" /></>}</I>,
  swap:    (p) => <I {...p}>{<><path d="M7 10 3 6l4-4" /><path d="M3 6h13a4 4 0 0 1 4 4" /><path d="m17 14 4 4-4 4" /><path d="M21 18H8a4 4 0 0 1-4-4" /></>}</I>,
  truck:   (p) => <I {...p}>{<><path d="M2 7h11v9H2Z" /><path d="M13 10h4l4 3v3h-8" /><circle cx="6.5" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></>}</I>,
  coins:   (p) => <I {...p}>{<><ellipse cx="9" cy="7" rx="6" ry="3" /><path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3" /><path d="M15 11.5c2.6.2 6 1.4 6 3.5 0 1.7-2.7 3-6 3-1.8 0-3.4-.4-4.5-1" /></>}</I>,
  money:   (p) => <I {...p}>{<><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.6" /><path d="M6 12h.01M18 12h.01" /></>}</I>,
  alert:   (p) => <I {...p}>{<><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></>}</I>,
  lock:    (p) => <I {...p}>{<><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>}</I>,
  search:  (p) => <I {...p}>{<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>}</I>,
  eye:     (p) => <I {...p}>{<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>}</I>,
  logout:  (p) => <I {...p}>{<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></>}</I>,
  filter:  (p) => <I {...p} d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />,
  xmark:   (p) => <I {...p} d="M18 6 6 18M6 6l12 12" />,
  barcode: (p) => <I {...p}>{<><rect x="3" y="4" width="2.5" height="16" rx=".8" fill="currentColor" stroke="none" /><rect x="7" y="4" width="1.5" height="16" rx=".5" fill="currentColor" stroke="none" /><rect x="10" y="4" width="3" height="16" rx=".8" fill="currentColor" stroke="none" /><rect x="15" y="4" width="1.5" height="16" rx=".5" fill="currentColor" stroke="none" /><rect x="18.5" y="4" width="2.5" height="16" rx=".8" fill="currentColor" stroke="none" /></>}</I>,
  star:    (p) => <I {...p} fill="currentColor" d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.9 6.6 19.5l1.2-6L3.3 9.3l6.1-.7Z" />,
  camera:  (p) => <I {...p}>{<><path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L19 6h0a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><circle cx="12" cy="13" r="3.4" /></>}</I>,
  image:   (p) => <I {...p}>{<><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="8.5" cy="9.5" r="1.6" /><path d="m4 18 5-5 4 4 3-3 4 4" /></>}</I>,
  trash:   (p) => <I {...p}>{<><path d="M4 7h16" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /></>}</I>,
  copy:    (p) => <I {...p}>{<><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>}</I>,
  barChart3: (p) => <I {...p}>{<><rect x="3" y="12" width="4" height="8" rx="1" /><rect x="10" y="6" width="4" height="14" rx="1" /><rect x="17" y="3" width="4" height="17" rx="1" /></>}</I>,
  fileText: (p) => <I {...p}>{<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5" /><path d="M8 13h8" /><path d="M8 17h8" /><path d="M8 9h8" /></>}</I>,
  settings: (p) => <I {...p}>{<><circle cx="12" cy="12" r="3.5" /><path d="M12 1v3m0 16v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3m16 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></>}</I>,
};

// ── Status meta ────────────────────────────────────────────────
const UB_STATUS = {
  pending: { label: 'Хүлээгдэж буй', color: 'var(--ub-ink-3)', bg: 'var(--ub-chip)' },
  enroute: { label: 'Замд явж байна', color: 'var(--ub-orange)', bg: 'var(--ub-orange-t)' },
  picked:  { label: 'Бараа авсан', color: 'var(--ub-info)', bg: 'var(--ub-info-t)' },
  done:    { label: 'Дууссан', color: 'var(--ub-green)', bg: 'var(--ub-green-t)' },
};
const REQ_STATUS = {
  sent:       { label: 'Илгээсэн', color: 'var(--ub-ink-3)' },
  received:   { label: 'CS хүлээн авсан', color: 'var(--ub-orange)' },
  review:     { label: 'Нягтлан шалгаж буй', color: 'var(--ub-info)' },
  done:       { label: 'Шийдвэрлэсэн', color: 'var(--ub-green)' },
  new:        { label: 'Шинэ', color: 'var(--ub-orange)' },
  accountant: { label: 'Нягтлан руу', color: 'var(--ub-info)' },
  draft:      { label: 'Ноорог', color: 'var(--ub-ink-3)' },
};

// ── Atoms ──────────────────────────────────────────────────────
function Badge({ children, color = 'var(--ub-ink-2)', bg = 'var(--ub-chip)', dot = false }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: dot ? '5px 11px 5px 9px' : '5px 11px', borderRadius: 999,
      background: bg, color, fontSize: 12.5, fontWeight: 600, lineHeight: 1,
      whiteSpace: 'nowrap',
    }}>
      {dot && <span style={{ width: 7, height: 7, borderRadius: 999, background: color }} />}
      {children}
    </span>
  );
}

function Btn({ children, kind = 'primary', size = 'md', icon, onClick, full, style = {} }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
    fontFamily: 'var(--ub-font)', fontWeight: 700, cursor: 'pointer',
    border: 'none', borderRadius: 12, transition: 'all .15s var(--ub-ease)',
    width: full ? '100%' : undefined, whiteSpace: 'nowrap',
    fontSize: size === 'sm' ? 14 : 16, padding: size === 'sm' ? '9px 16px' : '14px 22px',
  };
  const kinds = {
    primary:   { background: 'var(--ub-orange)', color: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.06)' },
    dark:      { background: 'var(--ub-ink)', color: 'var(--ub-bg)' },
    soft:      { background: 'var(--ub-orange-t)', color: 'var(--ub-orange-d)' },
    ghost:     { background: 'transparent', color: 'var(--ub-ink)', border: '1.5px solid var(--ub-border)' },
    quiet:     { background: 'var(--ub-surface-2)', color: 'var(--ub-ink)' },
  };
  return (
    <button onClick={onClick} className="ub-btn" style={{ ...base, ...kinds[kind], ...style }}>
      {icon}{children}
    </button>
  );
}

function StatPill({ icon, children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--ub-ink-2)', fontSize: 13.5, fontWeight: 500 }}>
      {icon}{children}
    </span>
  );
}

function fmt(n) { return n.toLocaleString('en-US'); }

function Avatar({ name, size = 40, color = 'var(--ub-orange)' }) {
  const initials = name.replace(/^[А-ЯA-Z]\.\s*/, '').slice(0, 1);
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, flexShrink: 0,
      background: 'var(--ub-orange-t)', color: 'var(--ub-orange-d)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.4,
    }}>{initials}</div>
  );
}

Object.assign(window, { Icon, UB_STATUS, REQ_STATUS, Badge, Btn, StatPill, Avatar, ubFmt: fmt });
