// ub-root.jsx — shell: login, mode switcher, scale-to-fit, tweaks
const { useState: useRS, useEffect: useRE, useRef: useRR } = React;

// ── Persistent state (localStorage sync) ──────────────────────
function usePersist(key, init) {
  const [val, setVal] = useRS(() => {
    try { const s = localStorage.getItem(key); if (s !== null) return JSON.parse(s); } catch {}
    return typeof init === 'function' ? init() : init;
  });
  const set = React.useCallback((v) => {
    setVal(prev => {
      const next = typeof v === 'function' ? v(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);
  return [val, set];
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#F58220",
  "textSize": "Дунд"
} /*EDITMODE-END*/;

// ── Generate unique UBC code ──────────────────────────────────
const generateUBCCode = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `UBC-${date}-${rand}`;
};

const ZOOM = { 'Жижиг': 0.92, 'Дунд': 1, 'Том': 1.12 };

// ── Scale a fixed-size frame to fit available space ─────────────
function ScaleToFit({ w, h, max = 1, children }) {
  const wrap = useRR(null);
  const [scale, setScale] = useRS(0.6);
  useRE(() => {
    const fit = () => {
      const el = wrap.current;if (!el) return;
      const aw = el.clientWidth,ah = el.clientHeight;
      setScale(Math.min(aw / w, ah / h, max));
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (wrap.current) ro.observe(wrap.current);
    window.addEventListener('resize', fit);
    return () => {ro.disconnect();window.removeEventListener('resize', fit);};
  }, [w, h, max]);
  return (
    <div ref={wrap} style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <div style={{ width: w * scale, height: h * scale, flexShrink: 0 }}>
        <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          {children}
        </div>
      </div>
    </div>);
}

// ── Login (adapts to mode) ──────────────────────────────────────
function Login({ mode, onLogin, onRegister, loginError }) {
  const isDriver = mode === 'driver';
  const isAdmin = mode === 'admin';
  const [loginPhone, setLoginPhone] = useRS('');
  const [loginPw, setLoginPw] = useRS('');
  const headerText = isDriver ? 'Чиглэлийн хүргэлт' : isAdmin ? 'Бүртгэл, ажилтан, жолоочийг удирдана' : 'Үйл ажиллагааны нэгдсэн самбар';
  const subText = isDriver ? 'Хүргэлт, буцаалт, хүсэлт, орлогоо хянаарай.' : isAdmin ? 'Жолоочийн бүртгэлийг зөвшөөрөх, ажилтан нэмэх.' : 'Буцаалт, жолоочийн хүсэлт, хаягийн өөрчлөлтийг удирдана.';
  const loginLabel = isDriver ? 'НЭВТРЭХ' : isAdmin ? 'АДМИН НЭВТРЭЛТ' : 'АЖИЛТНЫ НЭВТРЭЛТ';
  return (
    <div style={{ height: '100%', background: 'var(--ub-bg)', color: 'var(--ub-ink)', fontFamily: 'var(--ub-font)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ background: '#fff', padding: isDriver ? '70px 28px 40px' : '64px 56px 48px', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--ub-border)' }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: 999, background: 'color-mix(in srgb, var(--ub-orange) 10%, transparent)' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -70, width: 150, height: 150, borderRadius: 999, background: 'color-mix(in srgb, var(--ub-orange) 6%, transparent)' }} />
        {false && <img src={window.__resources?.ubcabLogo || 'assets/ubcab-express-logo.png'} alt="UBCAB Express" style={{ height: isDriver ? 30 : 34, width: 'auto', display: 'block', position: 'relative' }} />}
        <div style={{ color: 'var(--ub-ink)', fontSize: isDriver ? 20 : 32, fontWeight: 800, letterSpacing: '-.025em', marginTop: 26, lineHeight: 1.1, maxWidth: 420, position: 'relative', textAlign: isDriver ? 'center' : 'left' }}>{headerText}</div>
        {!isDriver && <div style={{ color: 'var(--ub-ink-2)', fontSize: 16, marginTop: 8, maxWidth: 380, position: 'relative' }}>{subText}</div>}
      </div>
      <div style={{ flex: 1, padding: isDriver ? '28px 28px' : '40px 56px', display: 'flex', flexDirection: 'column', maxWidth: isDriver ? 'none' : 460, width: '100%' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ub-ink-3)', letterSpacing: '.04em', marginBottom: 16 }}>{loginLabel}</div>
        {isDriver ? (
          <>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink-2)', marginBottom: 7 }}>Утасны дугаар</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '0 16px', borderRadius: 12, border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface)' }}>
                <span style={{ color: 'var(--ub-ink-3)', flexShrink: 0 }}><Icon.phone size={18} /></span>
                <input type="tel" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} placeholder="99xxxxxx"
                  style={{ flex: 1, border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 16, fontWeight: 600, color: 'var(--ub-ink)', padding: '14px 0', outline: 'none' }} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink-2)', marginBottom: 7 }}>Нууц үг</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '0 16px', borderRadius: 12, border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface)' }}>
                <span style={{ color: 'var(--ub-ink-3)', flexShrink: 0 }}><Icon.check size={18} /></span>
                <input type="password" value={loginPw} onChange={(e) => setLoginPw(e.target.value)} placeholder="Нууц үг"
                  onKeyDown={(e) => e.key === 'Enter' && onLogin(loginPhone, loginPw)}
                  style={{ flex: 1, border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 16, fontWeight: 600, color: 'var(--ub-ink)', padding: '14px 0', outline: 'none' }} />
              </div>
            </div>
            {loginError && (
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(192,57,43,.1)', color: '#C0392B', fontSize: 13.5, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon.alert size={17} /> {loginError}
              </div>
            )}
          </>
        ) : isAdmin ? (
          <>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink-2)', marginBottom: 7 }}>Утасны дугаар</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '0 16px', borderRadius: 12, border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface)' }}>
                <span style={{ color: 'var(--ub-ink-3)', flexShrink: 0 }}><Icon.phone size={18} /></span>
                <input type="tel" value={loginPhone} onChange={e => setLoginPhone(e.target.value)} placeholder="8661 7780"
                  style={{ flex: 1, border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 16, fontWeight: 600, color: 'var(--ub-ink)', padding: '14px 0', outline: 'none' }} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink-2)', marginBottom: 7 }}>4 оронтой PIN</div>
              <input type="password" inputMode="numeric" maxLength={4} value={loginPw} onChange={e => setLoginPw(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="● ● ● ●"
                onKeyDown={e => e.key === 'Enter' && onLogin(loginPhone, loginPw)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid var(--ub-border)', borderRadius: 12, padding: '14px 16px', fontSize: 22, fontWeight: 800, letterSpacing: '0.3em', textAlign: 'center', fontFamily: 'var(--ub-font)', background: 'var(--ub-surface)', color: 'var(--ub-ink)', outline: 'none' }} />
            </div>
            {loginError && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(192,57,43,.1)', color: '#C0392B', fontSize: 13.5, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}><Icon.alert size={17} /> {loginError}</div>}
          </>
        ) : (
          <>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink-2)', marginBottom: 7 }}>Утасны дугаар</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '0 16px', borderRadius: 12, border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface)' }}>
                <span style={{ color: 'var(--ub-ink-3)', flexShrink: 0 }}><Icon.phone size={18} /></span>
                <input type="tel" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} placeholder="99xxxxxx"
                  style={{ flex: 1, border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 16, fontWeight: 600, color: 'var(--ub-ink)', padding: '14px 0', outline: 'none' }} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink-2)', marginBottom: 7 }}>4 оронтой PIN</div>
              <input type="password" inputMode="numeric" maxLength={4} value={loginPw} onChange={e => setLoginPw(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="● ● ● ●"
                onKeyDown={(e) => e.key === 'Enter' && onLogin(loginPhone, loginPw)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid var(--ub-border)', borderRadius: 12, padding: '14px 16px', fontSize: 22, fontWeight: 800, letterSpacing: '0.3em', textAlign: 'center', fontFamily: 'var(--ub-font)', background: 'var(--ub-surface)', color: 'var(--ub-ink)', outline: 'none' }} />
            </div>
            {loginError && <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(192,57,43,.1)', color: '#C0392B', fontSize: 13.5, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}><Icon.alert size={17} /> {loginError}</div>}
          </>
        )}
        <div style={{ height: 18 }} />
        <Btn kind="primary" full onClick={() => onLogin(loginPhone, loginPw)} icon={<Icon.chevR size={19} />}>Нэвтрэх</Btn>
        {!isDriver && !isAdmin && <button onClick={onRegister} style={{ width: '100%', textAlign: 'center', padding: '14px 0', border: 'none', background: 'none', color: 'var(--ub-orange)', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4 }}>Шинээр бүртгүүлэх</button>}

        {isDriver && <>
          {/* Fleet driver hint */}

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '16px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--ub-border)' }} />
            <span style={{ fontSize: 12.5, color: 'var(--ub-ink-3)', fontWeight: 600 }}>эсвэл</span>
            <div style={{ flex: 1, height: 1, background: 'var(--ub-border)' }} />
          </div>
          <Btn kind="ghost" full onClick={onRegister} icon={<Icon.plus size={19} />}>Бүртгүүлэх</Btn>
        </>}


      </div>
    </div>);
}

