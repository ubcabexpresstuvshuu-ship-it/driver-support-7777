// cs-web.jsx — UBCAB Express CS / employee web dashboard (inside ChromeWindow)
const { useState: useStateCS } = React;

// ── Sidebar ─────────────────────────────────────────────────────
function CSSidebar({ nav, onNav, onLogout, returnResultsCount, inboxNewCount, pendingRegsCount, isAdmin, adminUnlocked, csProfile }) {
  const csItems = [
    ['dash', 'Хяналтын самбар', Icon.grid],
    ['returns', 'Буцаалт байршуулах', Icon.upload],
    ['inbox', 'Жолоочийн хүсэлт', Icon.inbox],
    ['changes', 'Хаяг/дугаар солих', Icon.swap],
  ];
  const adminItems = [
    ['regs', 'Бүртгэлийн хүсэлт', Icon.inbox],
    ['drivers', 'Жолоочид', Icon.truck],
    ['staff', 'CS Ажилтан', Icon.user],
    ['logs', 'Системийн логс', Icon.fileText],
  ];
  const newCount = inboxNewCount != null ? inboxNewCount : 0;
  const pendingRegs = pendingRegsCount || 0;

  const renderItem = ([k, label, Ic]) => {
    const on = nav === k;
    return (
      <button key={k} onClick={() => onNav(k)} style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 11,
        border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14.5, fontWeight: on ? 700 : 500,
        background: on ? 'var(--ub-orange-t)' : 'transparent', color: on ? 'var(--ub-orange-d)' : 'var(--ub-ink-2)', textAlign: 'left',
      }}>
        {k === 'returns'
          ? <img src="assets/icon-returns.png" style={{ width: 20, height: 20, objectFit: 'contain' }} />
          : k === 'changes'
            ? <Ic size={20} />
            : <Ic size={20} />
        }<span style={{ flex: 1 }}>{label}</span>
        {k === 'regs' && pendingRegs > 0 && <span style={{ background: 'var(--ub-orange)', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '2px 7px' }}>{pendingRegs}</span>}
      </button>
    );
  };

  return (
    <div style={{ width: 248, flexShrink: 0, background: 'var(--ub-surface-2)', borderRight: '1px solid var(--ub-border)', display: 'flex', flexDirection: 'column', padding: '20px 14px' }}>
      <div style={{ padding: '0 8px 22px' }}>
        <img src={window.__resources?.ubcabLogo || 'assets/ubcab-express-logo.png'} alt="UBCAB Express" style={{ height: 26, width: 'auto', display: 'block' }} />
        <div style={{ fontSize: 12, color: 'var(--ub-ink-3)', fontWeight: 600, marginTop: 8, letterSpacing: '.04em' }}>CS АЖЛЫН ОРЧИН</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {csItems.map(renderItem)}
      </div>
      {isAdmin && <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '16px 12px 8px', borderTop: '1px solid var(--ub-border)', marginTop: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ub-ink-3)', letterSpacing: '.06em', textTransform: 'uppercase', flex: 1 }}>Админ</span>
          {!adminUnlocked && <span title="Нууц үгээр хамгаалагдсан" style={{ color: 'var(--ub-ink-3)', opacity: 0.7 }}><Icon.lock size={13}/></span>}
          {adminUnlocked && <span title="Нээлттэй" style={{ color: 'var(--ub-green)' }}><Icon.check size={13}/></span>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {adminItems.map(renderItem)}
        </div>
      </>}
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 10px', borderRadius: 12, background: 'var(--ub-surface)', border: '1px solid var(--ub-border)' }}>
        <Avatar name={csProfile?.name || UB.cs.name} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{csProfile?.name || UB.cs.name}</div>
        </div>
        <button onClick={onLogout} title="Гарах" style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--ub-ink-3)' }}><Icon.logout size={18} /></button>
      </div>
    </div>
  );
}

function CSTopBar({ title, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 32px', borderBottom: '1px solid var(--ub-border)' }}>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em' }}>{title}</div>
        {sub && <div style={{ fontSize: 14, color: 'var(--ub-ink-2)', marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative', color: 'var(--ub-ink-2)' }}>
          <Icon.bell size={22} />
          <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 999, background: 'var(--ub-orange)' }} />
        </div>
      </div>
    </div>
  );
}


function CSStat({ label, value, sub, color = 'var(--ub-ink)', icon, onClick, active }) {
  return (
    <div onClick={onClick} style={{ background: active ? 'var(--ub-orange-t)' : 'var(--ub-surface)', border: active ? '2px solid var(--ub-orange)' : '1px solid var(--ub-border)', borderRadius: 16, padding: 20, cursor: onClick ? 'pointer' : 'default', transition: onClick ? 'box-shadow .15s' : 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13.5, color: 'var(--ub-ink-2)', fontWeight: 600 }}>{label}</span>
        <span style={{ color: color === 'var(--ub-ink)' ? 'var(--ub-ink-3)' : color }}>{icon}</span>
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.02em', color, lineHeight: 1 }} className="numeric">{value}</div>
      {sub && <div style={{ fontSize: 13, color: 'var(--ub-ink-3)', marginTop: 8 }}>{sub}</div>}
    </div>
  );
}

