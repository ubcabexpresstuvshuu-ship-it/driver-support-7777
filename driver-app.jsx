// driver-app.jsx — UBCAB Express driver mobile app (inside IOSDevice)
const { useState } = React;

// ── Map placeholder ────────────────────────────────────────────
function DrvMap({ height = 200 }) {
  return (
    <div style={{ position: 'relative', height, borderRadius: 16, overflow: 'hidden', background: 'var(--ub-map)' }}>
      <svg width="100%" height="100%" viewBox="0 0 380 220" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
        <rect width="380" height="220" fill="var(--ub-map)" />
        {[40, 95, 150, 205].map((y, i) => <line key={'h' + i} x1="0" y1={y} x2="380" y2={y} stroke="var(--ub-map-line)" strokeWidth="1.5" />)}
        {[60, 140, 220, 300].map((x, i) => <line key={'v' + i} x1={x} y1="0" x2={x} y2="220" stroke="var(--ub-map-line)" strokeWidth="1.5" />)}
        <path d="M0 95 L140 95 L140 220" fill="none" stroke="var(--ub-map-road)" strokeWidth="9" strokeLinecap="round" />
        <path d="M60 0 L60 140 L380 140" fill="none" stroke="var(--ub-map-road)" strokeWidth="9" strokeLinecap="round" />
        <path d="M140 95 C 200 70, 250 120, 300 95" fill="none" stroke="var(--ub-orange)" strokeWidth="3.5" strokeDasharray="2 7" strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', left: '76%', top: '36%', transform: 'translate(-50%,-100%)', color: 'var(--ub-orange)' }}>
        <Icon.pin size={34} />
      </div>
      <div style={{ position: 'absolute', left: '36%', top: '62%', transform: 'translate(-50%,-50%)' }}>
        <div style={{ width: 16, height: 16, borderRadius: 999, background: 'var(--ub-info)', border: '3px solid #fff', boxShadow: '0 0 0 6px color-mix(in srgb, var(--ub-info) 22%, transparent)' }} />
      </div>
    </div>
  );
}

// ── Elapsed-hour color logic ────────────────────────────────────
function getElapsedColor(createdDate) {
  if (!createdDate) return null;
  const h = Math.max(0, (Date.now() - new Date(createdDate).getTime()) / 3600000);
  if (h <= 12) return { hours: h, bg: 'rgba(28,138,91,.12)',  color: '#1C8A5B', label: Math.round(h) + 'ц', badge: 'Хэвийн' };
  if (h <= 24) return { hours: h, bg: 'rgba(217,166,0,.14)',  color: '#B8860B', label: Math.round(h) + 'ц', badge: 'Анхаарах' };
  if (h <= 36) return { hours: h, bg: 'rgba(200,60,40,.12)',  color: '#C0392B', label: Math.round(h) + 'ц', badge: 'Хэтэрсэн' };
  if (h <= 48) return { hours: h, bg: 'rgba(180,30,20,.18)',  color: '#A01010', label: Math.round(h) + 'ц', badge: 'Яаралтай' };
  return             { hours: h, bg: 'rgba(140,10,10,.22)',   color: '#7A0A0A', label: Math.round(h) + 'ц', badge: 'Маш хэтэрсэн' };
}
window.getElapsedColor = getElapsedColor;

function fmtCreatedTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const mon = d.getMonth() + 1, day = d.getDate();
  const h = d.getHours(), m = d.getMinutes();
  return mon + '/' + String(day).padStart(2, '0') + ' ' + String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}

// ── Task card ──────────────────────────────────────────────────
function DrvTaskCard({ t, onOpen }) {
  const s = UB_STATUS[t.status] || UB_STATUS['pending'];
  const el = getElapsedColor(t.created);
  return (
    <button onClick={onOpen} className="ub-card" style={{
      display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
      background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16,
      padding: 16, font: 'inherit', color: 'inherit'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ub-ink-3)', letterSpacing: '.02em', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon.clock size={13} /> {fmtCreatedTime(t.created)}</span>
          {t.changed && <Badge color="var(--ub-orange-d)" bg="var(--ub-orange-t)"><Icon.swap size={13} /> Шинэчлэгдсэн</Badge>}
        </div>
        <Badge color={s.color} bg={s.bg} dot>{s.label}</Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ color: 'var(--ub-orange)', flexShrink: 0 }}><Icon.pin size={18} /></span>
        <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--ub-orange-d)' }}>{t.khoroo}</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ub-ink)', marginBottom: 12, lineHeight: 1.4, paddingLeft: 26 }}>{t.addr}</div>
      {el &&
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingLeft: 26 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: el.bg, border: `1.5px solid ${el.color}33`, borderRadius: 10, padding: '5px 11px' }}>
            <Icon.clock size={14} />
            <span style={{ fontSize: 13.5, fontWeight: 800, color: el.color }}>{el.label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: el.color, opacity: .8 }}>{el.badge}</span>
          </div>
        </div>
      }
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--ub-border)' }}>
        <StatPill icon={<Icon.phone size={16} />}>{t.phone}</StatPill>
        <StatPill icon={<Icon.box size={16} />}>{t.items}</StatPill>
      </div>
    </button>
  );
}

// ── District sheet ─────────────────────────────────────────────
const UB_DISTRICTS = ['Багануур', 'Багахангай', 'Баянгол', 'Баянзүрх', 'Налайх', 'Сонгинохайрхан', 'Сүхбаатар', 'Хан-Уул', 'Чингэлтэй'];

