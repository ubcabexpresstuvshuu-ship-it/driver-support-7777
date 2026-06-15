// admin-app.jsx — UBCAB Express Admin dashboard (inside ChromeWindow)
const { useState: useStateAdmin, useMemo: useMemoAdmin } = React;

// Import Icon, Btn, Badge, Avatar from window (exported by ub-ui.jsx)
const Icon = window.Icon || {};
const Btn = window.Btn || (() => null);
const Badge = window.Badge || (() => null);
const Avatar = window.Avatar || (() => null);

// ── Admin Sidebar ───────────────────────────────────────────────
function AdminSidebar({ nav, setNav, onLogout, pendingCount }) {
  const items = [
    ['dash', 'Хяналтын самбар', Icon.grid],
    ['regs', 'Бүртгэлийн хүсэлт', Icon.inbox],
    ['drivers', 'Жолоочид', Icon.truck],
    ['staff', 'CS Ажилтан', Icon.user],
    ['earnings', 'Орлогын тайлан', Icon.barChart3],
    ['logs', 'Системийн логс', Icon.fileText],
    ['settings', 'Тохиргоо', Icon.settings],
  ];
  return (
    <div style={{ width: 248, flexShrink: 0, background: 'var(--ub-surface-2)', borderRight: '1px solid var(--ub-border)', display: 'flex', flexDirection: 'column', padding: '20px 14px' }}>
      <div style={{ padding: '0 8px 22px' }}>
        <img src={window.__resources?.ubcabLogo || 'assets/ubcab-express-logo.png'} alt="UBCAB Express" style={{ height: 26, width: 'auto', display: 'block' }} />
        <div style={{ fontSize: 12, color: 'var(--ub-ink-3)', fontWeight: 600, marginTop: 8, letterSpacing: '.04em' }}>АДМИН САМБАР</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {items.map(([k, label, Ic]) => {
          const on = nav === k;
          return (
            <button key={k} onClick={() => setNav(k)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 11,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14.5, fontWeight: on ? 700 : 500,
              background: on ? 'var(--ub-orange-t)' : 'transparent', color: on ? 'var(--ub-orange-d)' : 'var(--ub-ink-2)', textAlign: 'left',
            }}>
              <Ic size={20} /><span style={{ flex: 1 }}>{label}</span>
              {k === 'regs' && pendingCount > 0 && <span style={{ background: 'var(--ub-orange)', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '2px 7px' }}>{pendingCount}</span>}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 10px', borderRadius: 12, background: 'var(--ub-surface)', border: '1px solid var(--ub-border)' }}>
        <Avatar name="Т. Ганбаатар" size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Т. Ганбаатар</div>
          <div style={{ fontSize: 11.5, color: 'var(--ub-ink-3)' }}>ADM-01</div>
        </div>
        <button onClick={onLogout} title="Гарах" style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--ub-ink-3)' }}><Icon.logout size={18} /></button>
      </div>
    </div>
  );
}

function AdminTopBar({ title, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 32px', borderBottom: '1px solid var(--ub-border)' }}>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em' }}>{title}</div>
        {sub && <div style={{ fontSize: 14, color: 'var(--ub-ink-2)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ── Admin Dashboard ─────────────────────────────────────────────
function AdminDashStat({ label, value, sub, color = 'var(--ub-ink)', icon }) {
  return (
    <div style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13.5, color: 'var(--ub-ink-2)', fontWeight: 600 }}>{label}</span>
        <span style={{ color: color === 'var(--ub-ink)' ? 'var(--ub-ink-3)' : color }}>{icon}</span>
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.02em', color, lineHeight: 1 }} className="numeric">{value}</div>
      {sub && <div style={{ fontSize: 13, color: 'var(--ub-ink-3)', marginTop: 8 }}>{sub}</div>}
    </div>
  );
}

function AdminDash({ regs, staff }) {
  const fleet = UB.fleet;
  const onlineCount = fleet.filter(f => f.status === 'online').length;
  const breakCount = fleet.filter(f => f.status === 'break').length;
  const pendingRegs = regs.filter(r => r.status === 'pending').length;
  const approvedRegs = regs.filter(r => r.status === 'approved').length;
  const totalActive = fleet.reduce((s, f) => s + f.active, 0);
  const totalDone = fleet.reduce((s, f) => s + f.done, 0);

  // Zone breakdown
  const zones = {};
  fleet.forEach(f => {
    const z = f.zone.replace(' дүүрэг', '');
    if (!zones[z]) zones[z] = { total: 0, online: 0, active: 0, done: 0 };
    zones[z].total++;
    if (f.status === 'online') zones[z].online++;
    zones[z].active += f.active;
    zones[z].done += f.done;
  });
  const zoneList = Object.entries(zones).sort((a, b) => b[1].total - a[1].total);
  const maxTotal = Math.max(...zoneList.map(([, v]) => v.total));

  return (
    <div style={{ padding: 32 }}>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <AdminDashStat label="Нийт жолооч" value={fleet.length} sub={`${onlineCount} идэвхтэй · ${breakCount} завсарлага`} color="var(--ub-orange)" icon={<Icon.truck size={20} />} />
        <AdminDashStat label="Хүлээгдэж буй бүртгэл" value={pendingRegs} sub={`${approvedRegs} зөвшөөрсөн`} color="var(--ub-info)" icon={<Icon.inbox size={20} />} />
        <AdminDashStat label="Идэвхтэй хүргэлт" value={totalActive} sub={`${totalDone} дууссан`} color="var(--ub-green)" icon={<Icon.box size={20} />} />
        <AdminDashStat label="Нийт ажилтан" value={staff.length} sub={`${staff.filter(s => s.role === 'Админ').length} админ · ${staff.filter(s => s.role === 'CS ажилтан').length} CS`} icon={<Icon.user size={20} />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Zone breakdown */}
        <div style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, padding: 22 }}>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>Дүүргийн ачаалал</div>
          {zoneList.map(([z, v]) => (
            <div key={z} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>{z}</span>
                <span style={{ color: 'var(--ub-ink-3)' }}>{v.online}/{v.total} идэвхтэй</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: 'var(--ub-chip)', overflow: 'hidden' }}>
                <div style={{ width: (v.total / maxTotal * 100) + '%', height: '100%', borderRadius: 999, background: 'var(--ub-orange)', position: 'relative' }}>
                  <div style={{ width: (v.online / v.total * 100) + '%', height: '100%', borderRadius: 999, background: 'var(--ub-green)' }} />
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--ub-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--ub-green)' }}></span>
              <span style={{ fontSize: 12, color: 'var(--ub-ink-3)', fontWeight: 600 }}>Идэвхтэй</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--ub-orange)' }}></span>
              <span style={{ fontSize: 12, color: 'var(--ub-ink-3)', fontWeight: 600 }}>Нийт</span>
            </div>
          </div>
        </div>

        {/* Recent registrations */}
        <div style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Сүүлийн бүртгэлүүд</div>
            {pendingRegs > 0 && <Badge color="var(--ub-orange-d)" bg="var(--ub-orange-t)">{pendingRegs} хүлээгдэж буй</Badge>}
          </div>
          {regs.slice(0, 5).map((r, i) => {
            const badge = r.status === 'pending' ? { label: 'Хүлээгдэж буй', color: 'var(--ub-orange)', bg: 'var(--ub-orange-t)' }
              : r.status === 'approved' ? { label: 'Зөвшөөрсөн', color: 'var(--ub-green)', bg: 'var(--ub-green-t)' }
              : { label: 'Татгалзсан', color: '#C0392B', bg: 'rgba(200,60,40,.12)' };
            return (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: i ? '1px solid var(--ub-border)' : 'none' }}>
                <Avatar name={r.name} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ub-ink-3)' }}>{r.district} · {r.ts}</div>
                </div>
                <Badge color={badge.color} bg={badge.bg} dot>{badge.label}</Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Registration Requests ───────────────────────────────────────
function AdminRegs({ regs, onApprove, onReject }) {
  const [filter, setFilter] = useStateAdmin('pending');
  const [regPage, setRegPage] = useStateAdmin(1);
  const REG_PAGE = 10;
  const filtered = useMemoAdmin(() => regs.filter(r => filter === 'all' ? true : r.status === filter), [regs, filter]);
  const pendingCount = regs.filter(r => r.status === 'pending').length;
  const regTotalPages = Math.ceil(filtered.length / REG_PAGE);
  const regSafePage = Math.min(regPage, Math.max(1, regTotalPages));
  const pageRegs = filtered.slice((regSafePage-1)*REG_PAGE, regSafePage*REG_PAGE);

  const REG_BADGE = {
    pending: { label: 'Хүлээгдэж буй', color: 'var(--ub-orange)', bg: 'var(--ub-orange-t)' },
    approved: { label: 'Зөвшөөрсөн', color: 'var(--ub-green)', bg: 'var(--ub-green-t)' },
    rejected: { label: 'Татгалзсан', color: '#C0392B', bg: 'rgba(200,60,40,.12)' },
  };

  return (
    <div style={{ padding: 32 }}>
      {/* filter tabs */}
      <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 999, background: 'var(--ub-chip)', marginBottom: 24, maxWidth: 420 }}>
        {[['pending', 'Хүлээгдэж буй'], ['approved', 'Зөвшөөрсөн'], ['rejected', 'Татгалзсан'], ['all', 'Бүгд']].map(([k, lbl]) => {
          const on = filter === k;
          return (
            <button key={k} onClick={() => { setFilter(k); setRegPage(1); }} style={{
              flex: 1, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 700,
              padding: '9px 0', borderRadius: 999, transition: 'all .15s var(--ub-ease)',
              background: on ? 'var(--ub-surface)' : 'transparent', color: on ? 'var(--ub-orange-d)' : 'var(--ub-ink-3)',
              boxShadow: on ? '0 1px 3px rgba(0,0,0,.08)' : 'none', whiteSpace: 'nowrap'
            }}>{lbl}{k === 'pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}</button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--ub-ink-3)' }}>
          <Icon.inbox size={32} />
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 12 }}>Хүсэлт байхгүй байна</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {pageRegs.map((r) => {
            const badge = REG_BADGE[r.status] || REG_BADGE.pending;
            return (
              <div key={r.id} style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar name={r.name} size={42} />
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800 }}>{r.name}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--ub-ink-3)' }}>{r.id} · {r.ts}</div>
                    </div>
                  </div>
                  <Badge color={badge.color} bg={badge.bg} dot>{badge.label}</Badge>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: r.status === 'pending' ? 16 : 0 }}>
                  <RegInfoCell icon={<Icon.phone size={16} />} label="Утас" value={r.phone} />
                  <RegInfoCell icon={<Icon.truck size={16} />} label="Тээвэр" value={r.vehicle} />
                  <RegInfoCell icon={<Icon.pin size={16} />} label="Дүүрэг" value={r.district} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: r.status === 'pending' ? 16 : 0 }}>
                  <Badge color={r.method === 'gmail' ? '#4285F4' : 'var(--ub-ink-3)'} bg="var(--ub-chip)">
                    {r.method === 'gmail' ? '✉ Gmail' : '📱 Утас'}
                  </Badge>
                  {r.email && <span style={{ fontSize: 13, color: 'var(--ub-ink-2)' }}>{r.email}</span>}
                </div>
                {r.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--ub-border)', paddingTop: 14 }}>
                    <Btn kind="primary" size="sm" icon={<Icon.check size={17} />} onClick={() => onApprove(r.id)} style={{ flex: 1 }}>Зөвшөөрөх</Btn>
                    <Btn kind="ghost" size="sm" icon={<Icon.xmark size={17} />} onClick={() => onReject(r.id)} style={{ flex: 1 }}>Татгалзах</Btn>
                  </div>
                )}
              </div>
            );
          })}
          {regTotalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--ub-ink-3)', fontWeight: 600 }}>{(regSafePage-1)*REG_PAGE+1}–{Math.min(regSafePage*REG_PAGE,filtered.length)} / {filtered.length}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={()=>setRegPage(p=>Math.max(1,p-1))} disabled={regSafePage===1} style={{width:32,height:32,borderRadius:8,border:'1.5px solid var(--ub-border)',background:'var(--ub-surface)',cursor:regSafePage===1?'default':'pointer',opacity:regSafePage===1?0.4:1,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon.chevL size={15}/></button>
                {Array.from({length:regTotalPages},(_,i)=>i+1).filter(p=>p===1||p===regTotalPages||Math.abs(p-regSafePage)<=1).reduce((acc,p,idx,arr)=>{if(idx>0&&p-arr[idx-1]>1)acc.push('…');acc.push(p);return acc;},[]).map((p,i)=>p==='…'?(
                  <span key={'e'+i} style={{width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'var(--ub-ink-3)'}}>…</span>
                ):(
                  <button key={p} onClick={()=>setRegPage(p)} style={{width:32,height:32,borderRadius:8,border:p===regSafePage?'2px solid var(--ub-orange)':'1.5px solid var(--ub-border)',background:p===regSafePage?'var(--ub-orange-t)':'var(--ub-surface)',color:p===regSafePage?'var(--ub-orange-d)':'var(--ub-ink)',fontFamily:'inherit',fontSize:13,fontWeight:p===regSafePage?700:500,cursor:'pointer'}}>{p}</button>
                ))}
                <button onClick={()=>setRegPage(p=>Math.min(regTotalPages,p+1))} disabled={regSafePage===regTotalPages} style={{width:32,height:32,borderRadius:8,border:'1.5px solid var(--ub-border)',background:'var(--ub-surface)',cursor:regSafePage===regTotalPages?'default':'pointer',opacity:regSafePage===regTotalPages?0.4:1,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon.chevR size={15}/></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RegInfoCell({ icon, label, value }) {
  return (
    <div style={{ padding: '10px 12px', background: 'var(--ub-surface-2)', borderRadius: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ub-ink-3)', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{icon}{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
    </div>
  );
}

// ── Driver list (approved) ──────────────────────────────────────
const PAGE_SIZE = 20;
function AdminDrivers({ regs }) {
  const [selectedZone, setSelectedZone] = useStateAdmin('Бүгд');
  const [dropOpen, setDropOpen] = useStateAdmin(false);
  const [search, setSearch] = useStateAdmin('');
  const [page, setPage] = useStateAdmin(1);

  const approved = regs.filter(r => r.status === 'approved');
  const allDrivers = [
    ...UB.fleet.map(f => ({ name: f.name, zone: f.zone, status: f.status, vehicle: '—', phone: f.phone || '—', active: f.active, done: f.done, source: 'fleet' })),
    ...approved.map(r => ({ name: r.name, zone: r.district + ' дүүрэг', status: 'online', vehicle: r.vehicle, phone: r.phone, active: 0, done: 0, source: 'reg' })),
  ];

  // Extract unique zones
  const zones = useMemoAdmin(() => {
    const zs = [...new Set(allDrivers.map(d => d.zone))].sort();
    return ['Бүгд', ...zs];
  }, [allDrivers.length]);

  const filtered = useMemoAdmin(() => {
    let list = selectedZone === 'Бүгд' ? allDrivers : allDrivers.filter(d => d.zone === selectedZone);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(q) || d.phone.includes(q));
    }
    return list;
  }, [selectedZone, search, allDrivers.length]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const pageDrivers = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const onlineCount = filtered.filter(d => d.status === 'online').length;
  const breakCount = filtered.filter(d => d.status !== 'online').length;

  const resetPage = () => setPage(1);

  return (
    <div style={{ padding: 32 }}>
      {/* Top bar: stats + search + district filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 14, color: 'var(--ub-ink-2)', flex: 1 }}>
          Нийт <strong>{filtered.length}</strong> жолооч
          <span style={{ marginLeft: 10 }}><Badge color="var(--ub-green)" bg="var(--ub-green-t)" dot>{onlineCount} идэвхтэй</Badge></span>
          <span style={{ marginLeft: 6 }}><Badge color="var(--ub-ink-3)" bg="var(--ub-chip)" dot>{breakCount} завсарлага</Badge></span>
        </div>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0 14px', borderRadius: 12, border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface)', height: 42 }}>
          <Icon.search size={17} style={{ color: 'var(--ub-ink-3)' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); resetPage(); }} placeholder="Нэр, утас хайх…"
            style={{ border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 14, color: 'var(--ub-ink)', outline: 'none', width: 170 }} />
        </div>
        {/* District dropdown */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setDropOpen(!dropOpen)} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 12,
            border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface)', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: 'var(--ub-ink)',
            minWidth: 180, transition: 'all .15s var(--ub-ease)',
            ...(dropOpen ? { borderColor: 'var(--ub-orange)', boxShadow: '0 0 0 3px var(--ub-orange-t)' } : {})
          }}>
            <Icon.pin size={17} style={{ color: 'var(--ub-orange)', flexShrink: 0 }} />
            <span style={{ flex: 1, textAlign: 'left' }}>{selectedZone === 'Бүгд' ? 'Бүх дүүрэг' : selectedZone.replace(' дүүрэг', '')}</span>
            <span style={{ color: 'var(--ub-ink-3)', transform: dropOpen ? 'rotate(270deg)' : 'rotate(90deg)', transition: 'transform .15s', flexShrink: 0 }}><Icon.chevR size={16} /></span>
          </button>
          {dropOpen && (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', width: 220, zIndex: 50, background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,.12)', padding: '6px 0', maxHeight: 320, overflowY: 'auto' }}>
              {zones.map((z) => {
                const on = z === selectedZone;
                const count = z === 'Бүгд' ? allDrivers.length : allDrivers.filter(d => d.zone === z).length;
                return (
                  <button key={z} onClick={() => { setSelectedZone(z); setDropOpen(false); resetPage(); }} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px',
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                    background: on ? 'var(--ub-orange-t)' : 'transparent',
                    color: on ? 'var(--ub-orange-d)' : 'var(--ub-ink)', fontSize: 14, fontWeight: on ? 700 : 500,
                  }}>
                    <span style={{ color: on ? 'var(--ub-orange)' : 'var(--ub-ink-3)', flexShrink: 0 }}><Icon.pin size={16} /></span>
                    <span style={{ flex: 1 }}>{z === 'Бүгд' ? 'Бүх дүүрэг' : z.replace(' дүүрэг', '')}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ub-ink-3)', background: 'var(--ub-chip)', borderRadius: 999, padding: '2px 8px' }}>{count}</span>
                    {on && <Icon.check size={16} style={{ color: 'var(--ub-orange)', flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 0.6fr 0.6fr 0.8fr', gap: 14, padding: '14px 22px', background: 'var(--ub-surface-2)', fontSize: 12.5, fontWeight: 700, color: 'var(--ub-ink-3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
          <span>Жолооч</span><span>Утас</span><span>Дүүрэг</span><span style={{ textAlign: 'center' }}>Идэвхтэй</span><span style={{ textAlign: 'center' }}>Дууссан</span><span>Төлөв</span>
        </div>
        {pageDrivers.length === 0 ? (
          <div style={{ padding: '36px 22px', textAlign: 'center', color: 'var(--ub-ink-3)', fontSize: 14 }}>Жолооч олдсонгүй</div>
        ) : pageDrivers.map((d, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 0.6fr 0.6fr 0.8fr', gap: 14, padding: '14px 22px', borderTop: '1px solid var(--ub-border)', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}><Avatar name={d.name} size={32} /><span style={{ fontSize: 14, fontWeight: 600 }}>{d.name}</span></div>
            <span style={{ fontSize: 13.5, color: 'var(--ub-ink-2)' }}>{d.phone}</span>
            <span style={{ fontSize: 13, color: 'var(--ub-ink-2)' }}>{d.zone.replace(' дүүрэг', '')}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ub-orange)', textAlign: 'center' }} className="numeric">{d.active}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ub-green)', textAlign: 'center' }} className="numeric">{d.done}</span>
            <Badge color={d.status === 'online' ? 'var(--ub-green)' : 'var(--ub-ink-3)'} bg="var(--ub-chip)" dot>{d.status === 'online' ? 'Идэвхтэй' : 'Завсарлага'}</Badge>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--ub-ink-3)', fontWeight: 600 }}>
            {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} / {filtered.length}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
              style={{ width: 34, height: 34, borderRadius: 9, border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface)', cursor: safePage === 1 ? 'default' : 'pointer', opacity: safePage === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ub-ink)' }}>
              <Icon.chevL size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1).reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
              acc.push(p); return acc;
            }, []).map((p, i) => p === '…' ? (
              <span key={'e' + i} style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--ub-ink-3)' }}>…</span>
            ) : (
              <button key={p} onClick={() => setPage(p)} style={{
                width: 34, height: 34, borderRadius: 9, border: p === safePage ? '2px solid var(--ub-orange)' : '1.5px solid var(--ub-border)',
                background: p === safePage ? 'var(--ub-orange-t)' : 'var(--ub-surface)',
                color: p === safePage ? 'var(--ub-orange-d)' : 'var(--ub-ink)',
                fontFamily: 'inherit', fontSize: 13.5, fontWeight: p === safePage ? 700 : 500, cursor: 'pointer'
              }}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
              style={{ width: 34, height: 34, borderRadius: 9, border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface)', cursor: safePage === totalPages ? 'default' : 'pointer', opacity: safePage === totalPages ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ub-ink)' }}>
              <Icon.chevR size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Staff management ────────────────────────────────────────────
const STAFF_PAGE = 10;
function AdminStaff({ staff, onAdd }) {
  const [showForm, setShowForm] = useStateAdmin(false);
  const [newName, setNewName] = useStateAdmin('');
  const [newPhone, setNewPhone] = useStateAdmin('');
  const [newRole, setNewRole] = useStateAdmin('CS ажилтан');
  const [sp, setSp] = useStateAdmin(1);
  const totalSP = Math.ceil(staff.length / STAFF_PAGE);
  const safeSP = Math.min(sp, Math.max(1, totalSP));
  const pageStaff = staff.slice((safeSP-1)*STAFF_PAGE, safeSP*STAFF_PAGE);

  const handleAdd = () => {
    if (!newName.trim() || !newPhone.trim()) return;
    onAdd({ name: newName.trim(), phone: newPhone.trim(), role: newRole });
    setNewName(''); setNewPhone(''); setNewRole('CS ажилтан'); setShowForm(false);
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: 'var(--ub-ink-2)' }}>Нийт <strong>{staff.length}</strong> ажилтан</div>
        <Btn kind="primary" size="sm" icon={<Icon.plus size={17} />} onClick={() => setShowForm(!showForm)}>Ажилтан нэмэх</Btn>
      </div>

      {showForm && (
        <div style={{ background: 'var(--ub-surface)', border: '2px solid var(--ub-orange)', borderRadius: 16, padding: 22, marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Шинэ ажилтан нэмэх</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink-2)', marginBottom: 6 }}>Нэр</div>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Жишээ: Б. Болд"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--ub-border)', background: 'var(--ub-bg)', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: 'var(--ub-ink)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink-2)', marginBottom: 6 }}>Утас</div>
              <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="9900 1234"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--ub-border)', background: 'var(--ub-bg)', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: 'var(--ub-ink)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink-2)', marginBottom: 6 }}>Албан тушаал</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['CS ажилтан', 'Админ'].map(r => (
                <button key={r} onClick={() => setNewRole(r)} style={{
                  padding: '10px 20px', borderRadius: 10, border: newRole === r ? '2px solid var(--ub-orange)' : '1.5px solid var(--ub-border)',
                  background: newRole === r ? 'var(--ub-orange-t)' : 'var(--ub-bg)',
                  color: newRole === r ? 'var(--ub-orange-d)' : 'var(--ub-ink)',
                  fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer'
                }}>{r}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn kind="primary" size="sm" icon={<Icon.check size={17} />} onClick={handleAdd}>Нэмэх</Btn>
            <Btn kind="ghost" size="sm" onClick={() => setShowForm(false)}>Болих</Btn>
          </div>
        </div>
      )}

      <div style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr 1.2fr 0.8fr', gap: 14, padding: '14px 22px', background: 'var(--ub-surface-2)', fontSize: 12.5, fontWeight: 700, color: 'var(--ub-ink-3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
          <span>Ажилтан</span><span>Утас</span><span>Албан тушаал</span><span>Төлөв</span>
        </div>
        {(() => {
          return (<>
            {pageStaff.map((s, i) => (
          <div key={s.id || i} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr 1.2fr 0.8fr', gap: 14, padding: '15px 22px', borderTop: '1px solid var(--ub-border)', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <Avatar name={s.name} size={34} />
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ub-ink-3)' }}>{s.id}</div>
              </div>
            </div>
            <span style={{ fontSize: 14, color: 'var(--ub-ink-2)' }}>{s.phone}</span>
            <Badge color={s.role === 'Админ' ? 'var(--ub-orange-d)' : 'var(--ub-info)'} bg="var(--ub-chip)">{s.role}</Badge>
            <Badge color="var(--ub-green)" bg="var(--ub-green-t)" dot>Идэвхтэй</Badge>
          </div>
            ))}
            {totalSP > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 22px', borderTop: '1px solid var(--ub-border)' }}>
                <span style={{ fontSize: 13, color: 'var(--ub-ink-3)', fontWeight: 600 }}>{(safeSP-1)*STAFF_PAGE+1}–{Math.min(safeSP*STAFF_PAGE,staff.length)} / {staff.length}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={()=>setSp(p=>Math.max(1,p-1))} disabled={safeSP===1} style={{width:32,height:32,borderRadius:8,border:'1.5px solid var(--ub-border)',background:'var(--ub-surface)',cursor:safeSP===1?'default':'pointer',opacity:safeSP===1?0.4:1,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon.chevL size={14}/></button>
                  {Array.from({length:totalSP},(_,i)=>i+1).filter(p=>p===1||p===totalSP||Math.abs(p-safeSP)<=1).reduce((acc,p,idx,arr)=>{if(idx>0&&p-arr[idx-1]>1)acc.push('…');acc.push(p);return acc;},[]).map((p,i)=>p==='…'?(<span key={'e'+i} style={{width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'var(--ub-ink-3)'}}>…</span>):(<button key={p} onClick={()=>setSp(p)} style={{width:32,height:32,borderRadius:8,border:p===safeSP?'2px solid var(--ub-orange)':'1.5px solid var(--ub-border)',background:p===safeSP?'var(--ub-orange-t)':'var(--ub-surface)',color:p===safeSP?'var(--ub-orange-d)':'var(--ub-ink)',fontFamily:'inherit',fontSize:13,fontWeight:p===safeSP?700:500,cursor:'pointer'}}>{p}</button>))}
                  <button onClick={()=>setSp(p=>Math.min(totalSP,p+1))} disabled={safeSP===totalSP} style={{width:32,height:32,borderRadius:8,border:'1.5px solid var(--ub-border)',background:'var(--ub-surface)',cursor:safeSP===totalSP?'default':'pointer',opacity:safeSP===totalSP?0.4:1,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon.chevR size={14}/></button>
                </div>
              </div>
            )}
          </>);
        })()}
      </div>
    </div>
  );
}

// ── Earnings Report ────────────────────────────────────────────
const EARN_PAGE = 20;
function AdminEarnings() {
  const [period, setPeriod] = useStateAdmin('month');
  const [commRate, setCommRate] = useStateAdmin(15);
  const [search, setSearch] = useStateAdmin('');
  const [page, setPage] = useStateAdmin(1);

  const earnings = useMemoAdmin(() => UB.fleet.map(f => {
    const revenue = (f.active * 45000) + (f.done * 45000);
    const commission = (revenue * commRate) / 100;
    return { ...f, revenue, commission, net: revenue - commission, status: (f.active + f.done) % 3 !== 0 ? 'paid' : 'pending' };
  }), [commRate]);

  const filtered = useMemoAdmin(() => {
    if (!search.trim()) return earnings;
    const q = search.trim().toLowerCase();
    return earnings.filter(e => e.name.toLowerCase().includes(q) || e.phone?.includes(q));
  }, [search, earnings]);

  const totalPages = Math.ceil(filtered.length / EARN_PAGE);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const pageItems = filtered.slice((safePage - 1) * EARN_PAGE, safePage * EARN_PAGE);
  const totalRev = filtered.reduce((s, e) => s + e.revenue, 0);
  const totalComm = filtered.reduce((s, e) => s + e.commission, 0);

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['day', 'week', 'month', 'year'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: '8px 14px', borderRadius: 8, border: period === p ? '2px solid var(--ub-orange)' : '1.5px solid var(--ub-border)',
              background: period === p ? 'var(--ub-orange-t)' : 'transparent', color: period === p ? 'var(--ub-orange-d)' : 'var(--ub-ink-2)',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}>{p === 'day' ? 'Өдөр' : p === 'week' ? '7 хоног' : p === 'month' ? 'Сар' : 'Жил'}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', borderRadius: 12, border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface)', height: 40, flex: 1, minWidth: 160 }}>
          <Icon.search size={16} style={{ color: 'var(--ub-ink-3)' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Жолооч хайх…"
            style={{ border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 14, color: 'var(--ub-ink)', outline: 'none', width: '100%' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--ub-ink-2)', fontWeight: 600 }}>Комиссион:</span>
          <input type="range" min="5" max="30" value={commRate} onChange={e => setCommRate(Number(e.target.value))} style={{ width: 100, cursor: 'pointer' }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ub-orange)', minWidth: 36 }}>{commRate}%</span>
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        {[['Нийт орлого', (totalRev/1000000).toFixed(1)+'M₮', 'var(--ub-orange)'], ['Нийт комисс', (totalComm/1000000).toFixed(1)+'M₮', 'var(--ub-ink-2)'], ['Цэвэр орлого', ((totalRev-totalComm)/1000000).toFixed(1)+'M₮', 'var(--ub-green)']].map(([lbl, val, clr]) => (
          <div key={lbl} style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 12, padding: '14px 18px' }}>
            <div style={{ fontSize: 12, color: 'var(--ub-ink-3)', fontWeight: 600, marginBottom: 4 }}>{lbl}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: clr }} className="numeric">{val}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr 0.8fr', gap: 14, padding: '14px 22px', background: 'var(--ub-surface-2)', fontSize: 12.5, fontWeight: 700, color: 'var(--ub-ink-3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
          <span>Жолооч</span><span style={{ textAlign: 'right' }}>Орлого</span><span style={{ textAlign: 'right' }}>Комиссион</span><span style={{ textAlign: 'right' }}>Цэвэр</span><span>Дүүрэг</span><span>Төлөв</span>
        </div>
        {pageItems.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--ub-ink-3)', fontSize: 14 }}>Жолооч олдсонгүй</div>
        ) : pageItems.map((e, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr 0.8fr', gap: 14, padding: '13px 22px', borderTop: '1px solid var(--ub-border)', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><Avatar name={e.name} size={28} /><span style={{ fontSize: 13.5, fontWeight: 600 }}>{e.name}</span></div>
            <span style={{ textAlign: 'right', fontSize: 14, fontWeight: 700, color: 'var(--ub-orange)' }} className="numeric">{(e.revenue/1000).toFixed(0)}k₮</span>
            <span style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600, color: 'var(--ub-ink-3)' }} className="numeric">{(e.commission/1000).toFixed(0)}k₮</span>
            <span style={{ textAlign: 'right', fontSize: 14, fontWeight: 700, color: 'var(--ub-green)' }} className="numeric">{(e.net/1000).toFixed(0)}k₮</span>
            <span style={{ fontSize: 12.5, color: 'var(--ub-ink-2)' }}>{e.zone?.replace(' дүүрэг','')}</span>
            <Badge color={e.status==='paid'?'var(--ub-green)':'var(--ub-orange)'} bg={e.status==='paid'?'var(--ub-green-t)':'var(--ub-orange-t)'} dot>{e.status==='paid'?'Төлсөн':'Хүлээгдэж'}</Badge>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <span style={{ fontSize: 13, color: 'var(--ub-ink-3)', fontWeight: 600 }}>{(safePage-1)*EARN_PAGE+1}–{Math.min(safePage*EARN_PAGE,filtered.length)} / {filtered.length}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={safePage===1} style={{width:34,height:34,borderRadius:9,border:'1.5px solid var(--ub-border)',background:'var(--ub-surface)',cursor:safePage===1?'default':'pointer',opacity:safePage===1?0.4:1,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon.chevL size={16}/></button>
            {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-safePage)<=1).reduce((acc,p,idx,arr)=>{if(idx>0&&p-arr[idx-1]>1)acc.push('…');acc.push(p);return acc;},[]).map((p,i)=>p==='…'?(
              <span key={'e'+i} style={{width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'var(--ub-ink-3)'}}>…</span>
            ):(
              <button key={p} onClick={()=>setPage(p)} style={{width:34,height:34,borderRadius:9,border:p===safePage?'2px solid var(--ub-orange)':'1.5px solid var(--ub-border)',background:p===safePage?'var(--ub-orange-t)':'var(--ub-surface)',color:p===safePage?'var(--ub-orange-d)':'var(--ub-ink)',fontFamily:'inherit',fontSize:13.5,fontWeight:p===safePage?700:500,cursor:'pointer'}}>{p}</button>
            ))}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={safePage===totalPages} style={{width:34,height:34,borderRadius:9,border:'1.5px solid var(--ub-border)',background:'var(--ub-surface)',cursor:safePage===totalPages?'default':'pointer',opacity:safePage===totalPages?0.4:1,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon.chevR size={16}/></button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── System Logs ─────────────────────────────────────────────────
const LOG_PAGE = 15;
function AdminLogs() {
  const [filterType, setFilterType] = useStateAdmin('all');
  const [logPage, setLogPage] = useStateAdmin(1);
  const logs = [
    { id: 1, ts: '2025-01-13 14:32', user: 'Т. Ганбаатар', action: 'login', detail: 'Админ нэвтрэв' },
    { id: 2, ts: '2025-01-13 14:28', user: 'Э. Сараа', action: 'approve', detail: 'Б. Батсайхан-г бүртгэлж зөвшөөрлөө' },
    { id: 3, ts: '2025-01-13 13:45', user: 'Т. Ганбаатар', action: 'staff_add', detail: 'Ж. Өнөрбаян CS ажилтан нэмсэн' },
    { id: 4, ts: '2025-01-13 12:10', user: 'Э. Сараа', action: 'reject', detail: 'М. Жамсран-г татгалзасан' },
    { id: 5, ts: '2025-01-13 10:50', user: 'Т. Ганбаатар', action: 'settings', detail: 'Комиссион 15%-т өөрчилсөн' },
  ];

  const filtered = filterType === 'all' ? logs : logs.filter(l => l.action === filterType);
  const logTotalPages = Math.ceil(filtered.length / LOG_PAGE);
  const logSafePage = Math.min(logPage, Math.max(1, logTotalPages));
  const pageLogs = filtered.slice((logSafePage-1)*LOG_PAGE, logSafePage*LOG_PAGE);
  const actionLabels = {
    login: '🔐 Нэвтрэх', approve: '✅ Бүртгэл зөвшөөрөх', reject: '❌ Татгалзах',
    staff_add: '👤 Ажилтан нэмэх', settings: '⚙️ Тохиргоо өөрчлөх'
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', 'login', 'approve', 'reject', 'staff_add', 'settings'].map(t => (
          <button key={t} onClick={() => { setFilterType(t); setLogPage(1); }} style={{
            padding: '8px 14px', borderRadius: 8, border: filterType === t ? '2px solid var(--ub-orange)' : '1.5px solid var(--ub-border)',
            background: filterType === t ? 'var(--ub-orange-t)' : 'transparent', color: filterType === t ? 'var(--ub-orange-d)' : 'var(--ub-ink-2)',
            fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer'
          }}>
            {t === 'all' ? 'Бүгд' : actionLabels[t]}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {pageLogs.map(log => (
          <div key={log.id} style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{log.detail}</div>
              <div style={{ fontSize: 13, color: 'var(--ub-ink-3)' }}>{log.user} · {log.ts}</div>
            </div>
            <Badge color="var(--ub-ink-3)" bg="var(--ub-chip)">{actionLabels[log.action] || log.action}</Badge>
          </div>
        ))}
      </div>
      {logTotalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <span style={{ fontSize: 13, color: 'var(--ub-ink-3)', fontWeight: 600 }}>{(logSafePage-1)*LOG_PAGE+1}–{Math.min(logSafePage*LOG_PAGE,filtered.length)} / {filtered.length}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={()=>setLogPage(p=>Math.max(1,p-1))} disabled={logSafePage===1} style={{width:34,height:34,borderRadius:9,border:'1.5px solid var(--ub-border)',background:'var(--ub-surface)',cursor:logSafePage===1?'default':'pointer',opacity:logSafePage===1?0.4:1,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon.chevL size={16}/></button>
            {Array.from({length:logTotalPages},(_,i)=>i+1).filter(p=>p===1||p===logTotalPages||Math.abs(p-logSafePage)<=1).reduce((acc,p,idx,arr)=>{if(idx>0&&p-arr[idx-1]>1)acc.push('…');acc.push(p);return acc;},[]).map((p,i)=>p==='…'?(<span key={'e'+i} style={{width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'var(--ub-ink-3)'}}>…</span>):(<button key={p} onClick={()=>setLogPage(p)} style={{width:34,height:34,borderRadius:9,border:p===logSafePage?'2px solid var(--ub-orange)':'1.5px solid var(--ub-border)',background:p===logSafePage?'var(--ub-orange-t)':'var(--ub-surface)',color:p===logSafePage?'var(--ub-orange-d)':'var(--ub-ink)',fontFamily:'inherit',fontSize:13.5,fontWeight:p===logSafePage?700:500,cursor:'pointer'}}>{p}</button>))}
            <button onClick={()=>setLogPage(p=>Math.min(logTotalPages,p+1))} disabled={logSafePage===logTotalPages} style={{width:34,height:34,borderRadius:9,border:'1.5px solid var(--ub-border)',background:'var(--ub-surface)',cursor:logSafePage===logTotalPages?'default':'pointer',opacity:logSafePage===logTotalPages?0.4:1,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon.chevR size={16}/></button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Settings ────────────────────────────────────────────────────
function AdminSettings() {
  const [settings, setSettings] = useStateAdmin({
    basePrice: 45000,
    commission: 15,
    minDistance: 1,
    maxDistance: 50,
    apiKey: 'sk-ubcab-' + Math.random().toString(36).slice(2, 8).toUpperCase()
  });

  const updateSetting = (key, value) => {
    setSettings(s => ({ ...s, [key]: value }));
  };

  const sections = [
    { label: 'Үнийн тохиргоо', fields: [
      { key: 'basePrice', label: 'Суурь үнэ (₮)', type: 'number', min: 10000, max: 100000 },
      { key: 'commission', label: 'Комиссион (%)', type: 'number', min: 5, max: 50 },
    ]},
    { label: 'Хүргэлтийн муж', fields: [
      { key: 'minDistance', label: 'Хамгийн багасан (км)', type: 'number', min: 0.5, max: 10 },
      { key: 'maxDistance', label: 'Хамгийн даалинтай (км)', type: 'number', min: 20, max: 100 },
    ]},
  ];

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      {sections.map((sec, i) => (
        <div key={i} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{sec.label}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {sec.fields.map(f => (
              <div key={f.key} style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink-2)', marginBottom: 8 }}>{f.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type={f.type} min={f.min} max={f.max} value={settings[f.key]} onChange={(e) => updateSetting(f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--ub-border)', background: 'var(--ub-bg)', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: 'var(--ub-ink)', outline: 'none', boxSizing: 'border-box' }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ub-orange)', minWidth: 60 }}>{settings[f.key]}{f.key === 'basePrice' ? '₮' : f.key === 'commission' ? '%' : 'км'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 12, padding: 16, marginTop: 28 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>API түлхүүр</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="text" value={settings.apiKey} readOnly style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--ub-border)', background: 'var(--ub-bg)', fontFamily: 'monospace', fontSize: 12, color: 'var(--ub-ink-3)', outline: 'none', boxSizing: 'border-box' }} />
          <Btn kind="ghost" size="sm" onClick={() => updateSetting('apiKey', 'sk-ubcab-' + Math.random().toString(36).slice(2, 8).toUpperCase())}>Шинэ</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Admin Nav Meta ──────────────────────────────────────────────
const ADMIN_META = {
  dash: ['Хяналтын самбар', 'Нэгдсэн тойм мэдээлэл'],
  regs: ['Бүртгэлийн хүсэлт', 'Жолоочийн бүртгэлийг зөвшөөрөх, татгалзах'],
  drivers: ['Жолоочид', 'Бүртгэлтэй жолоочийн жагсаалт'],
  staff: ['CS Ажилтан', 'Ажилтан нэмэх, удирдах'],
  earnings: ['Орлогын тайлан', 'Жолоочийн орлого, комиссион, төлөлт'],
  logs: ['Системийн логс', 'Нэвтрэх, өөрчлөлтийн түүх'],
  settings: ['Тохиргоо', 'Үнэ, комиссион, API түлхүүр'],
};

// AdminApp removed — functionality moved to CSApp with isAdmin={true}