// ── DASHBOARD ───────────────────────────────────────────────────
const DASH_PAGE = 30;
function CSDash({ returnResults, onNav, shipmentTasks, driverRequests, inboxNewCount, pendingChangesCount, onRefresh, onClearAll, isAdmin }) {
  const [showClearModal, setShowClearModal] = useStateCS(false);
  const [clearPin, setClearPin] = useStateCS('');
  const [clearErr, setClearErr] = useStateCS('');

  const results = returnResults || [];
  const taskCount = (shipmentTasks || []).length;
  const assignedCount = (shipmentTasks || []).filter(t => t.district).length;
  const newReqCount = inboxNewCount != null ? inboxNewCount : (driverRequests || []).length;
  const [dashPage, setDashPage] = useStateCS(1);
  const [selectedResult, setSelectedResult] = React.useState(null);
  const [tableFilter, setTableFilter] = React.useState(null); // null | 'all' | 'received' | 'cancelled'

  const allRows = React.useMemo(() => {
    const done = (returnResults || []).map(r => ({
      id: r.taskId || r.ubcCode,
      tracking: r.ubcCode || r.taskId,
      status: r.status,
      driverPhone: '—',
      phone: r.customer || '—',
      addr: r.district || '—',
      khoroo: '',
      district: r.district || '—',
      _result: r,
    }));
    const pending = (shipmentTasks || []).filter(t =>
      !(returnResults || []).some(r => r.taskId === t.id || r.ubcCode === (t.tracking || t.id))
    );
    return [...done, ...pending];
  }, [returnResults, shipmentTasks]);

  // Merge: received/cancelled on top, then pending shipments
  const filteredRows = React.useMemo(() => {
    if (tableFilter === 'received') return allRows.filter(r => r.status === 'received');
    if (tableFilter === 'cancelled') return allRows.filter(r => r.status === 'cancelled');
    return allRows;
  }, [allRows, tableFilter]);

  const dashTotalPages = Math.ceil(filteredRows.length / DASH_PAGE);
  const dashSafePage = Math.min(dashPage, Math.max(1, dashTotalPages));
  const pageResults = results.slice((dashSafePage-1)*DASH_PAGE, dashSafePage*DASH_PAGE);
  return (
    <div style={{ padding: 32 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginBottom: 20 }}>
        <button onClick={() => { if (window.ubcabSync?.pull) window.ubcabSync.pull(); onRefresh && onRefresh(); }} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 10, border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface)', color: 'var(--ub-ink-2)', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          <Icon.upload size={15} style={{ transform: 'rotate(180deg)' }} /> Шинэчлэх
        </button>
        {isAdmin && <button onClick={() => { setShowClearModal(true); setClearPin(''); setClearErr(''); }} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 10, border: '1.5px solid #C0392B', background: 'rgba(192,57,43,.07)', color: '#C0392B', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          <Icon.trash size={15} /> Мэдээлэл устгах
        </button>}
      </div>
      {/* Clear modal */}
      {showClearModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--ub-surface)', borderRadius: 18, padding: 32, width: 340, boxShadow: '0 8px 32px rgba(0,0,0,.18)' }}>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>Мэдээлэл устгах</div>
            <div style={{ fontSize: 13, color: 'var(--ub-ink-3)', marginBottom: 20 }}>Бүх буцаалт, даалгавар устгагдана. Баталгаажуулахын тулд PIN оруулна уу.</div>
            <input type="password" inputMode="numeric" maxLength={4} value={clearPin} onChange={e => setClearPin(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="● ● ● ●"
              style={{ width: '100%', boxSizing: 'border-box', border: `1.5px solid ${clearErr ? '#C0392B' : 'var(--ub-border)'}`, borderRadius: 12, padding: '12px 16px', fontSize: 22, fontWeight: 800, letterSpacing: '0.3em', textAlign: 'center', fontFamily: 'var(--ub-font)', background: 'var(--ub-bg)', color: 'var(--ub-ink)', outline: 'none', marginBottom: 8 }} />
            {clearErr && <div style={{ fontSize: 12.5, color: '#C0392B', fontWeight: 600, marginBottom: 10 }}>{clearErr}</div>}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={() => setShowClearModal(false)} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: '1.5px solid var(--ub-border)', background: 'none', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: 'var(--ub-ink-3)' }}>Болих</button>
              <button onClick={() => {
                if (clearPin !== '0815') { setClearErr('PIN буруу байна'); return; }
                onClearAll && onClearAll();
                setShowClearModal(false);
              }} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', background: '#C0392B', color: '#fff', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Устгах</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16, marginBottom: 28 }}>
        <CSStat label="Өнөөдрийн буцаалт" value={taskCount} sub={taskCount > 0 ? `${assignedCount} хаяг хуваарилагдсан` : 'Excel ачаагдаагүй байна'} color="var(--ub-orange)" icon={<Icon.box size={20} />} onClick={() => setTableFilter(f => f === 'all' ? null : 'all')} active={tableFilter === 'all'} />
        <CSStat label="Өнөөдөр авсан буцаалт" value={(returnResults || []).filter(r => r.status === 'received' && new Date(r.receivedAt || Date.now()).toLocaleDateString('sv-SE') === new Date().toLocaleDateString('sv-SE')).length} sub="Жолоочид хүлээн авсан" color="var(--ub-orange)" icon={<Icon.truck size={20} />} onClick={() => setTableFilter(f => f === 'received' ? null : 'received')} active={tableFilter === 'received'} />
        <CSStat label="Өнөөдөр цуцалсан" value={allRows.filter(r => r.status === 'cancelled').length} sub="Жолооч цуцалсан" color="#C0392B" icon={<Icon.xmark size={20} />} onClick={() => setTableFilter(f => f === 'cancelled' ? null : 'cancelled')} active={tableFilter === 'cancelled'} />
        <CSStat label="Шинэ хүсэлт" value={newReqCount} sub={newReqCount > 0 ? 'Хариу хүлээж байна' : 'Шинэ хүсэлт алга'} color="var(--ub-info)" icon={<Icon.inbox size={20} />} onClick={() => onNav && onNav('inbox')} />
        <CSStat label="Хаяг/дугаар солих" value={pendingChangesCount || 0} sub={pendingChangesCount > 0 ? 'Хүлээгдэж буй хүсэлт' : 'Шийдвэрлэгдсэн'} color="var(--ub-info)" icon={<Icon.swap size={20} />} onClick={() => onNav && onNav('changes')} />
      </div>
      {/* Detail modal */}
      {selectedResult && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedResult(null)}>
          <div style={{ background: 'var(--ub-surface)', borderRadius: 20, padding: 28, width: 460, maxWidth: '90vw', boxShadow: '0 16px 48px rgba(0,0,0,.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>Буцаалтын дэлгэрэнгүй</div>
              <button onClick={() => setSelectedResult(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--ub-ink-3)' }}><Icon.xmark size={20} /></button>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 800, flex: 1 }}>{selectedResult.ubcCode || selectedResult.taskId}</div>
              <Badge color={selectedResult.status === 'received' ? 'var(--ub-green)' : selectedResult.status === 'cancelled' ? '#A01010' : 'var(--ub-orange-d)'} bg={selectedResult.status === 'received' ? 'var(--ub-green-t)' : selectedResult.status === 'cancelled' ? 'rgba(160,16,16,.1)' : 'var(--ub-orange-t)'} dot>{selectedResult.status === 'received' ? 'Pick up' : selectedResult.status === 'cancelled' ? 'Цуцалсан' : 'Received'}</Badge>
            </div>
            {[
              ['Хэрэглэгч', selectedResult.customer],
              ['Жолооч', selectedResult.driver],
              ['Дүүрэг', selectedResult.district],
              ['Хаяг 1', selectedResult.khoroo],
              ['Хаяг 2', selectedResult.addr],
              ['Цаг', selectedResult.ts],
              ['Шалтгаан', selectedResult.reason || selectedResult.cancelReason],
            ].filter(([,v]) => v).map(([l, v], i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '10px 0', borderTop: i ? '1px solid var(--ub-border)' : 'none' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ub-ink-3)', width: 80, flexShrink: 0, paddingTop: 2 }}>{l}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Жолоочийн буцаалтын төлөв */}
      <div style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, overflow: 'hidden', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--ub-border)' }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Буцаалтын жагсаалт</div>
          {filteredRows.length > 0 && <Badge color="var(--ub-orange-d)" bg="var(--ub-orange-t)">{filteredRows.length} хаяг</Badge>}
        </div>
        {filteredRows.length === 0 ?
          <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--ub-ink-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Icon.upload size={28} /></div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Excel файл байршуулаагүй байна</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Буцаалт байршуулах хэсгээс оруулна уу</div>
          </div>
        :
          <div style={{ overflowX: 'auto' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '180px 90px 120px 120px 1fr 1fr', gap: 0, padding: '8px 14px', background: 'var(--ub-ink)', borderBottom: '1px solid var(--ub-border)' }}>
              {['Tracking дугаар', 'Төлөв', 'Жолоочийн утас', 'Хэрэглэгчийн утас', 'Хаяг 1', 'Хаяг 2'].map((h, i) => (
                <div key={i} style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,.7)', letterSpacing: '.05em', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {filteredRows.slice((dashSafePage-1)*DASH_PAGE, dashSafePage*DASH_PAGE).map((t, i) => {
              const statusMap = { pending:'Received', enroute:'Замд', picked:'Pick up', done:'Pick up', received:'Pick up', cancelled:'Цуцалсан' };
              const statusColor = { pending:'var(--ub-ink-3)', enroute:'var(--ub-orange-d)', picked:'var(--ub-info)', done:'var(--ub-green)', received:'var(--ub-green)', cancelled:'#A01010' };
              const statusBg = { pending:'var(--ub-chip)', enroute:'var(--ub-orange-t)', picked:'var(--ub-info-t)', done:'var(--ub-green-t)', received:'var(--ub-green-t)', cancelled:'rgba(160,16,16,.1)' };
              const sc = statusColor[t.status] || 'var(--ub-ink-3)';
              const sb = statusBg[t.status] || 'var(--ub-chip)';
              return (
                <div key={(t.id||'')+'-'+i} onClick={() => setSelectedResult(t._result ? {...t._result, ubcCode: t.tracking, customer: t.phone, taskId: t.id} : {...t, ubcCode: t.tracking||t.id, customer: t.phone, taskId: t.id})} style={{ display: 'grid', gridTemplateColumns: '180px 90px 120px 120px 1fr 1fr', gap: 0, padding: '8px 14px', borderTop: '1px solid var(--ub-border)', cursor: 'pointer', transition: 'background .1s', background: t._result ? (t.status==='received'?'rgba(28,138,91,.05)':'rgba(160,16,16,.04)') : (i%2===0?'transparent':'var(--ub-surface-2)') }}
                  onMouseEnter={e => e.currentTarget.style.background='var(--ub-orange-t)'}
                  onMouseLeave={e => e.currentTarget.style.background= t._result ? (t.status==='received'?'rgba(28,138,91,.05)':'rgba(160,16,16,.04)') : (i%2===0?'transparent':'var(--ub-surface-2)')}>
                  <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'monospace', color: 'var(--ub-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8, display: 'flex', alignItems: 'center' }}>{t.tracking || t.id}</div>
                  <div><span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: sb, color: sc }}>{statusMap[t.status]||t.status}</span></div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink)', display: 'flex', alignItems: 'center' }}>{t.driverPhone || '—'}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink)', display: 'flex', alignItems: 'center' }}>{t.phone || '—'}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ub-ink-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>{t.khoroo || '—'}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ub-ink-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>{t.addr || '—'}</div>
                </div>
              );
            })}
          {Math.ceil(filteredRows.length / DASH_PAGE) > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '12px 22px', borderTop: '1px solid var(--ub-border)' }}>
                <button onClick={()=>setDashPage(p=>Math.max(1,p-1))} disabled={dashSafePage===1} style={{width:32,height:32,borderRadius:8,border:'1.5px solid var(--ub-border)',background:'var(--ub-surface)',cursor:dashSafePage===1?'default':'pointer',opacity:dashSafePage===1?0.4:1,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon.chevL size={14}/></button>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ub-ink-2)', minWidth: 80, textAlign: 'center' }}>{(dashSafePage-1)*DASH_PAGE+1}–{Math.min(dashSafePage*DASH_PAGE,filteredRows.length)} / {filteredRows.length}</span>
                <button onClick={()=>setDashPage(p=> p < Math.ceil(filteredRows.length/DASH_PAGE) ? p+1 : p)} disabled={dashSafePage >= Math.ceil(filteredRows.length/DASH_PAGE)} style={{width:32,height:32,borderRadius:8,border:'1.5px solid var(--ub-border)',background:'var(--ub-surface)',cursor:dashSafePage>=Math.ceil(filteredRows.length/DASH_PAGE)?'default':'pointer',opacity:dashSafePage>=Math.ceil(filteredRows.length/DASH_PAGE)?0.4:1,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon.chevR size={14}/></button>
              </div>
            )}
          </div>
        }
      </div>

    </div>
  );
}

// ── Elapsed-hour color logic (conditional formatting) ───────────
// 0–12ц → ногоон (хэвийн), 12–24ц → шар (анхаарах), 24–36ц → бүдэг улаан, 36–48ц → тод улаан, 48+ → хар улаан
function getElapsedInfo(createdDate) {
  if (!createdDate) return { hours: null, bg: 'transparent', color: 'var(--ub-ink-3)', label: '—', badge: 'Тодорхойгүй' };
  const hrs = (Date.now() - new Date(createdDate).getTime()) / 3600000;
  const h = Math.max(0, hrs);
  if (h <= 12)  return { hours: h, bg: 'rgba(28,138,91,.12)',  color: '#1C8A5B', label: h.toFixed(1) + ' цаг', badge: 'Хэвийн' };
  if (h <= 24)  return { hours: h, bg: 'rgba(217,166,0,.14)',   color: '#B8860B', label: h.toFixed(1) + ' цаг', badge: 'Анхаарах' };
  if (h <= 36)  return { hours: h, bg: 'rgba(200,60,40,.12)',   color: '#C0392B', label: h.toFixed(1) + ' цаг', badge: 'Хэтэрсэн' };
  if (h <= 48)  return { hours: h, bg: 'rgba(180,30,20,.18)',   color: '#A01010', label: h.toFixed(1) + ' цаг', badge: 'Яаралтай' };
  return           { hours: h, bg: 'rgba(140,10,10,.22)',   color: '#7A0A0A', label: h.toFixed(0) + ' цаг', badge: 'Маш хэтэрсэн' };
}