// ── HOME ───────────────────────────────────────────────────────
function DrvHome({ tasks, onOpen, online, setOnline, district, onPickDistrict, driverDistrict, returnResults, onDeleteAllTasks }) {
  const [taskPage, setTaskPage] = React.useState(1);
  const [showPinModal, setShowPinModal] = React.useState(false);
  const [pin, setPin] = React.useState('');

  const filteredTasks = driverDistrict && driverDistrict !== 'Бүх дүүрэг'
    ? tasks.filter(t => !t.district || t.district === 'Улаанбаатар' || t.district === driverDistrict)
    : tasks;
  const list = district === 'Бүх дүүрэг' ? filteredTasks : filteredTasks.filter(t => t.district === district);

  return (
    <div style={{ padding: '0 16px 24px' }}>
      <div style={{ padding: '4px 2px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 13, color: 'var(--ub-ink-3)', fontWeight: 600 }}>Өнөөдөр · {new Date().getMonth()+1}-р сар {new Date().getDate()}</div>
          <button onClick={() => setOnline(!online)} style={{
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', border: 'none',
            background: online ? 'var(--ub-green-t)' : 'var(--ub-chip)', color: online ? 'var(--ub-green)' : 'var(--ub-ink-3)',
            padding: '8px 14px', borderRadius: 999, fontWeight: 700, fontSize: 13.5, fontFamily: 'inherit'
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: 'currentColor' }} />
            {online ? 'Идэвхтэй' : 'Завсарлага'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
        {(() => {
          const overdue = filteredTasks.filter(t => t.status !== 'done' && getElapsedColor(t.created)?.hours > 48).length;
          const todayStr = new Date().toLocaleDateString('sv-SE');
          const toLocalDate = iso => { try { return new Date(iso).toLocaleDateString('sv-SE'); } catch { return ''; } };
          const receivedCount = (returnResults || []).filter(r => r.status === 'received' && toLocalDate(r.receivedAt) === todayStr).length;
          const distLabel = driverDistrict && driverDistrict !== 'Бүх дүүрэг' ? driverDistrict : 'Нийт';
          return [
            [distLabel + ' буцаалт', filteredTasks.length, 'var(--ub-ink)'],
            ['Авсан буцаалт', receivedCount, 'var(--ub-orange)'],
            ['Цуцалсан буцаалт', filteredTasks.filter(t => t.status === 'done').length, 'var(--ub-green)'],
            ['Хугацаа хэтрэлт', overdue, 'var(--ub-orange)']
          ].map(([l, v, c], i) =>
            <div key={i} style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 14, padding: '12px 14px' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: c, lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 12, color: 'var(--ub-ink-3)', fontWeight: 600, marginTop: 5 }}>{l}</div>
            </div>
          );
        })()}
      </div>

      <button onClick={onPickDistrict} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 14, border: '1px solid var(--ub-border)', background: 'var(--ub-surface)', color: 'var(--ub-ink)', fontFamily: 'inherit', cursor: 'pointer', marginBottom: 18 }}>
        <span style={{ color: 'var(--ub-orange)', flexShrink: 0 }}><Icon.pin size={20} /></span>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: 11.5, color: 'var(--ub-ink-3)', fontWeight: 600 }}>Ажиллах дүүрэг</div>
          <div style={{ fontSize: 15.5, fontWeight: 700 }}>{district}</div>
        </div>
        <span style={{ color: 'var(--ub-ink-3)', transform: 'rotate(90deg)', flexShrink: 0 }}><Icon.chevR size={18} /></span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Тэмү буцаалт</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--ub-ink-3)', fontWeight: 600 }}>{list.length} хаяг</span>
          {onDeleteAllTasks && list.length > 0 &&
            <button onClick={() => { setPin(''); setShowPinModal(true); }} style={{ border: 'none', background: 'rgba(192,57,43,.1)', color: '#C0392B', borderRadius: 8, padding: '4px 10px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>Бүгдийг устгах</button>
          }
        </div>
      </div>

      {showPinModal &&
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(20,17,13,.5)' }}>
          <div style={{ background: 'var(--ub-surface)', borderRadius: 20, padding: 24, width: 300, boxShadow: '0 8px 32px rgba(0,0,0,.18)' }}>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>Баталгаажуулах</div>
            <div style={{ fontSize: 13.5, color: 'var(--ub-ink-2)', marginBottom: 16 }}>Бүх даалгаврыг устгахын тулд PIN код оруулна уу</div>
            <input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={e => setPin(e.target.value)} placeholder="····" style={{ width: '100%', fontSize: 28, letterSpacing: 12, textAlign: 'center', border: '1.5px solid var(--ub-border)', borderRadius: 12, padding: '10px 0', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box', background: 'var(--ub-bg)' }} />
            {pin.length === 4 && pin !== '0815' && <div style={{ fontSize: 13, color: '#C0392B', fontWeight: 600, marginTop: 8 }}>Буруу PIN код</div>}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={() => setShowPinModal(false)} style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: '1.5px solid var(--ub-border)', background: 'none', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Цуцлах</button>
              <button onClick={() => { if (pin === '0815') { onDeleteAllTasks(); setShowPinModal(false); setPin(''); } }} disabled={pin !== '0815'} style={{ flex: 1, padding: '11px 0', borderRadius: 12, border: 'none', background: pin === '0815' ? '#C0392B' : 'var(--ub-chip)', color: pin === '0815' ? '#fff' : 'var(--ub-ink-3)', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: pin === '0815' ? 'pointer' : 'default' }}>Устгах</button>
            </div>
          </div>
        </div>
      }

      {(() => {
        const TASK_PAGE = 20;
        const totalTaskPages = Math.ceil(list.length / TASK_PAGE);
        const safeTaskPage = Math.min(taskPage, Math.max(1, totalTaskPages));
        const pageTasks = list.slice((safeTaskPage - 1) * TASK_PAGE, safeTaskPage * TASK_PAGE);
        return (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {list.length ? pageTasks.map((t, idx) => <DrvTaskCard key={t.id + '-' + idx} t={t} onOpen={() => onOpen(t.id)} />) :
                <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--ub-ink-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Icon.box size={30} /></div>
                  <div style={{ fontSize: 14.5, fontWeight: 600 }}>{district}-д өнөөдөр даалгавар алга</div>
                </div>}
            </div>
            {totalTaskPages > 1 &&
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, padding: '0 2px' }}>
                <span style={{ fontSize: 12, color: 'var(--ub-ink-3)', fontWeight: 600 }}>{(safeTaskPage - 1) * TASK_PAGE + 1}–{Math.min(safeTaskPage * TASK_PAGE, list.length)} / {list.length}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setTaskPage(p => Math.max(1, p - 1))} disabled={safeTaskPage === 1} style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface)', cursor: safeTaskPage === 1 ? 'default' : 'pointer', opacity: safeTaskPage === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.chevL size={15} /></button>
                  <button onClick={() => setTaskPage(p => Math.min(totalTaskPages, p + 1))} disabled={safeTaskPage === totalTaskPages} style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface)', cursor: safeTaskPage === totalTaskPages ? 'default' : 'pointer', opacity: safeTaskPage === totalTaskPages ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.chevR size={15} /></button>
                </div>
              </div>
            }
          </>
        );
      })()}
    </div>
  );
}