// ── Driver Registration form ────────────────────────────────────
const REG_DISTRICTS = ['Багануур','Багахангай','Баянгол','Баянзүрх','Налайх','Сонгинохайрхан','Сүхбаатар','Хан-Уул','Чингэлтэй'];

function DriverRegister({ method, email, onComplete, onBack }) {
  const [name, setName] = useRS('');
  const [phone, setPhone] = useRS('');
  const [vehicle, setVehicle] = useRS('');
  const [district, setDistrict] = useRS('');
  const [pin, setPin] = useRS('');
  const [pin2, setPin2] = useRS('');
  const pinValid = /^\d{4}$/.test(pin);
  const allFilled = name.trim() && phone.trim() && vehicle.trim() && district && pinValid && pin === pin2;

  const submit = () => {
    if (!allFilled) return;
    const profile = { name: name.trim(), phone: phone.trim(), vehicle: vehicle.trim(), district, email: email || '', method: method || 'phone', pin };
    onComplete(profile);
  };

  return (
    <div style={{ height: '100%', background: 'var(--ub-bg)', color: 'var(--ub-ink)', fontFamily: 'var(--ub-font)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'var(--ub-ink)', padding: '70px 28px 30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: 999, background: 'color-mix(in srgb, var(--ub-orange) 26%, transparent)' }} />
        <div style={{ color: 'var(--ub-bg)', fontSize: 22, fontWeight: 800, letterSpacing: '-.02em', marginTop: 20, lineHeight: 1.15, position: 'relative' }}>Бүртгүүлэх</div>
        {email && <div style={{ color: 'color-mix(in srgb, var(--ub-bg) 60%, transparent)', fontSize: 13.5, marginTop: 6, position: 'relative' }}>{email}</div>}
      </div>
      <div style={{ flex: 1, padding: '22px 28px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ub-ink-3)', letterSpacing: '.04em', marginBottom: 14 }}>ЖОЛООЧИЙН МЭДЭЭЛЭЛ</div>
        <RegField label="Нэр" placeholder="Жишээ: Бат-Эрдэнэ" value={name} onChange={setName} icon={<Icon.user size={18} />} />
        <RegField label="Утасны дугаар" placeholder="9911 2233" value={phone} onChange={setPhone} icon={<Icon.phone size={18} />} type="tel" />
        <RegField label="Тээврийн хэрэгсэл (марк · улсын дугаар)" placeholder="Porter H100 · 1234 УБА" value={vehicle} onChange={setVehicle} icon={<Icon.truck size={18} />} />
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink-2)', marginBottom: 7 }}>Ажиллах дүүрэг</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {REG_DISTRICTS.map((d) => {
              const on = district === d;
              return (
                <button key={d} onClick={() => setDistrict(d)} style={{
                  padding: '10px 6px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 12, fontWeight: on ? 700 : 500, textAlign: 'center',
                  border: on ? '2px solid var(--ub-orange)' : '1.5px solid var(--ub-border)',
                  background: on ? 'var(--ub-orange-t)' : 'var(--ub-bg)',
                  color: on ? 'var(--ub-orange-d)' : 'var(--ub-ink)', transition: 'all .12s'
                }}>{d}</button>);
            })}
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink-2)', marginBottom: 7 }}>4 оронтой PIN код</div>
          <input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="● ● ● ●" style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid var(--ub-border)', borderRadius: 12, padding: '14px 16px', fontSize: 22, fontWeight: 800, letterSpacing: '0.3em', textAlign: 'center', fontFamily: 'var(--ub-font)', background: 'var(--ub-surface)', color: 'var(--ub-ink)', outline: 'none' }} />
          <div style={{ fontSize: 12, color: 'var(--ub-ink-3)', marginTop: 5 }}>Зөвхөн тоо, 4 оронтой</div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink-2)', marginBottom: 7 }}>PIN давтах</div>
          <input type="password" inputMode="numeric" maxLength={4} value={pin2} onChange={e => setPin2(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="● ● ● ●" style={{ width: '100%', boxSizing: 'border-box', border: `1.5px solid ${pin2.length === 4 && pin !== pin2 ? '#C0392B' : 'var(--ub-border)'}`, borderRadius: 12, padding: '14px 16px', fontSize: 22, fontWeight: 800, letterSpacing: '0.3em', textAlign: 'center', fontFamily: 'var(--ub-font)', background: 'var(--ub-surface)', color: 'var(--ub-ink)', outline: 'none' }} />
        </div>
        {pin.length === 4 && pin2.length === 4 && pin !== pin2 && <div style={{ fontSize: 12.5, color: '#C0392B', fontWeight: 600, marginTop: -8, marginBottom: 10 }}>PIN код таарахгүй байна</div>}
        <div style={{ height: 6 }} />
        <Btn kind="primary" full onClick={submit} icon={<Icon.check size={19} />}
          style={{ opacity: allFilled ? 1 : 0.45, pointerEvents: allFilled ? 'auto' : 'none' }}>Бүртгүүлэх</Btn>
        <button onClick={onBack} style={{ width: '100%', textAlign: 'center', padding: '14px 0', border: 'none', background: 'none', color: 'var(--ub-ink-3)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginTop: 6 }}>← Буцах</button>
      </div>
    </div>
  );
}

function CSRegister({ onComplete, onBack }) {
  const [name, setName] = useRS('');
  const [phone, setPhone] = useRS('');
  const [pin, setPin] = useRS('');
  const [pin2, setPin2] = useRS('');
  const pinValid = /^\d{4}$/.test(pin);
  const allFilled = name.trim() && phone.trim() && pinValid && pin === pin2;

  return (
    <div style={{ height: '100%', background: 'var(--ub-bg)', color: 'var(--ub-ink)', fontFamily: 'var(--ub-font)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'var(--ub-ink)', padding: '64px 56px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: 999, background: 'color-mix(in srgb, var(--ub-orange) 26%, transparent)' }} />
        <div style={{ color: 'var(--ub-bg)', fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', marginTop: 20, lineHeight: 1.15, position: 'relative' }}>CS ажилтан бүртгүүлэх</div>
      </div>
      <div style={{ flex: 1, padding: '28px 56px', display: 'flex', flexDirection: 'column', overflowY: 'auto', maxWidth: 460 }}>
        <RegField label="Нэр" placeholder="Жишээ: Сарантуяа" value={name} onChange={setName} icon={<Icon.user size={18} />} />
        <RegField label="Утасны дугаар" placeholder="9911 2233" value={phone} onChange={setPhone} icon={<Icon.phone size={18} />} type="tel" />
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink-2)', marginBottom: 7 }}>4 оронтой PIN код</div>
          <input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="● ● ● ●" style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid var(--ub-border)', borderRadius: 12, padding: '14px 16px', fontSize: 22, fontWeight: 800, letterSpacing: '0.3em', textAlign: 'center', fontFamily: 'var(--ub-font)', background: 'var(--ub-surface)', color: 'var(--ub-ink)', outline: 'none' }} />
          <div style={{ fontSize: 12, color: 'var(--ub-ink-3)', marginTop: 5 }}>Зөвхөн тоо, 4 оронтой</div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink-2)', marginBottom: 7 }}>PIN давтах</div>
          <input type="password" inputMode="numeric" maxLength={4} value={pin2} onChange={e => setPin2(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="● ● ● ●" style={{ width: '100%', boxSizing: 'border-box', border: `1.5px solid ${pin2.length === 4 && pin !== pin2 ? '#C0392B' : 'var(--ub-border)'}`, borderRadius: 12, padding: '14px 16px', fontSize: 22, fontWeight: 800, letterSpacing: '0.3em', textAlign: 'center', fontFamily: 'var(--ub-font)', background: 'var(--ub-surface)', color: 'var(--ub-ink)', outline: 'none' }} />
        </div>
        {pin.length === 4 && pin2.length === 4 && pin !== pin2 && <div style={{ fontSize: 12.5, color: '#C0392B', fontWeight: 600, marginTop: -8, marginBottom: 10 }}>PIN код таарахгүй байна</div>}
        <div style={{ height: 6 }} />
        <Btn kind="primary" full onClick={() => allFilled && onComplete({ name: name.trim(), phone: phone.trim(), pin })} icon={<Icon.check size={19} />} style={{ opacity: allFilled ? 1 : 0.45, pointerEvents: allFilled ? 'auto' : 'none' }}>Бүртгүүлэх</Btn>
        <button onClick={onBack} style={{ width: '100%', textAlign: 'center', padding: '14px 0', border: 'none', background: 'none', color: 'var(--ub-ink-3)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginTop: 6 }}>← Буцах</button>
      </div>
    </div>
  );
}

function RegField({ label, placeholder, value, onChange, icon, type = 'text' }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink-2)', marginBottom: 7 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '0 16px', borderRadius: 12, border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface)' }}>
        <span style={{ color: 'var(--ub-ink-3)', flexShrink: 0 }}>{icon}</span>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          style={{ flex: 1, border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, color: 'var(--ub-ink)', padding: '14px 0', outline: 'none' }} />
      </div>
    </div>
  );
}

// ── Pending approval screen ─────────────────────────────────────
function DriverPending({ profile, onBack }) {
  return (
    <div style={{ height: '100%', background: 'var(--ub-bg)', color: 'var(--ub-ink)', fontFamily: 'var(--ub-font)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ background: 'var(--ub-ink)', padding: '70px 28px 36px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: 999, background: 'color-mix(in srgb, var(--ub-orange) 26%, transparent)' }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
        <div style={{ width: 80, height: 80, borderRadius: 999, background: 'var(--ub-orange-t)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: 'var(--ub-orange)' }}>
          <Icon.clock size={40} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>Бүртгэл хүлээгдэж байна</div>
        <div style={{ fontSize: 14, color: 'var(--ub-ink-2)', textAlign: 'center', lineHeight: 1.5, maxWidth: 280, marginBottom: 24 }}>
          Таны бүртгэлийг админ хянаж зөвшөөрсний дараа нэвтрэх боломжтой болно.
        </div>
        <div style={{ width: '100%', background: 'var(--ub-surface)', border: '1px solid var(--ub-border)', borderRadius: 16, padding: 18, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 999, background: 'var(--ub-orange-t)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ub-orange-d)', fontSize: 20, fontWeight: 800 }}>
              {(profile.name || '?')[0]}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800 }}>{profile.name}</div>
              <div style={{ fontSize: 13, color: 'var(--ub-ink-2)' }}>{profile.phone}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge color="var(--ub-ink-2)" bg="var(--ub-chip)"><Icon.truck size={13} /> {profile.vehicle}</Badge>
            <Badge color="var(--ub-ink-2)" bg="var(--ub-chip)"><Icon.pin size={13} /> {profile.district}</Badge>
            <Badge color="var(--ub-orange)" bg="var(--ub-orange-t)" dot>Хүлээгдэж буй</Badge>
          </div>
        </div>
        <Btn kind="ghost" full onClick={onBack} icon={<Icon.chevL size={18} />}>Нэвтрэх хуудас руу буцах</Btn>
      </div>
    </div>
  );
}

function LoginField({ label, value, icon }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ub-ink-2)', marginBottom: 7 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 16px', borderRadius: 12, border: '1.5px solid var(--ub-border)', background: 'var(--ub-surface)', color: 'var(--ub-ink)' }}>
        <span style={{ color: 'var(--ub-ink-3)' }}>{icon}</span>
        <span style={{ fontSize: 16, fontWeight: 600 }}>{value}</span>
      </div>
    </div>);
}