// ── SHIPMENT TABLE (shown inside upload detail) ─────────────────
function ShipmentTable({ shipments }) {
  const thStyle = { fontSize: 11.5, fontWeight: 700, color: 'var(--ub-ink-3)', textTransform: 'uppercase', letterSpacing: '.04em', padding: '12px 10px', textAlign: 'left', whiteSpace: 'nowrap' };
  const tdStyle = { fontSize: 13, padding: '11px 10px', borderTop: '1px solid var(--ub-border)', verticalAlign: 'top' };
  return (
    <div style={{ overflowX: 'auto', margin: '0 -20px', padding: '0 20px' }}>
      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ub-ink-3)' }}>Хугацааны ялгаа:</span>
        {[
          { label: '0–12ц', bg: 'rgba(28,138,91,.12)', color: '#1C8A5B', tag: 'Хэвийн' },
          { label: '12–24ц', bg: 'rgba(217,166,0,.14)', color: '#B8860B', tag: 'Анхаарах' },
          { label: '24–36ц', bg: 'rgba(200,60,40,.12)', color: '#C0392B', tag: 'Хэтэрсэн' },
          { label: '36–48ц', bg: 'rgba(180,30,20,.18)', color: '#A01010', tag: 'Яаралтай' },
          { label: '48ц+', bg: 'rgba(140,10,10,.22)', color: '#7A0A0A', tag: 'Маш хэтэрсэн' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 4, background: l.bg, border: `1.5px solid ${l.color}` }}></span>
            <span style={{ fontSize: 11.5, color: l.color, fontWeight: 600 }}>{l.label}</span>
          </div>
        ))}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 880 }}>
        <thead>
          <tr style={{ background: 'var(--ub-surface-2)' }}>
            <th style={thStyle}>Хэрэглэгчийн дугаар</th>
            <th style={thStyle}>Төлөв</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>Өнгөрсөн цаг</th>
            <th style={thStyle}>Огноо</th>
            <th style={thStyle}>Partner</th>
            <th style={thStyle}>Утас</th>
            <th style={thStyle}>Жин (кг)</th>
            <th style={thStyle}>Хороо</th>
            <th style={thStyle}>Хаяг</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((s, i) => {
            const el = getElapsedInfo(s.created);
            return (
              <tr key={s.tracking} style={{ background: i % 2 === 0 ? 'var(--ub-surface)' : 'var(--ub-surface-2)' }}>
                <td style={{ ...tdStyle, fontWeight: 700, fontSize: 12, fontFamily: 'monospace', letterSpacing: '.02em', color: 'var(--ub-orange-d)', whiteSpace: 'nowrap' }}>{s.phone}</td>
                <td style={tdStyle}><Badge color="var(--ub-green)" bg="var(--ub-green-t)" dot>{s.status === 'Received' ? 'Хүлээн авсан' : s.status}</Badge></td>
                <td style={{ ...tdStyle, textAlign: 'center', padding: '8px 6px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: el.bg, border: `1px solid ${el.color}22`, borderRadius: 8, padding: '5px 10px' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: el.color, fontVariantNumeric: 'tabular-nums' }}>{el.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: el.color, opacity: .75 }}>{el.badge}</span>
                  </div>
                </td>
                <td style={{ ...tdStyle, whiteSpace: 'nowrap', color: 'var(--ub-ink-2)' }}>{s.created}</td>
                <td style={tdStyle}><Badge color="var(--ub-info)" bg="var(--ub-chip)">{s.partner}</Badge></td>
                <td style={{ ...tdStyle, fontWeight: 600, whiteSpace: 'nowrap' }}>{s.phone}</td>
                <td style={{ ...tdStyle, fontWeight: 700, textAlign: 'right' }} className="numeric">{s.weight}</td>
                <td style={{ ...tdStyle, whiteSpace: 'nowrap', color: 'var(--ub-ink-2)' }}>{s.khoroo}</td>
                <td style={{ ...tdStyle, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ub-ink-2)' }} title={s.addr}>{s.addr}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── RETURNS UPLOAD ──────────────────────────────────────────────
function CSReturns({ onShipmentUpload, onDeleteUploadTasks }) {
  const [uploads, setUploads] = useStateCS(() => {
    try { const s = localStorage.getItem('ub_cs_uploads'); if (s) return JSON.parse(s); } catch {}
    return [];
  });
  const [expandedId, setExpandedId] = useStateCS(null);
  const [uploadedShipments, setUploadedShipments] = useStateCS(() => {
    try { const s = localStorage.getItem('ub_cs_shipments'); if (s) return JSON.parse(s); } catch {}
    return null;
  });
  React.useEffect(() => {
    try { localStorage.setItem('ub_cs_uploads', JSON.stringify(uploads)); } catch {}
  }, [uploads]);
  React.useEffect(() => {
    if (uploadedShipments) try { localStorage.setItem('ub_cs_shipments', JSON.stringify(uploadedShipments)); } catch {}
  }, [uploadedShipments]);
  const [dragOver, setDragOver] = useStateCS(false);
  const fileInputRef = React.useRef(null);

  const processFile = (file) => {
    if (!file) return;
    if (!window.XLSX) { alert('Excel сан ачаалагдаагүй байна, түр хүлээнэ үү.'); return; }
    const isCsv = file.name.toLowerCase().endsWith('.csv');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = isCsv
          ? window.XLSX.read(e.target.result, { type: 'string', raw: false })
          : window.XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = window.XLSX.utils.sheet_to_json(ws, { defval: '' });
        if (rows.length > 0) console.log('CSV баганууд:', Object.keys(rows[0]));
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        // Excel огноог ISO болгох helper
        const parseExcelDate = (val) => {
          if (!val || val === '') return null;
          // Excel serial number (number type)
          if (typeof val === 'number') {
            const d = new Date((val - 25569) * 86400 * 1000);
            return isNaN(d.getTime()) ? null : d.toISOString();
          }
          // String: normalize separators and try parse
          const s = String(val).trim().replace(/\//g, '-');
          const d = new Date(s);
          return isNaN(d.getTime()) ? null : d.toISOString();
        };
        // Normalize: trim keys, uppercase for matching
        const norm = (row) => {
          const out = {};
          Object.keys(row).forEach(k => { out[k.trim().toUpperCase()] = row[k]; });
          return out;
        };
        const now = new Date().toISOString();
        const shipmentsWithUBC = rows.map((rawRow, i) => {
          const row = norm(rawRow);
          const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
          const addr1 = row['ADDRESS LINE 1'] || row['ADRESSLINE1'] || row['ADDRESSLINE1'] || row['ХАЯГ1'] || row['ADDRESS'] || '';
          const addr2 = row['ADDRESS LINE 2'] || row['ADRESSLINE 2'] || row['ADDRESSLINE2'] || row['ХАЯГ2'] || '';
          const tracking = row['TRACKING NUMBER'] || row['TRACKING'] || row['ХЭРЭГЛЭГЧИЙН ДУГААР'] || `UBC-${date}-${rand}`;
          const zip = row['ZIPCODE'] || row['ZIP CODE'] || row['ZIP'] || row['ЗИП'] || '';
          return {
            tracking,
            id: tracking,
            name: row['НЭР'] || row['NAME'] || row['ХҮЛЭЭН АВАГЧ'] || `Хүлээн авагч ${i + 1}`,
            addr: [addr1, addr2].filter(v => v && v !== '-').join(', '),
            phone: row['УТАСНЫ ДУГААР'] || row['УТАС'] || row['PHONE'] || row['PHONE NUMBER'] || '',
            khoroo: row['ADDRESS LINE 2'] || row['ADRESSLINE 2'] || row['ХОРОО'] || row['БҮС'] || '',
            zip,
            weight: row['ЖИН'] || row['WEIGHT'] || row['КГ'] || '',
            partner: row['PARTNER'] || row['ХАРИЛЦАГЧ'] || '',
            status: 'Received',
            created: parseExcelDate(row['ЗАХИАЛГА ҮҮССЭН'] || row['ОГНОО']) || now,
            receivedAt: now,
            note: row['ТАЙЛБАР'] || row['ТЭМДЭГЛЭЛ'] || row['NOTE'] || '',
          };
        });
        const nextId = 'U-' + Math.floor(Math.random() * 10000);
        const newUpload = { id: nextId, name: file.name, rows: shipmentsWithUBC.length, assigned: shipmentsWithUBC.length, ts: 'Дөнгөж сая', by: UB.cs.name, hasData: true, trackingIds: shipmentsWithUBC.map(s => s.tracking) };
        setUploads(u => [newUpload, ...u]);
        setUploadedShipments(shipmentsWithUBC);

        setExpandedId(nextId);
        try { if (onShipmentUpload) onShipmentUpload(shipmentsWithUBC); } catch(e) { console.error('onShipmentUpload error:', e); }
      } catch (err) {
        alert('Файл уншихад алдаа гарлаа: ' + err.message);
      }
    };
    if (isCsv) reader.readAsText(file, 'UTF-8');
    else reader.readAsArrayBuffer(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileInput = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const toggleExpand = (id, hasData) => {
    if (!hasData) return;
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div style={{ padding: 32 }}>
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={handleFileInput} />
      <div
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{ cursor: 'pointer', border: `2px dashed ${dragOver ? 'var(--ub-orange)' : 'var(--ub-border)'}`, borderRadius: 16, padding: '38px 24px', textAlign: 'center', background: dragOver ? 'var(--ub-orange-t)' : 'var(--ub-surface-2)', marginBottom: 24, transition: 'all .15s' }}>
        <div style={{ width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}><img src="assets/icon-returns.png" style={{ width: 64, height: 64, objectFit: 'contain' }} /></div>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Өдрийн буцаалтын Excel байршуулах</div>
        <div style={{ fontSize: 14, color: 'var(--ub-ink-2)' }}>.xlsx файлыг чирж оруулна уу — хаягууд жолоочид автоматаар хуваарилагдана</div>
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Байршуулсан файлууд</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {uploads.map((u, i) => {
          const isExpanded = expandedId === u.id && u.hasData;
          const shipments = u.hasData ? (uploadedShipments || UB.shipments) : null;
          return (
            <div key={u.id + i} style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', cursor: u.hasData ? 'pointer' : 'default' }} onClick={() => toggleExpand(u.id, u.hasData)}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: u.hasData ? 'var(--ub-orange-t)' : 'var(--ub-green-t)', color: u.hasData ? 'var(--ub-orange-d)' : 'var(--ub-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.doc size={20} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700 }}>{u.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ub-ink-3)' }}>{u.rows} мөр · {u.by} · {u.ts}</div>
                </div>
                <div style={{ width: 160 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}><span style={{ color: 'var(--ub-ink-3)' }}>Хуваарилалт</span><span style={{ fontWeight: 700 }}>{u.assigned}/{u.rows}</span></div>
                  <div style={{ height: 7, borderRadius: 999, background: 'var(--ub-chip)', overflow: 'hidden' }}><div style={{ width: (u.assigned / u.rows * 100) + '%', height: '100%', background: u.assigned === u.rows ? 'var(--ub-green)' : 'var(--ub-orange)' }} /></div>
                </div>
                {u.assigned === u.rows && <Badge color="var(--ub-green)" bg="var(--ub-green-t)" dot>Орсон</Badge>}
                {u.hasData && <span style={{ color: 'var(--ub-ink-3)', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform .15s var(--ub-ease)', flexShrink: 0 }}><Icon.chevR size={18} /></span>}
                <button onClick={e => { e.stopPropagation(); if (onDeleteUploadTasks && u.trackingIds) onDeleteUploadTasks(u.trackingIds); setUploads(prev => prev.filter(x => x.id !== u.id)); if (expandedId === u.id) setExpandedId(null); }} style={{ border: 'none', background: 'rgba(192,57,43,.1)', color: '#C0392B', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700 }}><Icon.trash size={14} /> Устгах</button>
              </div>
              {isExpanded && shipments && (
                <div style={{ borderTop: '1px solid var(--ub-border)', padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>Ачааны мэдээлэл</span>
                      <Badge color="var(--ub-orange-d)" bg="var(--ub-orange-t)">{shipments.length} мөр</Badge>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--ub-ink-3)' }}>
                      <Icon.box size={15} />
                      <span>Нийт жин: <strong style={{ color: 'var(--ub-ink)' }}>{shipments.reduce((s, r) => s + (parseFloat(r.weight) || 0), 0).toFixed(2)} кг</strong></span>
                    </div>
                  </div>
                  <ShipmentTable shipments={shipments} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── REQUESTS INBOX (Бараа шивүүлэх / Цалингийн хүсэлт картууд) ───
function InboxRequestRow({ q, status, accent, onAct }) {
  const r = REQ_STATUS[status] || { color: 'var(--ub-ink-3)', label: status || 'Хүлээгдэж буй' };
  const pending = status !== 'done';
  const [note, setNote] = React.useState('');
  const [expanded, setExpanded] = React.useState(false);
  const match = (q.detail || '').match(/[A-Z]{2}\d{9,12}[A-Z]{2}/);
  const trackingCode = match ? match[0] : null;
  const detailText = match ? (q.detail || '').replace(match[0], '').trim().replace(/^[·\-\s]+|[·\-\s]+$/g, '') : (q.detail || '');
  const copyCode = (code) => {
    try { navigator.clipboard.writeText(code); } catch {
      const t = document.createElement('textarea'); t.value = code;
      document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
  };
  return (
    <div style={{ borderBottom: '1px solid var(--ub-border)', background: pending ? accent.bg : 'transparent' }}>
      {/* Compact row */}
      <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto auto auto', gap: 10, alignItems: 'center', padding: '10px 16px', cursor: 'pointer' }} onClick={() => setExpanded(e => !e)}>
        <span style={{ color: 'var(--ub-ink-3)' }}><Icon.inbox size={16} /></span>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13.5, fontWeight: 700 }}>{q.driver}</span>
            <span style={{ fontSize: 12, color: 'var(--ub-ink-3)' }}>{q.driverPhone}</span>
            {trackingCode && <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, background: 'var(--ub-chip)', padding: '2px 8px', borderRadius: 6 }}>{trackingCode}</span>}
          </div>
          {detailText && <div style={{ fontSize: 12, color: 'var(--ub-ink-3)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{detailText}</div>}
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: status === 'done' ? '#111' : 'var(--ub-orange)', color: '#fff', whiteSpace: 'nowrap' }}>{status === 'done' ? 'DONE' : q.type === 'goods' ? 'БАРАА' : 'ЦАЛИН'}</span>
        {status === 'new' && <ElapsedBadge receivedAt={q.receivedAt} />}
        <span style={{ color: 'var(--ub-ink-3)', transform: expanded ? 'rotate(90deg)' : 'rotate(0)', transition: '.15s' }}><Icon.chevR size={14} /></span>
      </div>
      {/* Expanded actions */}
      {expanded && (
        <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {trackingCode && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, background: 'var(--ub-chip)', padding: '4px 10px', borderRadius: 7 }}>{trackingCode}</span>
              <button onClick={() => copyCode(trackingCode)} style={{ border: 'none', background: 'var(--ub-orange-t)', color: 'var(--ub-orange-d)', borderRadius: 7, padding: '4px 12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700 }}>Хуулах</button>
            </div>
          )}
          {status === 'new' && q.type === 'salary' && (
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Шийдвэрийн тайлбар..." rows={2}
              style={{ width: '100%', boxSizing: 'border-box', padding: '9px 11px', borderRadius: 10, border: '1.5px solid var(--ub-border)', fontFamily: 'inherit', fontSize: 13, background: 'var(--ub-surface)', color: 'var(--ub-ink)', outline: 'none', resize: 'none' }} />
          )}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            {status === 'new' && q.type === 'goods' && <Btn kind="primary" size="sm" icon={<Icon.check size={16} />} onClick={() => onAct(q.id, 'done')}>Системд шивсэн</Btn>}
            {status === 'new' && q.type === 'salary' && <Btn kind="primary" size="sm" icon={<Icon.send size={15} />} onClick={() => onAct(q.id, 'done', note || 'Таны цалингийн хүсэлт шийдвэрлэгдлээ')}>Шийдвэрлэсэн — илгээх</Btn>}
            {status === 'done' && <span style={{ fontSize: 13, color: 'var(--ub-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><Icon.check size={16} /> Шийдвэрлэсэн</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function useElapsed(receivedAt) {
  const [mins, setMins] = React.useState(() => receivedAt ? Math.floor((Date.now() - new Date(receivedAt)) / 60000) : null);
  React.useEffect(() => {
    if (!receivedAt) return;
    const t = setInterval(() => setMins(Math.floor((Date.now() - new Date(receivedAt)) / 60000)), 30000);
    return () => clearInterval(t);
  }, [receivedAt]);
  return mins;
}

function ElapsedBadge({ receivedAt }) {
  const mins = useElapsed(receivedAt);
  if (mins === null) return null;
  const color = mins <= 10 ? 'var(--ub-green)' : mins <= 30 ? '#D97706' : '#C0392B';
  const bg = mins <= 10 ? 'rgba(34,197,94,.12)' : mins <= 30 ? 'rgba(217,119,6,.12)' : 'rgba(192,57,43,.12)';
  const label = mins < 60 ? mins + ' мин' : Math.floor(mins/60) + 'ц ' + (mins%60) + 'м';
  return <span style={{ fontSize: 11, fontWeight: 800, color, background: bg, padding: '2px 8px', borderRadius: 999, flexShrink: 0 }}>⏱ {label}</span>;
}


const INBOX_PAGE = 6;
function InboxGroup({ title, sub, icon, accent, items, getStatus, onAct, emptyText }) {
  const [page, setPage] = useStateCS(1);
  const pending = items.filter(q => getStatus(q) !== 'done').length;
  const totalPages = Math.ceil(items.length / INBOX_PAGE);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const pageItems = items.slice((safePage-1)*INBOX_PAGE, safePage*INBOX_PAGE);
  return (
    <div style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '18px 20px', borderBottom: '1px solid var(--ub-border)' }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: accent.bg, color: accent.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16.5, fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: 12.5, color: 'var(--ub-ink-3)' }}>{sub}</div>
        </div>
        <span style={{ background: pending > 0 ? accent.fg : 'var(--ub-chip)', color: pending > 0 ? '#fff' : 'var(--ub-ink-3)', fontSize: 12.5, fontWeight: 700, borderRadius: 999, padding: '4px 11px', flexShrink: 0 }}>{pending} шинэ</span>
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '34px 16px', color: 'var(--ub-ink-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, opacity: .6 }}>{icon}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{emptyText}</div>
          </div>
        ) : pageItems.map(q => <InboxRequestRow key={q.id} q={q} status={getStatus(q)} accent={accent} onAct={onAct} />)}
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderTop: '1px solid var(--ub-border)' }}>
          <span style={{ fontSize: 12, color: 'var(--ub-ink-3)', fontWeight: 600 }}>{(safePage-1)*INBOX_PAGE+1}–{Math.min(safePage*INBOX_PAGE,items.length)} / {items.length}</span>
          <div style={{ display: 'flex', gap: 5 }}>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={safePage===1} style={{width:30,height:30,borderRadius:8,border:'1.5px solid var(--ub-border)',background:'var(--ub-surface)',cursor:safePage===1?'default':'pointer',opacity:safePage===1?0.4:1,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon.chevL size={14}/></button>
            {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-safePage)<=1).reduce((acc,p,idx,arr)=>{if(idx>0&&p-arr[idx-1]>1)acc.push('…');acc.push(p);return acc;},[]).map((p,i)=>p==='…'?(
              <span key={'e'+i} style={{width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'var(--ub-ink-3)'}}>…</span>
            ):(
              <button key={p} onClick={()=>setPage(p)} style={{width:30,height:30,borderRadius:8,border:p===safePage?'2px solid var(--ub-orange)':'1.5px solid var(--ub-border)',background:p===safePage?'var(--ub-orange-t)':'var(--ub-surface)',color:p===safePage?'var(--ub-orange-d)':'var(--ub-ink)',fontFamily:'inherit',fontSize:13,fontWeight:p===safePage?700:500,cursor:'pointer'}}>{p}</button>
            ))}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={safePage===totalPages} style={{width:30,height:30,borderRadius:8,border:'1.5px solid var(--ub-border)',background:'var(--ub-surface)',cursor:safePage===totalPages?'default':'pointer',opacity:safePage===totalPages?0.4:1,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon.chevR size={14}/></button>
          </div>
        </div>
      )}
    </div>
  );
}

function CSInboxRow({ q, isDone, resolvedTimes, onAct, setOverrides }) {
  const [noteOpen, setNoteOpen] = React.useState(false);
  const [note, setNote] = React.useState('');
  const match = (q.detail || '').match(/[A-Z]{2}\d{9,12}[A-Z]{2}/);
  const trackingCode = match ? match[0] : null;
  const detailText = match ? (q.detail || '').replace(match[0], '').trim().replace(/^[·\-\s]+|[·\-\s]+$/g, '') : (q.detail || '');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '80px 1.2fr 110px 110px 1.5fr 120px', gap: 0, alignItems: 'center', padding: '11px 20px', borderBottom: '1px solid var(--ub-border)', background: isDone ? 'transparent' : 'var(--ub-bg)' }}>
      {/* Төрөл */}
      <span style={{ fontSize: 10.5, fontWeight: 800, padding: '3px 9px', borderRadius: 999, background: q.type === 'goods' ? 'var(--ub-orange-t)' : 'rgba(59,130,246,.12)', color: q.type === 'goods' ? 'var(--ub-orange-d)' : '#1d4ed8', display: 'inline-block' }}>{q.type === 'goods' ? 'Бараа' : 'Цалин'}</span>
      {/* Жолооч */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ub-ink)' }}>{q.driver}</div>
        <div style={{ fontSize: 11, color: 'var(--ub-ink-3)' }}>{q.ts}</div>
      </div>
      {/* Утас */}
      <span style={{ fontSize: 12, color: 'var(--ub-ink)', fontFamily: 'monospace' }}>{q.driverPhone || '—'}</span>
      {/* Хугацаа */}
      <span>{resolvedTimes[q.id] ? (() => {
        const receivedMs = q.receivedAt ? new Date(q.receivedAt).getTime() : 0;
        const resolvedMs = new Date(resolvedTimes[q.id]).getTime();
        const diffMin = receivedMs ? Math.floor((resolvedMs - receivedMs) / 60000) : 0;
        const diffH = Math.floor(diffMin / 60);
        const label = diffH > 0 ? `${diffH}ц ${diffMin % 60}мин` : `${diffMin} мин`;
        return <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ub-ink-3)', display: 'flex', alignItems: 'center', gap: 4 }}>⏱ {label}</span>;
      })() : (!isDone && <ElapsedBadge receivedAt={q.receivedAt} />)}</span>
      {/* Агуулга */}
      <div style={{ minWidth: 0 }}>
        {detailText && <div style={{ fontSize: 12.5, color: 'var(--ub-ink-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{detailText}</div>}
        {trackingCode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, background: 'var(--ub-chip)', padding: '2px 8px', borderRadius: 6 }}>{trackingCode}</span>
          </div>
        )}
      </div>
      {/* Төлөв + Үйлдэл нэгтгэсэн */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {isDone && <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'rgba(22,163,74,.1)', color: 'var(--ub-green)', display: 'inline-block', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>✓ DONE</span>}
        {!isDone && q.type === 'goods' && (
          <button onClick={() => onAct(q.id, 'done')} style={{ padding: '5px 10px', borderRadius: 7, border: 'none', background: 'var(--ub-orange)', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', alignSelf: 'flex-start' }}>Системд шивэх</button>
        )}
        {!isDone && q.type === 'salary' && (
          <>
            {noteOpen && <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Хариу бичнэ үү..." rows={2} style={{ width: '100%', boxSizing: 'border-box', padding: '6px 8px', borderRadius: 7, border: '1.5px solid var(--ub-border)', fontFamily: 'inherit', fontSize: 11, background: 'var(--ub-bg)', color: 'var(--ub-ink)', outline: 'none', resize: 'none', marginBottom: 4 }} />}
            <button onClick={() => { if (!noteOpen) { setNoteOpen(true); } else { onAct(q.id, 'done', note || 'Таны цалингийн хүсэлт шийдвэрлэгдлээ'); setNoteOpen(false); } }} style={{ padding: '5px 10px', borderRadius: 7, border: 'none', background: noteOpen ? 'var(--ub-green)' : '#1d4ed8', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', alignSelf: 'flex-start' }}>{noteOpen ? '✓ Илгээх' : 'Шийдвэрлэх'}</button>
          </>
        )}
        {isDone && <span style={{ fontSize: 11, color: 'var(--ub-green)', fontWeight: 600 }}>✓ Шийдвэрлэсэн</span>}
      </div>
    </div>
  );
}

function CSInbox({ driverRequests, onNotify, overrides, setOverrides }) {
  const [resolvedTimes, setResolvedTimes] = useStateCS(() => {
    try { const s = localStorage.getItem('ub_cs_resolved_times'); if (s) return JSON.parse(s); } catch {}
    return {};
  });
  React.useEffect(() => {
    try { localStorage.setItem('ub_cs_resolved_times', JSON.stringify(resolvedTimes)); } catch {}
  }, [resolvedTimes]);

  const stableRequests = React.useMemo(() =>
    (driverRequests || []).map((r, i) => ({
      status: 'new',
      id: r.id || ('DRV-' + i + '-' + (r.ts || '').replace(/\s/g, '')),
      driver: r.driver || r.driverName || 'Жолооч',
      driverPhone: r.driverPhone || '',
      detail: r.text || r.label || '—',
      ts: r.ts || new Date().toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' }),
      receivedAt: r.receivedAt || r.ts || new Date().toISOString(),
      ...r
    })),
  [driverRequests]);
  const all = [...stableRequests, ...UB.inbox];
  const onAct = (id, status, noteText) => {
    if (status === 'done') setResolvedTimes(t => ({ ...t, [id]: new Date().toISOString() }));
    if (setOverrides) setOverrides(o => ({ ...o, [id]: status }));    const q = all.find(r => r.id === id);
    if (q && onNotify) {
      if (status === 'done') {
        const isSalary = q.type === 'salary';
        onNotify({
          type: isSalary ? 'salary' : 'goods',
          title: isSalary ? 'Цалингийн хүсэлт шийдвэрлэгдлээ' : 'Бараа системд шивэгдлээ',
          detail: noteText || q.detail || q.title || '—',
          id: q.id,
          driverPhone: q.driverPhone || '',
        });
      }
    }
  };
  const getStatus = (q) => overrides[q.id] || q.status;
  const goods = all.filter(q => q.type === 'goods' && getStatus(q) !== 'deleted');
  const salary = all.filter(q => q.type === 'salary' && getStatus(q) !== 'deleted');

  const [showExportMenu, setShowExportMenu] = useStateCS(false);
  const [showDeleteMenu, setShowDeleteMenu] = useStateCS(false);

  const deleteGoods = () => {
    goods.forEach(q => { if (setOverrides) setOverrides(o => ({ ...o, [q.id]: 'deleted' })); });
    setShowDeleteMenu(false);
  };
  const deleteSalary = () => {
    salary.forEach(q => { if (setOverrides) setOverrides(o => ({ ...o, [q.id]: 'deleted' })); });
    setShowDeleteMenu(false);
  };

  const exportGoods = () => {
    if (!window.XLSX) { alert('Excel сан ачаалагдахаас хүлээнэ үү.'); return; }
    const XLSX = window.XLSX;
    const wb = XLSX.utils.book_new();
    const goodsData = goods.map(q => ({
      'Дугаар': q.id, 'Жолооч': q.driver || q.name || '—', 'Дэлгэрц': q.detail || q.title || '—', 'Ирсэн цаг': q.receivedAt || q.ts || '—', 'Шийдвэрлэсэн цаг': resolvedTimes[q.id] || '—', 'Төлөв': getStatus(q) === 'done' ? 'Шийдвэрлэсэн' : 'Хүлээгдэж буй',
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(goodsData.length ? goodsData : [{'Мэдээлэл':'Хүсэлт байхгүй'}]), 'Бараа шивүүлэх');
    XLSX.writeFile(wb, `UBCAB_Бараа_${new Date().toISOString().slice(0,10)}.xlsx`);
    setShowExportMenu(false);
  };

  const exportSalary = () => {
    if (!window.XLSX) { alert('Excel сан ачаалагдахаас хүлээнэ үү.'); return; }
    const XLSX = window.XLSX;
    const wb = XLSX.utils.book_new();
    const salaryData = salary.map(q => ({
      'Төрөл': 'Цалингийн хүсэлт',
      'Дугаар': q.id,
      'Жолооч': q.driver || q.name || '—',
      'Дэлгэрц': q.detail || q.title || '—',
      'Ирсэн цаг': q.receivedAt || q.ts || '—',
      'Шийдвэрлэсэн цаг': resolvedTimes[q.id] || '—',
      'Төлөв': getStatus(q) === 'done' ? 'Шийдвэрлэсэн' : 'Хүлээгдэж буй',
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(salaryData.length ? salaryData : [{'Мэдээлэл':'Хүсэлт байхгүй'}]), 'Цалингийн хүсэлт');
    XLSX.writeFile(wb, `UBCAB_Цалин_${new Date().toISOString().slice(0,10)}.xlsx`);
    setShowExportMenu(false);
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginBottom: 16 }}>
        {/* Delete dropdown */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => { setShowDeleteMenu(m => !m); setShowExportMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 10, border: '1.5px solid #C0392B', background: 'rgba(192,57,43,.08)', color: '#C0392B', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>
            <Icon.trash size={16} /> Устгах <Icon.chevR size={14} style={{ transform: 'rotate(90deg)' }} />
          </button>
          {showDeleteMenu && (
            <div style={{ position: 'absolute', right: 0, top: '110%', background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,.10)', zIndex: 99, minWidth: 220, overflow: 'hidden' }}>
              <button onClick={deleteGoods} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 16px', border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', color: '#C0392B', textAlign: 'left' }}>
                <Icon.box size={16} style={{ color: 'var(--ub-orange)' }} /> Бараа шивүүлэх устгах
              </button>
              <div style={{ height: 1, background: 'var(--ub-border)', margin: '0 12px' }} />
              <button onClick={deleteSalary} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 16px', border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', color: '#C0392B', textAlign: 'left' }}>
                <Icon.money size={16} style={{ color: 'var(--ub-info)' }} /> Цалингийн хүсэлт устгах
              </button>
            </div>
          )}
        </div>
        {/* Export dropdown */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowExportMenu(m => !m)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 10, border: '1.5px solid var(--ub-green)', background: 'var(--ub-green-t)', color: 'var(--ub-green)', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>
            <Icon.fileText size={16} /> Excel татах <Icon.chevR size={14} style={{ transform: 'rotate(90deg)' }} />
          </button>
          {showExportMenu && (
            <div style={{ position: 'absolute', right: 0, top: '110%', background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,.10)', zIndex: 99, minWidth: 210, overflow: 'hidden' }}>
              <button onClick={exportGoods} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 16px', border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', color: 'var(--ub-ink)', textAlign: 'left' }}>
                <Icon.box size={16} style={{ color: 'var(--ub-orange)' }} /> Бараа шивүүлэх
              </button>
              <div style={{ height: 1, background: 'var(--ub-border)', margin: '0 12px' }} />
              <button onClick={exportSalary} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 16px', border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', color: 'var(--ub-ink)', textAlign: 'left' }}>
                <Icon.money size={16} style={{ color: 'var(--ub-info)' }} /> Цалингийн хүсэлт
              </button>
            </div>
          )}
        </div>
      </div>
      <div style={{ background: 'var(--ub-surface)', borderRadius: 14, border: '1px solid var(--ub-border)', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1.2fr 110px 110px 1.5fr 120px', gap: 0, background: 'var(--ub-chip)', borderBottom: '1px solid var(--ub-border)', padding: '10px 20px', fontSize: 10.5, fontWeight: 700, color: 'var(--ub-ink)', letterSpacing: '.07em' }}>
          <span>ТӨРӨЛ</span><span>ЖОЛООЧ</span><span>УТАС</span><span>⏱ ХУГАЦАА</span><span>АГУУЛГА / YC</span><span>ТӨЛӨВ</span>
        </div>
        {/* Rows */}
        {[...goods, ...salary].filter(q => getStatus(q) !== 'deleted').length === 0
          ? <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ub-ink-3)', fontSize: 14 }}>Хүсэлт байхгүй байна</div>
          : [...goods, ...salary].filter(q => getStatus(q) !== 'deleted').map(q => {
              const status = getStatus(q);
              const isDone = status === 'done';
              return <CSInboxRow key={q.id} q={q} isDone={isDone} resolvedTimes={resolvedTimes} onAct={onAct} setOverrides={setOverrides} />;
            })
        }
      </div>
    </div>
  );
}

// ── ADDRESS / PHONE CHANGES — Хаяг болон дугаар солих ────────────
const SHIFT_OPTS = [
  { value: 'morning', label: 'Өглөөний ээлж', time: '08:00 – 16:00' },
  { value: 'evening', label: 'Оройн ээлж',    time: '16:00 – 00:00' },
];
const CHANGE_OPERATORS = [
  { id: 'OP-01', name: 'А. Эрдэнэбаяр',   shift: 'morning' },
  { id: 'OP-02', name: 'М. Гончигдорж',   shift: 'morning' },
  { id: 'OP-03', name: 'М. Ренчиндорж',   shift: 'morning' },
  { id: 'OP-04', name: 'Б. Хуланцагаан',  shift: 'morning' },
  { id: 'OP-05', name: 'Б. Дашхүү',       shift: 'evening' },
  { id: 'OP-06', name: 'Б. Мэндбаяр',     shift: 'evening' },
  { id: 'OP-07', name: 'О. Анар',          shift: 'evening' },
  { id: 'OP-08', name: 'Г. Эрхэс',        shift: 'evening' },
  { id: 'OP-09', name: 'Б. Баянбат',      shift: 'morning' },
  { id: 'OP-10', name: 'Ш. Жавхаа',       shift: 'morning' },
];
const CHANGE_TYPES = [
  { value: 'address', label: 'Хаяг солих' },
  { value: 'phone',   label: 'Дугаар солих' },
];
const CH_TABS = [
  { key: 'new',     label: 'Шинэ хүсэлт',          color: 'var(--ub-orange)',   bg: 'var(--ub-orange-t)', icon: <Icon.plus size={18} /> },
  { key: 'pending', label: 'Хүлээгдэж буй хүсэлт', color: 'var(--ub-info)',     bg: 'var(--ub-info-t)',   icon: <Icon.clock size={18} /> },
  { key: 'done',    label: 'Шийдвэрлэсэн хүсэлт',  color: 'var(--ub-green)',    bg: 'var(--ub-green-t)',  icon: <Icon.check size={18} /> },
];

function ChangeRequestCard({ r, onAction }) {
  const typeLabel = r.type === 'phone' ? 'Дугаар' : 'Хаяг';
  const typeBg = r.type === 'phone' ? 'var(--ub-info-t)' : 'var(--ub-orange-t)';
  const typeColor = r.type === 'phone' ? 'var(--ub-info)' : 'var(--ub-orange-d)';
  return (
    <div style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 14, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <Badge color={typeColor} bg={typeBg}>{typeLabel}</Badge>
        <Badge color={r.shiftVal === 'morning' ? 'var(--ub-orange-d)' : 'var(--ub-info)'} bg="var(--ub-chip)">{r.shift}</Badge>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--ub-ink-3)' }}>{r.ts}</span>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: typeBg, color: typeColor }}>
          {r.type === 'phone' ? <Icon.phone size={18} /> : <Icon.pin size={18} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 3 }}>{r.worker}</div>
          <div style={{ fontSize: 13.5, color: 'var(--ub-ink-2)', lineHeight: 1.55 }}>{r.note}</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        {r.status === 'pending' && (
          <Btn kind="primary" size="sm" icon={<Icon.check size={15} />} onClick={() => onAction(r.id, 'done')}>Шийдвэрлэсэн</Btn>
        )}
        {r.status === 'done' && (
          <span style={{ fontSize: 13, color: 'var(--ub-green)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon.check size={16} /> Шийдвэрлэсэн</span>
        )}
      </div>
    </div>
  );
}

function CSChanges({ onNav }) {
  const [tab, setTab] = useStateCS('new');
  const [items, setItems] = useStateCS(() => {
    try { const s = localStorage.getItem('ub-ch-items'); if (s) return JSON.parse(s); } catch(e) {}
    return [];
  });
  React.useEffect(() => { try { localStorage.setItem('ub-ch-items', JSON.stringify(items)); } catch(e) {} }, [items]);
  const [showForm, setShowForm] = useStateCS(false);
  // Form
  const [chType, setChType] = useStateCS('address');
  const [shift, setShift] = useStateCS('morning');
  const [opId, setOpId] = useStateCS('');
  const [note, setNote] = useStateCS('');

  const filtered = CHANGE_OPERATORS;
  const canSend = opId !== '' && note.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    const op = CHANGE_OPERATORS.find(o => o.id === opId);
    const shiftLabel = SHIFT_OPTS.find(s => s.value === shift).label;
    const ts = new Date().toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' });
    const newItem = {
      id: 'CH-' + String(Date.now()).slice(-5),
      type: chType, shift: shiftLabel, shiftVal: shift,
      worker: op.name,
      note: note.trim(), ts, status: 'pending',
    };
    setItems(prev => [newItem, ...prev]);
    setNote(''); setOpId(''); setShowForm(false); setTab('pending');
    setTimeout(() => { if (window.ubcabSync?.push) window.ubcabSync.push(); }, 300);
  };

  const onAction = (id, newStatus) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, status: newStatus } : it));
    setTab(newStatus);
    setTimeout(() => { if (window.ubcabSync?.push) window.ubcabSync.push(); }, 300);
  };

  const counts = { new: 0, pending: 0, done: 0 };
  items.forEach(it => { if (counts[it.status] != null) counts[it.status]++; });
  const visibleItems = items.filter(it => it.status === tab);

  const selectStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface)',
    color: 'var(--ub-ink)', fontFamily: 'inherit', fontSize: 14.5, cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23938B7E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 36,
  };
  const labelStyle = { fontSize: 12.5, fontWeight: 700, color: 'var(--ub-ink-3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 };

  return (
    <div style={{ padding: 32 }}>
      {/* ── 3 Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {CH_TABS.map(t => {
          const active = tab === t.key;
          return (
            <div key={t.key} onClick={() => setTab(t.key)} style={{
              background: active ? t.bg : 'var(--ub-surface)', border: active ? `2px solid ${t.color}` : '1px solid var(--ub-border)',
              borderRadius: 14, padding: '18px 20px', cursor: 'pointer',
              transition: 'all .15s var(--ub-ease)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: active ? t.color : 'var(--ub-ink-2)' }}>{t.label}</span>
                <span style={{ color: active ? t.color : 'var(--ub-ink-3)' }}>{t.icon}</span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: active ? t.color : 'var(--ub-ink)', letterSpacing: '-.02em', lineHeight: 1 }} className="numeric">{counts[t.key]}</div>
            </div>
          );
        })}
      </div>

      {/* ── New request button / form ── */}
      {!showForm ? (
        <div onClick={() => setShowForm(true)} style={{
          cursor: 'pointer', border: '2px dashed var(--ub-border)', borderRadius: 14,
          padding: '18px 22px', textAlign: 'center', background: 'var(--ub-surface-2)', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          transition: 'border-color .15s',
        }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--ub-orange-t)', color: 'var(--ub-orange-d)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.plus size={20} /></span>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ub-ink-2)' }}>Шинэ хүсэлт үүсгэх</span>
        </div>
      ) : (
        <div style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ color: 'var(--ub-orange)' }}><Icon.swap size={19} /></span> Шинэ хүсэлт
            </div>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ub-ink-3)', padding: 4 }}><Icon.xmark size={20} /></button>
          </div>

          {/* Row 1: type + shift + operator */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.2fr', gap: 14, marginBottom: 14 }}>
            <div>
              <div style={labelStyle}>Төрөл</div>
              <select value={chType} onChange={e => setChType(e.target.value)} style={selectStyle}>
                {CHANGE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div style={{ display: 'none' }}>
              <div style={labelStyle}>Ээлж</div>
              <select value={shift} onChange={e => { setShift(e.target.value); setOpId(''); }} style={selectStyle}>
                {SHIFT_OPTS.map(s => <option key={s.value} value={s.value}>{s.label} · {s.time}</option>)}
              </select>
            </div>
            <div>
              <div style={labelStyle}>Ажилтан</div>
              <select value={opId} onChange={e => setOpId(e.target.value)} style={{ ...selectStyle, color: opId ? 'var(--ub-ink)' : 'var(--ub-ink-3)' }}>
                <option value="">Сонгох…</option>
                {filtered.map(op => <option key={op.id} value={op.id}>{op.name}</option>)}
              </select>
            </div>
          </div>

          {/* Row 2: note */}
          <div style={{ marginBottom: 16 }}>
            <div style={labelStyle}>Тэмдэглэл</div>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              placeholder={chType === 'phone' ? 'Жишээ: R-2210 · С. Алтанцэцэг — хуучин: 8800 1122, шинэ: 9911 4567' : 'Жишээ: R-2210 · С. Алтанцэцэг — Зайсан 3-р байр → Гранд хотхон 5-р байр'}
              style={{ width: '100%', minHeight: 78, boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit', fontSize: 14, lineHeight: 1.6, padding: '12px 14px', borderRadius: 12, border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface-2)', color: 'var(--ub-ink)', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Btn kind="ghost" size="sm" onClick={() => setShowForm(false)}>Болих</Btn>
            <Btn kind="primary" size="sm" icon={<Icon.send size={15} />} onClick={handleSend}
              style={{ opacity: canSend ? 1 : 0.4, pointerEvents: canSend ? 'auto' : 'none' }}>Хүсэлт илгээх</Btn>
          </div>
        </div>
      )}

      {/* ── Request list ── */}
      {visibleItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--ub-ink-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, opacity: .3 }}>
            {CH_TABS.find(t => t.key === tab)?.icon || <Icon.swap size={34} />}
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 600 }}>
            {tab === 'new' ? 'Шинэ хүсэлт алга' : tab === 'pending' ? 'Хүлээгдэж буй хүсэлт алга' : 'Шийдвэрлэсэн хүсэлт алга'}
          </div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            {tab === 'new' ? '"Шинэ хүсэлт үүсгэх" дарж эхэлнэ үү' : tab === 'pending' ? 'Шинэ хүсэлтийг хүлээгдэж буй руу шилжүүлнэ' : 'Шийдвэрлэсэн хүсэлтүүд энд харагдана'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visibleItems.map(r => <ChangeRequestCard key={r.id} r={r} onAction={onAction} />)}
        </div>
      )}
    </div>
  );
}

// ── REGISTRATIONS (CS view — read-only) ─────────────────────────
const CS_REG_PAGE = 15;
function CSRegs({ regs }) {
  const [page, setPage] = useStateCS(1);
  const [filter, setFilter] = useStateCS('all');
  const BADGE = {
    pending: { label: 'Хүлээгдэж буй', color: 'var(--ub-orange)', bg: 'var(--ub-orange-t)' },
    approved: { label: 'Зөвшөөрсөн', color: 'var(--ub-green)', bg: 'var(--ub-green-t)' },
    rejected: { label: 'Татгалзсан', color: '#C0392B', bg: 'rgba(200,60,40,.12)' },
  };
  const filtered = React.useMemo(() => filter === 'all' ? regs : regs.filter(r => r.status === filter), [regs, filter]);
  const totalPages = Math.ceil(filtered.length / CS_REG_PAGE);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const pageItems = filtered.slice((safePage-1)*CS_REG_PAGE, safePage*CS_REG_PAGE);
  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 14, color: 'var(--ub-ink-2)', flex: 1 }}>Нийт <strong>{filtered.length}</strong> бүртгэл · Зөвхөн харах эрхтэй</span>
        <div style={{ display: 'flex', gap: 4, padding: 3, borderRadius: 999, background: 'var(--ub-chip)' }}>
          {[['all','Бүгд'],['pending','Хүлээгдэж'],['approved','Зөвшөөрсөн'],['rejected','Татгалзсан']].map(([k,lbl])=>{
            const on = filter===k;
            return <button key={k} onClick={()=>{setFilter(k);setPage(1);}} style={{padding:'7px 12px',borderRadius:999,border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:12.5,fontWeight:700,background:on?'var(--ub-surface)':'transparent',color:on?'var(--ub-orange-d)':'var(--ub-ink-3)',boxShadow:on?'0 1px 3px rgba(0,0,0,.08)':'none',whiteSpace:'nowrap'}}>{lbl}</button>;
          })}
        </div>
      </div>
      <div style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.1fr 1.4fr 1fr 0.8fr 0.8fr', gap: 14, padding: '14px 22px', background: 'var(--ub-surface-2)', fontSize: 12.5, fontWeight: 700, color: 'var(--ub-ink-3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
          <span>Жолооч</span><span>Утас</span><span>Тээвэр</span><span>Дүүрэг</span><span>Арга</span><span>Төлөв</span>
        </div>
        {pageItems.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--ub-ink-3)', fontSize: 14 }}>Бүртгэл олдсонгүй</div>
        ) : pageItems.map((r, i) => {
          const b = BADGE[r.status] || BADGE.pending;
          return (
            <div key={r.id || i} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.1fr 1.4fr 1fr 0.8fr 0.8fr', gap: 14, padding: '14px 22px', borderTop: '1px solid var(--ub-border)', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <Avatar name={r.name} size={32} />
                <div><div style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11.5, color: 'var(--ub-ink-3)' }}>{r.id}</div></div>
              </div>
              <span style={{ fontSize: 13.5, color: 'var(--ub-ink-2)' }}>{r.phone}</span>
              <span style={{ fontSize: 13, color: 'var(--ub-ink-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.vehicle}</span>
              <span style={{ fontSize: 13.5, color: 'var(--ub-ink-2)' }}>{r.district}</span>
              <Badge color={r.method==='gmail'?'#4285F4':'var(--ub-ink-3)'} bg="var(--ub-chip)">{r.method==='gmail'?'✉ Gmail':'📱 Утас'}</Badge>
              <Badge color={b.color} bg={b.bg} dot>{b.label}</Badge>
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <span style={{ fontSize: 13, color: 'var(--ub-ink-3)', fontWeight: 600 }}>{(safePage-1)*CS_REG_PAGE+1}–{Math.min(safePage*CS_REG_PAGE,filtered.length)} / {filtered.length}</span>
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

// ── CS STAFF MANAGEMENT ─────────────────────────────────────────
function AdminStaff({ staff, onAdd, csStaff, onApproveCsStaff, onRejectCsStaff }) {
  const pending = (csStaff || []).filter(s => s.status === 'pending');
  const approved = (csStaff || []).filter(s => s.status === 'approved');
  return (
    <div style={{ padding: 32 }}>
      {pending.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 14, color: 'var(--ub-orange-d)' }}>⏳ Хүлээгдэж буй бүртгэл ({pending.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pending.map(s => (
              <div key={s.id} style={{ background: 'var(--ub-surface)', border: '1.5px solid var(--ub-orange)', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <Avatar name={s.name} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--ub-ink-3)' }}>{s.phone} · {s.ts}</div>
                </div>
                <button onClick={() => onApproveCsStaff && onApproveCsStaff(s.id)} style={{ padding: '8px 18px', borderRadius: 999, border: 'none', background: 'var(--ub-green)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>✓ Зөвшөөрөх</button>
                <button onClick={() => onRejectCsStaff && onRejectCsStaff(s.id)} style={{ padding: '8px 18px', borderRadius: 999, border: '1.5px solid #C0392B', background: 'transparent', color: '#C0392B', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>✕ Татгалзах</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>✅ Зөвшөөрөгдсөн ажилтнууд ({approved.length})</div>
      {approved.length === 0 ? <div style={{ color: 'var(--ub-ink-3)', fontSize: 14 }}>Одоогоор ажилтан байхгүй</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {approved.map(s => (
            <div key={s.id} style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={s.name} size={32} />
              <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div><div style={{ fontSize: 12, color: 'var(--ub-ink-3)' }}>{s.phone}</div></div>
              <Badge color="var(--ub-green)" bg="var(--ub-green-t)" dot>Идэвхтэй</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── FLEET ───────────────────────────────────────────────────────
const CS_PAGE = 20;
function CSFleet() {
  const [search, setSearch] = useStateCS('');
  const [page, setPage] = useStateCS(1);
  const filtered = React.useMemo(() => {
    if (!search.trim()) return UB.fleet;
    const q = search.trim().toLowerCase();
    return UB.fleet.filter(f => f.name.toLowerCase().includes(q) || f.phone.includes(q) || f.zone.toLowerCase().includes(q));
  }, [search]);
  const totalPages = Math.ceil(filtered.length / CS_PAGE);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const pageItems = filtered.slice((safePage - 1) * CS_PAGE, safePage * CS_PAGE);
  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: 'var(--ub-ink-2)', flex: 1 }}>Нийт <strong>{filtered.length}</strong> жолооч</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0 14px', borderRadius: 12, border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface)', height: 40 }}>
          <Icon.search size={16} style={{ color: 'var(--ub-ink-3)' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Нэр, утас, дүүрэг…"
            style={{ border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 14, color: 'var(--ub-ink)', outline: 'none', width: 200 }} />
        </div>
      </div>
      <div style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr 1fr 1fr 1fr', gap: 14, padding: '14px 22px', background: 'var(--ub-surface-2)', fontSize: 12.5, fontWeight: 700, color: 'var(--ub-ink-3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
          <span>Жолооч</span><span>Бүсчлэл</span><span>Идэвхтэй</span><span>Дууссан</span><span>Төлөв</span>
        </div>
        {pageItems.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--ub-ink-3)', fontSize: 14 }}>Жолооч олдсонгүй</div>
        ) : pageItems.map((f, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr 1fr 1fr 1fr', gap: 14, padding: '14px 22px', borderTop: '1px solid var(--ub-border)', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}><Avatar name={f.name} size={32} /><span style={{ fontSize: 14, fontWeight: 600 }}>{f.name}</span></div>
            <span style={{ fontSize: 13.5, color: 'var(--ub-ink-2)' }}>{f.zone}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ub-orange)' }} className="numeric">{f.active}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ub-green)' }} className="numeric">{f.done}</span>
            <Badge color={f.status === 'online' ? 'var(--ub-green)' : 'var(--ub-ink-3)'} bg="var(--ub-chip)" dot>{f.status === 'online' ? 'Онлайн' : 'Завсарлага'}</Badge>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <span style={{ fontSize: 13, color: 'var(--ub-ink-3)', fontWeight: 600 }}>{(safePage-1)*CS_PAGE+1}–{Math.min(safePage*CS_PAGE, filtered.length)} / {filtered.length}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={safePage===1} style={{ width:34,height:34,borderRadius:9,border:'1.5px solid var(--ub-border)',background:'var(--ub-surface)',cursor:safePage===1?'default':'pointer',opacity:safePage===1?0.4:1,display:'flex',alignItems:'center',justifyContent:'center' }}><Icon.chevL size={16}/></button>
            {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-safePage)<=1).reduce((acc,p,idx,arr)=>{ if(idx>0&&p-arr[idx-1]>1)acc.push('…'); acc.push(p); return acc; },[]).map((p,i)=> p==='…'?(
              <span key={'e'+i} style={{width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'var(--ub-ink-3)'}}>…</span>
            ):(
              <button key={p} onClick={()=>setPage(p)} style={{width:34,height:34,borderRadius:9,border:p===safePage?'2px solid var(--ub-orange)':'1.5px solid var(--ub-border)',background:p===safePage?'var(--ub-orange-t)':'var(--ub-surface)',color:p===safePage?'var(--ub-orange-d)':'var(--ub-ink)',fontFamily:'inherit',fontSize:13.5,fontWeight:p===safePage?700:500,cursor:'pointer'}}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={safePage===totalPages} style={{ width:34,height:34,borderRadius:9,border:'1.5px solid var(--ub-border)',background:'var(--ub-surface)',cursor:safePage===totalPages?'default':'pointer',opacity:safePage===totalPages?0.4:1,display:'flex',alignItems:'center',justifyContent:'center' }}><Icon.chevR size={16}/></button>
          </div>
        </div>
      )}
    </div>
  );
}

const CS_META = {
  dash: ['Хяналтын самбар', '6-р сар 9, Мягмар · өдрийн тойм'],
  returns: ['Буцаалт байршуулах', 'Өдрийн Excel файлыг оруулж хаягуудыг хуваарилах'],
  inbox: ['Жолоочийн хүсэлт', 'Бараа шивүүлэх ба цалингийн хүсэлтийг шийдвэрлэх'],
  changes: ['Хаяг/дугаар солих', 'Шинэ хүсэлт → хүлээгдэж буй → шийдвэрлэсэн'],
  drivers_chat: ['Жолоочитой чат', 'Жолоочидтай цахим сообщений илгээх, хүлээн авах'],
  regs: ['Бүртгэлийн хүсэлт', 'Жолоочийн бүртгэлийг зөвшөөрөх, татгалзах'],
  drivers: ['Жолоочид', 'Бүртгэлтэй жолоочийн жагсаалт'],
  staff: ['CS Ажилтан', 'Ажилтан нэмэх, удирдах'],
  earnings: ['Орлогын тайлан', 'Жолочийн орлого, комиссион, цэвэр ялаа'],
  logs: ['Системийн логс', 'Нэвтрэх, өөрчлөлт, ажилтан нэмэх үйл ажиллагаа'],
  settings: ['Тохиргоо', 'Үнэ, комиссион, API түлхүүр тохиргоо'],
};

function CSApp({ onLogout, returnResults, driverRequests, onShipmentUpload, regs, onApprove, onReject, onNotify, csInboxOverrides, setCsInboxOverrides, isAdmin, staff: staffProp, onAddStaff, shipmentTasks: shipmentTasksProp, onDeleteUploadTasks, csProfile, csStaff, onApproveCsStaff, onRejectCsStaff }) {
  const [nav, setNav] = useStateCS('dash');
  const shipmentTasks = shipmentTasksProp || [];
  const localStaff = staffProp || UB.staff;
  const [staffState, setStaffState] = useStateCS(localStaff);
  const staff = staffProp ? staffProp : staffState;
  const addStaffFn = onAddStaff || (({ name, phone, role }) => {
    const newId = role === 'Админ' ? 'ADM-' + String(staffState.length+1).padStart(2,'0') : 'CS-' + String(staffState.length+7).padStart(2,'0');
    setStaffState(s => [...s, { id: newId, name, phone, role, status: 'active' }]);
  });
  const [adminUnlocked, setAdminUnlocked] = useStateCS(isAdmin || false);
  const [showAdminModal, setShowAdminModal] = useStateCS(false);
  const [adminPw, setAdminPw] = useStateCS('');
  const [adminPwErr, setAdminPwErr] = useStateCS('');
  const [pendingNav, setPendingNav] = useStateCS(null);

  const ADMIN_KEYS = ['regs','drivers','staff','earnings','logs','settings'];

  const handleNav = (k) => {
    if (k === 'dash') {
      setNav('dash');
      // Dashboard дотоод мэдээллийг Supabase-аас шинэчлэх
      if (window.ubcabSync?.pull) window.ubcabSync.pull();
      return;
    }
    if (ADMIN_KEYS.includes(k) && !adminUnlocked && !isAdmin) {
      setPendingNav(k); setShowAdminModal(true); setAdminPw(''); setAdminPwErr('');
    } else { setNav(k); }
  };

  const handleAdminUnlock = () => {
    if (adminPw === 'admin1234') {
      setAdminUnlocked(true); setShowAdminModal(false);
      if (pendingNav) { setNav(pendingNav); setPendingNav(null); }
    } else { setAdminPwErr('Нууц үг буруу'); }
  };
  const meta = CS_META[nav] || CS_META['dash'];
  const resultsCount = (returnResults || []).length;
  const resolvedDriverReqs = (driverRequests || []).filter((r, i) => {
    const id = r.id || ('DRV-' + i + '-' + (r.ts || '').replace(/\s/g, ''));
    return (csInboxOverrides || {})[id] === 'done';
  }).length;
  const inboxNewCount = (driverRequests || []).length - resolvedDriverReqs;
  const pendingSalaryCount = (driverRequests || []).filter((r, i) => {
    const id = r.id || ('DRV-' + i + '-' + (r.ts || '').replace(/\s/g, ''));
    return r.type === 'salary' && (csInboxOverrides || {})[id] !== 'done';
  }).length;
  const pendingChangesCount = (() => {
    try { const s = localStorage.getItem('ub-ch-items'); const items = s ? JSON.parse(s) : []; return items.filter(i => i.status === 'pending').length; } catch { return 0; }
  })();
  const pendingRegsCount = (regs || []).filter(r => r.status === 'pending').length;

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--ub-bg)', color: 'var(--ub-ink)', fontFamily: 'var(--ub-font)' }}>
      <CSSidebar nav={nav} onNav={handleNav} onLogout={onLogout} returnResultsCount={resultsCount} inboxNewCount={inboxNewCount} pendingRegsCount={pendingRegsCount} isAdmin={isAdmin} adminUnlocked={adminUnlocked} csProfile={csProfile} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <CSTopBar title={meta[0]} sub={meta[1]} returnResults={returnResults} shipmentTasks={shipmentTasks} nav={nav} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {nav === 'dash' && <CSDash returnResults={returnResults} onNav={handleNav} shipmentTasks={shipmentTasks} driverRequests={driverRequests} inboxNewCount={inboxNewCount} pendingChangesCount={pendingChangesCount} isAdmin={isAdmin} onRefresh={() => { if (window.ubcabSync?.pull) window.ubcabSync.pull(); }} onClearAll={() => { if (window.ubcabSync?.clearAll) window.ubcabSync.clearAll(); else { try { ['ub_return_results','ub_shipment_tasks','ub_driver_requests','ub_driver_notifs','ub_cs_inbox_overrides'].forEach(k => localStorage.removeItem(k)); } catch {} window.dispatchEvent(new Event('ub-sync-done')); } }} />}
          {nav === 'returns' && <CSReturns onShipmentUpload={onShipmentUpload} onDeleteUploadTasks={onDeleteUploadTasks} />}
          {nav === 'inbox' && <CSInbox driverRequests={driverRequests} onNotify={onNotify} overrides={csInboxOverrides || {}} setOverrides={setCsInboxOverrides} />}
          {nav === 'changes' && <CSChanges onNav={handleNav} />}
          {nav === 'regs' && <AdminRegs regs={regs || []} onApprove={onApprove} onReject={onReject} />}
          {nav === 'drivers' && <AdminDrivers regs={regs || []} />}
          {nav === 'staff' && <AdminStaff staff={staff} onAdd={addStaffFn} csStaff={csStaff || []} onApproveCsStaff={onApproveCsStaff} onRejectCsStaff={onRejectCsStaff} />}
          {nav === 'drivers_chat' && <CSDriverChat />}
          {nav === 'earnings' && <AdminEarnings />}
          {nav === 'logs' && <AdminLogs />}
          {nav === 'settings' && <AdminSettings />}
        </div>
      </div>
      {showAdminModal && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.45)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center' }} onClick={()=>setShowAdminModal(false)}>
          <div style={{ background:'var(--ub-surface)',borderRadius:18,padding:32,width:340,boxShadow:'0 16px 48px rgba(0,0,0,.18)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:20 }}>
              <span style={{ color:'var(--ub-orange)',background:'var(--ub-orange-t)',borderRadius:12,padding:10,display:'flex' }}><Icon.lock size={22}/></span>
              <div><div style={{ fontSize:17,fontWeight:700 }}>Админ нэвтрэлт</div><div style={{ fontSize:13,color:'var(--ub-ink-3)' }}>Нууц үгеэ батална уу</div></div>
            </div>
            <input type="password" value={adminPw} onChange={e=>{setAdminPw(e.target.value);setAdminPwErr('');}} onKeyDown={e=>e.key==='Enter'&&handleAdminUnlock()}
              placeholder="Нууц үг" autoFocus
              style={{ width:'100%',boxSizing:'border-box',padding:'12px 14px',borderRadius:10,border:adminPwErr?'2px solid var(--ub-red)':'1.5px solid var(--ub-border)',fontFamily:'inherit',fontSize:15,outline:'none',marginBottom:8,background:'var(--ub-surface)' }}/>
            {adminPwErr && <div style={{ fontSize:13,color:'var(--ub-red)',marginBottom:8 }}>{adminPwErr}</div>}
            <div style={{ display:'flex',gap:10,marginTop:4 }}>
              <button onClick={()=>setShowAdminModal(false)} style={{ flex:1,padding:'11px',borderRadius:10,border:'1.5px solid var(--ub-border)',background:'transparent',fontFamily:'inherit',fontSize:14,fontWeight:600,cursor:'pointer',color:'var(--ub-ink-2)' }}>Цуцлах</button>
              <button onClick={handleAdminUnlock} style={{ flex:1,padding:'11px',borderRadius:10,border:'none',background:'var(--ub-orange)',color:'#fff',fontFamily:'inherit',fontSize:14,fontWeight:700,cursor:'pointer' }}>Нэвтрэх</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.CSApp = CSApp;
