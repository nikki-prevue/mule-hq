import { useState, useEffect } from 'react';

const GOLD = '#A07840';
const SAGE = '#5C7F59';
const HOT = '#C17B5A';
const WARM = '#A07840';
const COLD = '#5C7F59';

export default function Home() {
  const [page, setPage] = useState('command');
  const [briefing, setBriefing] = useState('Loading your morning briefing...');
  const [offices, setOffices] = useState([]);
  const [visits, setVisits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [route, setRoute] = useState([]);
  const [time, setTime] = useState('');
  const [phase, setPhase] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [alert, setAlert] = useState(true);
  const [loading, setLoading] = useState(false);

  // Field log state
  const [logOffice, setLogOffice] = useState('');
  const [logGift, setLogGift] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [logNextAction, setLogNextAction] = useState('');
  const [logTier, setLogTier] = useState('warm');

  // Task quick add
  const [quickTask, setQuickTask] = useState('');

  // Office add
  const [showOfficeModal, setShowOfficeModal] = useState(false);
  const [newOffice, setNewOffice] = useState({ name:'', doctor:'', city:'Flower Mound', tier:'warm', address:'', phone:'', notes:'' });

  // Supply add
  const [showSupplyModal, setShowSupplyModal] = useState(false);
  const [newSupply, setNewSupply] = useState({ name:'', count:0, low:5 });

  // EOD
  const [eodDraft, setEodDraft] = useState('');

  useEffect(() => {
    loadAll();
    const t = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(t);
  }, []);

  useEffect(() => { if (page === 'command') generateBriefing(); }, [offices, tasks, route]);

  function updateClock() {
    const now = new Date();
    setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    setDateStr(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    const h = now.getHours() + now.getMinutes() / 60;
    if (h < 8) setPhase('Pre-Day');
    else if (h < 9) setPhase('Morning Prep');
    else if (h < 9.5) setPhase('Team Meeting');
    else if (h < 15) setPhase('Field Hours');
    else if (h < 16) setPhase('EOD Window');
    else setPhase('Wrap Up');
  }

  async function loadAll() {
    try {
      const [o, v, t, s] = await Promise.all([
        fetch('/api/offices').then(r => r.json()),
        fetch('/api/visits').then(r => r.json()),
        fetch('/api/tasks').then(r => r.json()),
        fetch('/api/supplies').then(r => r.json()),
      ]);
      setOffices(Array.isArray(o) ? o : []);
      setVisits(Array.isArray(v) ? v : []);
      setTasks(Array.isArray(t) ? t : []);
      setSupplies(Array.isArray(s) ? s : []);
    } catch (e) { console.error(e); }
  }

  async function generateBriefing() {
    try {
      const hot = offices.filter(o => o.tier === 'hot').length;
      const overdue = offices.filter(o => !o.lastVisit || (Date.now() - new Date(o.lastVisit)) > 14 * 864e5).length;
      const r = await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotCount: hot, overdueCount: overdue, route: route.map(s => s.name).join(', '), tasks: tasks.filter(t => !t.done).map(t => t.text).join(', '), isFriday: new Date().getDay() === 5 })
      });
      const d = await r.json();
      setBriefing(d.briefing || 'Good morning, Nikki. Have a great field day.');
    } catch { setBriefing('Good morning, Nikki. Ready for the field.'); }
  }

  async function logVisit() {
    if (!logOffice) return alert('Select an office.');
    setLoading(true);
    await fetch('/api/visits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ office: logOffice, gift: logGift, notes: logNotes, nextAction: logNextAction, tier: logTier }) });
    await fetch('/api/offices', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: offices.find(o => o.name === logOffice)?.id, tier: logTier, nextAction: logNextAction, lastVisit: new Date().toISOString() }) });
    setLogGift(''); setLogNotes(''); setLogNextAction(''); setLogOffice('');
    await loadAll();
    setLoading(false);
  }

  async function quickAddTask() {
    if (!quickTask.trim()) return;
    await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: quickTask, priority: 'today' }) });
    setQuickTask('');
    await loadAll();
  }

  async function toggleTask(id, done) {
    await fetch('/api/tasks', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, done: !done }) });
    await loadAll();
  }

  async function deleteTask(id) {
    await fetch('/api/tasks', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    await loadAll();
  }

  async function addOffice() {
    if (!newOffice.name) return;
    await fetch('/api/offices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newOffice) });
    setShowOfficeModal(false);
    setNewOffice({ name:'', doctor:'', city:'Flower Mound', tier:'warm', address:'', phone:'', notes:'' });
    await loadAll();
  }

  async function addSupply() {
    if (!newSupply.name) return;
    await fetch('/api/supplies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newSupply) });
    setShowSupplyModal(false);
    setNewSupply({ name:'', count:0, low:5 });
    await loadAll();
  }

  async function adjustSupply(id, count, delta) {
    await fetch('/api/supplies', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, count: Math.max(0, count + delta) }) });
    await loadAll();
  }

  async function generateEOD() {
    const today = new Date().toLocaleDateString();
    const todayVisits = visits.filter(v => v.date === today || new Date(v.date).toLocaleDateString() === today);
    if (!todayVisits.length) { setEodDraft('No visits logged today. Log field visits first.'); return; }
    setEodDraft('Drafting your EOD report...');
    const r = await fetch('/api/eod', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visits: todayVisits }) });
    const d = await r.json();
    setEodDraft(d.draft || 'Error generating draft.');
  }

  function addToRoute(office) {
    if (route.find(r => r.name === office.name)) return;
    setRoute([...route, { ...office, order: route.length + 1, done: false }]);
  }

  function openMaps() {
    const stops = route.sort((a, b) => a.order - b.order).map(s => encodeURIComponent(s.address || s.name + ' ' + s.city));
    if (!stops.length) return;
    window.open(`https://www.google.com/maps/dir/${stops.join('/')}`, '_blank');
  }

  const hotCount = offices.filter(o => o.tier === 'hot').length;
  const overdueCount = offices.filter(o => !o.lastVisit || (Date.now() - new Date(o.lastVisit)) > 14 * 864e5).length;
  const todayVisits = visits.filter(v => new Date(v.date).toLocaleDateString() === new Date().toLocaleDateString());
  const lowSupplies = supplies.filter(s => s.count <= s.low).length;

  const s = {
    body: { fontFamily: "'Jost', sans-serif", background: '#FAFAF7', color: '#1A1410', minHeight: '100vh', fontWeight: 400 },
    topbar: { background: '#FDFCFA', borderBottom: '1px solid #DDD5C4', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
    logo: { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, letterSpacing: '0.12em' },
    nav: { background: '#FDFCFA', borderBottom: '1px solid #DDD5C4', padding: '0 32px', display: 'flex', gap: 2 },
    tab: (active) => ({ padding: '13px 18px', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: active ? GOLD : '#7A6E64', cursor: 'pointer', borderBottom: `2px solid ${active ? GOLD : 'transparent'}`, transition: 'all 0.15s' }),
    main: { padding: '28px 32px', maxWidth: 1400, margin: '0 auto' },
    card: { background: '#FDFCFA', border: '1px solid #DDD5C4', borderRadius: 12, padding: 22, marginBottom: 18 },
    cardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #EDE6D6' },
    cardTitle: { fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6E5F50' },
    cardAction: { fontSize: 12, color: GOLD, cursor: 'pointer', fontWeight: 500 },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 },
    grid2eq: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
    statRow: { display: 'flex', gap: 14, marginBottom: 20 },
    statPill: { background: '#FDFCFA', border: '1px solid #DDD5C4', borderRadius: 10, padding: '14px 18px', flex: 1 },
    statVal: { fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, lineHeight: 1 },
    statLbl: { fontSize: 10, color: '#7A6E64', marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' },
    timebar: { background: '#F5F0E8', border: '1px solid #DDD5C4', borderRadius: 10, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 },
    briefingText: { fontSize: 15, lineHeight: 1.8, color: '#3D3228', background: '#FAFAF7', borderRadius: 8, padding: 18, minHeight: 90, fontFamily: "'Cormorant Garamond', serif", border: '1px solid #EDE6D6' },
    input: { background: '#FAFAF7', border: '1px solid #DDD5C4', borderRadius: 8, color: '#1A1410', fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '9px 13px', outline: 'none', width: '100%', marginBottom: 12 },
    textarea: { background: '#FAFAF7', border: '1px solid #DDD5C4', borderRadius: 8, color: '#1A1410', fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '9px 13px', outline: 'none', width: '100%', marginBottom: 12, resize: 'vertical', minHeight: 80 },
    select: { background: '#FAFAF7', border: '1px solid #DDD5C4', borderRadius: 8, color: '#1A1410', fontFamily: "'Jost', sans-serif", fontSize: 13, padding: '9px 13px', outline: 'none', width: '100%', marginBottom: 12 },
    btnPrimary: { background: GOLD, color: 'white', border: 'none', borderRadius: 8, padding: '9px 18px', fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.06em' },
    btnSecondary: { background: '#F5F0E8', color: '#3D3228', border: '1px solid #DDD5C4', borderRadius: 8, padding: '9px 18px', fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 500, cursor: 'pointer' },
    btnSm: { padding: '6px 12px', fontSize: 11 },
    taskItem: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 0', borderBottom: '1px solid #EDE6D6' },
    tierBadge: (tier) => ({ fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.07em', background: tier === 'hot' ? 'rgba(193,123,90,0.12)' : tier === 'warm' ? 'rgba(160,120,64,0.14)' : 'rgba(92,127,89,0.14)', color: tier === 'hot' ? HOT : tier === 'warm' ? WARM : COLD }),
    modal: { position: 'fixed', inset: 0, background: 'rgba(44,40,32,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' },
    modalBox: { background: '#FAFAF7', border: '1px solid #DDD5C4', borderRadius: 14, padding: 30, width: 480, maxWidth: '95vw', maxHeight: '85vh', overflowY: 'auto' },
    modalTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, marginBottom: 20 },
    label: { fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', color: '#6E5F50', marginBottom: 6, display: 'block', textTransform: 'uppercase' },
    alertBanner: { background: 'rgba(193,123,90,0.07)', border: '1px solid rgba(193,123,90,0.25)', borderRadius: 10, padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 },
    sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, marginBottom: 22 },
    vaultRow: { display: 'grid', gridTemplateColumns: '130px 1fr 140px 130px', gap: 14, padding: '13px 0', borderBottom: '1px solid #EDE6D6', fontSize: 13 },
    officeRow: { display: 'grid', gridTemplateColumns: '1fr 90px 110px 140px 32px', gap: 12, padding: '12px 0', borderBottom: '1px solid #EDE6D6', alignItems: 'center' },
  };

  const tabs = ['command','offices','fieldlog','vault','eod','depot'];
  const tabLabels = ['Command','Offices','Field Log','Visit Vault','EOD Draft','Supply Depot'];

  return (
    <div style={s.body}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* TOPBAR */}
      <div style={s.topbar}>
        <div style={s.logo}>MULE <span style={{ color: GOLD }}>HQ</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontSize: 11, color: '#7A6E64' }}><span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: SAGE, marginRight: 5 }}></span>Notion synced</span>
          <span style={{ fontSize: 11, color: '#7A6E64', fontFamily: 'monospace' }}>{dateStr}</span>
          {alert && <span style={{ background: HOT, color: 'white', fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>1 Alert</span>}
        </div>
      </div>

      {/* NAV */}
      <div style={s.nav}>
        {tabs.map((t, i) => <div key={t} style={s.tab(page === t)} onClick={() => setPage(t)}>{tabLabels[i]}</div>)}
      </div>

      <div style={s.main}>

        {/* COMMAND CENTER */}
        {page === 'command' && (
          <div>
            {alert && (
              <div style={s.alertBanner}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: HOT, flexShrink: 0 }}></div>
                <div style={{ fontSize: 13, color: '#3D3228' }}><strong>New Referrer:</strong> Flower Mound Family Dental sent their first referral. Priority visit recommended.</div>
                <button style={{ ...s.btnSecondary, ...s.btnSm, marginLeft: 'auto' }} onClick={() => setAlert(false)}>Dismiss</button>
              </div>
            )}

            <div style={s.timebar}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: SAGE, animation: 'pulse 2s infinite' }}></div>
              <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#3D3228' }}>{time}</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD }}>{phase}</span>
            </div>

            <div style={s.grid2}>
              <div>
                <div style={s.card}>
                  <div style={s.cardHeader}>
                    <div style={s.cardTitle}>Morning Briefing</div>
                    <span style={s.cardAction} onClick={generateBriefing}>Refresh</span>
                  </div>
                  <div style={s.briefingText}>{briefing}</div>
                </div>

                <div style={s.statRow}>
                  {[
                    { val: todayVisits.length, lbl: 'Visits Today', color: '#1A1410' },
                    { val: hotCount, lbl: 'Hot Offices', color: HOT },
                    { val: overdueCount, lbl: 'Overdue', color: WARM },
                    { val: lowSupplies, lbl: 'Low Supplies', color: SAGE },
                  ].map((st, i) => (
                    <div key={i} style={s.statPill}>
                      <div style={{ ...s.statVal, color: st.color }}>{st.val}</div>
                      <div style={s.statLbl}>{st.lbl}</div>
                    </div>
                  ))}
                </div>

                <div style={s.card}>
                  <div style={s.cardHeader}>
                    <div style={s.cardTitle}>Today's Route</div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <span style={s.cardAction} onClick={openMaps}>Open Maps</span>
                    </div>
                  </div>
                  {route.length === 0 && <div style={{ color: '#7A6E64', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>No stops yet. Add offices from the Offices tab.</div>}
                  {route.map((stop, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid #EDE6D6' }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', border: `1.5px solid ${stop.done ? SAGE : GOLD}`, color: stop.done ? SAGE : GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{stop.order}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{stop.name}</div>
                        <div style={{ fontSize: 11, color: '#7A6E64' }}>{stop.city}</div>
                      </div>
                      <button style={{ ...s.btnSecondary, ...s.btnSm }} onClick={() => setRoute(route.map((r, ri) => ri === i ? { ...r, done: !r.done } : r))}>{stop.done ? 'Undo' : 'Done'}</button>
                      <span style={{ cursor: 'pointer', color: '#7A6E64', fontSize: 17 }} onClick={() => setRoute(route.filter((_, ri) => ri !== i))}>×</span>
                    </div>
                  ))}
                  {route.length === 0 && (
                    <div style={{ marginTop: 16, padding: 16, background: 'rgba(92,127,89,0.08)', border: '1px solid rgba(92,127,89,0.2)', borderRadius: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: SAGE, marginBottom: 10 }}>Dead Day Playbook</div>
                      <div style={{ fontSize: 13, color: '#3D3228', lineHeight: 2.2 }}>1. DSO office calls — priority list<br />2. Write 3 handwritten thank you cards<br />3. Update Referral Lab notes<br />4. Schedule next Lunch & Learn<br />5. Prep Friday route plan<br />6. Review referral trend data</div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div style={s.card}>
                  <div style={s.cardHeader}>
                    <div style={s.cardTitle}>Tasks</div>
                    <span style={s.cardAction} onClick={() => setPage('command')}>+ Add</span>
                  </div>
                  {tasks.length === 0 && <div style={{ color: '#7A6E64', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>No tasks yet.</div>}
                  {tasks.map(t => (
                    <div key={t.id} style={s.taskItem}>
                      <div onClick={() => toggleTask(t.id, t.done)} style={{ width: 17, height: 17, border: `1.5px solid ${t.done ? SAGE : '#C4B49E'}`, borderRadius: 4, cursor: 'pointer', flexShrink: 0, marginTop: 2, background: t.done ? SAGE : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white' }}>{t.done ? '✓' : ''}</div>
                      <div style={{ flex: 1, fontSize: 13, color: t.done ? '#7A6E64' : '#3D3228', textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</div>
                      <div style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', background: t.priority === 'urgent' ? 'rgba(193,123,90,0.12)' : t.priority === 'today' ? 'rgba(160,120,64,0.14)' : 'rgba(158,142,130,0.12)', color: t.priority === 'urgent' ? HOT : t.priority === 'today' ? GOLD : '#7A6E64' }}>{t.priority}</div>
                      <span style={{ cursor: 'pointer', color: '#7A6E64', fontSize: 16, paddingLeft: 6 }} onClick={() => deleteTask(t.id)}>×</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <input style={{ ...s.input, marginBottom: 0, flex: 1 }} value={quickTask} onChange={e => setQuickTask(e.target.value)} placeholder="Quick add task..." onKeyDown={e => e.key === 'Enter' && quickAddTask()} />
                    <button style={s.btnPrimary} onClick={quickAddTask}>Add</button>
                  </div>
                </div>

                <div style={s.card}>
                  <div style={s.cardHeader}><div style={s.cardTitle}>This Week</div></div>
                  {[['Mon','Field — FM / Highland Village'],['Tue','Field — Lewisville'],['Wed','Check Alyse email — new referrers'],['Thu','DSO Calls'],['Fri','Admin Day — Routes + Prep']].map(([day, ev]) => (
                    <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #EDE6D6', fontSize: 13 }}>
                      <span style={{ fontWeight: 500, width: 36 }}>{day}</span>
                      <span style={{ color: day === 'Wed' || day === 'Fri' ? GOLD : '#7A6E64' }}>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OFFICES */}
        {page === 'offices' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <div style={s.sectionTitle}>Office Tracker <span style={{ fontSize: 13, color: '#7A6E64', fontFamily: "'Jost',sans-serif", fontWeight: 300 }}>Flower Mound · Highland Village · Lewisville</span></div>
              <button style={s.btnPrimary} onClick={() => setShowOfficeModal(true)}>+ Add Office</button>
            </div>
            <div style={s.card}>
              <div style={{ ...s.officeRow, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7A6E64', paddingBottom: 10 }}>
                <div>Office / Doctor</div><div>Tier</div><div>Last Touch</div><div>Next Action</div><div></div>
              </div>
              {offices.length === 0 && <div style={{ color: '#7A6E64', fontSize: 13, textAlign: 'center', padding: '32px 0' }}>No offices yet. Add your first office above.</div>}
              {offices.map(o => {
                const last = o.lastVisit ? `${Math.floor((Date.now() - new Date(o.lastVisit)) / 864e5)}d ago` : 'Never';
                const od = !o.lastVisit || (Date.now() - new Date(o.lastVisit)) > 14 * 864e5;
                return (
                  <div key={o.id} style={s.officeRow}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{o.name}</div>
                      <div style={{ fontSize: 11, color: '#7A6E64' }}>{o.doctor}</div>
                    </div>
                    <div><span style={s.tierBadge(o.tier)}>{o.tier}</span></div>
                    <div style={{ fontSize: 12, color: od ? HOT : SAGE, fontWeight: od ? 600 : 400 }}>{last}</div>
                    <div style={{ fontSize: 12, color: '#7A6E64' }}>{o.nextAction || '—'}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ fontSize: 11, color: GOLD, cursor: 'pointer' }} onClick={() => addToRoute(o)}>+Route</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FIELD LOG */}
        {page === 'fieldlog' && (
          <div>
            <div style={s.sectionTitle}>Field Log <span style={{ fontSize: 13, color: '#7A6E64', fontFamily: "'Jost',sans-serif", fontWeight: 300 }}>Log visits in real time</span></div>
            <div style={s.grid2eq}>
              <div style={s.card}>
                <div style={s.cardHeader}><div style={s.cardTitle}>Log a Visit</div></div>
                <label style={s.label}>Office</label>
                <select style={s.select} value={logOffice} onChange={e => setLogOffice(e.target.value)}>
                  <option value="">Select office...</option>
                  {offices.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                </select>
                <label style={s.label}>Gift / Drop</label>
                <input style={s.input} value={logGift} onChange={e => setLogGift(e.target.value)} placeholder="Snack box, referral pads..." />
                <label style={s.label}>Field Notes</label>
                <textarea style={s.textarea} value={logNotes} onChange={e => setLogNotes(e.target.value)} placeholder="Who you met, conversation, interest level..." />
                <label style={s.label}>Next Action</label>
                <input style={s.input} value={logNextAction} onChange={e => setLogNextAction(e.target.value)} placeholder="Follow up in 2 weeks, schedule Lunch & Learn..." />
                <label style={s.label}>Update Tier</label>
                <select style={s.select} value={logTier} onChange={e => setLogTier(e.target.value)}>
                  <option value="warm">Warm</option>
                  <option value="hot">Hot</option>
                  <option value="cold">Cold</option>
                </select>
                <button style={{ ...s.btnPrimary, width: '100%' }} onClick={logVisit} disabled={loading}>{loading ? 'Saving...' : 'Save Visit'}</button>
              </div>
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <div style={s.cardTitle}>Today's Notes</div>
                  <span style={s.cardAction} onClick={() => { setPage('eod'); generateEOD(); }}>Push to EOD</span>
                </div>
                {todayVisits.length === 0 && <div style={{ color: '#7A6E64', fontSize: 13, textAlign: 'center', padding: '32px 0' }}>No visits logged yet today.</div>}
                {todayVisits.map(v => (
                  <div key={v.id} style={{ background: '#FAFAF7', border: '1px solid #EDE6D6', borderRadius: 10, padding: 14, marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{v.office}</div>
                      <div style={{ fontSize: 10, color: '#7A6E64', fontFamily: 'monospace' }}>{new Date(v.date).toLocaleDateString()}</div>
                    </div>
                    {v.notes && <div style={{ fontSize: 12, color: '#7A6E64', marginTop: 6, lineHeight: 1.6 }}>{v.notes}</div>}
                    {v.gift && <div style={{ fontSize: 11, color: GOLD, marginTop: 5 }}>Drop: {v.gift}</div>}
                    {v.nextAction && <div style={{ fontSize: 11, color: SAGE, marginTop: 4 }}>Next: {v.nextAction}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VAULT */}
        {page === 'vault' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <div style={s.sectionTitle}>Visit Vault <span style={{ fontSize: 13, color: '#7A6E64', fontFamily: "'Jost',sans-serif", fontWeight: 300 }}>Every touchpoint, always here</span></div>
              <span style={{ fontSize: 12, color: '#7A6E64' }}>Total: <strong style={{ color: '#1A1410' }}>{visits.length}</strong> visits</span>
            </div>
            <div style={s.card}>
              <div style={{ ...s.vaultRow, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7A6E64' }}>
                <div>Date</div><div>Office</div><div>Gift Given</div><div>Next Action</div>
              </div>
              {visits.length === 0 && <div style={{ color: '#7A6E64', fontSize: 13, textAlign: 'center', padding: '32px 0' }}>No visits yet. Log your first visit in Field Log.</div>}
              {[...visits].reverse().map(v => (
                <div key={v.id} style={s.vaultRow}>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#7A6E64' }}>{new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  <div><strong>{v.office}</strong>{v.notes && <div style={{ fontSize: 11, color: '#7A6E64', marginTop: 2 }}>{v.notes.substring(0, 80)}{v.notes.length > 80 ? '...' : ''}</div>}</div>
                  <div style={{ fontSize: 12, color: GOLD, fontWeight: 500 }}>{v.gift || '—'}</div>
                  <div style={{ fontSize: 11, color: '#7A6E64' }}>{v.nextAction || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EOD */}
        {page === 'eod' && (
          <div>
            <div style={s.sectionTitle}>EOD Draft <span style={{ fontSize: 13, color: '#7A6E64', fontFamily: "'Jost',sans-serif", fontWeight: 300 }}>End of day report for Neel Patel</span></div>
            <div style={s.grid2eq}>
              <div style={s.card}>
                <div style={s.cardHeader}><div style={s.cardTitle}>Auto-Draft</div><span style={s.cardAction} onClick={generateEOD}>Generate from Today</span></div>
                <div style={{ fontSize: 13, color: '#7A6E64', lineHeight: 1.7 }}>Click "Generate from Today" to auto-draft your EOD from today's field log entries. Review, edit, then copy to Outlook.</div>
              </div>
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <div style={s.cardTitle}>Email Preview</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={s.cardAction} onClick={() => { navigator.clipboard.writeText(eodDraft); }}>Copy</span>
                    <span style={s.cardAction} onClick={() => window.open('https://outlook.office.com/mail/new', '_blank')}>Open Outlook</span>
                  </div>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.9, color: '#3D3228', background: '#FAFAF7', padding: 18, borderRadius: 10, minHeight: 300, whiteSpace: 'pre-wrap', border: '1px solid #EDE6D6' }}>{eodDraft || 'Generate your EOD above to preview here.'}</div>
              </div>
            </div>
          </div>
        )}

        {/* SUPPLY DEPOT */}
        {page === 'depot' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <div style={s.sectionTitle}>Supply Depot <span style={{ fontSize: 13, color: '#7A6E64', fontFamily: "'Jost',sans-serif", fontWeight: 300 }}>Restock before Friday</span></div>
              <button style={s.btnPrimary} onClick={() => setShowSupplyModal(true)}>+ Add Item</button>
            </div>
            <div style={{ ...s.card, maxWidth: 580 }}>
              {supplies.length === 0 && <div style={{ color: '#7A6E64', fontSize: 13, textAlign: 'center', padding: '32px 0' }}>No supplies tracked yet.</div>}
              {supplies.map(sup => (
                <div key={sup.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #EDE6D6' }}>
                  <div style={{ flex: 1, fontSize: 13 }}>{sup.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => adjustSupply(sup.id, sup.count, -1)} style={{ width: 28, height: 28, borderRadius: 6, background: '#F5F0E8', border: '1px solid #DDD5C4', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 500, minWidth: 40, textAlign: 'center', color: sup.count <= sup.low ? HOT : SAGE }}>{sup.count}</div>
                    <button onClick={() => adjustSupply(sup.id, sup.count, 1)} style={{ width: 28, height: 28, borderRadius: 6, background: '#F5F0E8', border: '1px solid #DDD5C4', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: sup.count <= sup.low ? HOT : SAGE }}>{sup.count <= sup.low ? 'Restock' : 'Stocked'}</div>
                </div>
              ))}
              <div style={{ marginTop: 16, fontSize: 11, color: '#7A6E64' }}>Items at or below threshold show red. Restock on Friday admin day.</div>
            </div>
          </div>
        )}
      </div>

      {/* ADD OFFICE MODAL */}
      {showOfficeModal && (
        <div style={s.modal} onClick={e => e.target === e.currentTarget && setShowOfficeModal(false)}>
          <div style={s.modalBox}>
            <div style={s.modalTitle}>Add Office</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={s.label}>Practice Name</label><input style={s.input} value={newOffice.name} onChange={e => setNewOffice({ ...newOffice, name: e.target.value })} placeholder="Practice name" /></div>
              <div><label style={s.label}>Doctor</label><input style={s.input} value={newOffice.doctor} onChange={e => setNewOffice({ ...newOffice, doctor: e.target.value })} placeholder="Dr. Last Name" /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={s.label}>City</label><select style={s.select} value={newOffice.city} onChange={e => setNewOffice({ ...newOffice, city: e.target.value })}><option>Flower Mound</option><option>Highland Village</option><option>Lewisville</option></select></div>
              <div><label style={s.label}>Tier</label><select style={s.select} value={newOffice.tier} onChange={e => setNewOffice({ ...newOffice, tier: e.target.value })}><option value="warm">Warm</option><option value="hot">Hot</option><option value="cold">Cold</option></select></div>
            </div>
            <label style={s.label}>Address</label><input style={s.input} value={newOffice.address} onChange={e => setNewOffice({ ...newOffice, address: e.target.value })} placeholder="Full address" />
            <label style={s.label}>Phone</label><input style={s.input} value={newOffice.phone} onChange={e => setNewOffice({ ...newOffice, phone: e.target.value })} placeholder="Office phone" />
            <label style={s.label}>Notes</label><textarea style={s.textarea} value={newOffice.notes} onChange={e => setNewOffice({ ...newOffice, notes: e.target.value })} placeholder="First impression, contact person, referral interest..." />
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={s.btnPrimary} onClick={addOffice}>Add Office</button>
              <button style={s.btnSecondary} onClick={() => setShowOfficeModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SUPPLY MODAL */}
      {showSupplyModal && (
        <div style={s.modal} onClick={e => e.target === e.currentTarget && setShowSupplyModal(false)}>
          <div style={s.modalBox}>
            <div style={s.modalTitle}>Add Supply Item</div>
            <label style={s.label}>Item Name</label><input style={s.input} value={newSupply.name} onChange={e => setNewSupply({ ...newSupply, name: e.target.value })} placeholder="e.g. Referral Pads" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={s.label}>Count</label><input style={s.input} type="number" value={newSupply.count} onChange={e => setNewSupply({ ...newSupply, count: parseInt(e.target.value) || 0 })} /></div>
              <div><label style={s.label}>Low Alert At</label><input style={s.input} type="number" value={newSupply.low} onChange={e => setNewSupply({ ...newSupply, low: parseInt(e.target.value) || 5 })} /></div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={s.btnPrimary} onClick={addSupply}>Add Item</button>
              <button style={s.btnSecondary} onClick={() => setShowSupplyModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}`}</style>
    </div>
  );
}