// ── Mode switcher (3 modes) ─────────────────────────────────────
function ModeSwitch({ mode, setMode }) {
  return (
    <div style={{ display: 'inline-flex', gap: 4, padding: 4, borderRadius: 999, background: 'rgba(255,255,255,.08)', backdropFilter: 'blur(8px)' }}>
      {[['driver', 'Жолооч', '· Mobile'], ['cs', 'CS / Админ', '· Web']].map(([k, label, tag]) => {
        const on = mode === k;
        return (
          <button key={k} onClick={() => setMode(k)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, border: 'none', cursor: 'pointer',
            padding: '9px 18px', borderRadius: 999, fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap',
            background: on ? 'var(--ub-orange)' : 'transparent', color: on ? '#fff' : 'rgba(255,255,255,.6)',
            transition: 'all .18s var(--ub-ease)', fontFamily: "\"URW Geometric\""
          }}>
            {label}<span style={{ fontSize: 11.5, fontWeight: 500, opacity: .8 }}>{tag}</span>
          </button>);
      })}
    </div>);
}

// Tweaks fallback (production — no tweaks-panel.jsx)
function useTweaks(defaults) { return [defaults, () => {}]; }
function TweaksPanel() { return null; }

function Root() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [mode, setMode] = useRS(() => localStorage.getItem('ub_mode') || 'driver');
  const [driverReturnResults, setDriverReturnResults] = useRS([]);
  useRE(() => {
    try { const s = localStorage.getItem(returnKey); setDriverReturnResults(s !== null ? JSON.parse(s) : []); } catch {}
  }, [returnKey]);
  const addReturnResult = (result) => {
    setDriverReturnResults(prev => {
      if (prev.some(r => r.taskId === result.taskId && r.status === result.status)) return prev;
      const next = [{ ...result, ts: new Date().toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' }), receivedAt: new Date().toISOString() }, ...prev].slice(0, 200);
      try { localStorage.setItem(returnKey, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const getAllReturnResults = () => {
    const all = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('ub_return_results_') || k === 'ub_return_results')) {
        try { const v = JSON.parse(localStorage.getItem(k)); if (Array.isArray(v)) all.push(...v); } catch {}
      }
    }
    return all.sort((a, b) => new Date(b.receivedAt || 0) - new Date(a.receivedAt || 0));
  };
  const [allReturnResults, setAllReturnResults] = useRS(getAllReturnResults);
  useRE(() => {
    const handler = (e) => { if (!e.key || e.key.startsWith('ub_return_results')) setAllReturnResults(getAllReturnResults()); };
    window.addEventListener('storage', handler);
    // Supabase pull (same-tab) → storage event дэмждэггүй тул ub-sync-done event сонсоно
    const syncHandler = () => setAllReturnResults(getAllReturnResults());
    window.addEventListener('ub-sync-done', syncHandler);
    return () => { window.removeEventListener('storage', handler); window.removeEventListener('ub-sync-done', syncHandler); };
  }, []);
  useRE(() => { setAllReturnResults(getAllReturnResults()); }, [driverReturnResults]);
  const returnResults = allReturnResults;
  const [driverRequests, setDriverRequests] = usePersist('ub_driver_requests', []);
  const addDriverRequest = (req) => setDriverRequests(prev => [{
    ...req,
    id: 'DRV-' + Date.now().toString(36),
    receivedAt: new Date().toISOString(),
    ts: new Date().toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' }),
    driver: driverProfile?.name || req.driver || '—',
    driverPhone: driverProfile?.phone || '',
  }, ...prev].slice(0, 500));
  const [driverNotifs, setDriverNotifs] = usePersist('ub_driver_notifs', []);
  const addDriverNotif = (n) => setDriverNotifs(prev => [{ ...n, ts: new Date().toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' }) }, ...prev].slice(0, 200));
  const deleteDriverNotif = (idx) => setDriverNotifs(prev => idx === 'all' ? [] : prev.filter((_, i) => i !== idx));
  const [shipmentTasks, setShipmentTasks] = usePersist('ub_shipment_tasks', []);
  const deleteShipmentTask = (id) => setShipmentTasks(prev => prev.filter(t => t.id !== id));
  const deleteAllShipmentTasks = () => setShipmentTasks([]);
  const deleteShipmentTasksByIds = (ids) => { const set = new Set(ids); setShipmentTasks(prev => prev.filter(t => !set.has(t.id))); };
  const [csInboxOverrides, setCsInboxOverrides] = usePersist('ub_cs_inbox_overrides', {});
  const [staff, setStaff] = usePersist('ub_staff', UB.staff);
  const addStaff = ({ name, phone, role }) => {
    setStaff(s => { const newId = role === 'Админ' ? 'ADM-' + String(s.length+1).padStart(2,'0') : 'CS-' + String(s.length+7).padStart(2,'0'); return [...s, { id: newId, name, phone, role, status: 'active' }]; });
  };
  const getDistrictByZip = (zip) => {
    const z = String(zip || '');
    if (z.startsWith('120')) return 'Багануур';
    if (z.startsWith('121') || z.startsWith('122')) return 'Налайх';
    if (z.startsWith('123')) return 'Багахангай';
    if (z.startsWith('13')) return 'Баянзүрх';
    if (z.startsWith('14')) return 'Сүхбаатар';
    if (z.startsWith('15')) return 'Чингэлтэй';
    if (z.startsWith('16')) return 'Баянгол';
    if (z.startsWith('17')) return 'Хан-Уул';
    if (z.startsWith('18')) return 'Сонгинохайрхан';
    return '';
  };
  const onShipmentUpload = (shipments) => {
    const newTasks = shipments.map((s) => {
      const district = getDistrictByZip(s.zip) || s.khoroo || 'Улаанбаатар';
      console.log('TASK:', s.tracking, '| zip:', s.zip, '| district:', district, '| khoroo:', s.khoroo);
      return { id: s.tracking, tracking: s.tracking, customer: '', phone: s.phone, district, khoroo: s.khoroo, addr: s.addr, items: s.partner + ' · ' + s.weight + 'кг', amount: 0, window: s.created, created: s.created || s.receivedAt || new Date().toISOString(), status: 'pending', note: '', weight: s.weight, partner: s.partner };
    });
    setShipmentTasks(prev => {
      const newIds = new Set(newTasks.map(t => t.id));
      const updated = prev.map(t => {
        const n = newTasks.find(x => x.id === t.id);
        return n ? { ...t, district: n.district, addr: n.addr, phone: n.phone, weight: n.weight } : t;
      });
      const brandNew = newTasks.filter(t => !prev.some(p => p.id === t.id));
      return [...brandNew, ...updated];
    });
  };

  const [authed, setAuthed] = useRS(() => localStorage.getItem('ub_authed') === '1');
  const [csAuthed, setCsAuthed] = useRS(() => localStorage.getItem('ub_cs_authed') === '1');
  const [adminAuthed, setAdminAuthed] = useRS(() => localStorage.getItem('ub_admin_authed') === '1');
  const [registrations, setRegistrations] = usePersist('ub_registrations', () => [...UB.registrations]);
  const [driverProfile, setDriverProfile] = useRS(() => {
    try { return JSON.parse(localStorage.getItem('ub_driver_profile')); } catch { return null; }
  });
  const returnKey = driverProfile?.phone ? 'ub_return_results_' + driverProfile.phone.replace(/\s/g,'') : 'ub_return_results';
  const [driverFlow, setDriverFlow] = useRS(null);
  const [pendingProfile, setPendingProfile] = useRS(null);
  const [loginError, setLoginError] = useRS('');

  const [csStaff, setCsStaff] = usePersist('ub_cs_staff', []);
  const [csStaffFlow, setCsStaffFlow] = useRS(null);
  const [csProfile, setCsProfile] = useRS(() => { try { return JSON.parse(localStorage.getItem('ub_cs_profile')); } catch { return null; } });

  const approveCsStaff = (id) => setCsStaff(ss => ss.map(s => s.id === id ? { ...s, status: 'approved' } : s));
  const rejectCsStaff = (id) => setCsStaff(ss => ss.map(s => s.id === id ? { ...s, status: 'rejected' } : s));
  const [hiddenDriverRequests, setHiddenDriverRequests] = usePersist('ub_hidden_driver_reqs', []);
  const approveReg = (id) => setRegistrations(rs => rs.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  const rejectReg = (id) => setRegistrations(rs => rs.map(r => r.id === id ? { ...r, status: 'rejected' } : r));

  const handleAdminLogin = (phone, pin) => {
    const clean = phone.replace(/ /g, '');
    if (clean === '86617780' && pin === '0815') {
      setAdminAuthed(true); setLoginError(''); return;
    }
    if (!clean) { setLoginError('Утасны дугаараа оруулна уу'); return; }
    setLoginError('Утасны дугаар эсвэл PIN буруу байна');
  };

  const handleCsLogin = (phone, pin) => {
    const clean = phone.replace(/ /g, '');
    // Admin шалгах
    if (clean === '86617780' && pin === '0815') {
      const adminProf = { name: 'Админ', phone: clean, id: 'ADMIN-001', isAdmin: true };
      setCsProfile(adminProf); localStorage.setItem('ub_cs_profile', JSON.stringify(adminProf));
      setCsAuthed(true); setCsStaffFlow(null); setLoginError(''); return;
    }
    const match = csStaff.find(s => s.phone.replace(/ /g, '') === clean && s.status === 'approved');
    if (match && match.pin === pin) {
      setCsProfile({ name: match.name, phone: match.phone, id: match.id });
      localStorage.setItem('ub_cs_profile', JSON.stringify({ name: match.name, phone: match.phone, id: match.id }));
      setCsAuthed(true); setCsStaffFlow(null); return;
    }
    const pending = csStaff.find(s => s.phone.replace(/ /g, '') === clean && s.status === 'pending');
    if (pending) { setLoginError('Таны бүртгэл хүлээгдэж байна. Админ зөвшөөрсний дараа нэвтэрнэ үү.'); return; }
    if (!match) { setLoginError('Утасны дугаар буруу эсвэл бүртгэл зөвшөөрөгдөөгүй байна'); return; }
    setLoginError('PIN буруу байна');
  };

  const handleCsRegComplete = (profile) => {
    const cleanPhone = profile.phone.replace(/ /g, '');
    const dup = csStaff.find(s => s.phone.replace(/ /g, '') === cleanPhone);
    if (dup) { setLoginError('Энэ утасны дугаар бүртэгдсэн байна'); setCsStaffFlow(null); return; }
    const newStaff = { id: 'CS-' + String(csStaff.length + 1).padStart(3, '0'), name: profile.name, phone: profile.phone, pin: profile.pin, status: 'pending', ts: new Date().toLocaleString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace('T', ' ') };
    setCsStaff(ss => [newStaff, ...ss]);
    setCsStaffFlow('pending');
  };

  // Supabase pull (same-tab) → ub-sync-done → бүх state шинэчлэх
  useRE(() => {
    const onSync = () => {
      try { const s = localStorage.getItem('ub_driver_requests'); if (s) setDriverRequests(JSON.parse(s)); } catch {}
      try { const s = localStorage.getItem('ub_driver_notifs'); if (s) setDriverNotifs(JSON.parse(s)); } catch {}
      try { const s = localStorage.getItem('ub_shipment_tasks'); if (s) setShipmentTasks(JSON.parse(s)); } catch {}
      try { const s = localStorage.getItem('ub_cs_inbox_overrides'); if (s) setCsInboxOverrides(JSON.parse(s)); } catch {}
      try { const s = localStorage.getItem('ub_registrations'); if (s) setRegistrations(JSON.parse(s)); } catch {}
    };
    window.addEventListener('ub-sync-done', onSync);
    return () => window.removeEventListener('ub-sync-done', onSync);
  }, []);

  const handleDriverLogin = (phone, pw) => {
    setLoginError('');
    const clean = phone.replace(/ /g, '');
    if (!clean || !pw) { setLoginError('Утас болон нууц үгээ оруулна уу'); return; }
    // 1. Шинэ бүртгэл (зөвшөөрөгдсөн)
    const match = registrations.find(r => r.status === 'approved' && r.phone.replace(/ /g, '') === clean);
    if (match && match.pin === pw) {
      const prof = { name: match.name, id: match.id || ('DRV-' + clean.slice(-8)), phone: match.phone, vehicle: match.vehicle, zone: (match.district || match.zone || 'Улаанбаатар') + (match.district ? ' дүүрэг' : ''), rating: 4.5 };
      setDriverProfile(prof); localStorage.setItem('ub_driver_profile', JSON.stringify(prof)); localStorage.removeItem('ub_driver_edit');
      try { const s = localStorage.getItem('ub_return_results_' + clean); setDriverReturnResults(s ? JSON.parse(s) : []); } catch { setDriverReturnResults([]); }
      setAuthed(true); setDriverFlow(null); return;
    }
    // 2. Флит жолооч — PIN шалгах (бүртгэлгүй бол нэвтрэх эрхгүй)
    const fleet = (window.UB?.fleet || []).find(f => f.phone.replace(/ /g, '') === clean);
    if (fleet) {
      const fleetReg = registrations.find(r => r.phone.replace(/ /g, '') === clean && r.status === 'approved' && r.pin);
      if (fleetReg && fleetReg.pin === pw) {
        const prof = { name: fleet.name, id: 'DRV-' + clean.slice(-8), phone: fleet.phone, vehicle: fleet.vehicle || '—', zone: fleet.zone, rating: 4.9 };
        setDriverProfile(prof); localStorage.setItem('ub_driver_profile', JSON.stringify(prof)); localStorage.removeItem('ub_driver_edit');
        try { const s = localStorage.getItem('ub_return_results_' + clean); setDriverReturnResults(s ? JSON.parse(s) : []); } catch { setDriverReturnResults([]); }
        setAuthed(true); setDriverFlow(null); return;
      }
      if (!fleetReg) { setLoginError('Та PIN тохируулаагүй байна. Эхлээд бүртгүүлнэ үү.'); return; }
      setLoginError('PIN буруу байна'); return;
    }
    // 3. Хүлээгдэж буй бүртгэл
    const pending = registrations.find(r => r.status === 'pending' && r.phone.replace(/ /g, '') === clean);
    if (pending) { setLoginError('Таны бүртгэл хүлээгдэж байна. Админ зөвшөөрсний дараа нэвтэрнэ үү.'); return; }
    setLoginError('Утасны дугаар буруу, эсвэл бүртгэл зөвшөөрөгдөөгүй байна');
  };

  const handleRegComplete = (profile) => {
    const cleanPhone = profile.phone.replace(/ /g, '');
    // Давхар бүртгэл шалгах
    const dup = registrations.find(r => r.phone.replace(/ /g, '') === cleanPhone);
    if (dup) {
      if (dup.status === 'approved') {
        setLoginError('Энэ утасны дугаар бүртгэгдсэн байна. Нэвтэрнэ үү.');
        setDriverFlow(null);
      } else if (dup.status === 'pending') {
        setPendingProfile({ name: dup.name, phone: dup.phone, vehicle: dup.vehicle, district: dup.district });
        setDriverFlow('pending');
      } else {
        setLoginError('Энэ утасны дугаар өмнө нь бүртгэгдсэн боловч татгалзагдсан байна.');
        setDriverFlow(null);
      }
      return;
    }
    // Флит жолоочийг шалгах
    const fleet = (window.UB?.fleet || []).find(f => f.phone.replace(/ /g, '') === cleanPhone);
    if (fleet) {
      setLoginError('Та флит жолоочийн бүртгэлтэй байна. Эхлээд бүртгүүлж PIN тохируулна уу.');
      setDriverFlow(null);
      return;
    }
    const newReg = {
      id: 'REG-' + String(registrations.length + 1).padStart(3, '0'),
      name: profile.name, phone: profile.phone, vehicle: profile.vehicle,
      district: profile.district, method: profile.method || 'phone',
      email: profile.email || '', pin: profile.pin,
      status: 'pending',
      ts: new Date().toLocaleString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace('T', ' '),
    };
    setRegistrations(rs => [newReg, ...rs]);
    setPendingProfile(profile);
    setDriverFlow('pending');
  };

  useRE(() => {localStorage.setItem('ub_mode', mode); setLoginError(''); setDriverFlow(null);}, [mode]);
  useRE(() => {localStorage.setItem('ub_authed', authed ? '1' : '0');}, [authed]);
  useRE(() => {localStorage.setItem('ub_cs_authed', csAuthed ? '1' : '0');}, [csAuthed]);
  useRE(() => {localStorage.setItem('ub_admin_authed', adminAuthed ? '1' : '0');}, [adminAuthed]);
  useRE(() => {
    document.documentElement.style.setProperty('--ub-orange', t.accent);
    document.documentElement.style.setProperty('--ub-zoom', String(ZOOM[t.textSize] || 1));
  }, [t.accent, t.textSize]);

  const isDriver = mode === 'driver';

  return (
    <div className="ub-theme" data-dark="false" style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#1A1714' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 20px 14px', position: 'relative' }}>
        <ModeSwitch mode={mode} setMode={setMode} />
        <div style={{ position: 'absolute', right: 22, color: 'rgba(255,255,255,.4)', fontSize: 12.5, fontWeight: 600, letterSpacing: '.03em' }}>UBCAB Express · prototype</div>
      </div>

      <div className="ub-stage" style={{ flex: 1, minHeight: 0, padding: '0 20px 22px', display: 'flex' }}>
        {isDriver ?
        <ScaleToFit w={402} h={840} max={1.0} key="driver">
            <IOSDevice width={402} height={840} dark={false}>
              <div className="ub-theme ub-zoom" data-dark="false">
                {authed ? <DriverApp onLogout={() => { setAuthed(false); setDriverProfile(null); localStorage.removeItem('ub_driver_profile'); }} onReturnResult={addReturnResult} onResetResults={() => { setDriverReturnResults([]); try { localStorage.setItem(returnKey, '[]'); } catch {} }} onDeleteTask={deleteShipmentTask} onDeleteAllTasks={deleteAllShipmentTasks} onSubmitRequest={addDriverRequest} onDeleteAllRequests={() => {
                    const myReqs = driverRequests.filter(r => r.driverPhone === driverProfile?.phone).map(r => r.id);
                    setHiddenDriverRequests(h => [...new Set([...h, ...myReqs])]);
                  }} shipmentTasks={shipmentTasks} driverInfo={driverProfile} driverDistrict={driverProfile?.zone?.split(' ')[0]} notifications={driverNotifs.filter(n => !n.driverPhone || n.driverPhone === driverProfile?.phone)} onDeleteNotif={deleteDriverNotif} returnResults={driverReturnResults} myRequests={driverRequests.filter(r => r.driverPhone === driverProfile?.phone && !hiddenDriverRequests.includes(r.id))} csInboxOverrides={csInboxOverrides} /> :
                 driverFlow === 'register' ? <DriverRegister method="phone" onComplete={handleRegComplete} onBack={() => setDriverFlow(null)} /> :
                 driverFlow === 'pending' && pendingProfile ? <DriverPending profile={pendingProfile} onBack={() => { setDriverFlow(null); setPendingProfile(null); }} /> :
                 <Login mode="driver" onLogin={handleDriverLogin} onRegister={() => { setLoginError(''); setDriverFlow('register'); }} loginError={loginError} />}
              </div>
            </IOSDevice>
          </ScaleToFit> :

        <ScaleToFit w={1180} h={760} max={1.0} key="cs">
            <ChromeWindow width={1180} height={760} url="app.ubcab.mn/cs" tabs={[{ title: 'UBCAB Express — CS' }]}>
              <div className="ub-theme ub-zoom" data-dark="false">
                {csAuthed ? <CSApp onLogout={() => { setCsAuthed(false); setCsProfile(null); localStorage.removeItem('ub_cs_profile'); }} returnResults={returnResults} driverRequests={driverRequests} onShipmentUpload={onShipmentUpload} regs={registrations} onApprove={approveReg} onReject={rejectReg} isAdmin={!!csProfile?.isAdmin} onNotify={addDriverNotif} csInboxOverrides={csInboxOverrides} setCsInboxOverrides={setCsInboxOverrides} staff={staff} onAddStaff={addStaff} shipmentTasks={shipmentTasks} onDeleteUploadTasks={deleteShipmentTasksByIds} csProfile={csProfile} csStaff={csStaff} onApproveCsStaff={approveCsStaff} onRejectCsStaff={rejectCsStaff} /> : csStaffFlow === 'pending' ? <div style={{ padding: 32, textAlign: 'center', fontFamily: 'var(--ub-font)' }}><div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Бүртгэл хүлээгдэж байна</div><div style={{ fontSize: 13, color: 'var(--ub-ink-3)' }}>Админ зөвшөөрсний дараа нэвтэрнэ үү</div><button onClick={() => setCsStaffFlow(null)} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 999, border: 'none', background: 'var(--ub-orange)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Буцах</button></div> : csStaffFlow === 'register' ? <CSRegister onComplete={handleCsRegComplete} onBack={() => setCsStaffFlow(null)} /> : <Login mode="cs" onLogin={handleCsLogin} loginError={loginError} onRegister={() => { setLoginError(''); setCsStaffFlow('register'); }} />}
              </div>
            </ChromeWindow>
          </ScaleToFit>
        }
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Брэнд" />
        <TweakColor label="Үндсэн өнгө" value={t.accent}
        options={['#F58220', '#FF6A00', '#E8701A', '#F2A03C']}
        onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Харагдац" />
        <TweakRadio label="Текстийн хэмжээ" value={t.textSize}
        options={['Жижиг', 'Дунд', 'Том']}
        onChange={(v) => setTweak('textSize', v)} />

      </TweaksPanel>
    </div>);
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
