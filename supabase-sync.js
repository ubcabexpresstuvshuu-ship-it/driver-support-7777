// ═══════════════════════════════════════════════════════════════
// UBCAB Express — Supabase Sync Layer
// UBCAB Express App.html дотор <script src="supabase-sync.js">
// гэж оруулна. Энэ скрипт localStorage-тай хамтран ажиллана.
// ═══════════════════════════════════════════════════════════════
// ⬇ Өөрийн Supabase URL болон ANON KEY-г энд бичнэ үү:
const SUPABASE_URL = 'https://rfghdxxttlgzsqvghkpk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_BssB1LIGl_naO8Go37T_FQ_tewmxFfp';
// ═══════════════════════════════════════════════════════════════

(async function initSupabaseSync() {
  // Supabase JS CDN-ээс ачаална
  if (!window.supabase) {
    await new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.50.0/dist/umd/supabase.min.js';
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  window._sb = sb;

  // ── Table ↔ localStorage key mapping ──────────────────────────
  const TABLES = {
    registrations:      { lsKey: 'ub_registrations',       pk: 'id' },
    return_results:     { lsKey: 'ub_return_results',      pk: 'id' },
    driver_requests:    { lsKey: 'ub_driver_requests',     pk: 'id' },
    driver_notifs:      { lsKey: 'ub_driver_notifs',       pk: 'id' },
    change_requests:    { lsKey: 'ub-ch-items',            pk: 'id' },
    shipment_tasks:     { lsKey: 'ub_shipment_tasks',      pk: 'id' },
  };

  // ── Supabase → localStorage (pull on init) ─────────────────────
  async function pullAll() {
    for (const [table, { lsKey }] of Object.entries(TABLES)) {
      try {
        const { data, error } = await sb.from(table).select('*').order('created_at', { ascending: false });
        if (error) { console.warn('[UBCAB Sync] pull error', table, error.message); continue; }
        if (data && data.length > 0) {
          localStorage.setItem(lsKey, JSON.stringify(data));
          console.log(`[UBCAB Sync] pulled ${data.length} rows from ${table}`);
        }
      } catch (e) { console.warn('[UBCAB Sync] pull failed', table, e); }
    }
    // cs_inbox_overrides (объект хэлбэрээр)
    try {
      const { data } = await sb.from('cs_inbox_overrides').select('*');
      if (data && data.length > 0) {
        const obj = {};
        data.forEach(r => { obj[r.id] = r.status; });
        localStorage.setItem('ub_cs_inbox_overrides', JSON.stringify(obj));
      }
    } catch (e) {}
    // Хуудсыг дахин ачаалж React state-г шинэчилнэ
    window.dispatchEvent(new Event('ub-sync-done'));
  }

  // ── localStorage → Supabase (push) ────────────────────────────
  async function pushAll() {
    for (const [table, { lsKey }] of Object.entries(TABLES)) {
      try {
        const raw = localStorage.getItem(lsKey);
        if (!raw) continue;
        const rows = JSON.parse(raw);
        if (!Array.isArray(rows) || rows.length === 0) continue;
        const { error } = await sb.from(table).upsert(rows, { onConflict: 'id', ignoreDuplicates: false });
        if (error) console.warn('[UBCAB Sync] push error', table, error.message);
        else console.log(`[UBCAB Sync] pushed ${rows.length} rows to ${table}`);
      } catch (e) { console.warn('[UBCAB Sync] push failed', table, e); }
    }
    // cs_inbox_overrides
    try {
      const raw = localStorage.getItem('ub_cs_inbox_overrides');
      if (raw) {
        const obj = JSON.parse(raw);
        const rows = Object.entries(obj).map(([id, status]) => ({ id, status }));
        if (rows.length > 0) await sb.from('cs_inbox_overrides').upsert(rows, { onConflict: 'id' });
      }
    } catch (e) {}
  }

  // ── Real-time subscription (Supabase → app) ───────────────────
  function subscribeAll() {
    Object.keys(TABLES).forEach(table => {
      sb.channel(`public:${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, () => pullAll())
        .subscribe();
    });
  }

  // ── Run ──────────────────────────────────────────────────────
  await pullAll();
  subscribeAll();

  // Хуудас хаагдахад localStorage → Supabase push
  window.addEventListener('beforeunload', pushAll);

  // Гараар push хийх функц (debug)
  async function clearAll() {
    const tables = ['return_results', 'shipment_tasks', 'driver_requests', 'driver_notifs', 'cs_inbox_overrides'];
    for (const table of tables) {
      try { await sb.from(table).delete().neq('id', '___never___'); } catch (e) {}
    }
    // localStorage цэвэрлэх
    ['ub_return_results', 'ub_shipment_tasks', 'ub_driver_requests', 'ub_driver_notifs', 'ub_cs_inbox_overrides'].forEach(k => {
      try { localStorage.removeItem(k); } catch {}
    });
    window.dispatchEvent(new Event('ub-sync-done'));
  }

  window.ubcabSync = { pull: pullAll, push: pushAll, clearAll };
  console.log('[UBCAB Sync] ready. window.ubcabSync.push() / .pull() гэж дуудна.');
})();