// ── Photo proof ─────────────────────────────────────────────────
function DrvPhotoProof({ photos, onAdd, onRemove }) {
  const inputRef = React.useRef(null);
  const pick = e => {
    Array.from(e.target.files || []).forEach(f => {
      const reader = new FileReader();
      reader.onload = () => onAdd(reader.result);
      reader.readAsDataURL(f);
    });
    e.target.value = '';
  };
  return (
    <div style={{ margin: '0 16px 16px', background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>Хүлээн авсны зураг</div>
        <span style={{ fontSize: 12.5, color: 'var(--ub-ink-3)', fontWeight: 600 }}>{photos.length} зураг</span>
      </div>
      <div style={{ fontSize: 13, color: 'var(--ub-ink-2)', marginBottom: 14 }}>Буцаалтын барааг хүлээн авахад зураг хавсаргана уу.</div>
      <input ref={inputRef} type="file" accept="image/*" capture="environment" multiple onChange={pick} style={{ display: 'none' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {photos.map((src, i) =>
          <div key={i} style={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: 12, overflow: 'hidden', background: 'var(--ub-chip)' }}>
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <button onClick={() => onRemove(i)} style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: 999, border: 'none', background: 'rgba(20,17,13,.6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}><Icon.trash size={15} /></button>
          </div>
        )}
        <button onClick={() => inputRef.current && inputRef.current.click()} style={{ aspectRatio: '1 / 1', width: '100%', borderRadius: 12, border: '1.5px dashed var(--ub-border)', background: 'var(--ub-bg)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--ub-orange)' }}>
          <Icon.camera size={26} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ub-ink-2)' }}>Зураг авах</span>
        </button>
      </div>
    </div>
  );
}

// ── Task detail ─────────────────────────────────────────────────
function DrvTaskDetail({ t, onBack, onAdvance, photos, onAddPhoto, onRemovePhoto, onReturnResult, driverInfo }) {
  const s = UB_STATUS[t.status] || UB_STATUS['pending'];
  const [flow, setFlow] = useState('buttons'); // buttons | confirmReceive | cancelReason | done | cancelled
  const [cancelReason, setCancelReason] = useState('');
  const [copied, setCopied] = useState(false);
  const ubcCode = t.tracking || t.id;

  const CANCEL_REASONS = [
    'Хэрэглэгчийн утас холбогдохгүй',
    'Хэрэглэгч 48цагт багтаан утасаа аваагүй',
    'Хэрэглэгч Гэртээ байгаагүй',
  ];

  const handleCopy = () => {
    const fallback = () => { const el = document.createElement('textarea'); el.value = ubcCode; el.style.position = 'fixed'; el.style.opacity = '0'; document.body.appendChild(el); el.select(); try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(el); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const goBack = () => { setTimeout(() => { if (onAdvance) onAdvance(t.id); if (onBack) onBack(); }, 1200); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ubcCode).then(() => { setCopied(true); goBack(); }).catch(() => { fallback(); goBack(); });
    } else { fallback(); goBack(); }
  };

  const doReceive = () => {
    setFlow('done');
    if (onReturnResult) onReturnResult({ taskId: t.id, customer: t.customer || t.phone, district: t.district, items: t.items, status: 'received', ubcCode: ubcCode, driver: driverInfo?.name || UB.driver.name, photoCount: (photos || []).length });
  };

  const doCancel = (reason) => {
    setCancelReason(reason);
    setFlow('cancelled');
    if (onReturnResult) onReturnResult({ taskId: t.id, customer: t.customer || t.phone, district: t.district, items: t.items, status: 'cancelled', reason, ubcCode: ubcCode, driver: driverInfo?.name || UB.driver.name, photoCount: 0 });
  };

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ padding: '0 16px' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'none', color: 'var(--ub-ink-2)', fontFamily: 'inherit', fontWeight: 600, fontSize: 15, cursor: 'pointer', padding: '2px 0 14px' }}>
          <Icon.chevL size={20} /> Буцах
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ub-ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon.clock size={14} /> {fmtCreatedTime(t.created)}</span>
          <Badge color={s.color} bg={s.bg} dot>{s.label}</Badge>
        </div>
        <DrvMap height={190} />
      </div>

      {t.changed &&
        <div style={{ margin: '16px 16px 0', display: 'flex', gap: 10, padding: 14, borderRadius: 14, background: 'var(--ub-orange-t)', color: 'var(--ub-orange-d)' }}>
          <Icon.swap size={20} />
          <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.4 }}>CS-ээс хаягийн өөрчлөлт ирсэн. Шинэ хаягаар очно уу.</div>
        </div>
      }

      <div style={{ margin: '16px', background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, padding: 18 }}>
        {t.customer && <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{t.customer}</div>}
        {(() => { const el = getElapsedColor(t.created); return el ?
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, background: el.bg, border: `1.5px solid ${el.color}22`, marginBottom: 12 }}>
            <Icon.clock size={18} />
            <span style={{ fontSize: 14, fontWeight: 800, color: el.color }}>{el.label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: el.color, opacity: .8 }}>· {el.badge}</span>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 11.5, color: el.color, opacity: .65 }}>Хүлээн авснаас</span>
          </div> : null;
        })()}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ color: 'var(--ub-orange)' }}><Icon.pin size={20} /></span>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--ub-orange-d)' }}>{t.khoroo}</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ub-ink)', marginBottom: 14, paddingLeft: 28, lineHeight: 1.4 }}>{t.addr}</div>
        {[
          [<Icon.box size={18} />, 'Бараа', t.items],
          ...(t.amount ? [[<Icon.money size={18} />, 'Дүн', (t.amount).toLocaleString() + '₮']] : []),
          ...(t.note ? [[<Icon.alert size={18} />, 'Тэмдэглэл', t.note]] : [])
        ].map((r, i) =>
          <div key={i} style={{ display: 'flex', gap: 13, padding: '11px 0', borderTop: i ? '1px solid var(--ub-border)' : 'none' }}>
            <span style={{ color: 'var(--ub-ink-3)', marginTop: 1 }}>{r[0]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, color: 'var(--ub-ink-3)', fontWeight: 600, marginBottom: 2 }}>{r[1]}</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{r[2]}</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Buttons state ── */}
      {flow === 'buttons' && (
        <div style={{ padding: '0 16px', display: 'flex', gap: 12, marginBottom: 14 }}>
          <Btn kind="primary" icon={<Icon.check size={19} />} style={{ flex: 1 }} onClick={() => setFlow('confirmReceive')}>Авсан</Btn>
          <Btn kind="ghost" icon={<Icon.xmark size={18} />} style={{ flex: 1 }} onClick={() => setFlow('cancelReason')}>Цуцалсан</Btn>
        </div>
      )}

      {/* ── Confirm receive modal ── */}
      {flow === 'confirmReceive' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setFlow('buttons')}>
          <div style={{ background: 'var(--ub-surface)', borderRadius: '20px 20px 0 0', padding: '28px 20px 32px', width: '100%', maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--ub-border)', margin: '0 auto 20px' }}></div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, textAlign: 'center' }}>Та хэрэглэгчээс буцаалтаа авсан уу?</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn kind="ghost" style={{ flex: 1 }} onClick={() => setFlow('buttons')}>Болих</Btn>
              <Btn kind="primary" style={{ flex: 1 }} onClick={doReceive}>Тийм, авсан</Btn>
            </div>
          </div>
        </div>
      )}

      {/* ── Cancel reason sheet ── */}
      {flow === 'cancelReason' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setFlow('buttons')}>
          <div style={{ background: 'var(--ub-surface)', borderRadius: '20px 20px 0 0', padding: '24px 16px 32px', width: '100%', maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--ub-border)', margin: '0 auto 16px' }}></div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, textAlign: 'center' }}>Цуцлах шалтгаан</div>
            <div style={{ fontSize: 13, color: 'var(--ub-ink-3)', textAlign: 'center', marginBottom: 20 }}>Шалтгааныг сонгоно уу</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {CANCEL_REASONS.map((reason, i) => (
                <button key={i} onClick={() => doCancel(reason)} style={{ padding: '14px 16px', borderRadius: 14, border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface)', color: 'var(--ub-ink)', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 32, height: 32, borderRadius: 999, background: 'rgba(192,57,43,.08)', color: '#C0392B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 800 }}>{i + 1}</span>
                  {reason}
                </button>
              ))}
            </div>
            <button onClick={() => setFlow('buttons')} style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1.5px solid var(--ub-border)', background: 'none', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: 'var(--ub-ink-3)' }}>Болих</button>
          </div>
        </div>
      )}

      {/* ── Done / Cancelled UBC code ── */}
      {(flow === 'done' || flow === 'cancelled') && (
        <div>
          {flow === 'done' &&
            <div style={{ margin: '0 16px 14px', textAlign: 'center', color: 'var(--ub-green)', fontWeight: 700, padding: 12, background: 'var(--ub-green-t)', borderRadius: 14 }}>✓ Амжилттай авсан</div>
          }
          {flow === 'cancelled' && cancelReason &&
            <div style={{ margin: '0 16px 14px', padding: '12px 16px', borderRadius: 14, background: 'rgba(192,57,43,.08)', border: '1px solid rgba(192,57,43,.2)', color: '#C0392B', fontSize: 13, fontWeight: 600 }}>
              ✗ Шалтгаан: {cancelReason}
            </div>
          }
          <div style={{ margin: '0 16px 24px', background: 'var(--ub-ink)', color: 'var(--ub-bg)', borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.08em', opacity: .55 }}>UBC КОД</div>
              {flow === 'cancelled' && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ub-orange)', background: 'rgba(245,130,32,.15)', padding: '3px 10px', borderRadius: 999 }}>Цуцалсан</span>}
            </div>
            <div style={{ border: '2px solid var(--ub-orange)', borderRadius: 14, padding: '14px 18px', marginBottom: 12, background: 'rgba(245,130,32,.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: 26, letterSpacing: '.08em', fontFamily: 'monospace', color: '#fff', lineHeight: 1 }}>{ubcCode}</div>
            </div>
          </div>
          <div style={{ margin: '0 16px 24px' }}>
            <button onClick={handleCopy} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 0', borderRadius: 12, border: '2px solid var(--ub-orange)', background: copied ? 'var(--ub-orange)' : 'rgba(245,130,32,.1)', color: copied ? '#fff' : 'var(--ub-orange)', fontFamily: 'inherit', fontSize: 15, fontWeight: 800, cursor: 'pointer', transition: 'all .2s' }}>
              {copied ? <Icon.check size={18} /> : <Icon.copy size={18} />}
              {copied ? 'Хуулагдсан!' : 'Код хуулах'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NotifCard({ n, i, onDeleteNotif }) {
  const [expanded, setExpanded] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [progress, setProgress] = React.useState(100);
  const timerRef = React.useRef(null);
  const progRef = React.useRef(null);

  const openModal = (e) => { e.stopPropagation(); setModal(true); setProgress(100);
    timerRef.current = setTimeout(() => { setModal(false); if (onDeleteNotif) onDeleteNotif(i); }, 10000);
    const start = Date.now();
    progRef.current = setInterval(() => { setProgress(Math.max(0, 100 - ((Date.now() - start) / 50))); }, 50);
  };
  React.useEffect(() => () => { clearTimeout(timerRef.current); clearInterval(progRef.current); }, []);

  return (
    <>
      {modal && (
        <div onClick={() => { setModal(false); clearTimeout(timerRef.current); clearInterval(progRef.current); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--ub-surface)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 340, boxShadow: '0 12px 40px rgba(0,0,0,.3)' }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>{n.label || n.title || 'Мэдэгдэл'}</div>
            <div style={{ fontSize: 14, color: 'var(--ub-ink-2)', lineHeight: 1.6, marginBottom: 20 }}>{n.text || n.detail || '—'}</div>
            <div style={{ height: 4, borderRadius: 999, background: 'var(--ub-chip)', overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ height: '100%', borderRadius: 999, background: 'var(--ub-orange)', width: progress + '%', transition: 'width .05s linear' }} />
            </div>
            <button onClick={() => { setModal(false); clearTimeout(timerRef.current); clearInterval(progRef.current); if (onDeleteNotif) onDeleteNotif(i); }}
              style={{ width: '100%', padding: '12px 0', borderRadius: 12, border: 'none', background: 'var(--ub-chip)', color: 'var(--ub-ink)', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Хаах</button>
          </div>
        </div>
      )}
    <div style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--ub-orange)' }} />
      <button onClick={() => setExpanded(e => !e)} style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 14px 14px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--ub-orange-t)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon.bell size={16} style={{ color: 'var(--ub-orange)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ub-ink)', lineHeight: 1.4, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title || n.type || 'Мэдэгдэл'}</div>
          {n.ts && <div style={{ fontSize: 11, color: 'var(--ub-ink-3)', display: 'flex', alignItems: 'center', gap: 3 }}><Icon.clock size={9} />{n.ts}</div>}
        </div>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 999, background: 'var(--ub-orange-t)', flexShrink: 0 }}><Icon.eye size={15} style={{ color: 'var(--ub-orange)' }} /></span>
      </button>
      {expanded && (
        <div style={{ margin: '0 14px 14px 20px', padding: '12px 14px', borderRadius: 12, background: 'var(--ub-bg)', border: '1px solid var(--ub-border)' }}>
          {(n.text || n.detail || n.label) && (
            <div style={{ fontSize: 13, color: 'var(--ub-ink-2)', lineHeight: 1.5, marginBottom: onDeleteNotif ? 10 : 0 }}>{n.text || n.detail || n.label}</div>
          )}
          {onDeleteNotif && (
            <button onClick={() => onDeleteNotif(i)} style={{ fontSize: 12, fontWeight: 700, color: '#C0392B', background: 'rgba(192,57,43,.08)', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>Устгах</button>
          )}
        </div>
      )}
    </div>
    </>
  );
}


function DrvRequest({ onSubmitRequest, notifications, onDeleteNotif, myRequests, csInboxOverrides, onDeleteAllRequests }) {
  const [selectedReq, setSelectedReq] = React.useState(null);
  const [reqTab, setReqTab] = React.useState('mine');
  const [reqType, setReqType] = React.useState('goods');
  const [trackingNums, setTrackingNums] = React.useState([]);
  const [trackingInput, setTrackingInput] = React.useState('');
  const [month, setMonth] = React.useState('');
  const [day, setDay] = React.useState('');
  const [text, setText] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const submit = () => {
    if (reqType === 'goods') {
      const label = trackingNums.join(', ') || 'Бараа шивүүлэх хүсэлт';
      if (onSubmitRequest) onSubmitRequest({ type: 'goods', label, text: label });
    } else if (reqType === 'salary') {
      const mLabel = month ? `2026 оны ${month}-р сар${day ? `, ${day}-нд` : ''}` : '';
      if (onSubmitRequest) onSubmitRequest({ type: 'salary', label: mLabel, text: text || 'Цалин хүссэн хүсэлт' });
    } else {
      if (onSubmitRequest) onSubmitRequest({ type: 'general', text });
    }
    setSent(true);
    setTimeout(() => { setSent(false); setText(''); setMonth(''); setDay(''); setTrackingNums([]); setTrackingInput(''); }, 2500);
  };

  const notifs = notifications || [];

  return (
    <div style={{ padding: '0 16px 32px', minHeight: '100%' }}>
      <div style={{ padding: '16px 0' }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>Хүсэлт</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 999, background: 'var(--ub-chip)', flex: 1 }}>
          {[['mine', 'Миний хүсэлт'], ['new', 'Шинэ хүсэлт']].map(([k, l]) => {
          const on = reqTab === k;
          return <button key={k} onClick={() => setReqTab(k)} style={{ flex: 1, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, padding: '9px 4px', borderRadius: 999, transition: 'all .15s', background: on ? 'var(--ub-surface)' : 'transparent', color: on ? 'var(--ub-orange-d)' : 'var(--ub-ink-3)', boxShadow: on ? '0 1px 3px rgba(0,0,0,.08)' : 'none' }}>{l}</button>;
        })}
        </div>
        {reqTab === 'mine' && myRequests.length > 0 && (
          <button onClick={() => { if (typeof onDeleteAllRequests === 'function') onDeleteAllRequests(); }} style={{ padding: '8px 14px', borderRadius: 999, border: '1px solid #C0392B', background: 'none', color: '#C0392B', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Delete all</button>
        )}
      </div>

      {reqTab === 'mine' && (
        myRequests.length === 0
          ? <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--ub-ink-3)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 999, background: 'var(--ub-chip)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Icon.inbox size={26} style={{ color: 'var(--ub-ink-3)' }} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Хүсэлт байхгүй</div>
              <div style={{ fontSize: 12, color: 'var(--ub-ink-3)', marginTop: 4 }}>Шинэ хүсэлт илгээснийхээ дараа энд харагдана</div>
            </div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myRequests.map((r, i) => {
                const status = csInboxOverrides[r.id] || r.status || 'new';
                const isDone = status === 'done';
                const isGoods = r.type === 'goods';
                return (
                  <div key={r.id || i} onClick={() => setSelectedReq(r)} style={{ background: 'var(--ub-surface)', border: `1.5px solid ${isDone ? 'var(--ub-green)' : 'var(--ub-border)'}`, borderRadius: 16, padding: '14px 16px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 18 }}>{isGoods ? '📦' : '💰'}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, flex: 1, color: 'var(--ub-ink)' }}>{isGoods ? 'Бараа шивүүлэх' : 'Цалингийн хүсэлт'}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '3px 10px',
                        background: isDone ? 'rgba(22,163,74,.1)' : 'rgba(245,130,32,.1)',
                        color: isDone ? 'var(--ub-green)' : 'var(--ub-orange)' }}>
                        {isDone ? '✓ Шийдвэрлэсэн' : '⏳ Хүлээгдэж буй'}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--ub-ink-2)', marginBottom: 4 }}>{r.detail || r.label || r.text || '—'}</div>
                    <div style={{ fontSize: 11, color: 'var(--ub-ink-3)', fontWeight: 600 }}>{r.ts || ''}</div>
                  </div>
                );
              })}
            </div>
      )}

      {selectedReq && (() => {
        const r = selectedReq;
        const status = (csInboxOverrides || {})[r.id] || r.status || 'new';
        const isDone = status === 'done';
        const notif = [...(notifications || [])].find(n => n.id === r.id);
        return (
          <div style={{ position: 'absolute', inset: 0, zIndex: 999, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'flex-end' }} onClick={() => setSelectedReq(null)}>
            <div style={{ width: '100%', background: 'var(--ub-surface)', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--ub-border)', margin: '0 auto 20px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>{r.type === 'goods' ? '📦' : '💰'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{r.type === 'goods' ? 'Бараа шивүүлэх' : 'Цалингийн хүсэлт'}</div>
                  <div style={{ fontSize: 12, color: 'var(--ub-ink-3)' }}>{r.ts || ''}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, borderRadius: 999, padding: '4px 12px', background: isDone ? 'rgba(22,163,74,.1)' : 'rgba(245,130,32,.1)', color: isDone ? 'var(--ub-green)' : 'var(--ub-orange)' }}>{isDone ? '✓ Шийдвэрлэсэн' : '⏳ Хүлээгдэж буй'}</span>
              </div>
              <div style={{ background: 'var(--ub-bg)', borderRadius: 14, padding: '14px 16px', marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ub-ink-3)', marginBottom: 6 }}>ХҮСЭЛТИЙН ДЭЛГЭРЭНГҮЙ</div>
                <div style={{ fontSize: 14, color: 'var(--ub-ink)', lineHeight: 1.6 }}>{r.detail || r.label || r.text || '—'}</div>
              </div>
              {notif && <div style={{ background: 'rgba(22,163,74,.08)', border: '1px solid var(--ub-green)', borderRadius: 14, padding: '14px 16px', marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ub-green)', marginBottom: 6 }}>✓ CS-ийн хариу</div>
                <div style={{ fontSize: 14, color: 'var(--ub-ink)', lineHeight: 1.5 }}>{notif.detail || notif.title}</div>
              </div>}
              <button onClick={() => setSelectedReq(null)} style={{ width: '100%', marginTop: 8, padding: '14px 0', borderRadius: 14, border: 'none', background: 'var(--ub-chip)', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, cursor: 'pointer', color: 'var(--ub-ink-2)' }}>Хаах</button>
            </div>
          </div>
        );
      })()}
      {reqTab === 'new' && <div>
          <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 999, background: 'var(--ub-chip)', marginBottom: 16 }}>
            {[['goods', '📦 Бараа'], ['salary', '💰 Цалин']].map(([v, l]) => {
              const on = reqType === v;
              return <button key={v} onClick={() => setReqType(v)} style={{ flex: 1, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, padding: '9px 4px', borderRadius: 999, transition: 'all .15s', background: on ? 'var(--ub-surface)' : 'transparent', color: on ? 'var(--ub-orange-d)' : 'var(--ub-ink-3)', boxShadow: on ? '0 1px 3px rgba(0,0,0,.08)' : 'none' }}>{l}</button>;
            })}
          </div>

          {reqType === 'goods' && (
            <div style={{ marginBottom: 80 }}>
              {/* Big card input */}
              <div style={{ background: 'var(--ub-surface)', border: '2px solid var(--ub-border)', borderRadius: 20, padding: '24px 20px', marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ub-ink-3)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 16 }}>Шивүүлэх Tracking дугаараа нягталж зөв бичиж явуулна уу</div>
                {/* YC input */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ padding: '0 10px', fontSize: 15, fontWeight: 900, color: 'var(--ub-orange)', fontFamily: 'monospace', background: 'rgba(245,130,32,.12)', borderRadius: 10, height: 52, display: 'flex', alignItems: 'center', flexShrink: 0, border: '2px solid var(--ub-orange)' }}>YC</span>
                    <input
                      type="text" maxLength={9}
                      value={trackingInput}
                      onChange={e => {
                        const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        const nums = raw.slice(0,3).replace(/[^0-9]/g,'');
                        const rest = raw.slice(3,9);
                        setTrackingInput(nums + rest);
                      }}
                      placeholder="000XXXXXX"
                      style={{ flex: 1, border: '2px solid var(--ub-border)', borderRadius: 10, background: 'var(--ub-bg)', fontFamily: 'monospace', fontSize: 18, fontWeight: 800, color: 'var(--ub-ink)', outline: 'none', padding: '0 8px', height: 52, letterSpacing: '.1em', textAlign: 'center' }}
                    />
                    <span style={{ padding: '0 10px', fontSize: 15, fontWeight: 900, color: 'var(--ub-orange)', fontFamily: 'monospace', background: 'rgba(245,130,32,.12)', borderRadius: 10, height: 52, display: 'flex', alignItems: 'center', flexShrink: 0, border: '2px solid var(--ub-orange)' }}>CN</span>
                  </div>
                </div>
                {/* Add button */}
                <button
                  onClick={() => {
                    if (trackingInput.length === 9) {
                      const full = 'YC' + trackingInput.slice(0,3).padStart(3,'0') + trackingInput.slice(3,9).padEnd(6,'X') + 'CN';
                      if (!trackingNums.includes(full)) { setTrackingNums([...trackingNums, full]); setTrackingInput(''); }
                    }
                  }}
                  style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', background: trackingInput.length >= 9 ? 'var(--ub-orange)' : 'var(--ub-chip)', color: trackingInput.length >= 9 ? '#fff' : 'var(--ub-ink-3)', fontFamily: 'inherit', fontSize: 15, fontWeight: 800, cursor: trackingInput.length >= 9 ? 'pointer' : 'default', transition: 'all .2s', marginTop: 12 }}
                >+ Нэмэх</button>
              </div>
              {/* Added codes */}
              {trackingNums.length > 0 && (
                <div style={{ background: 'var(--ub-surface)', border: '1.5px solid var(--ub-border)', borderRadius: 16, padding: '16px 16px 10px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ub-ink-3)', marginBottom: 12 }}>{trackingNums.length} дугаар нэмэгдсэн</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {trackingNums.map((num, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 12, background: 'var(--ub-bg)', border: '1.5px solid var(--ub-orange)' }}>
                        <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--ub-ink)', fontFamily: 'monospace', letterSpacing: '.05em' }}>{num}</span>
                        <button onClick={() => setTrackingNums(trackingNums.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: 'var(--ub-ink-3)', cursor: 'pointer', padding: '4px 8px', fontSize: 18, lineHeight: 1, borderRadius: 8 }}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {reqType === 'salary' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ub-ink-3)', marginBottom: 6 }}>Сар</div>
                <select value={month} onChange={e => setMonth(e.target.value)} style={{ width: '100%', padding: '11px 12px', borderRadius: 12, border: '1.5px solid var(--ub-border)', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, background: 'var(--ub-surface)', color: 'var(--ub-ink)', outline: 'none' }}>
                  <option value="">Сонгох</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>{m}-р сар</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ub-ink-3)', marginBottom: 6 }}>Өдөр</div>
                <input type="number" min={1} max={31} value={day} onChange={e => setDay(e.target.value)} placeholder="Өдөр" style={{ width: '100%', boxSizing: 'border-box', padding: '11px 12px', borderRadius: 12, border: '1.5px solid var(--ub-border)', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, background: 'var(--ub-surface)', color: 'var(--ub-ink)', outline: 'none' }} />
              </div>
            </div>
          )}
          {reqType !== 'goods' && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ub-ink-3)', marginBottom: 6 }}>Тайлбар</div>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder={reqType === 'salary' ? 'Нэмэлт тайлбар (заавал биш)' : 'Хүсэлтийн утга...'} rows={3} style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: 12, border: '1.5px solid var(--ub-border)', fontFamily: 'inherit', fontSize: 14, background: 'var(--ub-surface)', color: 'var(--ub-ink)', outline: 'none', resize: 'none' }} />
          </div>
          )}
          {sent
            ? <div style={{ textAlign: 'center', padding: '14px', borderRadius: 14, background: 'var(--ub-orange-t)', color: 'var(--ub-orange-d)', fontWeight: 700, fontSize: 14 }}>✓ Хүсэлт илгээгдлээ</div>
            : reqType === 'goods'
              ? trackingNums.length > 0 && (
                  <div style={{ position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 64px)', maxWidth: 340, zIndex: 50 }}>
                    <button onClick={submit} style={{ width: '100%', padding: '16px 0', borderRadius: 16, border: 'none', background: 'var(--ub-orange)', color: '#fff', fontFamily: 'inherit', fontSize: 16, fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 24px rgba(245,130,32,.45)', letterSpacing: '.01em' }}>
                      📦 {trackingNums.length} код илгээх
                    </button>
                  </div>
                )
              : <Btn kind="primary" full onClick={submit}>Илгээх</Btn>
          }
        </div>}
    </div>
  );
}

// ── Live Clock ─────────────────────────────────────────────────
function DrvClock() {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
  const hDeg = h % 12 * 30 + m * 0.5, mDeg = m * 6 + s * 0.1, sDeg = s * 6;
  const pad = n => String(n).padStart(2, '0');
  const days = ['Ням','Даваа','Мягмар','Лхагва','Пүрэв','Баасан','Бямба'];
  const months = ['1-р сар','2-р сар','3-р сар','4-р сар','5-р сар','6-р сар','7-р сар','8-р сар','9-р сар','10-р сар','11-р сар','12-р сар'];
  return (
    <div style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, padding: '20px 18px', textAlign: 'center' }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--ub-ink-2)' }}>Одоогийн цаг</div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="66" fill="var(--ub-bg)" stroke="var(--ub-border)" strokeWidth="2" />
          {[...Array(12)].map((_, i) => { const a = (i * 30 - 90) * Math.PI / 180; return <line key={i} x1={70+52*Math.cos(a)} y1={70+52*Math.sin(a)} x2={70+58*Math.cos(a)} y2={70+58*Math.sin(a)} stroke="var(--ub-ink)" strokeWidth={i%3===0?2.5:1.2} strokeLinecap="round" />; })}
          <line x1="70" y1="70" x2={70+32*Math.cos((hDeg-90)*Math.PI/180)} y2={70+32*Math.sin((hDeg-90)*Math.PI/180)} stroke="var(--ub-ink)" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="70" y1="70" x2={70+44*Math.cos((mDeg-90)*Math.PI/180)} y2={70+44*Math.sin((mDeg-90)*Math.PI/180)} stroke="var(--ub-ink)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="70" y1="70" x2={70+48*Math.cos((sDeg-90)*Math.PI/180)} y2={70+48*Math.sin((sDeg-90)*Math.PI/180)} stroke="var(--ub-orange)" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="70" cy="70" r="4" fill="var(--ub-orange)" />
          <circle cx="70" cy="70" r="2" fill="var(--ub-surface)" />
        </svg>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-.01em', color: 'var(--ub-ink)', lineHeight: 1 }}>
        {pad(h)}:{pad(m)}<span style={{ fontSize: 20, color: 'var(--ub-orange)', fontWeight: 700 }}>:{pad(s)}</span>
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--ub-ink-3)', fontWeight: 600, marginTop: 6 }}>
        {days[now.getDay()]} · {now.getFullYear()} оны {months[now.getMonth()]} {now.getDate()}
      </div>
    </div>
  );
}

// ── Income ─────────────────────────────────────────────────────
function DrvIncome({ onRequest, returnResults }) {
  const toLocalDate = iso => { try { return new Date(iso).toLocaleDateString('sv-SE'); } catch { return ''; } };
  const todayStr = new Date().toLocaleDateString('sv-SE');
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const RATE = 4500;
  const received = (returnResults || []).filter(r => r.status === 'received');
  const cancelled = (returnResults || []).filter(r => r.status === 'cancelled');
  const filteredReceived = selectedDate ? received.filter(r => toLocalDate(r.receivedAt || new Date()) === selectedDate) : received;
  const filteredCancelled = selectedDate ? cancelled.filter(r => toLocalDate(r.receivedAt || new Date()) === selectedDate) : cancelled;
  const isToday = selectedDate === todayStr;
  const totalAll = received.length;
  const totalEarned = received.length * RATE;

  return (
    <div style={{ padding: '0 0 40px', background: 'var(--ub-bg)' }}>
      <div style={{ margin: '0', background: 'linear-gradient(145deg, #1a1714 0%, #232018 60%, #1a1714 100%)', padding: '28px 20px 32px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(245,130,32,.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 11, fontWeight: 700, opacity: .45, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 20, position: 'relative' }}>Миний хэтэвч</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 0, position: 'relative', marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', fontWeight: 600, letterSpacing: '.04em', marginBottom: 8 }}>Нийт авсан</div>
            <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: 4 }}>
              {totalAll}<span style={{ fontSize: 15, fontWeight: 600, opacity: .45, marginLeft: 2 }}>ш</span>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.08)', width: 1 }} />
          <div style={{ paddingLeft: 20 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', fontWeight: 600, letterSpacing: '.04em', marginBottom: 8 }}>Нийт цалин</div>
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-.03em', lineHeight: 1, color: '#F58220' }}>
              {totalEarned.toLocaleString()}<span style={{ fontSize: 14, marginLeft: 3, opacity: .8 }}>₮</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, background: 'var(--ub-surface)', border: '1.5px solid var(--ub-border)', borderRadius: 12, padding: '0 14px', height: 44 }}>
          <Icon.clock size={15} style={{ color: 'var(--ub-orange)', flexShrink: 0 }} />
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ flex: 1, border: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, color: 'var(--ub-ink)', outline: 'none', cursor: 'pointer' }} />
          {!isToday && <button onClick={() => setSelectedDate(todayStr)} style={{ border: 'none', background: 'var(--ub-orange)', color: '#fff', borderRadius: 999, padding: '3px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>Өнөөдөр</button>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          <div style={{ background: 'var(--ub-surface)', border: '1.5px solid var(--ub-border)', borderRadius: 16, padding: '16px 14px' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ub-ink-3)', letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 4 }}>Авсан</div>
            <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-.03em', lineHeight: 1 }}>{filteredReceived.length}<span style={{ fontSize: 12, fontWeight: 600, opacity: .4, marginLeft: 2 }}>ш</span></div>
          </div>
          <div style={{ background: '#F58220', borderRadius: 16, padding: '16px 14px', boxShadow: '0 4px 16px rgba(245,130,32,.3)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.7)', letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 4 }}>Цалин</div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-.02em', lineHeight: 1, color: '#fff' }}>{(filteredReceived.length * RATE).toLocaleString()}<span style={{ fontSize: 12, marginLeft: 2, opacity: .8 }}>₮</span></div>
          </div>
        </div>

        {filteredReceived.length === 0 && filteredCancelled.length === 0 &&
          <div style={{ textAlign: 'center', padding: '52px 0', color: 'var(--ub-ink-3)' }}>
            <Icon.coins size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: .25 }} />
            <div style={{ fontSize: 14, fontWeight: 700 }}>{isToday ? 'Өнөөдөр бүртгэл алга' : selectedDate + '-д бүртгэл алга'}</div>
          </div>
        }

        {filteredReceived.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ub-ink-3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 }}>Гүйлгээний түүх</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredReceived.map((r, i) => (
                <div key={i} style={{ background: 'var(--ub-surface)', border: '1.5px solid var(--ub-border)', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(245,130,32,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon.box size={16} style={{ color: 'var(--ub-orange)' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.ubcCode || r.taskId || '—'}</div>
                    <div style={{ fontSize: 11, color: 'var(--ub-ink-3)', marginTop: 1 }}>{r.district || r.ts || ''}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#F58220' }}>+{RATE.toLocaleString()}₮</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Profile ────────────────────────────────────────────────────
function DrvProfile({ onLogout, driverInfo, onResetResults }) {
  const d = driverInfo || UB.driver;
  const avatarKey = 'ub_driver_avatar_' + (d.phone || '').replace(/\s/g,'');
  const [avatarUrl, setAvatarUrl] = React.useState(() => localStorage.getItem(avatarKey) || null);
  const fileRef = React.useRef(null);
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState(() => {
    try { const s = localStorage.getItem('ub_driver_edit'); if (s) { const p = JSON.parse(s); if (p.phone === d.phone) return p; } } catch {}
    return { name: d.name, phone: d.phone, vehicle: d.vehicle, zone: d.zone };
  });
  const saveEdit = () => { localStorage.setItem('ub_driver_edit', JSON.stringify(form)); setEditing(false); };
  const handleAvatarChange = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { localStorage.setItem(avatarKey, ev.target.result); setAvatarUrl(ev.target.result); };
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ padding: '0 0 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 0' }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.02em' }}>Профайл</div>
        <button onClick={() => editing ? saveEdit() : setEditing(true)} style={{ border: editing ? 'none' : '1.5px solid var(--ub-border)', background: editing ? 'var(--ub-orange)' : 'var(--ub-surface)', color: editing ? '#fff' : 'var(--ub-ink)', borderRadius: 10, padding: '7px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          {editing ? 'Хадгалах' : 'Засах ✏️'}
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 20px' }}>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
        <div onClick={() => fileRef.current && fileRef.current.click()} style={{ position: 'relative', cursor: 'pointer', marginBottom: 16 }}>
          {avatarUrl
            ? <img src={avatarUrl} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--ub-orange)', boxShadow: '0 4px 20px rgba(245,130,32,.25)' }} />
            : <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--ub-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 800, color: '#fff' }}>{(form.name || d.name || '?')[0]}</div>}
          <div style={{ position: 'absolute', bottom: 3, right: 3, width: 28, height: 28, borderRadius: '50%', background: 'var(--ub-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid var(--ub-bg)' }}>
            <Icon.camera size={13} style={{ color: '#fff' }} />
          </div>
        </div>
        {editing
          ? <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ fontSize: 20, fontWeight: 800, border: 'none', borderBottom: '2px solid var(--ub-orange)', background: 'transparent', outline: 'none', fontFamily: 'inherit', color: 'var(--ub-ink)', textAlign: 'center', marginBottom: 6 }} />
          : <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-.01em' }}>{form.name || d.name}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          <div style={{ background: 'var(--ub-orange-t)', color: 'var(--ub-orange-d)', borderRadius: 999, padding: '3px 12px', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon.star size={12} /> {d.rating}
          </div>
          <div style={{ background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 999, padding: '3px 12px', fontSize: 12, fontWeight: 600, color: 'var(--ub-ink-2)' }}>{d.id}</div>
        </div>
      </div>
      <div style={{ margin: '0 16px 14px', background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, overflow: 'hidden' }}>
        {[['Утас','phone',form.phone||d.phone,<Icon.phone size={18} />],['Тээврийн хэрэгсэл','vehicle',form.vehicle||d.vehicle,<Icon.truck size={18} />],['Бүсчлэл','zone',form.zone||d.zone,<Icon.pin size={18} />]].map(([label,key,val,icon],i)=>(
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderTop: i ? '1px solid var(--ub-border)' : 'none' }}>
            <span style={{ color: 'var(--ub-orange)' }}>{icon}</span>
            <div style={{ flex: 1, fontSize: 12.5, color: 'var(--ub-ink-3)', fontWeight: 600 }}>{label}</div>
            {editing
              ? <input value={form[key]||''} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} style={{ fontSize: 14, fontWeight: 700, border: 'none', borderBottom: '1.5px solid var(--ub-orange)', background: 'transparent', outline: 'none', fontFamily: 'inherit', color: 'var(--ub-ink)', textAlign: 'right', width: 130 }} />
              : <div style={{ fontWeight: 700, fontSize: 14 }}>{val}</div>}
          </div>
        ))}
      </div>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {onResetResults && <button onClick={() => { if(window.confirm('Буцаалтын бүртгэл устгах уу?')) onResetResults(); }} style={{ width: '100%', padding: '13px', borderRadius: 14, border: '1.5px solid rgba(192,57,43,.25)', background: 'rgba(192,57,43,.07)', color: '#C0392B', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Буцаалтын бүртгэл цэвэрлэх</button>}
        <Btn kind="ghost" full icon={<Icon.logout size={18} />} onClick={onLogout}>Гарах</Btn>
      </div>
    </div>
  );
}

// ── DriverApp root ─────────────────────────────────────────────
function DriverApp({ onLogout, onReturnResult, onDeleteTask, onDeleteAllTasks, onSubmitRequest, shipmentTasks, driverInfo, driverDistrict, notifications, onDeleteNotif, returnResults, onResetResults, onDeleteAllRequests, myRequests, csInboxOverrides }) {
  const [tab, setTab] = useState('home');
  const [openId, setOpenId] = useState(null);
  const [openedTaskSnapshot, setOpenedTaskSnapshot] = useState(null);
  const [online, setOnline] = useState(true);
  const [district, setDistrict] = useState(driverDistrict || 'Бүх дүүрэг');
  const [showDistrict, setShowDistrict] = useState(false);
  const [photos, setPhotos] = useState({});

  const completedKey = 'ub_completed_tasks_' + ((driverInfo || {}).phone || 'default').replace(/\s/g,'');
  const [completedIds, setCompletedIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(completedKey) || '[]')); } catch { return new Set(); }
  });

  const BASE_TASKS = React.useRef(UB.tasks);

  const tasks = React.useMemo(() => {
    const uploadedTasks = (shipmentTasks || []).map(t => ({ ...t, _fromUpload: true }));
    const uploadedIds = new Set(uploadedTasks.map(t => t.id));
    const baseTasks = BASE_TASKS.current.filter(t => !uploadedIds.has(t.id) && !completedIds.has(t.id));
    return [...uploadedTasks.filter(t => !completedIds.has(t.id)), ...baseTasks];
  }, [shipmentTasks, completedIds]);

  const advance = (id) => {
    if (onDeleteTask) onDeleteTask(id);
    setCompletedIds(prev => {
      const next = new Set(prev); next.add(id);
      try { localStorage.setItem(completedKey, JSON.stringify([...next])); } catch {}
      return next;
    });
    setOpenId(null); setOpenedTaskSnapshot(null);
  };
  const driverInfo2 = driverInfo || UB.driver;

  const TABS = [
    ['home', 'Даалгавар', Icon.home],
    ['requests', 'Хүсэлт', Icon.inbox],
    ['income', 'Хэтэвч', Icon.coins],
    ['profile', 'Профайл', Icon.user],
  ];

  const openedTask = openedTaskSnapshot || tasks.find(t => t.id === openId);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--ub-bg)', paddingTop: 44 }}>
      {showDistrict && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowDistrict(false)}>
          <div style={{ background: 'var(--ub-surface)', borderRadius: '20px 20px 0 0', padding: '20px 16px 32px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--ub-border)', margin: '0 auto 16px' }} />
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Дүүрэг сонгох</div>
            {['Бүх дүүрэг', ...UB_DISTRICTS].map(d => (
              <div key={d} onClick={() => { setDistrict(d); setShowDistrict(false); }} style={{ padding: '12px 14px', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 14, background: district === d ? 'var(--ub-orange-t)' : 'transparent', color: district === d ? 'var(--ub-orange-d)' : 'var(--ub-ink)', marginBottom: 4 }}>{d}</div>
            ))}
          </div>
        </div>
      )}

      {openId && openedTask && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'var(--ub-bg)', overflow: 'auto' }}>
          <DrvTaskDetail
            t={openedTask}
            onBack={() => { setOpenId(null); setOpenedTaskSnapshot(null); }}
            onAdvance={advance}
            photos={photos[openedTask.id] || []}
            onAddPhoto={url => setPhotos(p => ({ ...p, [openedTask.id]: [...(p[openedTask.id] || []), url] }))}
            onRemovePhoto={i => setPhotos(p => ({ ...p, [openedTask.id]: (p[openedTask.id] || []).filter((_, j) => j !== i) }))}
            onReturnResult={onReturnResult}
            driverInfo={driverInfo2}
          />
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto', background: 'var(--ub-bg)' }}>
        {tab === 'home' && <DrvHome tasks={tasks} onOpen={id => { setOpenId(id); setOpenedTaskSnapshot(tasks.find(t => t.id === id) || null); }} online={online} setOnline={setOnline} district={district} onPickDistrict={() => setShowDistrict(true)} driverDistrict={driverDistrict} returnResults={returnResults} onDeleteAllTasks={() => { if (onDeleteAllTasks) onDeleteAllTasks(); }} />}
        {tab === 'requests' && <DrvRequest onSubmitRequest={onSubmitRequest} notifications={notifications} onDeleteNotif={onDeleteNotif} myRequests={myRequests || []} csInboxOverrides={csInboxOverrides || {}} onDeleteAllRequests={onDeleteAllRequests} />}
        {tab === 'income' && <DrvIncome onRequest={() => setTab('requests')} returnResults={returnResults} />}
        {tab === 'profile' && <DrvProfile onLogout={onLogout} driverInfo={driverInfo2} onResetResults={onResetResults} />}
      </div>

      <div style={{ borderTop: '1px solid var(--ub-border)', background: 'var(--ub-surface)', padding: '8px 0 16px', display: 'flex', flexShrink: 0 }}>
        {TABS.map(([key, label, Ic]) => {
          const on = tab === key;
          const badge = key === 'requests' && (notifications || []).filter(n => !n.read).length;
          return (
            <button key={key} onClick={() => setTab(key)} style={{ flex: 1, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0', fontFamily: 'inherit', position: 'relative' }}>
              <div style={{ color: on ? 'var(--ub-orange)' : 'var(--ub-ink-3)', transition: 'color .15s', position: 'relative' }}>
                <Ic size={22} />
                {badge > 0 && <div style={{ position: 'absolute', top: -2, right: -4, width: 8, height: 8, borderRadius: '50%', background: 'var(--ub-orange)', border: '1.5px solid var(--ub-surface)' }} />}
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: on ? 'var(--ub-orange)' : 'var(--ub-ink-3)', letterSpacing: '.02em' }}>{label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { DriverApp, DrvRequest });
