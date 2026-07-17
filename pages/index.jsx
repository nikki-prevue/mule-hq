import { useState, useEffect, useRef } from 'react';

// ─── DESIGN TOKENS ───────────────────────────────────────────────
const T = {
  bg:      '#F5EFE6',
  card:    '#FDF9F4',
  card2:   '#EDE5D8',
  border:  '#D8CCBA',
  choc:    '#2C1A0E',
  choc2:   '#4A3020',
  choc3:   '#7A6050',
  gold:    '#A07830',
  goldBg:  'rgba(160,120,48,0.1)',
  sage:    '#3A7050',
  sageBg:  'rgba(58,112,80,0.1)',
  hot:     '#B84830',
  hotBg:   'rgba(184,72,48,0.1)',
};

// ─── SHARED STYLES ───────────────────────────────────────────────
const s = {
  page:     { fontFamily:"'DM Sans',sans-serif", background:T.bg, color:T.choc, minHeight:'100vh' },
  topbar:   { background:T.card, borderBottom:`1.5px solid ${T.border}`, padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 },
  logo:     { fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:T.choc, letterSpacing:'0.04em' },
  timebar:  { background:T.card2, borderBottom:`1px solid ${T.border}`, padding:'8px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' },
  content:  { padding:'16px 16px 100px', maxWidth:900, margin:'0 auto' },
  card:     { background:T.card, border:`1.5px solid ${T.border}`, borderRadius:16, padding:16, marginBottom:14, boxShadow:'0 2px 8px rgba(44,26,14,0.06)' },
  cheader:  { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${T.border}` },
  clabel:   { fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:T.choc3 },
  caction:  { fontSize:12, fontWeight:700, color:T.gold, cursor:'pointer' },
  input:    { background:T.card2, border:`1.5px solid ${T.border}`, borderRadius:10, color:T.choc, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:500, padding:'10px 14px', outline:'none', width:'100%', marginBottom:12 },
  textarea: { background:T.card2, border:`1.5px solid ${T.border}`, borderRadius:10, color:T.choc, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:500, padding:'10px 14px', outline:'none', width:'100%', marginBottom:12, resize:'vertical', minHeight:90 },
  select:   { background:T.card2, border:`1.5px solid ${T.border}`, borderRadius:10, color:T.choc, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:500, padding:'10px 14px', outline:'none', width:'100%', marginBottom:12 },
  label:    { fontSize:11, fontWeight:700, letterSpacing:'0.08em', color:T.choc3, marginBottom:6, display:'block', textTransform:'uppercase' },
  btnPrimary: { background:T.gold, color:'white', border:'none', borderRadius:10, padding:'10px 20px', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, cursor:'pointer', letterSpacing:'0.04em' },
  btnSecondary: { background:T.card2, color:T.choc, border:`1.5px solid ${T.border}`, borderRadius:10, padding:'10px 20px', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:'pointer' },
  btnSm:    { padding:'6px 12px', fontSize:11 },
  btnDanger: { background:T.hotBg, color:T.hot, border:`1.5px solid rgba(184,72,48,0.2)`, borderRadius:10, padding:'6px 12px', fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, cursor:'pointer' },
  modal:    { position:'fixed', inset:0, background:'rgba(44,26,14,0.5)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(3px)', padding:16 },
  modalBox: { background:T.card, border:`1.5px solid ${T.border}`, borderRadius:20, padding:24, width:'100%', maxWidth:560, maxHeight:'88vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(44,26,14,0.2)' },
  modalTitle: { fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:T.choc, marginBottom:16 },
  divider:  { height:1, background:`linear-gradient(90deg,transparent,${T.border},transparent)`, margin:'12px 0' },
  badge:    (c,bg) => ({ fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:20, textTransform:'uppercase', letterSpacing:'0.06em', display:'inline-block', color:c, background:bg }),
  sectionTitle: { fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:T.choc, marginBottom:20 },
};

// ─── TABS ────────────────────────────────────────────────────────
const TABS = ['command','offices','field','vault','reports'];
const TAB_LABELS = ['Command','Offices','Field','Vault','Reports'];
const TAB_ICONS = ['⌂','◎','✦','⊟','≡'];

export default function MuleHQ() {
  const [tab, setTab] = useState('command');
  const [offices, setOffices] = useState([]);
  const [visits, setVisits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [lunches, setLunches] = useState([]);
  const [route, setRoute] = useState([]);
  const [briefing, setBriefing] = useState('Loading your morning briefing...');
  const [time, setTime] = useState('');
  const [phase, setPhase] = useState('');
  const [dateStr, setDateStr] = useState('');

  // MODALS
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [taskNoteModal, setTaskNoteModal] = useState(null);
  const [taskNoteText, setTaskNoteText] = useState('');
  const [editTaskModal, setEditTaskModal] = useState(null);
  const [showAddOffice, setShowAddOffice] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddLunch, setShowAddLunch] = useState(false);
  const [editLunch, setEditLunch] = useState(null);
  const [newOffice, setNewOffice] = useState({name:'',doctor:'',city:'Flower Mound',tier:'warm',address:'',phone:'',email:'',website:'',contact:'',notes:''});
  const [newTask, setNewTask] = useState({text:'',priority:'today'});
  const [newLunch, setNewLunch] = useState({office:'',doctor:'',contact:'',status:'To Schedule',restaurant:'',date:'',notes:'',staffCount:''});

  // FIELD CHAT
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // OFFICE FILTERS
  const [officeSearch, setOfficeSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  // ROUTE
  const [routeSearch, setRouteSearch] = useState('');
  const [showRouteSearch, setShowRouteSearch] = useState(false);
  const [smartPlan, setSmartPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [smartPlanQueue, setSmartPlanQueue] = useState([]);
  const [smartPlanSearch, setSmartPlanSearch] = useState('');
  const [comingDue, setComingDue] = useState([]);

  // REPORTS
  const [eodDraft, setEodDraft] = useState('');
  const [rlDraft, setRlDraft] = useState('');
  const [excelDraft, setExcelDraft] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [scratchNotes, setScratchNotes] = useState('');

  // QUICK NOTE
  const [quickNoteOffice, setQuickNoteOffice] = useState('');
  const [quickNoteType, setQuickNoteType] = useState('Call');
  const [quickNoteText, setQuickNoteText] = useState('');
  const [quickNoteSaving, setQuickNoteSaving] = useState(false);

  useEffect(() => {
    loadAll();
    const t = setInterval(tick, 1000);
    tick();
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  function tick() {
    const n = new Date();
    setTime(n.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    setDateStr(n.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    const h = n.getHours() + n.getMinutes() / 60;
    setPhase(h < 8 ? 'Pre-Day' : h < 9 ? 'Morning Prep' : h < 15 ? 'Field Hours' : h < 16 ? 'EOD Window' : 'Wrap Up');
  }

  async function loadAll() {
    try {
      const [o, v, t, sp, lu, ro] = await Promise.all([
        fetch('/api/offices').then(r => r.json()),
        fetch('/api/visits').then(r => r.json()),
        fetch('/api/tasks').then(r => r.json()),
        fetch('/api/supplies').then(r => r.json()),
        fetch('/api/lunches').then(r => r.json()),
        fetch('/api/routes').then(r => r.json()),
      ]);
      const offs = Array.isArray(o) ? o : [];
      const vis = Array.isArray(v) ? v : [];
      const tks = Array.isArray(t) ? t : [];
      const sups = Array.isArray(sp) ? sp : [];
      const lun = Array.isArray(lu) ? lu : [];
      const rt = Array.isArray(ro) ? ro : [];
      setOffices(offs);
      setVisits(vis);
      setTasks(tks);
      setSupplies(sups);
      setLunches(lun);
      if (rt.length > 0) setRoute(rt);
      generateBriefing(offs, tks);
    } catch (e) { console.error(e); }
  }

  async function generateBriefing(offs, tks) {
    try {
      const now = Date.now();
      const due = (offs || offices).filter(o => o.lastVisit && Math.floor((now - new Date(o.lastVisit)) / 864e5) >= 25).length;
      const urgent = (tks || tasks).filter(t => !t.done && t.priority === 'urgent').length;
      const r = await fetch('/api/briefing', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotCount: (offs || offices).filter(o => o.tier === 'hot').length, overdueCount: due, urgentTasks: urgent, isFriday: new Date().getDay() === 5 })
      });
      const d = await r.json();
      setBriefing(d.briefing || 'Good morning, Nikki. Ready for the field.');
    } catch { setBriefing(`Good morning, Nikki. Today is ${dateStr}.`); }
  }

  async function saveRoute(newRoute) {
    try {
      await fetch('/api/routes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stops: newRoute }) });
    } catch (e) { console.error(e); }
  }

  function updateRoute(newRoute) {
    setRoute(newRoute);
    saveRoute(newRoute);
  }

  // ── TASKS ──
  async function addTask() {
    if (!newTask.text.trim()) return;
    const ts = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newTask, timestamp: ts }) });
    setNewTask({ text: '', priority: 'today' });
    setShowAddTask(false);
    await loadAll();
  }

  async function toggleTask(id, done) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !done } : t));
    await fetch('/api/tasks', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, done: !done }) });
  }

  async function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
    await fetch('/api/tasks', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
  }

  async function saveTaskNote() {
    if (!taskNoteModal || !taskNoteText.trim()) return;
    const ts = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    const noteEntry = `[${ts}] ${taskNoteText.trim()}`;
    const updatedNotes = taskNoteModal.notes ? taskNoteModal.notes + '\n' + noteEntry : noteEntry;
    await fetch('/api/tasks', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: taskNoteModal.id, notes: updatedNotes }) });
    setTaskNoteText('');
    setTaskNoteModal(null);
    await loadAll();
  }

  async function saveTaskEdit() {
    if (!editTaskModal) return;
    await fetch('/api/tasks', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editTaskModal.id, text: editTaskModal.text, priority: editTaskModal.priority }) });
    setEditTaskModal(null);
    await loadAll();
  }

  // ── OFFICES ──
  async function addOffice() {
    if (!newOffice.name) return;
    await fetch('/api/offices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newOffice) });
    setShowAddOffice(false);
    setNewOffice({ name: '', doctor: '', city: 'Flower Mound', tier: 'warm', address: '', phone: '', email: '', website: '', contact: '', notes: '' });
    await loadAll();
  }

  async function updateOfficeField(id, field, value) {
    await fetch('/api/offices', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, [field]: value }) });
    await loadAll();
  }

  async function deleteOffice(id) {
    if (!confirm('Remove this office?')) return;
    await fetch('/api/offices', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setSelectedOffice(null);
    await loadAll();
  }

  // ── VISITS ──
  async function deleteVisit(id) {
    if (!confirm('Remove this visit?')) return;
    await fetch('/api/visits', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setSelectedVisit(null);
    await loadAll();
  }

  // ── LUNCHES ──
  async function addLunch() {
    if (!newLunch.office) return;
    await fetch('/api/lunches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newLunch) });
    setShowAddLunch(false);
    setNewLunch({ office: '', doctor: '', contact: '', status: 'To Schedule', restaurant: '', date: '', notes: '', staffCount: '' });
    await loadAll();
  }

  async function updateLunch(id, updates) {
    await fetch('/api/lunches', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...updates }) });
    await loadAll();
  }

  async function deleteLunch(id) {
    if (!confirm('Remove this lunch?')) return;
    await fetch('/api/lunches', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setEditLunch(null);
    await loadAll();
  }

  // ── SUPPLIES ──
  async function adjSupply(id, count, delta) {
    const newCount = Math.max(0, count + delta);
    setSupplies(prev => prev.map(s => s.id === id ? { ...s, count: newCount } : s));
    await fetch('/api/supplies', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, count: newCount }) });
  }

  // ── QUICK NOTE ──
  async function saveQuickNote() {
    if (!quickNoteOffice || !quickNoteText.trim()) return;
    setQuickNoteSaving(true);
    const officeRecord = offices.find(o => o.name === quickNoteOffice);
    const ts = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    const noteEntry = `[${quickNoteType} — ${ts}] ${quickNoteText.trim()}`;
    try {
      await fetch('/api/visits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ office: quickNoteOffice, doctor: officeRecord?.doctor || '', contact: '', gift: '', notes: noteEntry, nextAction: '', tier: officeRecord?.tier || 'warm', date: new Date().toISOString().split('T')[0] }) });
      const updatedNotes = officeRecord?.notes ? officeRecord.notes + ' | ' + noteEntry : noteEntry;
      await fetch('/api/offices', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: officeRecord?.id, notes: updatedNotes }) });
      setQuickNoteOffice(''); setQuickNoteText(''); setQuickNoteType('Call');
      await loadAll();
    } catch (e) { console.error(e); }
    setQuickNoteSaving(false);
  }

  // ── FIELD CHAT ──
  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg, ts: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) }]);
    setChatLoading(true);

    try {
      const context = `You are MULE HQ Field Assistant for Nikki Williams, Provider Relations Coordinator at ROOT Periodontal & Implant Center covering Flower Mound, Highland Village, and Lewisville TX territory.

TERRITORY DATA:
- ${offices.length} offices in territory
- Hot offices: ${offices.filter(o => o.tier === 'hot').map(o => o.name).join(', ')}
- Recent visits: ${visits.slice(0, 5).map(v => v.office + ' on ' + v.date).join(', ')}
- Urgent tasks: ${tasks.filter(t => !t.done && t.priority === 'urgent').map(t => t.text).join(', ')}
- Lunches pending: ${lunches.filter(l => l.status === 'Ordered' || l.status === 'Pending').map(l => l.office + ' - ' + l.restaurant).join(', ')}
- Supplies low: ${supplies.filter(s => s.count <= s.low_alert).map(s => s.name).join(', ')}
- Today's route: ${route.map((r, i) => (i + 1) + '. ' + r.name).join(', ')}

You help Nikki plan her day, log field visits, generate EOD emails, create Referral Lab notes, and manage her territory. Be concise, direct, and field-focused. When she mentions a visit, extract key info and confirm what you captured. When she says Ready for EOD, generate a professional email in her exact template format.`;

      const history = chatMessages.slice(-10).map(m => ({ role: m.role, content: m.content }));

      const r = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...history, { role: 'user', content: userMsg }], context })
      });
      const d = await r.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: d.response || 'Something went wrong.', ts: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Try again.', ts: '' }]);
    }
    setChatLoading(false);
  }

  // ── REPORTS ──
  async function generateReports() {
    if (!scratchNotes.trim()) { alert('Add your scratch notes first.'); return; }
    setReportLoading(true);
    try {
      const r = await fetch('/api/reports', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: scratchNotes, date: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }), territory: 'Flower Mound / Lewisville' })
      });
      const d = await r.json();
      setEodDraft(d.eod || '');
      setRlDraft(d.rl || '');
      setExcelDraft(d.excel || '');
    } catch (e) { console.error(e); }
    setReportLoading(false);
  }

  // ── SMART PLAN ──
  async function generateSmartPlan() {
    setPlanLoading(true);
    try {
      const now = Date.now();
      const dow = new Date().getDay();
      if (dow === 5) { setSmartPlan([]); setSmartPlanQueue([]); setComingDue([]); setPlanLoading(false); return; }
      const BLOCKED = ['irving kids dentist', 'shine and sparkle dentistry'];
      const ON_HOLD = ['glorious smiles', 'baylor scott'];
      const refPadsInStock = supplies.some(s => s.name.toLowerCase().includes('referral') && s.count > 0);
      const cardsInStock = supplies.some(s => s.name.toLowerCase().includes('card') && s.count > 0);
      const pendingTaskText = tasks.filter(t => !t.done).map(t => t.text.toLowerCase());

      const eligible = offices.filter(o => {
        const n = o.name.toLowerCase();
        if (BLOCKED.some(b => n.includes(b))) return false;
        if (ON_HOLD.some(h => n.includes(h))) return false;
        if (o.status === 'Do Not Target' || o.status === 'On Hold - Pending Info') return false;
        return true;
      }).map(o => {
        const daysSince = o.lastVisit ? Math.floor((now - new Date(o.lastVisit)) / 864e5) : 90;
        const neverVisited = !o.lastVisit;
        const nextLower = (o.nextAction || '').toLowerCase();
        const needsRefPads = nextLower.includes('referral pad') || nextLower.includes('ref pad') || nextLower.includes('owed');
        const needsCards = nextLower.includes('card') && nextLower.includes('drop');
        const dropBackReady = (needsRefPads && refPadsInStock) || (needsCards && cardsInStock);
        const hasExplicitTask = pendingTaskText.some(t => t.includes(o.name.toLowerCase().slice(0, 10)) && (t.includes('call') || t.includes('confirm') || t.includes('lock')));
        const hasOverride = dropBackReady || hasExplicitTask;
        const tier1 = neverVisited || daysSince >= 25 || hasOverride;
        const tier2 = daysSince >= 18 && daysSince < 25;
        if (!tier1 && !tier2) return null;
        let score = 0;
        if (daysSince >= 30) score += 50;
        else if (daysSince >= 25) score += 35;
        else if (neverVisited) score += 40;
        else if (hasOverride) score += 35;
        else if (tier2) score += 10;
        if (o.tier === 'hot') score += 25;
        else if (o.tier === 'warm') score += 10;
        if (o.topReferrer) score += 20;
        if ((o.referralVolume || 0) > 20) score += 15;
        if (hasOverride) score += 15;
        return { ...o, score, daysSince, neverVisited, hasOverride, dropBackReady, hasExplicitTask, tier1, tier2 };
      }).filter(Boolean).sort((a, b) => b.score - a.score);

      const fm = eligible.filter(o => o.city === 'Flower Mound');
      const hv = eligible.filter(o => o.city === 'Highland Village');
      const lv = eligible.filter(o => o.city === 'Lewisville');
      const ot = eligible.filter(o => o.city === 'Other');
      let clustered = dow === 2 ? [...lv, ...hv, ...fm, ...ot] : [...fm, ...hv, ...lv, ...ot];
      const seen = new Set();
      const deduped = clustered.filter(o => { if (seen.has(o.id)) return false; seen.add(o.id); return true; });
      const suggested = deduped.slice(0, 7).map((o, i) => ({ ...o, order: i + 1, done: false, stopNote: '' }));
      const selectedIds = new Set(suggested.map(o => o.id));
      const backup = deduped.filter(o => !selectedIds.has(o.id)).slice(0, 8).map((o, i) => ({ ...o, order: 8 + i, done: false, stopNote: '' }));
      const comingDueList = offices.filter(o => {
        if (!o.lastVisit) return false;
        const n = o.name.toLowerCase();
        if (BLOCKED.some(b => n.includes(b)) || ON_HOLD.some(h => n.includes(h))) return false;
        if (o.status === 'Do Not Target' || o.status === 'On Hold - Pending Info') return false;
        const d = Math.floor((now - new Date(o.lastVisit)) / 864e5);
        return d >= 15 && d < 25;
      }).map(o => ({ ...o, daysSince: Math.floor((now - new Date(o.lastVisit)) / 864e5) })).sort((a, b) => b.daysSince - a.daysSince).slice(0, 5);
      setSmartPlan(suggested);
      setSmartPlanQueue(backup);
      setComingDue(comingDueList);
    } catch (e) { console.error(e); }
    setPlanLoading(false);
  }

  function acceptSmartPlan() {
    if (smartPlan && smartPlan.length > 0) {
      updateRoute(smartPlan.map((o, i) => ({ ...o, order: i + 1, done: false })));
      setSmartPlan(null); setSmartPlanQueue([]);
    }
  }

  function addToSmartPlan(office) {
    if (smartPlan && !smartPlan.find(s => s.id === office.id)) {
      setSmartPlan([...smartPlan, { ...office, order: smartPlan.length + 1, done: false, stopNote: '' }]);
      setSmartPlanSearch('');
    }
  }

  // ── HELPERS ──
  const daysAgo = (d) => { if (!d) return 'Never'; const n = Math.floor((Date.now() - new Date(d)) / 864e5); return n === 0 ? 'Today' : n === 1 ? 'Yesterday' : `${n}d ago`; };
  const isOverdue = (d) => !d || (Date.now() - new Date(d)) > 25 * 864e5;
  const todayVisits = visits.filter(v => new Date(v.date).toLocaleDateString() === new Date().toLocaleDateString());
  const urgentCount = tasks.filter(t => !t.done && t.priority === 'urgent').length;
  const dueThisWeek = offices.filter(o => { if (!o.lastVisit) return false; const d = Math.floor((Date.now() - new Date(o.lastVisit)) / 864e5); return d >= 18 && d < 32; }).length;
  const lunchPending = lunches.filter(l => l.status === 'Ordered' || l.status === 'Pending').length;
  const filteredOffices = offices.filter(o => {
    const ms = officeSearch.toLowerCase();
    return (!ms || o.name.toLowerCase().includes(ms) || (o.doctor || '').toLowerCase().includes(ms) || (o.contact || '').toLowerCase().includes(ms)) && (!tierFilter || o.tier === tierFilter) && (!cityFilter || o.city === cityFilter);
  });

  const BLOCKED_NAMES = ['irving kids dentist', 'shine and sparkle dentistry'];
  const ON_HOLD_NAMES = ['glorious smiles', 'baylor scott'];

  // ════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════
  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>

      {/* TOPBAR */}
      <div style={s.topbar}>
        <div style={s.logo}>MULE <span style={{color:T.gold}}>HQ</span></div>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{display:'flex',alignItems:'center',gap:5,fontSize:11,fontWeight:600,color:T.choc3}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:T.sage}}></div>
            Synced
          </div>
          <div style={{fontSize:11,fontWeight:600,color:T.choc3,display:'none'}} className="desktop-date">{dateStr}</div>
        </div>
      </div>

      {/* TIME BAR */}
      <div style={s.timebar}>
        <div style={{fontSize:13,fontWeight:600,color:T.choc2}}>{time} · {dateStr}</div>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:T.gold,background:T.goldBg,padding:'3px 10px',borderRadius:20}}>{phase}</div>
      </div>

      {/* CONTENT */}
      <div style={s.content}>

        {/* ══ COMMAND ══════════════════════════════════════════════ */}
        {tab === 'command' && (
          <div>
            {/* ALERT */}
            {urgentCount > 0 && (
              <div style={{background:T.hotBg,border:`1.5px solid rgba(184,72,48,0.2)`,borderRadius:12,padding:'12px 14px',marginBottom:14,display:'flex',alignItems:'flex-start',gap:9}}>
                <div style={{width:7,height:7,borderRadius:'50%',background:T.hot,flexShrink:0,marginTop:4}}></div>
                <div style={{fontSize:13,fontWeight:600,color:T.choc}}>{urgentCount} urgent task{urgentCount>1?'s':''} need attention today.</div>
              </div>
            )}

            {/* BRIEFING */}
            <div style={s.card}>
              <div style={{...s.cheader,marginBottom:10,paddingBottom:8}}>
                <div style={s.clabel}>Morning Briefing</div>
                <span style={s.caction} onClick={() => generateBriefing()}>Refresh</span>
              </div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:500,color:T.choc,lineHeight:1.8}}>{briefing}</div>
            </div>

            {/* STATS */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
              {[
                {n:todayVisits.length, l:'Visits Today', accent:false},
                {n:urgentCount, l:'Urgent Tasks', accent:urgentCount>0},
                {n:dueThisWeek, l:'Due This Week', accent:false},
                {n:lunchPending, l:'Lunches Pending', accent:false},
              ].map((st,i) => (
                <div key={i} style={s.card}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:700,color:st.accent?T.hot:T.choc,lineHeight:1,marginBottom:4}}>{st.n}</div>
                  <div style={{fontSize:10,fontWeight:700,color:T.choc3,letterSpacing:'0.06em',textTransform:'uppercase'}}>{st.l}</div>
                </div>
              ))}
            </div>

            {/* TODAY'S ROUTE */}
            <div style={s.card}>
              <div style={s.cheader}>
                <div style={s.clabel}>Today's Route</div>
                <div style={{display:'flex',gap:10,alignItems:'center'}}>
                  {route.length > 0 && (
                    <span style={s.caction} onClick={() => {
                      const stops = route.sort((a,b)=>a.order-b.order).map(s => encodeURIComponent((s.address||s.name)+' '+(s.city||'')+' TX'));
                      const origin = stops[0]; const dest = stops[stops.length-1];
                      const wpts = stops.slice(1,-1).join('|');
                      window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${wpts?'&waypoints='+wpts:''}&travelmode=driving`,'_blank');
                    }}>Google Maps ↗</span>
                  )}
                  <span style={s.caction} onClick={generateSmartPlan}>{planLoading?'Planning...':'Smart Plan'}</span>
                  <span style={s.caction} onClick={() => setShowRouteSearch(!showRouteSearch)}>+ Add</span>
                </div>
              </div>

              {/* SMART PLAN */}
              {smartPlan !== null && (
                <div style={{background:T.sageBg,border:`1.5px solid rgba(58,112,80,0.2)`,borderRadius:12,padding:14,marginBottom:12}}>
                  {smartPlan.length === 0 ? (
                    <div style={{fontSize:13,fontWeight:600,color:T.sage,textAlign:'center'}}>Friday Admin Day — No field visits suggested.</div>
                  ) : (
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                        <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:T.sage}}>Smart Plan — {smartPlan.length} stops</div>
                        <div style={{display:'flex',gap:8}}>
                          <button style={{...s.btnPrimary,...s.btnSm}} onClick={acceptSmartPlan}>Accept Route</button>
                          <button style={{...s.btnSecondary,...s.btnSm}} onClick={() => {setSmartPlan(null);setSmartPlanQueue([]);setComingDue([]);}}>Dismiss</button>
                        </div>
                      </div>
                      {smartPlan.map((o,i) => (
                        <div key={o.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<smartPlan.length-1?`1px solid rgba(58,112,80,0.15)`:'none'}}>
                          <div style={{width:24,height:24,borderRadius:'50%',background:o.hasOverride?T.gold:T.sage,color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,flexShrink:0}}>{i+1}</div>
                          <div onClick={() => setSelectedOffice(offices.find(off => off.id===o.id)||o)} style={{flex:1,minWidth:0,cursor:'pointer'}}>
                            <div style={{fontSize:12,fontWeight:700,color:T.choc,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{o.name} <span style={{fontSize:10,color:T.gold}}>▶</span></div>
                            <div style={{fontSize:10,fontWeight:500,color:T.choc3}}>{o.city} · {o.neverVisited?'Never visited':o.daysSince+'d ago'}</div>
                          </div>
                          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:2}}>
                            <span style={s.badge(o.tier==='hot'?T.hot:T.gold, o.tier==='hot'?T.hotBg:T.goldBg)}>{o.tier}</span>
                            {o.daysSince>=30&&<span style={{fontSize:9,fontWeight:700,color:'#E85C5C'}}>OVERDUE</span>}
                            <span onClick={() => {const next=smartPlanQueue[0];const updated=smartPlan.filter((_,si)=>si!==i).map((s,si)=>({...s,order:si+1}));if(next){setSmartPlan([...updated,{...next,order:updated.length+1}]);setSmartPlanQueue(smartPlanQueue.slice(1));}else{setSmartPlan(updated);}}} style={{cursor:'pointer',color:T.choc3,fontSize:14,lineHeight:1,marginTop:2}}>✕</span>
                          </div>
                        </div>
                      ))}
                      {/* MANUAL ADD */}
                      <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid rgba(58,112,80,0.2)`}}>
                        <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:T.sage,marginBottom:8}}>Add Another Office</div>
                        <div style={{position:'relative'}}>
                          <input style={{...s.input,marginBottom:0,fontSize:12}} value={smartPlanSearch} onChange={e=>setSmartPlanSearch(e.target.value)} placeholder="Search offices..."/>
                          {smartPlanSearch.length>1&&(
                            <div style={{position:'absolute',top:'100%',left:0,right:0,background:T.card,border:`1.5px solid ${T.border}`,borderRadius:10,zIndex:60,maxHeight:160,overflowY:'auto',marginTop:4,boxShadow:'0 4px 12px rgba(44,26,14,0.1)'}}>
                              {offices.filter(o=>o.status!=='Do Not Target'&&!BLOCKED_NAMES.some(b=>o.name.toLowerCase().includes(b))&&!smartPlan.find(s=>s.id===o.id)&&o.name.toLowerCase().includes(smartPlanSearch.toLowerCase())).slice(0,5).map(o=>(
                                <div key={o.id} onClick={()=>addToSmartPlan(o)} style={{padding:'9px 14px',cursor:'pointer',borderBottom:`1px solid ${T.border}`,fontSize:13,fontWeight:500}} onMouseEnter={e=>e.currentTarget.style.background=T.card2} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                                  <div style={{fontWeight:700}}>{o.name}</div>
                                  <div style={{fontSize:10,color:T.choc3}}>{o.city} · {daysAgo(o.lastVisit)}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* COMING DUE */}
                      {comingDue.length>0&&(
                        <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid rgba(58,112,80,0.2)`}}>
                          <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:T.gold,marginBottom:8}}>Coming Due This Week</div>
                          {comingDue.map(o=>(
                            <div key={o.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 0',borderBottom:`1px solid ${T.border}`,fontSize:12}}>
                              <div><div style={{fontWeight:700,color:T.choc}}>{o.name}</div><div style={{fontSize:10,color:T.choc3}}>{o.city} · {o.daysSince}d ago</div></div>
                              <button style={{...s.btnSecondary,...s.btnSm}} onClick={()=>addToSmartPlan(o)}>+ Add</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ROUTE SEARCH */}
              {showRouteSearch&&(
                <div style={{marginBottom:12,position:'relative'}}>
                  <input style={{...s.input,marginBottom:0}} value={routeSearch} onChange={e=>setRouteSearch(e.target.value)} placeholder="Search offices to add to route..." autoFocus/>
                  {routeSearch.length>0&&(
                    <div style={{position:'absolute',top:'100%',left:0,right:0,background:T.card,border:`1.5px solid ${T.border}`,borderRadius:10,zIndex:50,maxHeight:200,overflowY:'auto',marginTop:4,boxShadow:'0 4px 12px rgba(44,26,14,0.1)'}}>
                      {offices.filter(o=>o.status!=='Do Not Target'&&!route.find(r=>r.name===o.name)&&(o.name.toLowerCase().includes(routeSearch.toLowerCase())||(o.city||'').toLowerCase().includes(routeSearch.toLowerCase()))).slice(0,6).map(o=>(
                        <div key={o.id} onClick={()=>{updateRoute([...route,{...o,order:route.length+1,done:false,stopNote:''}]);setRouteSearch('');setShowRouteSearch(false);}} style={{padding:'10px 14px',cursor:'pointer',borderBottom:`1px solid ${T.border}`,fontSize:13}} onMouseEnter={e=>e.currentTarget.style.background=T.card2} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <div style={{fontWeight:700}}>{o.name}</div>
                          <div style={{fontSize:11,color:T.choc3}}>{o.city} · {daysAgo(o.lastVisit)} · {o.tier}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STOPS */}
              {route.length===0 ? (
                <div style={{fontSize:13,fontWeight:500,color:T.choc3,textAlign:'center',padding:'16px 0'}}>No stops yet. Use Smart Plan or search above.</div>
              ) : (
                <div>
                  {route.sort((a,b)=>a.order-b.order).map((stop,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:i<route.length-1?`1px solid ${T.border}`:'none',opacity:stop.done?0.55:1}}>
                      <div style={{width:28,height:28,borderRadius:'50%',border:`2px solid ${stop.done?T.sage:T.gold}`,color:stop.done?T.sage:T.gold,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>{stop.done?'✓':stop.order}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700,color:stop.done?T.choc3:T.choc,textDecoration:stop.done?'line-through':'none',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{stop.name}</div>
                        <div style={{fontSize:11,fontWeight:500,color:T.choc3}}>{stop.city}{stop.address?' · '+stop.address:''}</div>
                      </div>
                      <div style={{display:'flex',gap:3,flexShrink:0,alignItems:'center'}}>
                        <div style={{display:'flex',flexDirection:'column',gap:2}}>
                          <span style={{cursor:i===0?'default':'pointer',color:i===0?T.border:T.choc3,fontSize:11,lineHeight:1,userSelect:'none'}} onClick={()=>{if(i===0)return;const r=[...route];[r[i-1],r[i]]=[r[i],r[i-1]];updateRoute(r.map((s,idx)=>({...s,order:idx+1})));}}>▲</span>
                          <span style={{cursor:i===route.length-1?'default':'pointer',color:i===route.length-1?T.border:T.choc3,fontSize:11,lineHeight:1,userSelect:'none'}} onClick={()=>{if(i===route.length-1)return;const r=[...route];[r[i],r[i+1]]=[r[i+1],r[i]];updateRoute(r.map((s,idx)=>({...s,order:idx+1})));}}>▼</span>
                        </div>
                        {stop.address&&<button style={{...s.btnSecondary,...s.btnSm}} onClick={()=>window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address+' '+stop.city+' TX')}`,'_blank')}>Nav</button>}
                        <button style={{...s.btnSecondary,...s.btnSm,background:stop.done?T.sageBg:undefined,color:stop.done?T.sage:undefined}} onClick={()=>updateRoute(route.map((r,ri)=>ri===i?{...r,done:!r.done}:r))}>{stop.done?'Undo':'Done'}</button>
                        <span style={{cursor:'pointer',color:T.choc3,fontSize:18,lineHeight:1}} onClick={()=>updateRoute(route.filter((_,ri)=>ri!==i))}>×</span>
                      </div>
                    </div>
                  ))}
                  <div style={{marginTop:12,padding:'10px 14px',background:T.card2,borderRadius:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{fontSize:12,fontWeight:600,color:T.choc3}}>{route.filter(s=>s.done).length} of {route.length} completed</div>
                    <button style={s.btnPrimary} onClick={()=>{
                      const stops=route.sort((a,b)=>a.order-b.order).map(s=>encodeURIComponent((s.address||s.name)+' '+(s.city||'')+' TX'));
                      const origin=stops[0];const dest=stops[stops.length-1];const wpts=stops.slice(1,-1).join('|');
                      window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${wpts?'&waypoints='+wpts:''}&travelmode=driving`,'_blank');
                    }}>Open Full Route</button>
                  </div>
                </div>
              )}
            </div>

            {/* TASKS */}
            <div style={s.card}>
              <div style={s.cheader}>
                <div style={s.clabel}>Tasks</div>
                <span style={s.caction} onClick={()=>setShowAddTask(true)}>+ Add Task</span>
              </div>
              {tasks.slice(0,12).map(t=>(
                <div key={t.id} style={{padding:'10px 0',borderBottom:`1px solid ${T.border}`}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
                    <div onClick={()=>toggleTask(t.id,t.done)} style={{width:19,height:19,border:`2px solid ${t.done?T.sage:T.border}`,borderRadius:5,cursor:'pointer',flexShrink:0,marginTop:1,background:t.done?T.sage:T.card2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'white',fontWeight:700}}>{t.done?'✓':''}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:t.done?400:600,color:t.done?T.choc3:T.choc,textDecoration:t.done?'line-through':'none',lineHeight:1.4}}>{t.text}</div>
                      {t.timestamp&&<div style={{fontSize:10,fontWeight:500,color:T.choc3,marginTop:3}}>Added {t.timestamp}</div>}
                      {t.notes&&t.notes.split('\n').map((note,ni)=>(
                        <div key={ni} style={{fontSize:11,fontWeight:500,color:T.choc3,marginTop:4,paddingLeft:10,borderLeft:`2px solid ${T.border}`,lineHeight:1.5}}>{note}</div>
                      ))}
                    </div>
                    <span style={s.badge(t.priority==='urgent'?T.hot:t.priority==='week'?T.choc3:T.gold, t.priority==='urgent'?T.hotBg:t.priority==='week'?'rgba(122,96,80,0.1)':T.goldBg)}>{t.priority}</span>
                    <div style={{display:'flex',gap:4,flexShrink:0}}>
                      <span style={{cursor:'pointer',fontSize:11,fontWeight:700,color:T.gold,padding:'2px 6px',borderRadius:4,border:`1px solid ${T.border}`}} onClick={()=>{setTaskNoteModal(t);setTaskNoteText('');}}>+ Note</span>
                      <span style={{cursor:'pointer',fontSize:11,fontWeight:700,color:T.choc3,padding:'2px 6px',borderRadius:4,border:`1px solid ${T.border}`}} onClick={()=>setEditTaskModal({...t})}>Edit</span>
                      <span style={{cursor:'pointer',color:T.choc3,fontSize:17,lineHeight:1}} onClick={()=>deleteTask(t.id)}>×</span>
                    </div>
                  </div>
                </div>
              ))}
              {tasks.filter(t=>t.done).length>0&&<div style={{fontSize:11,fontWeight:600,color:T.choc3,textAlign:'center',padding:'8px 0'}}>{tasks.filter(t=>t.done).length} completed</div>}
            </div>
          </div>
        )}

        {/* ══ OFFICES ══════════════════════════════════════════════ */}
        {tab === 'offices' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div style={s.sectionTitle}>Offices</div>
              <button style={s.btnPrimary} onClick={()=>setShowAddOffice(true)}>+ Add Office</button>
            </div>
            <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
              <input style={{...s.input,marginBottom:0,flex:1,minWidth:180}} placeholder="Search name, doctor, contact..." value={officeSearch} onChange={e=>setOfficeSearch(e.target.value)}/>
              <select style={{...s.select,marginBottom:0,width:120}} value={tierFilter} onChange={e=>setTierFilter(e.target.value)}>
                <option value="">All Tiers</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
              <select style={{...s.select,marginBottom:0,width:150}} value={cityFilter} onChange={e=>setCityFilter(e.target.value)}>
                <option value="">All Cities</option>
                <option value="Flower Mound">Flower Mound</option>
                <option value="Highland Village">Highland Village</option>
                <option value="Lewisville">Lewisville</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={{fontSize:11,fontWeight:600,color:T.choc3,marginBottom:12}}>{filteredOffices.length} offices</div>

            {['Flower Mound','Highland Village','Lewisville','Other'].map(city => {
              const cityOffices = filteredOffices.filter(o=>o.city===city).sort((a,b)=>{
                const dnt = o => o.status==='Do Not Target';
                if(dnt(a)&&!dnt(b))return 1; if(!dnt(a)&&dnt(b))return -1;
                if(a.tier==='hot'&&b.tier!=='hot')return -1; if(a.tier!=='hot'&&b.tier==='hot')return 1;
                if(isOverdue(a.lastVisit)&&!isOverdue(b.lastVisit))return -1; if(!isOverdue(a.lastVisit)&&isOverdue(b.lastVisit))return 1;
                return 0;
              });
              if(!cityOffices.length && cityFilter) return null;
              if(!cityOffices.length) return null;
              return (
                <div key={city} style={{marginBottom:24}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:T.choc}}>{city}</div>
                    <div style={{flex:1,height:1,background:`linear-gradient(90deg,${T.border},transparent)`}}></div>
                    <div style={{fontSize:11,fontWeight:600,color:T.choc3}}>{cityOffices.length} offices</div>
                  </div>
                  <div style={{background:T.card,border:`1.5px solid ${T.border}`,borderRadius:16,overflow:'hidden',boxShadow:'0 2px 8px rgba(44,26,14,0.06)'}}>
                    {/* TABLE HEADER */}
                    <div style={{display:'grid',gridTemplateColumns:'3fr 1.5fr 80px 100px',padding:'8px 16px',background:T.card2,borderBottom:`1px solid ${T.border}`,gap:8}}>
                      {['Office / Doctor','Contact','Tier','Last Touch'].map(h=>(
                        <div key={h} style={{fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:T.choc3}}>{h}</div>
                      ))}
                    </div>
                    {cityOffices.map((o,i)=>{
                      const od = isOverdue(o.lastVisit);
                      const dnt = o.status==='Do Not Target';
                      const isNew = o.status==='New - not visited';
                      const onHold = o.status==='On Hold - Pending Info';
                      return(
                        <div key={o.id} onClick={()=>!dnt&&setSelectedOffice(o)} style={{display:'grid',gridTemplateColumns:'3fr 1.5fr 80px 100px',padding:'12px 16px',background:i%2===0?T.card:T.card2,borderBottom:i<cityOffices.length-1?`1px solid ${T.border}`:'none',cursor:dnt?'default':'pointer',borderLeft:`3px solid ${dnt?T.border:o.tier==='hot'?T.hot:od?'#E85C5C':T.border}`,opacity:dnt?0.5:1,gap:8}} onMouseEnter={e=>{if(!dnt)e.currentTarget.style.background=T.goldBg}} onMouseLeave={e=>{e.currentTarget.style.background=i%2===0?T.card:T.card2}}>
                          <div>
                            <div style={{display:'flex',alignItems:'center',gap:5,flexWrap:'wrap'}}>
                              <span style={{fontSize:13,fontWeight:700,color:T.choc}}>{o.name}</span>
                              {o.topReferrer&&<span style={s.badge(T.gold,T.goldBg)}>Top</span>}
                              {isNew&&<span style={s.badge(T.sage,T.sageBg)}>New</span>}
                              {dnt&&<span style={s.badge(T.hot,T.hotBg)}>DNT</span>}
                              {onHold&&<span style={s.badge(T.choc3,'rgba(122,96,80,0.1)')}>Hold</span>}
                            </div>
                            {o.doctor&&<div style={{fontSize:11,fontWeight:500,color:T.choc3,marginTop:2}}>{o.doctor}</div>}
                          </div>
                          <div style={{fontSize:12,fontWeight:500,color:T.choc3,alignSelf:'center'}}>{o.contact||'—'}</div>
                          <div style={{alignSelf:'center'}}><span style={s.badge(o.tier==='hot'?T.hot:T.gold,o.tier==='hot'?T.hotBg:T.goldBg)}>{o.tier}</span></div>
                          <div style={{alignSelf:'center'}}>
                            <div style={{fontSize:12,fontWeight:700,color:od&&!dnt?'#E85C5C':T.sage}}>{!o.lastVisit?'Never':Math.floor((Date.now()-new Date(o.lastVisit))/864e5)+'d ago'}</div>
                            {o.referralVolume>0&&<div style={{fontSize:10,fontWeight:700,color:T.gold,marginTop:2}}>{o.referralVolume}/yr</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ FIELD ASSISTANT ══════════════════════════════════════ */}
        {tab === 'field' && (
          <div>
            <div style={s.sectionTitle}>Field Assistant</div>

            {/* QUICK NOTE */}
            <div style={s.card}>
              <div style={{...s.cheader,marginBottom:10,paddingBottom:8}}>
                <div style={s.clabel}>Quick Note — Any Interaction</div>
              </div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:8}}>
                <select style={{...s.select,marginBottom:0,flex:1,minWidth:140}} value={quickNoteOffice} onChange={e=>setQuickNoteOffice(e.target.value)}>
                  <option value="">Select office...</option>
                  {offices.filter(o=>o.status!=='Do Not Target').map(o=><option key={o.id} value={o.name}>{o.name}</option>)}
                </select>
                <select style={{...s.select,marginBottom:0,width:140}} value={quickNoteType} onChange={e=>setQuickNoteType(e.target.value)}>
                  <option value="Call">Phone Call</option>
                  <option value="Email">Email</option>
                  <option value="Text">Text</option>
                  <option value="Lunch Coord">Lunch Coord</option>
                  <option value="Dr. Patel Request">Dr. Patel Request</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{display:'flex',gap:8}}>
                <input style={{...s.input,marginBottom:0,flex:1}} value={quickNoteText} onChange={e=>setQuickNoteText(e.target.value)} placeholder="Note what happened — saves with timestamp..." onKeyDown={e=>e.key==='Enter'&&saveQuickNote()}/>
                <button style={{...s.btnPrimary,whiteSpace:'nowrap',opacity:quickNoteSaving?0.7:1}} onClick={saveQuickNote} disabled={quickNoteSaving}>{quickNoteSaving?'Saving...':'Save'}</button>
              </div>
            </div>

            {/* LIVE CHAT */}
            <div style={s.card}>
              <div style={{...s.cheader,marginBottom:0,paddingBottom:10}}>
                <div style={s.clabel}>Field Chat — Talk to your HQ</div>
                <span style={s.caction} onClick={()=>setChatMessages([])}>Clear</span>
              </div>

              {/* MESSAGES */}
              <div style={{minHeight:200,maxHeight:400,overflowY:'auto',padding:'12px 0'}}>
                {chatMessages.length===0&&(
                  <div style={{textAlign:'center',padding:'32px 16px'}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,color:T.choc,marginBottom:8}}>Your AI field companion is ready.</div>
                    <div style={{fontSize:13,fontWeight:500,color:T.choc3,lineHeight:1.7}}>
                      Try: <em>"What should my route be today?"</em><br/>
                      Or: <em>"Just left Ace Smile, met Christina, she wants to schedule L&L"</em><br/>
                      Or: <em>"Ready for EOD"</em>
                    </div>
                  </div>
                )}
                {chatMessages.map((m,i)=>(
                  <div key={i} style={{marginBottom:12,display:'flex',flexDirection:'column',alignItems:m.role==='user'?'flex-end':'flex-start'}}>
                    <div style={{maxWidth:'85%',background:m.role==='user'?T.gold:T.card2,color:m.role==='user'?'white':T.choc,borderRadius:m.role==='user'?'16px 16px 4px 16px':'16px 16px 16px 4px',padding:'10px 14px',fontSize:13,fontWeight:500,lineHeight:1.6,border:m.role==='assistant'?`1px solid ${T.border}`:'none'}}>
                      {m.content}
                    </div>
                    {m.ts&&<div style={{fontSize:10,fontWeight:500,color:T.choc3,marginTop:3,paddingLeft:4,paddingRight:4}}>{m.ts}</div>}
                  </div>
                ))}
                {chatLoading&&(
                  <div style={{display:'flex',alignItems:'flex-start',marginBottom:12}}>
                    <div style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:'16px 16px 16px 4px',padding:'10px 14px',fontSize:13,color:T.choc3}}>Thinking...</div>
                  </div>
                )}
                <div ref={chatEndRef}/>
              </div>

              {/* INPUT */}
              <div style={{borderTop:`1px solid ${T.border}`,paddingTop:12,display:'flex',gap:8}}>
                <textarea
                  style={{...s.textarea,marginBottom:0,flex:1,minHeight:44,resize:'none',fontSize:13}}
                  value={chatInput}
                  onChange={e=>setChatInput(e.target.value)}
                  placeholder="Type your notes or ask anything..."
                  rows={2}
                  onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}}}
                />
                <button style={{...s.btnPrimary,alignSelf:'flex-end',padding:'10px 16px'}} onClick={sendChat} disabled={chatLoading}>Send</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ VAULT ════════════════════════════════════════════════ */}
        {tab === 'vault' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div style={s.sectionTitle}>Visit Vault</div>
              <span style={{fontSize:12,fontWeight:600,color:T.choc3}}>{visits.length} total visits</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
              {[...visits].reverse().map(v=>(
                <div key={v.id} onClick={()=>setSelectedVisit(v)} style={{background:T.card,border:`1.5px solid ${T.border}`,borderRadius:14,padding:16,cursor:'pointer',boxShadow:'0 2px 6px rgba(44,26,14,0.05)'}} onMouseEnter={e=>e.currentTarget.style.borderColor=T.gold} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <div style={{fontWeight:700,fontSize:13,color:T.choc,flex:1,paddingRight:8}}>{v.office}</div>
                    <div style={{fontSize:10,fontWeight:600,color:T.choc3,fontFamily:'monospace',flexShrink:0}}>{new Date(v.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
                  </div>
                  {v.doctor&&<div style={{fontSize:11,fontWeight:500,color:T.choc3,marginBottom:4}}>{v.doctor}</div>}
                  {v.contact&&<div style={{fontSize:11,fontWeight:500,color:T.choc3,marginBottom:4}}>Spoke with: {v.contact}</div>}
                  {v.gift&&<div style={{fontSize:11,fontWeight:600,color:T.gold,marginBottom:4}}>Drop: {v.gift}</div>}
                  {v.notes&&<div style={{fontSize:12,fontWeight:500,color:T.choc3,lineHeight:1.5,marginTop:6,paddingTop:6,borderTop:`1px solid ${T.border}`}}>{v.notes.substring(0,100)}{v.notes.length>100?'...':''}</div>}
                  {v.nextAction&&<div style={{fontSize:11,fontWeight:700,color:T.sage,marginTop:6}}>Next: {v.nextAction}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ REPORTS ══════════════════════════════════════════════ */}
        {tab === 'reports' && (
          <div>
            <div style={s.sectionTitle}>Reports</div>

            {/* SCRATCH NOTES */}
            <div style={s.card}>
              <div style={{...s.cheader,marginBottom:10,paddingBottom:8}}>
                <div style={s.clabel}>Your Field Notes — Scratch Format OK</div>
              </div>
              <div style={{fontSize:12,fontWeight:500,color:T.choc3,marginBottom:10,lineHeight:1.6}}>Dump your notes exactly as you took them. Claude fixes the wording and generates all three reports at once.</div>
              <textarea
                style={{...s.textarea,minHeight:180,fontSize:13}}
                value={scratchNotes}
                onChange={e=>setScratchNotes(e.target.value)}
                placeholder="Milestones - met Leah, she said they need cards, met dr patel very nice, refers to dr mikhil mostly&#10;Divine - met illiani, gave dirty soda, online referrals&#10;Family Smiles - minnie excited, needs ref forms, bought jewelry from 9 yr old cancer fundraiser&#10;..."
              />
              <button style={{...s.btnPrimary,width:'100%',padding:'12px'}} onClick={generateReports} disabled={reportLoading}>
                {reportLoading ? 'Generating all reports...' : 'Generate EOD + Referral Lab + Excel Notes'}
              </button>
            </div>

            {/* EOD DRAFT */}
            {eodDraft && (
              <div style={s.card}>
                <div style={s.cheader}>
                  <div style={s.clabel}>EOD Email Draft</div>
                  <div style={{display:'flex',gap:10}}>
                    <span style={s.caction} onClick={()=>navigator.clipboard.writeText(eodDraft)}>Copy</span>
                    <span style={s.caction} onClick={()=>window.open('https://outlook.office.com/mail/new','_blank')}>Open Outlook</span>
                  </div>
                </div>
                <div style={{fontSize:13,fontWeight:500,color:T.choc,lineHeight:1.8,whiteSpace:'pre-wrap',background:T.card2,padding:16,borderRadius:10,border:`1px solid ${T.border}`}}>{eodDraft}</div>
              </div>
            )}

            {/* REFERRAL LAB NOTES */}
            {rlDraft && (
              <div style={s.card}>
                <div style={s.cheader}>
                  <div style={s.clabel}>Referral Lab Notes</div>
                  <span style={s.caction} onClick={()=>navigator.clipboard.writeText(rlDraft)}>Copy</span>
                </div>
                <div style={{fontSize:13,fontWeight:500,color:T.choc,lineHeight:1.9,whiteSpace:'pre-wrap',background:T.card2,padding:16,borderRadius:10,border:`1px solid ${T.border}`}}>{rlDraft}</div>
              </div>
            )}

            {/* EXCEL NOTES */}
            {excelDraft && (
              <div style={s.card}>
                <div style={s.cheader}>
                  <div style={s.clabel}>Excel / Simple Notes</div>
                  <span style={s.caction} onClick={()=>navigator.clipboard.writeText(excelDraft)}>Copy</span>
                </div>
                <div style={{fontSize:13,fontWeight:500,color:T.choc,lineHeight:1.9,whiteSpace:'pre-wrap',background:T.card2,padding:16,borderRadius:10,border:`1px solid ${T.border}`}}>{excelDraft}</div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ══ BOTTOM NAV ══════════════════════════════════════════════ */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,background:T.card,borderTop:`1.5px solid ${T.border}`,display:'flex',zIndex:100,height:64,boxShadow:'0 -4px 16px rgba(44,26,14,0.08)'}}>
        {TABS.map((t,i)=>(
          <div key={t} onClick={()=>setTab(t)} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',color:tab===t?T.gold:T.choc3,borderTop:tab===t?`2.5px solid ${T.gold}`:'2.5px solid transparent',gap:3,paddingTop:4}}>
            <div style={{fontSize:19,lineHeight:1}}>{TAB_ICONS[i]}</div>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase'}}>{TAB_LABELS[i]}</div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button onClick={()=>setTab('field')} style={{position:'fixed',bottom:74,right:16,width:52,height:52,borderRadius:'50%',background:T.gold,color:'white',border:'none',fontSize:24,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 20px rgba(160,120,48,0.4)`,cursor:'pointer',zIndex:99}}>+</button>

      {/* ══ OFFICE DETAIL MODAL ═════════════════════════════════════ */}
      {selectedOffice && (
        <div style={s.modal} onClick={e=>e.target===e.currentTarget&&setSelectedOffice(null)}>
          <div style={s.modalBox}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
              <div style={{flex:1,paddingRight:12}}>
                <div style={s.modalTitle}>{selectedOffice.name}</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
                  <span style={s.badge(selectedOffice.tier==='hot'?T.hot:T.gold,selectedOffice.tier==='hot'?T.hotBg:T.goldBg)}>{selectedOffice.tier}</span>
                  {selectedOffice.topReferrer&&<span style={s.badge(T.gold,T.goldBg)}>Top Referrer</span>}
                  <span style={{fontSize:11,fontWeight:600,color:isOverdue(selectedOffice.lastVisit)?'#E85C5C':T.sage}}>{!selectedOffice.lastVisit?'Never visited':`Last visit: ${Math.floor((Date.now()-new Date(selectedOffice.lastVisit))/864e5)}d ago`}</span>
                </div>
              </div>
              <span style={{cursor:'pointer',color:T.choc3,fontSize:22}} onClick={()=>setSelectedOffice(null)}>×</span>
            </div>

            {/* FIELD INTEL */}
            {selectedOffice.notes&&(
              <div style={{background:T.goldBg,border:`1.5px solid rgba(160,120,48,0.2)`,borderRadius:12,padding:'12px 14px',marginBottom:16}}>
                <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:T.gold,marginBottom:6}}>Field Intel</div>
                <div style={{fontSize:13,fontWeight:500,color:T.choc,lineHeight:1.7,whiteSpace:'pre-wrap'}}>{selectedOffice.notes}</div>
              </div>
            )}

            <div style={s.divider}/>

            {/* EDITABLE FIELDS */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
              {[
                {label:'Contact Person',field:'contact',placeholder:'Front desk name, OM...'},
                {label:'Doctor(s)',field:'doctor',placeholder:'Dr. Last Name'},
                {label:'Phone',field:'phone',placeholder:'(XXX) XXX-XXXX'},
                {label:'Email',field:'email',placeholder:'office@email.com'},
              ].map(({label,field,placeholder})=>(
                <div key={field}>
                  <label style={s.label}>{label}</label>
                  <input style={{...s.input,marginBottom:0,fontSize:13}} defaultValue={selectedOffice[field]||''} placeholder={placeholder}
                    onBlur={async(e)=>{if(e.target.value!==(selectedOffice[field]||'')){await updateOfficeField(selectedOffice.id,field,e.target.value);setSelectedOffice({...selectedOffice,[field]:e.target.value});}}}
                  />
                </div>
              ))}
              <div style={{gridColumn:'1/-1'}}>
                <label style={s.label}>Address</label>
                <input style={{...s.input,marginBottom:0,fontSize:13}} defaultValue={selectedOffice.address||''} placeholder="Full address..."
                  onBlur={async(e)=>{if(e.target.value!==(selectedOffice.address||'')){await updateOfficeField(selectedOffice.id,'address',e.target.value);setSelectedOffice({...selectedOffice,address:e.target.value});}}}
                />
              </div>
              <div style={{gridColumn:'1/-1'}}>
                <label style={s.label}>Website</label>
                <input style={{...s.input,marginBottom:0,fontSize:13}} defaultValue={selectedOffice.website||''} placeholder="https://..."
                  onBlur={async(e)=>{if(e.target.value!==(selectedOffice.website||'')){await updateOfficeField(selectedOffice.id,'website',e.target.value);setSelectedOffice({...selectedOffice,website:e.target.value});}}}
                />
              </div>
              <div>
                <label style={s.label}>Tier</label>
                <select style={{...s.select,marginBottom:0,fontSize:13}} value={selectedOffice.tier}
                  onChange={async(e)=>{await updateOfficeField(selectedOffice.id,'tier',e.target.value);setSelectedOffice({...selectedOffice,tier:e.target.value});}}>
                  <option value="hot">Hot</option>
                  <option value="warm">Warm</option>
                  <option value="cold">Cold</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Last Gift / Drop</label>
                <input style={{...s.input,marginBottom:0,fontSize:13,color:T.gold}} defaultValue={selectedOffice.gift||''} placeholder="What did you drop last time?"
                  onBlur={async(e)=>{if(e.target.value!==(selectedOffice.gift||'')){await updateOfficeField(selectedOffice.id,'gift',e.target.value);setSelectedOffice({...selectedOffice,gift:e.target.value});}}}
                />
              </div>
              <div style={{gridColumn:'1/-1'}}>
                <label style={s.label}>Next Action</label>
                <input style={{...s.input,marginBottom:0,fontSize:13,color:T.sage}} defaultValue={selectedOffice.nextAction||''} placeholder="What needs to happen next?"
                  onBlur={async(e)=>{if(e.target.value!==(selectedOffice.nextAction||'')){await updateOfficeField(selectedOffice.id,'nextAction',e.target.value);setSelectedOffice({...selectedOffice,nextAction:e.target.value});}}}
                />
              </div>
              <div style={{gridColumn:'1/-1'}}>
                <label style={s.label}>Full Notes (click to edit)</label>
                <textarea style={{...s.textarea,marginBottom:0,fontSize:13,minHeight:100}} defaultValue={selectedOffice.notes||''} placeholder="Office intel, staff notes, Dr. Patel requests, therapy dog, anything important..."
                  onBlur={async(e)=>{if(e.target.value!==(selectedOffice.notes||'')){await updateOfficeField(selectedOffice.id,'notes',e.target.value);setSelectedOffice({...selectedOffice,notes:e.target.value});}}}
                />
              </div>
            </div>

            <div style={s.divider}/>

            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              <button style={s.btnPrimary} onClick={()=>{if(!route.find(r=>r.name===selectedOffice.name)){updateRoute([...route,{...selectedOffice,order:route.length+1,done:false,stopNote:''}]);}setSelectedOffice(null);setTab('command');}}>+ Add to Route</button>
              {selectedOffice.address&&<button style={s.btnSecondary} onClick={()=>window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedOffice.address+' '+selectedOffice.city+' TX')}`,'_blank')}>Google Maps</button>}
              <button style={s.btnSecondary} onClick={()=>{setQuickNoteOffice(selectedOffice.name);setSelectedOffice(null);setTab('field');}}>Quick Note</button>
              <button style={s.btnDanger} onClick={()=>deleteOffice(selectedOffice.id)}>Remove Office</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ VISIT DETAIL MODAL ══════════════════════════════════════ */}
      {selectedVisit && (
        <div style={s.modal} onClick={e=>e.target===e.currentTarget&&setSelectedVisit(null)}>
          <div style={s.modalBox}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
              <div>
                <div style={s.modalTitle}>{selectedVisit.office}</div>
                <div style={{fontSize:12,fontWeight:600,color:T.choc3,fontFamily:'monospace'}}>{new Date(selectedVisit.date).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</div>
              </div>
              <span style={{cursor:'pointer',color:T.choc3,fontSize:22}} onClick={()=>setSelectedVisit(null)}>×</span>
            </div>
            <div style={s.divider}/>
            {[['Doctor',selectedVisit.doctor],['Contact',selectedVisit.contact],['Gift / Drop',selectedVisit.gift],['Next Action',selectedVisit.nextAction]].filter(([,v])=>v).map(([label,val])=>(
              <div key={label} style={{marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:T.choc3,marginBottom:4}}>{label}</div>
                <div style={{fontSize:13,fontWeight:500,color:label==='Gift / Drop'?T.gold:label==='Next Action'?T.sage:T.choc}}>{val}</div>
              </div>
            ))}
            {selectedVisit.notes&&(
              <div style={{marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:T.choc3,marginBottom:4}}>Field Notes</div>
                <div style={{fontSize:13,fontWeight:500,color:T.choc,background:T.card2,border:`1px solid ${T.border}`,borderRadius:10,padding:12,lineHeight:1.7,whiteSpace:'pre-wrap'}}>{selectedVisit.notes}</div>
              </div>
            )}
            <div style={s.divider}/>
            <div style={{display:'flex',gap:8}}>
              <button style={s.btnSecondary} onClick={()=>setSelectedVisit(null)}>Close</button>
              <button style={s.btnDanger} onClick={()=>deleteVisit(selectedVisit.id)}>Delete Visit</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ TASK NOTE MODAL ══════════════════════════════════════════ */}
      {taskNoteModal && (
        <div style={s.modal} onClick={e=>e.target===e.currentTarget&&setTaskNoteModal(null)}>
          <div style={s.modalBox}>
            <div style={s.modalTitle}>Add Note</div>
            <div style={{fontSize:13,fontWeight:600,color:T.choc2,marginBottom:12,padding:'10px 14px',background:T.card2,borderRadius:10}}>{taskNoteModal.text}</div>
            {taskNoteModal.notes&&(
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:T.choc3,marginBottom:8}}>Previous Notes</div>
                {taskNoteModal.notes.split('\n').map((note,i)=>(
                  <div key={i} style={{fontSize:12,fontWeight:500,color:T.choc3,padding:'6px 0',borderBottom:`1px solid ${T.border}`,lineHeight:1.5}}>{note}</div>
                ))}
              </div>
            )}
            <label style={s.label}>New Note</label>
            <textarea style={{...s.textarea,minHeight:80}} value={taskNoteText} onChange={e=>setTaskNoteText(e.target.value)} placeholder="Called 7/16 — office manager out, try again Monday. Or: Confirmed L&L for July 22nd at noon..." autoFocus/>
            <div style={{display:'flex',gap:8}}>
              <button style={s.btnPrimary} onClick={saveTaskNote}>Save Note</button>
              <button style={s.btnSecondary} onClick={()=>setTaskNoteModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ EDIT TASK MODAL ══════════════════════════════════════════ */}
      {editTaskModal && (
        <div style={s.modal} onClick={e=>e.target===e.currentTarget&&setEditTaskModal(null)}>
          <div style={s.modalBox}>
            <div style={s.modalTitle}>Edit Task</div>
            <label style={s.label}>Task</label>
            <textarea style={{...s.textarea,minHeight:80}} value={editTaskModal.text} onChange={e=>setEditTaskModal({...editTaskModal,text:e.target.value})}/>
            <label style={s.label}>Priority</label>
            <select style={s.select} value={editTaskModal.priority} onChange={e=>setEditTaskModal({...editTaskModal,priority:e.target.value})}>
              <option value="urgent">Urgent</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
            </select>
            <div style={{display:'flex',gap:8}}>
              <button style={s.btnPrimary} onClick={saveTaskEdit}>Save</button>
              <button style={s.btnSecondary} onClick={()=>setEditTaskModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ ADD TASK MODAL ═══════════════════════════════════════════ */}
      {showAddTask && (
        <div style={s.modal} onClick={e=>e.target===e.currentTarget&&setShowAddTask(false)}>
          <div style={s.modalBox}>
            <div style={s.modalTitle}>Add Task</div>
            <label style={s.label}>Task</label>
            <textarea style={{...s.textarea,minHeight:80}} value={newTask.text} onChange={e=>setNewTask({...newTask,text:e.target.value})} placeholder="What needs to get done?" autoFocus/>
            <label style={s.label}>Priority</label>
            <select style={s.select} value={newTask.priority} onChange={e=>setNewTask({...newTask,priority:e.target.value})}>
              <option value="urgent">Urgent</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
            </select>
            <div style={{display:'flex',gap:8}}>
              <button style={s.btnPrimary} onClick={addTask}>Add Task</button>
              <button style={s.btnSecondary} onClick={()=>setShowAddTask(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ ADD OFFICE MODAL ═════════════════════════════════════════ */}
      {showAddOffice && (
        <div style={s.modal} onClick={e=>e.target===e.currentTarget&&setShowAddOffice(false)}>
          <div style={s.modalBox}>
            <div style={s.modalTitle}>Add Office</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div style={{gridColumn:'1/-1'}}><label style={s.label}>Practice Name</label><input style={s.input} value={newOffice.name} onChange={e=>setNewOffice({...newOffice,name:e.target.value})} placeholder="Practice name" autoFocus/></div>
              <div><label style={s.label}>Doctor</label><input style={s.input} value={newOffice.doctor} onChange={e=>setNewOffice({...newOffice,doctor:e.target.value})} placeholder="Dr. Last Name"/></div>
              <div><label style={s.label}>Contact Person</label><input style={s.input} value={newOffice.contact} onChange={e=>setNewOffice({...newOffice,contact:e.target.value})} placeholder="Front desk, OM..."/></div>
              <div><label style={s.label}>City</label>
                <select style={s.select} value={newOffice.city} onChange={e=>setNewOffice({...newOffice,city:e.target.value})}>
                  <option>Flower Mound</option><option>Highland Village</option><option>Lewisville</option><option>Other</option>
                </select>
              </div>
              <div><label style={s.label}>Tier</label>
                <select style={s.select} value={newOffice.tier} onChange={e=>setNewOffice({...newOffice,tier:e.target.value})}>
                  <option value="warm">Warm</option><option value="hot">Hot</option><option value="cold">Cold</option>
                </select>
              </div>
              <div style={{gridColumn:'1/-1'}}><label style={s.label}>Address</label><input style={s.input} value={newOffice.address} onChange={e=>setNewOffice({...newOffice,address:e.target.value})} placeholder="Full address"/></div>
              <div><label style={s.label}>Phone</label><input style={s.input} value={newOffice.phone} onChange={e=>setNewOffice({...newOffice,phone:e.target.value})} placeholder="(XXX) XXX-XXXX"/></div>
              <div><label style={s.label}>Email</label><input style={s.input} value={newOffice.email} onChange={e=>setNewOffice({...newOffice,email:e.target.value})} placeholder="office@email.com"/></div>
              <div style={{gridColumn:'1/-1'}}><label style={s.label}>Notes</label><textarea style={{...s.textarea,minHeight:80}} value={newOffice.notes} onChange={e=>setNewOffice({...newOffice,notes:e.target.value})} placeholder="First impression, intel, referral interest..."/></div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button style={s.btnPrimary} onClick={addOffice}>Add Office</button>
              <button style={s.btnSecondary} onClick={()=>setShowAddOffice(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        *::-webkit-scrollbar{width:4px}
        *::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px}
        input::placeholder,textarea::placeholder{color:${T.choc3};opacity:0.7}
        @media(max-width:600px){
          .desktop-date{display:none!important}
        }
      `}</style>
    </div>
  );
}
