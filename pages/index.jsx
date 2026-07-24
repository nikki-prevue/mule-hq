import { useState, useEffect, useRef } from 'react';

// ─── DESIGN SYSTEM ───────────────────────────────────────────────
const C = {
  gold:     '#C9A96E',
  goldDark: '#A07830',
  sage:     '#5A9B6E',
  hot:      '#D4634A',
  lav:      '#9B8EC4',
  rose:     '#C47A8A',
  choc:     '#2C1A0E',
  choc2:    '#4A3020',
  choc3:    '#7A6050',
  white:    'rgba(255,255,255,0.95)',
  glass:    'rgba(255,255,255,0.18)',
  glassBorder: 'rgba(255,255,255,0.35)',
  glassDark: 'rgba(255,245,235,0.12)',
};

const GRADIENT = `linear-gradient(135deg, #F5DEB3 0%, #FAEBD7 20%, #DEB887 40%, #F5E6C8 60%, #E8C99A 80%, #F0D9B5 100%)`;

const glass = (extra = {}) => ({
  background: 'rgba(255,250,240,0.55)',
  backdropFilter: 'blur(20px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
  border: '1px solid rgba(255,255,255,0.6)',
  boxShadow: '0 8px 32px rgba(160,120,48,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
  borderRadius: 20,
  ...extra,
});

const glassCard = (extra = {}) => ({
  ...glass(),
  padding: 18,
  marginBottom: 14,
  transition: 'all 0.3s ease',
  ...extra,
});

const badge = (color, bg) => ({
  fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 20,
  textTransform: 'uppercase', letterSpacing: '0.08em', display: 'inline-block',
  color, background: bg || color + '22',
});

const btn = {
  primary: {
    background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`,
    color: 'white', border: 'none', borderRadius: 12, padding: '11px 22px',
    fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700,
    cursor: 'pointer', boxShadow: `0 4px 16px ${C.gold}44`, letterSpacing: '0.03em',
    transition: 'all 0.2s',
  },
  secondary: {
    background: 'rgba(255,250,240,0.7)', color: C.choc,
    border: '1px solid rgba(255,255,255,0.6)', borderRadius: 12,
    padding: '11px 22px', fontFamily: "'DM Sans',sans-serif",
    fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
  },
  sm: { padding: '6px 13px', fontSize: 11, borderRadius: 9 },
  danger: {
    background: `${C.hot}18`, color: C.hot,
    border: `1px solid ${C.hot}33`, borderRadius: 12,
    padding: '6px 13px', fontFamily: "'DM Sans',sans-serif",
    fontSize: 11, fontWeight: 700, cursor: 'pointer',
  },
};

const input = {
  background: 'rgba(255,250,240,0.7)', border: '1px solid rgba(255,255,255,0.6)',
  borderRadius: 12, color: C.choc, fontFamily: "'DM Sans',sans-serif",
  fontSize: 14, fontWeight: 500, padding: '11px 14px', outline: 'none',
  width: '100%', marginBottom: 12, backdropFilter: 'blur(8px)',
  boxShadow: 'inset 0 2px 4px rgba(160,120,48,0.06)',
  transition: 'border 0.2s',
};
const label = {
  fontSize: 11, fontWeight: 700, letterSpacing: '0.09em',
  color: C.choc3, marginBottom: 6, display: 'block', textTransform: 'uppercase',
};
const sectionTitle = {
  fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700,
  color: C.choc, marginBottom: 20,
  textShadow: '0 1px 2px rgba(160,120,48,0.15)',
};
const cardLabel = {
  fontSize: 10, fontWeight: 800, letterSpacing: '0.14em',
  textTransform: 'uppercase', color: C.choc3, marginBottom: 8,
};
const cardHeader = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  marginBottom: 12, paddingBottom: 10,
  borderBottom: '1px solid rgba(255,255,255,0.5)',
};
const modal = {
  position: 'fixed', inset: 0, background: 'rgba(44,26,14,0.45)',
  zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', padding: 16,
};
const modalBox = {
  ...glass(), padding: 28, width: '100%', maxWidth: 580,
  maxHeight: '90vh', overflowY: 'auto', borderRadius: 24,
};

const TABS = ['command','offices','field','vault','calendar','lunches','supplies','reports'];
const TAB_ICONS = ['⌂','◎','✦','⊟','◷','◇','▤','≡'];
const TAB_LABELS = ['Today','Offices','Field','Vault','Calendar','Lunches','Supplies','Reports'];

export default function MuleHQ() {
  const [tab, setTab] = useState('command');
  const [offices, setOffices] = useState([]);
  const [visits, setVisits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [lunches, setLunches] = useState([]);
  const [route, setRoute] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [newDoctorName, setNewDoctorName] = useState('');
  const [briefing, setBriefing] = useState('Loading your morning briefing...');
  const [time, setTime] = useState('');
  const [phase, setPhase] = useState('');
  const [dateStr, setDateStr] = useState('');

  // Calendar
  const [calDate, setCalDate] = useState(new Date());
  const [calEvents, setCalEvents] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({title:'',date:'',time:'',type:'visit',notes:''});
  const [selectedDay, setSelectedDay] = useState(null);

  // Modals
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [taskNoteModal, setTaskNoteModal] = useState(null);
  const [taskNoteText, setTaskNoteText] = useState('');
  const [editTaskModal, setEditTaskModal] = useState(null);
  const [showAddOffice, setShowAddOffice] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddLunch, setShowAddLunch] = useState(false);
  const [editLunch, setEditLunch] = useState(null);
  const [showAddSupply, setShowAddSupply] = useState(false);
  const [newOffice, setNewOffice] = useState({name:'',doctor:'',city:'Flower Mound',tier:'warm',address:'',phone:'',email:'',website:'',contact:'',notes:''});
  const [newTask, setNewTask] = useState({text:'',priority:'today'});
  const [newLunch, setNewLunch] = useState({office:'',doctor:'',contact:'',status:'To Schedule',restaurant:'',date:'',notes:'',staffCount:''});
  const [newSupply, setNewSupply] = useState({name:'',count:0,low:5});

  // Field
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [quickNoteOffice, setQuickNoteOffice] = useState('');
  const [quickNoteType, setQuickNoteType] = useState('Call');
  const [quickNoteText, setQuickNoteText] = useState('');
  const [quickNoteSaving, setQuickNoteSaving] = useState(false);
  const chatEndRef = useRef(null);

  // Reports
  const [scratchNotes, setScratchNotes] = useState('');
  const [eodDraft, setEodDraft] = useState('');
  const [rlDraft, setRlDraft] = useState('');
  const [excelDraft, setExcelDraft] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  // Route
  const [routeSearch, setRouteSearch] = useState('');
  const [showRouteSearch, setShowRouteSearch] = useState(false);
  const [smartPlan, setSmartPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [smartPlanQueue, setSmartPlanQueue] = useState([]);
  const [smartPlanSearch, setSmartPlanSearch] = useState('');
  const [comingDue, setComingDue] = useState([]);

  // Offices
  const [officeSearch, setOfficeSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => { loadAll(); const t = setInterval(tick, 1000); tick(); return () => clearInterval(t); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  function tick() {
    const n = new Date();
    setTime(n.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    setDateStr(n.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    const h = n.getHours() + n.getMinutes() / 60;
    setPhase(h < 8 ? 'Pre-Day' : h < 9 ? 'Morning Prep' : h < 15 ? 'Field Hours' : h < 16 ? 'EOD Window' : 'Wrap Up');
  }

  async function loadAll() {
    try {
      const [o, v, t, sp, lu, ro, dc, evd] = await Promise.all([
        fetch('/api/offices').then(r => r.json()),
        fetch('/api/visits').then(r => r.json()),
        fetch('/api/tasks').then(r => r.json()),
        fetch('/api/supplies').then(r => r.json()),
        fetch('/api/lunches').then(r => r.json()),
        fetch('/api/routes').then(r => r.json()),
        fetch('/api/doctors').then(r => r.json()),
        fetch('/api/events').then(r => r.json()),
      ]);
      const offs = Array.isArray(o) ? o : [];
      const vis = Array.isArray(v) ? v : [];
      const tks = Array.isArray(t) ? t : [];
      const sups = Array.isArray(sp) ? sp : [];
      const lun = Array.isArray(lu) ? lu : [];
      const rt = Array.isArray(ro) ? ro : [];
      const dcs = Array.isArray(dc) ? dc : [];
      setOffices(offs); setVisits(vis); setTasks(tks);
      setSupplies(sups); setLunches(lun); setDoctors(dcs); setCalEvents(Array.isArray(evd)?evd:[]);
      if (rt.length > 0) setRoute(rt);
      generateBriefing(offs, tks);
    } catch (e) { console.error(e); }
  }

  async function generateBriefing(offs, tks) {
    try {
      const r = await fetch('/api/briefing', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hotCount: (offs||offices).filter(o=>o.tier==='hot').length, overdueCount: (offs||offices).filter(o=>!o.lastVisit||(Date.now()-new Date(o.lastVisit))>25*864e5).length, urgentTasks: (tks||tasks).filter(t=>!t.done&&t.priority==='urgent').length, isFriday: new Date().getDay()===5 })
      });
      const d = await r.json();
      setBriefing(d.briefing || 'Good morning, Nikki. Ready for the field.');
    } catch { setBriefing(`Good morning, Nikki. Today is ${dateStr}. Make it count.`); }
  }

  async function saveRoute(r) { try { await fetch('/api/routes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({stops:r})}); } catch(e){} }
  function updateRoute(r) { setRoute(r); saveRoute(r); }

  async function addTask() {
    if (!newTask.text.trim()) return;
    const ts = new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',hour12:true});
    await fetch('/api/tasks',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...newTask,timestamp:ts})});
    setNewTask({text:'',priority:'today'}); setShowAddTask(false); await loadAll();
  }
  async function toggleTask(id,done) { setTasks(p=>p.map(t=>t.id===id?{...t,done:!done}:t)); await fetch('/api/tasks',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,done:!done})}); }
  async function deleteTask(id) { setTasks(p=>p.filter(t=>t.id!==id)); await fetch('/api/tasks',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); }
  async function saveTaskNote() {
    if(!taskNoteModal||!taskNoteText.trim()) return;
    const ts = new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',hour12:true});
    const note = `[${ts}] ${taskNoteText.trim()}`;
    const updated = taskNoteModal.notes ? taskNoteModal.notes+'\n'+note : note;
    await fetch('/api/tasks',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:taskNoteModal.id,notes:updated})});
    setTaskNoteText(''); setTaskNoteModal(null); await loadAll();
  }
  async function saveTaskEdit() {
    if(!editTaskModal) return;
    await fetch('/api/tasks',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:editTaskModal.id,text:editTaskModal.text,priority:editTaskModal.priority})});
    setEditTaskModal(null); await loadAll();
  }

  async function addOffice() {
    if(!newOffice.name) return;
    await fetch('/api/offices',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newOffice)});
    setShowAddOffice(false); setNewOffice({name:'',doctor:'',city:'Flower Mound',tier:'warm',address:'',phone:'',email:'',website:'',contact:'',notes:''}); await loadAll();
  }
  async function addDoctor(){ if(!newDoctorName.trim()||!selectedOffice) return; await fetch('/api/doctors',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({office:selectedOffice.name,name:newDoctorName.trim()})}); setNewDoctorName(''); await loadAll(); }
  async function updateOfficeField(id,field,value) { await fetch('/api/offices',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,[field]:value})}); await loadAll(); }
  async function deleteOffice(id) { if(!confirm('Remove this office from MULE HQ?')) return; await fetch('/api/offices',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); setSelectedOffice(null); await loadAll(); }
  async function deleteVisit(id) { if(!confirm('Delete this visit?')) return; await fetch('/api/visits',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); setSelectedVisit(null); await loadAll(); }

  async function addLunch() {
    if(!newLunch.office) return;
    await fetch('/api/lunches',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newLunch)});
    setShowAddLunch(false); setNewLunch({office:'',doctor:'',contact:'',status:'To Schedule',restaurant:'',date:'',notes:'',staffCount:''}); await loadAll();
  }
  async function updateLunch(id,updates) { await fetch('/api/lunches',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,...updates})}); await loadAll(); }
  async function saveLunchEdit() { if(!editLunch) return; await fetch('/api/lunches',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(editLunch)}); setEditLunch(null); await loadAll(); }
  async function deleteLunch(id) { if(!confirm('Remove this lunch?')) return; await fetch('/api/lunches',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); setEditLunch(null); await loadAll(); }

  async function adjSupply(id,count,delta) { const n=Math.max(0,count+delta); setSupplies(p=>p.map(s=>s.id===id?{...s,count:n}:s)); await fetch('/api/supplies',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,count:n})}); }
  async function addSupply() { if(!newSupply.name) return; await fetch('/api/supplies',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newSupply)}); setShowAddSupply(false); setNewSupply({name:'',count:0,low:5}); await loadAll(); }
  async function deleteSupply(id) { if(!confirm('Remove this supply item?')) return; await fetch('/api/supplies',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}); await loadAll(); }

  async function saveQuickNote() {
    if(!quickNoteOffice||!quickNoteText.trim()) return;
    setQuickNoteSaving(true);
    const off = offices.find(o=>o.name===quickNoteOffice);
    const ts = new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',hour12:true});
    const note = `[${quickNoteType} — ${ts}] ${quickNoteText.trim()}`;
    try {
      await fetch('/api/visits',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({office:quickNoteOffice,doctor:off?.doctor||'',contact:'',gift:'',notes:note,nextAction:'',tier:off?.tier||'warm',date:new Date().toISOString().split('T')[0],attempted:quickNoteType==='Closed / No Contact'})});
      setQuickNoteOffice(''); setQuickNoteText(''); setQuickNoteType('Call');
      await loadAll();
    } catch(e){}
    setQuickNoteSaving(false);
  }

  async function sendChat() {
    if(!chatInput.trim()||chatLoading) return;
    const msg = chatInput.trim(); setChatInput('');
    const ts = new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',hour12:true});
    setChatMessages(p=>[...p,{role:'user',content:msg,ts}]);
    setChatLoading(true);
    try {
      const context = `You are MULE HQ — the AI field assistant for Nikki Williams, Provider Relations Coordinator at ROOT Periodontal & Implant Center in Flower Mound/Highland Village/Lewisville TX territory.

LIVE TERRITORY DATA:
Offices: ${offices.length} total | Hot: ${offices.filter(o=>o.tier==='hot').map(o=>o.name).slice(0,5).join(', ')}
Recent visits: ${visits.slice(0,5).map(v=>v.office+' ('+v.date+')').join(', ')}
Urgent tasks: ${tasks.filter(t=>!t.done&&t.priority==='urgent').map(t=>t.text).join(' | ')}
Active lunches: ${lunches.filter(l=>l.status==='Ordered'||l.status==='Pending').map(l=>l.office+' - '+l.restaurant).join(', ')}
Low supplies: ${supplies.filter(s=>s.count<=s.low_alert).map(s=>s.name).join(', ')||'None'}
Today route: ${route.map((r,i)=>(i+1)+'. '+r.name).join(', ')||'No stops yet'}

You guide Nikki through her day: suggest routes, capture visit notes, generate professional EOD emails and Referral Lab notes, track follow-ups. When she shares visit notes, extract key details, confirm back, and ask for next office. When she says "Ready for EOD" generate the full professional email. Keep responses concise and field-friendly.`;

      const history = chatMessages.slice(-8).map(m=>({role:m.role,content:m.content}));
      const r = await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[...history,{role:'user',content:msg}],context})});
      const d = await r.json();
      const rts = new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',hour12:true});
      setChatMessages(p=>[...p,{role:'assistant',content:d.response||'Something went wrong.',ts:rts}]);
    } catch(e) { setChatMessages(p=>[...p,{role:'assistant',content:'Connection error. Try again.',ts:''}]); }
    setChatLoading(false);
  }

  async function generateReports() {
    if(!scratchNotes.trim()){alert('Add your field notes first.');return;}
    setReportLoading(true);
    try {
      const today = new Date().toLocaleDateString('en-US',{month:'numeric',day:'numeric',year:'numeric'});
      const r = await fetch('/api/reports',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({notes:scratchNotes,date:today,territory:'Flower Mound / Highland Village / Lewisville'})});
      const d = await r.json();
      setEodDraft(d.eod||''); setRlDraft(d.rl||''); setExcelDraft(d.excel||'');
    } catch(e){}
    setReportLoading(false);
  }

  async function generateSmartPlan() {
    setPlanLoading(true);
    try {
      const now = Date.now(); const dow = new Date().getDay();
      if(dow===5){setSmartPlan([]);setSmartPlanQueue([]);setComingDue([]);setPlanLoading(false);return;}
      const BLOCKED=['irving kids dentist','shine and sparkle dentistry'];
      const ON_HOLD=['glorious smiles','baylor scott'];
      const refPads=supplies.some(s=>s.name.toLowerCase().includes('referral')&&s.count>0);
      const cards=supplies.some(s=>s.name.toLowerCase().includes('card')&&s.count>0);
      const ptasks=tasks.filter(t=>!t.done).map(t=>t.text.toLowerCase());

      const scored=offices.filter(o=>{
        const n=o.name.toLowerCase();
        if(BLOCKED.some(b=>n.includes(b)))return false;
        if(ON_HOLD.some(h=>n.includes(h)))return false;
        if(o.status==='Do Not Target'||o.status==='On Hold - Pending Info')return false;
        return true;
      }).map(o=>{
        const days=o.lastVisit?Math.floor((now-new Date(o.lastVisit))/864e5):90;
        const never=!o.lastVisit;
        const nl=(o.nextAction||'').toLowerCase();
        const needPads=nl.includes('referral pad')||nl.includes('ref pad')||nl.includes('owed');
        const needCards=nl.includes('card')&&nl.includes('drop');
        const drop=(needPads&&refPads)||(needCards&&cards);
        const task=ptasks.some(t=>t.includes(o.name.toLowerCase().slice(0,10))&&(t.includes('call')||t.includes('confirm')||t.includes('lock')));
        const override=drop||task;
        const t1=never||days>=25||override;
        const t2=days>=18&&days<25;
        if(!t1&&!t2)return null;
        let sc=0;
        if(days>=30)sc+=50; else if(days>=25)sc+=35; else if(never)sc+=40; else if(override)sc+=35; else if(t2)sc+=10;
        if(o.tier==='hot')sc+=25; else if(o.tier==='warm')sc+=10;
        if(o.topReferrer)sc+=20; if((o.referralVolume||0)>20)sc+=15; if(override)sc+=15;
        return{...o,score:sc,daysSince:days,neverVisited:never,hasOverride:override,tier1:t1,tier2:t2};
      }).filter(Boolean).sort((a,b)=>b.score-a.score);

      const fm=scored.filter(o=>o.city==='Flower Mound');
      const hv=scored.filter(o=>o.city==='Highland Village');
      const lv=scored.filter(o=>o.city==='Lewisville');
      const ot=scored.filter(o=>o.city==='Other');
      let cl=dow===2?[...lv,...hv,...fm,...ot]:[...fm,...hv,...lv,...ot];
      const seen=new Set();
      const ded=cl.filter(o=>{if(seen.has(o.id))return false;seen.add(o.id);return true;});
      const sug=ded.slice(0,7).map((o,i)=>({...o,order:i+1,done:false,stopNote:''}));
      const selIds=new Set(sug.map(o=>o.id));
      const bk=ded.filter(o=>!selIds.has(o.id)).slice(0,8).map((o,i)=>({...o,order:8+i,done:false,stopNote:''}));
      const cd=offices.filter(o=>{
        if(!o.lastVisit)return false;
        const n=o.name.toLowerCase();
        if(BLOCKED.some(b=>n.includes(b))||ON_HOLD.some(h=>n.includes(h)))return false;
        if(o.status==='Do Not Target'||o.status==='On Hold - Pending Info')return false;
        const d=Math.floor((now-new Date(o.lastVisit))/864e5);
        return d>=15&&d<25;
      }).map(o=>({...o,daysSince:Math.floor((now-new Date(o.lastVisit))/864e5)})).sort((a,b)=>b.daysSince-a.daysSince).slice(0,5);
      setSmartPlan(sug); setSmartPlanQueue(bk); setComingDue(cd);
    } catch(e){console.error(e);}
    setPlanLoading(false);
  }

  function acceptSmartPlan(){if(smartPlan&&smartPlan.length>0){updateRoute(smartPlan.map((o,i)=>({...o,order:i+1,done:false})));setSmartPlan(null);setSmartPlanQueue([]);}}

  // Helpers
  const daysAgo=(d)=>{if(!d)return'Never';const n=Math.floor((Date.now()-new Date(d))/864e5);return n===0?'Today':n===1?'Yesterday':`${n}d ago`;};
  const isOverdue=(d)=>!d||(Date.now()-new Date(d))>25*864e5;
  const todayVisits=visits.filter(v=>new Date(v.date).toLocaleDateString()===new Date().toLocaleDateString());
  const urgentCount=tasks.filter(t=>!t.done&&t.priority==='urgent').length;
  const dueThisWeek=offices.filter(o=>{if(!o.lastVisit)return false;const d=Math.floor((Date.now()-new Date(o.lastVisit))/864e5);return d>=18&&d<32;}).length;
  const lunchPending=lunches.filter(l=>l.status==='Ordered'||l.status==='Pending').length;
  const ymd=(d)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const _wkStart=(()=>{const n=new Date();const day=n.getDay();const diff=(day===0?-6:1)-day;const m=new Date(n);m.setDate(n.getDate()+diff);m.setHours(0,0,0,0);return m;})();
  const weekDays=Array.from({length:5},(_,i)=>{const d=new Date(_wkStart);d.setDate(_wkStart.getDate()+i);return d;});
  const _todayKey=ymd(new Date());
  const _wd3=new Date().toLocaleDateString('en-US',{weekday:'short'}).toLowerCase();
  const todayAlerts=(()=>{const a=[];const ec={lunch:C.gold,visit:C.sage,admin:C.lav,meeting:C.hot,personal:C.rose,other:C.choc3};
    calEvents.filter(e=>e.date===_todayKey).forEach(e=>a.push({color:ec[e.type]||C.choc3,title:e.title,sub:e.time||''}));
    lunches.filter(l=>l.date===_todayKey&&l.status!=='Delivered'&&l.status!=='Done').forEach(l=>a.push({color:C.gold,title:'Confirm lunch: '+l.office,sub:l.restaurant||l.status||''}));
    offices.filter(o=>o.topReferrer&&isOverdue(o.lastVisit)).forEach(o=>a.push({color:C.hot,title:'Top referrer overdue: '+o.name,sub:'Last touch '+daysAgo(o.lastVisit)}));
    route.forEach(st=>{const off=offices.find(o=>o.id===st.id||o.name===st.name);const cd=off&&off.closedDays;if(cd&&cd.toLowerCase().includes(_wd3))a.push({color:C.lav,title:st.name+' may be closed today',sub:'Closed '+cd});});
    return a;})();
  const filteredOffices=offices.filter(o=>{const ms=officeSearch.toLowerCase();return(!ms||o.name.toLowerCase().includes(ms)||(o.doctor||'').toLowerCase().includes(ms)||(o.contact||'').toLowerCase().includes(ms))&&(!tierFilter||o.tier===tierFilter)&&(!cityFilter||o.city===cityFilter);});

  const EVENT_COLORS = {lunch:'#C9A96E',visit:'#5A9B6E',admin:'#9B8EC4',meeting:'#D4634A',personal:'#C47A8A',other:'#7A6050'};

  // Calendar helpers
  const getDaysInMonth=(year,month)=>new Date(year,month+1,0).getDate();
  const getFirstDayOfMonth=(year,month)=>new Date(year,month,1).getDay();
  const getEventsForDate=(dateStr)=>calEvents.filter(e=>e.date===dateStr);

  const calYear=calDate.getFullYear();
  const calMonth=calDate.getMonth();
  const daysInMonth=getDaysInMonth(calYear,calMonth);
  const firstDay=getFirstDayOfMonth(calYear,calMonth);
  const monthName=calDate.toLocaleDateString('en-US',{month:'long',year:'numeric'});

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:GRADIENT,minHeight:'100vh',minHeight:'100dvh',color:C.choc}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>

      {/* ── TOPBAR ── */}
      <div style={{...glass({borderRadius:0,borderTop:'none',borderLeft:'none',borderRight:'none'}),padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:C.choc,letterSpacing:'0.04em'}}>
          MULE <span style={{color:C.goldDark}}>HQ</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{fontSize:12,fontWeight:600,color:C.choc3}}>{time}</div>
          <div style={{display:'flex',alignItems:'center',gap:5,fontSize:11,fontWeight:700,color:C.sage,background:`${C.sage}18`,padding:'4px 10px',borderRadius:20}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:C.sage}}></div>
            Live
          </div>
        </div>
      </div>

      {/* ── PHASE BAR ── */}
      <div style={{background:'rgba(255,245,225,0.4)',borderBottom:'1px solid rgba(255,255,255,0.4)',padding:'7px 20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:12,fontWeight:600,color:C.choc2}}>{dateStr}</div>
        <div style={{fontSize:10,fontWeight:800,letterSpacing:'0.12em',textTransform:'uppercase',color:C.goldDark,background:`${C.gold}22`,padding:'3px 12px',borderRadius:20}}>{phase}</div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{padding:'16px 16px 110px',maxWidth:960,margin:'0 auto'}}>

        {/* ══ COMMAND ══════════════════════════════════════════ */}
        {tab==='command'&&(
          <div>
            {/* WEEK AT A GLANCE */}
            <div style={glassCard()}>
              <div style={cardLabel}>This Week at a Glance</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8}}>
                {weekDays.map((d,i)=>{const key=ymd(d);const isT=d.toDateString()===new Date().toDateString();const vC=visits.filter(v=>new Date(v.date).toDateString()===d.toDateString()).length;const evs=calEvents.filter(e=>e.date===key);const luC=lunches.filter(l=>l.date===key).length;return (
                  <div key={i} onClick={()=>{setCalDate(new Date(d));setSelectedDay(key);setTab('calendar');}} style={{cursor:'pointer',textAlign:'center',padding:'10px 4px',borderRadius:12,background:isT?`${C.gold}22`:'rgba(255,255,255,0.3)',border:isT?`1.5px solid ${C.gold}`:'1px solid rgba(255,255,255,0.4)'}}>
                    <div style={{fontSize:10,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.06em',color:isT?C.goldDark:C.choc3}}>{d.toLocaleDateString('en-US',{weekday:'short'})}</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:C.choc,lineHeight:1.2}}>{d.getDate()}</div>
                    <div style={{display:'flex',gap:3,justifyContent:'center',marginTop:4,minHeight:8}}>
                      {vC>0&&<div style={{width:6,height:6,borderRadius:'50%',background:C.sage}}></div>}
                      {luC>0&&<div style={{width:6,height:6,borderRadius:'50%',background:C.gold}}></div>}
                      {evs.filter(e=>e.type!=='lunch').length>0&&<div style={{width:6,height:6,borderRadius:'50%',background:C.lav}}></div>}
                    </div>
                  </div>
                );})}
              </div>
            </div>

            {todayAlerts.length>0&&(
              <div style={glassCard()}>
                <div style={cardLabel}>Today's Radar</div>
                {todayAlerts.map((a,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'flex-start',gap:9,padding:'8px 0',borderBottom:i<todayAlerts.length-1?'1px solid rgba(255,255,255,0.4)':'none'}}>
                    <div style={{width:7,height:7,borderRadius:'50%',background:a.color,flexShrink:0,marginTop:5}}></div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:C.choc}}>{a.title}</div>
                      {a.sub&&<div style={{fontSize:11,fontWeight:500,color:C.choc3}}>{a.sub}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {urgentCount>0&&(
              <div style={{...glass({borderRadius:14}),padding:'12px 16px',marginBottom:14,display:'flex',alignItems:'flex-start',gap:9,border:`1px solid ${C.hot}33`,background:`rgba(212,99,74,0.08)`}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:C.hot,flexShrink:0,marginTop:4}}></div>
                <div style={{fontSize:13,fontWeight:700,color:C.choc}}>{urgentCount} urgent task{urgentCount>1?'s':''} need attention today.</div>
              </div>
            )}

            {/* BRIEFING */}
            <div style={glassCard()}>
              <div style={cardHeader}>
                <div style={cardLabel}>Morning Briefing</div>
                <span style={{fontSize:12,fontWeight:700,color:C.goldDark,cursor:'pointer'}} onClick={()=>generateBriefing()}>Refresh</span>
              </div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:500,color:C.choc,lineHeight:1.8}}>{briefing}</div>
            </div>

            {/* STATS */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
              {[
                {n:todayVisits.length,l:'Visits Today',c:C.choc},
                {n:urgentCount,l:'Urgent Tasks',c:urgentCount>0?C.hot:C.choc},
                {n:dueThisWeek,l:'Due This Week',c:C.choc},
                {n:lunchPending,l:'Lunches Pending',c:C.choc},
              ].map((st,i)=>(
                <div key={i} style={glassCard({padding:'14px 16px',marginBottom:0})}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:700,color:st.c,lineHeight:1,marginBottom:4}}>{st.n}</div>
                  <div style={{fontSize:10,fontWeight:800,color:C.choc3,letterSpacing:'0.07em',textTransform:'uppercase'}}>{st.l}</div>
                </div>
              ))}
            </div>

            {/* ROUTE */}
            <div style={glassCard()}>
              <div style={cardHeader}>
                <div style={cardLabel}>Today's Route</div>
                <div style={{display:'flex',gap:10}}>
                  {route.length>0&&(
                    <span style={{fontSize:12,fontWeight:700,color:C.goldDark,cursor:'pointer'}} onClick={()=>{
                      const stops=route.sort((a,b)=>a.order-b.order).map(s=>encodeURIComponent((s.address||s.name)+' '+(s.city||'')+' TX'));
                      const o=stops[0],d=stops[stops.length-1],w=stops.slice(1,-1).join('|');
                      window.open(`https://www.google.com/maps/dir/?api=1&origin=${o}&destination=${d}${w?'&waypoints='+w:''}&travelmode=driving`,'_blank');
                    }}>Google Maps</span>
                  )}
                  <span style={{fontSize:12,fontWeight:700,color:C.goldDark,cursor:'pointer'}} onClick={generateSmartPlan}>{planLoading?'Planning...':'Smart Plan'}</span>
                  <span style={{fontSize:12,fontWeight:700,color:C.goldDark,cursor:'pointer'}} onClick={()=>setShowRouteSearch(!showRouteSearch)}>+ Add</span>
                </div>
              </div>

              {/* SMART PLAN PANEL */}
              {smartPlan!==null&&(
                <div style={{background:`${C.sage}12`,border:`1px solid ${C.sage}33`,borderRadius:14,padding:14,marginBottom:12}}>
                  {smartPlan.length===0?(
                    <div style={{fontSize:13,fontWeight:600,color:C.sage,textAlign:'center'}}>Friday Admin Day — No field visits suggested.</div>
                  ):(
                    <>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                        <div style={{fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:C.sage}}>Smart Plan — {smartPlan.length} stops</div>
                        <div style={{display:'flex',gap:8}}>
                          <button style={btn.primary} onClick={acceptSmartPlan}>Accept Route</button>
                          <button style={btn.secondary} onClick={()=>{setSmartPlan(null);setSmartPlanQueue([]);setComingDue([]);}}>Dismiss</button>
                        </div>
                      </div>
                      {smartPlan.map((o,i)=>(
                        <div key={o.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<smartPlan.length-1?`1px solid ${C.sage}22`:'none'}}>
                          <div style={{width:24,height:24,borderRadius:'50%',background:o.hasOverride?C.gold:C.sage,color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,flexShrink:0}}>{i+1}</div>
                          <div onClick={()=>setSelectedOffice(offices.find(off=>off.id===o.id)||o)} style={{flex:1,minWidth:0,cursor:'pointer'}}>
                            <div style={{fontSize:12,fontWeight:700,color:C.choc,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{o.name} <span style={{fontSize:9,color:C.gold}}>tap for intel ▶</span></div>
                            <div style={{fontSize:10,fontWeight:500,color:C.choc3}}>{o.city} · {o.neverVisited?'Never visited':o.daysSince+'d ago'}</div>
                          </div>
                          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:2}}>
                            <span style={badge(o.tier==='hot'?C.hot:C.goldDark)}>{o.tier}</span>
                            {o.daysSince>=30&&<span style={{fontSize:9,fontWeight:800,color:'#E85C5C'}}>OVERDUE</span>}
                            <span onClick={()=>{const next=smartPlanQueue[0];const upd=smartPlan.filter((_,si)=>si!==i).map((s,si)=>({...s,order:si+1}));if(next){setSmartPlan([...upd,{...next,order:upd.length+1}]);setSmartPlanQueue(smartPlanQueue.slice(1));}else setSmartPlan(upd);}} style={{cursor:'pointer',color:C.choc3,fontSize:14,lineHeight:1}}>✕</span>
                          </div>
                        </div>
                      ))}
                      <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${C.sage}22`}}>
                        <div style={{fontSize:10,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:C.sage,marginBottom:6}}>Add Another Office</div>
                        <div style={{position:'relative'}}>
                          <input style={{...input,marginBottom:0,fontSize:12}} value={smartPlanSearch} onChange={e=>setSmartPlanSearch(e.target.value)} placeholder="Search offices..."/>
                          {smartPlanSearch.length>1&&(
                            <div style={{position:'absolute',top:'100%',left:0,right:0,...glass({borderRadius:12}),zIndex:60,maxHeight:160,overflowY:'auto',marginTop:4}}>
                              {offices.filter(o=>o.status!=='Do Not Target'&&!['irving kids','shine and sparkle'].some(b=>o.name.toLowerCase().includes(b))&&!smartPlan.find(s=>s.id===o.id)&&o.name.toLowerCase().includes(smartPlanSearch.toLowerCase())).slice(0,5).map(o=>(
                                <div key={o.id} onClick={()=>{setSmartPlan([...smartPlan,{...o,order:smartPlan.length+1,done:false,stopNote:''}]);setSmartPlanSearch('');}} style={{padding:'9px 14px',cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,0.3)',fontSize:13,fontWeight:600}} onMouseEnter={e=>e.currentTarget.style.background='rgba(201,169,110,0.15)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                                  <div>{o.name}</div><div style={{fontSize:10,color:C.choc3}}>{o.city} · {daysAgo(o.lastVisit)}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {comingDue.length>0&&(
                        <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${C.sage}22`}}>
                          <div style={{fontSize:10,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:C.goldDark,marginBottom:6}}>Coming Due This Week</div>
                          {comingDue.map(o=>(
                            <div key={o.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,0.3)',fontSize:12}}>
                              <div><div style={{fontWeight:700}}>{o.name}</div><div style={{fontSize:10,color:C.choc3}}>{o.city} · {o.daysSince}d ago</div></div>
                              <button style={{...btn.secondary,...btn.sm}} onClick={()=>{setSmartPlan([...smartPlan,{...o,order:smartPlan.length+1,done:false,stopNote:''}]);}}>+ Add</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ROUTE SEARCH */}
              {showRouteSearch&&(
                <div style={{marginBottom:12,position:'relative'}}>
                  <input style={{...input,marginBottom:0}} value={routeSearch} onChange={e=>setRouteSearch(e.target.value)} placeholder="Search offices to add..." autoFocus/>
                  {routeSearch.length>0&&(
                    <div style={{position:'absolute',top:'100%',left:0,right:0,...glass({borderRadius:12}),zIndex:50,maxHeight:200,overflowY:'auto',marginTop:4}}>
                      {offices.filter(o=>o.status!=='Do Not Target'&&!route.find(r=>r.name===o.name)&&(o.name.toLowerCase().includes(routeSearch.toLowerCase())||(o.city||'').toLowerCase().includes(routeSearch.toLowerCase()))).slice(0,6).map(o=>(
                        <div key={o.id} onClick={()=>{updateRoute([...route,{...o,order:route.length+1,done:false,stopNote:''}]);setRouteSearch('');setShowRouteSearch(false);}} style={{padding:'10px 14px',cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,0.3)',fontSize:13,fontWeight:600}} onMouseEnter={e=>e.currentTarget.style.background='rgba(201,169,110,0.15)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <div>{o.name}</div><div style={{fontSize:11,color:C.choc3}}>{o.city} · {daysAgo(o.lastVisit)} · {o.tier}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {route.length===0?(
                <div style={{fontSize:13,fontWeight:500,color:C.choc3,textAlign:'center',padding:'16px 0'}}>No stops yet. Use Smart Plan or search above.</div>
              ):(
                <div>
                  {route.sort((a,b)=>a.order-b.order).map((stop,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:i<route.length-1?'1px solid rgba(255,255,255,0.4)':'none',opacity:stop.done?0.55:1}}>
                      <div style={{width:28,height:28,borderRadius:'50%',border:`2px solid ${stop.done?C.sage:C.gold}`,color:stop.done?C.sage:C.goldDark,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,flexShrink:0,background:stop.done?`${C.sage}18`:'rgba(255,255,255,0.5)'}}>{stop.done?'✓':stop.order}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:700,color:stop.done?C.choc3:C.choc,textDecoration:stop.done?'line-through':'none',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{stop.name}</div>
                        <div style={{fontSize:11,fontWeight:500,color:C.choc3}}>{stop.city}{stop.address?' · '+stop.address:''}</div>
                      </div>
                      <div style={{display:'flex',gap:3,flexShrink:0,alignItems:'center'}}>
                        <div style={{display:'flex',flexDirection:'column',gap:1}}>
                          <span style={{cursor:i===0?'default':'pointer',color:i===0?'rgba(255,255,255,0.4)':C.choc3,fontSize:11,userSelect:'none'}} onClick={()=>{if(i===0)return;const r=[...route];[r[i-1],r[i]]=[r[i],r[i-1]];updateRoute(r.map((s,idx)=>({...s,order:idx+1})));}}>▲</span>
                          <span style={{cursor:i===route.length-1?'default':'pointer',color:i===route.length-1?'rgba(255,255,255,0.4)':C.choc3,fontSize:11,userSelect:'none'}} onClick={()=>{if(i===route.length-1)return;const r=[...route];[r[i],r[i+1]]=[r[i+1],r[i]];updateRoute(r.map((s,idx)=>({...s,order:idx+1})));}}>▼</span>
                        </div>
                        {stop.address&&<button style={{...btn.secondary,...btn.sm}} onClick={()=>window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address+' '+stop.city+' TX')}`,'_blank')}>Nav</button>}
                        <button style={{...btn.secondary,...btn.sm,background:stop.done?`${C.sage}18`:undefined,color:stop.done?C.sage:undefined}} onClick={()=>updateRoute(route.map((r,ri)=>ri===i?{...r,done:!r.done}:r))}>{stop.done?'Undo':'Done'}</button>
                        <span style={{cursor:'pointer',color:C.choc3,fontSize:18,lineHeight:1}} onClick={()=>updateRoute(route.filter((_,ri)=>ri!==i))}>×</span>
                      </div>
                    </div>
                  ))}
                  <div style={{marginTop:12,padding:'10px 14px',background:'rgba(255,250,240,0.5)',borderRadius:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{fontSize:12,fontWeight:600,color:C.choc3}}>{route.filter(s=>s.done).length} of {route.length} done</div>
                    <button style={btn.primary} onClick={()=>{
                      const stops=route.sort((a,b)=>a.order-b.order).map(s=>encodeURIComponent((s.address||s.name)+' '+(s.city||'')+' TX'));
                      const o=stops[0],d=stops[stops.length-1],w=stops.slice(1,-1).join('|');
                      window.open(`https://www.google.com/maps/dir/?api=1&origin=${o}&destination=${d}${w?'&waypoints='+w:''}&travelmode=driving`,'_blank');
                    }}>Open Full Route</button>
                  </div>
                </div>
              )}
            </div>

            {/* TASKS */}
            <div style={glassCard()}>
              <div style={cardHeader}>
                <div style={cardLabel}>Tasks</div>
                <span style={{fontSize:12,fontWeight:700,color:C.goldDark,cursor:'pointer'}} onClick={()=>setShowAddTask(true)}>+ Add Task</span>
              </div>
              {tasks.slice(0,12).map(t=>(
                <div key={t.id} style={{padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.4)'}}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
                    <div onClick={()=>toggleTask(t.id,t.done)} style={{width:19,height:19,border:`2px solid ${t.done?C.sage:'rgba(160,120,48,0.3)'}`,borderRadius:5,cursor:'pointer',flexShrink:0,marginTop:1,background:t.done?C.sage:'rgba(255,255,255,0.5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'white',fontWeight:800}}>{t.done?'✓':''}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:t.done?400:600,color:t.done?C.choc3:C.choc,textDecoration:t.done?'line-through':'none',lineHeight:1.4}}>{t.text}</div>
                      {t.timestamp&&<div style={{fontSize:10,fontWeight:500,color:C.choc3,marginTop:2}}>Added {t.timestamp}</div>}
                      {t.notes&&t.notes.split('\n').map((note,ni)=>(
                        <div key={ni} style={{fontSize:11,fontWeight:500,color:C.choc3,marginTop:4,paddingLeft:10,borderLeft:`2px solid rgba(160,120,48,0.3)`,lineHeight:1.5}}>{note}</div>
                      ))}
                    </div>
                    <span style={badge(t.priority==='urgent'?C.hot:t.priority==='week'?C.choc3:C.goldDark)}>{t.priority}</span>
                    <div style={{display:'flex',gap:3,flexShrink:0}}>
                      <span style={{cursor:'pointer',fontSize:10,fontWeight:700,color:C.goldDark,padding:'2px 6px',borderRadius:6,border:`1px solid ${C.gold}44`,background:`${C.gold}11`}} onClick={()=>{setTaskNoteModal(t);setTaskNoteText('');}}>+ Note</span>
                      <span style={{cursor:'pointer',fontSize:10,fontWeight:700,color:C.choc3,padding:'2px 6px',borderRadius:6,border:'1px solid rgba(255,255,255,0.5)',background:'rgba(255,255,255,0.4)'}} onClick={()=>setEditTaskModal({...t})}>Edit</span>
                      <span style={{cursor:'pointer',color:C.choc3,fontSize:17,lineHeight:1}} onClick={()=>deleteTask(t.id)}>×</span>
                    </div>
                  </div>
                </div>
              ))}
              {tasks.filter(t=>t.done).length>0&&<div style={{fontSize:11,fontWeight:600,color:C.choc3,textAlign:'center',padding:'8px 0 0'}}>{tasks.filter(t=>t.done).length} completed</div>}
            </div>
          </div>
        )}

        {/* ══ OFFICES ══════════════════════════════════════════ */}
        {tab==='offices'&&(
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div style={sectionTitle}>Offices</div>
              <button style={btn.primary} onClick={()=>setShowAddOffice(true)}>+ Add Office</button>
            </div>
            <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
              <input style={{...input,marginBottom:0,flex:1,minWidth:160}} placeholder="Search name, doctor, contact..." value={officeSearch} onChange={e=>setOfficeSearch(e.target.value)}/>
              <select style={{...input,marginBottom:0,width:120}} value={tierFilter} onChange={e=>setTierFilter(e.target.value)}>
                <option value="">All Tiers</option><option value="hot">Hot</option><option value="warm">Warm</option><option value="cold">Cold</option>
              </select>
              <select style={{...input,marginBottom:0,width:150}} value={cityFilter} onChange={e=>setCityFilter(e.target.value)}>
                <option value="">All Cities</option><option value="Flower Mound">Flower Mound</option><option value="Highland Village">Highland Village</option><option value="Lewisville">Lewisville</option><option value="Other">Other</option>
              </select>
            </div>
            {['Flower Mound','Highland Village','Lewisville','Other'].map(city=>{
              const cityOff=filteredOffices.filter(o=>o.city===city).sort((a,b)=>{
                if(a.status==='Do Not Target'&&b.status!=='Do Not Target')return 1;
                if(a.status!=='Do Not Target'&&b.status==='Do Not Target')return -1;
                if(a.tier==='hot'&&b.tier!=='hot')return -1;if(a.tier!=='hot'&&b.tier==='hot')return 1;
                if(isOverdue(a.lastVisit)&&!isOverdue(b.lastVisit))return -1;if(!isOverdue(a.lastVisit)&&isOverdue(b.lastVisit))return 1;
                return 0;
              });
              if(!cityOff.length)return null;
              return(
                <div key={city} style={{marginBottom:24}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:C.choc}}>{city}</div>
                    <div style={{flex:1,height:1,background:'linear-gradient(90deg,rgba(201,169,110,0.4),transparent)'}}></div>
                    <div style={{fontSize:11,fontWeight:600,color:C.choc3}}>{cityOff.length} offices</div>
                  </div>
                  <div style={{...glass({borderRadius:16}),overflow:'hidden'}}>
                    <div style={{display:'grid',gridTemplateColumns:'3fr 1.5fr 80px 100px',padding:'8px 16px',background:'rgba(255,245,220,0.5)',borderBottom:'1px solid rgba(255,255,255,0.5)',gap:8}}>
                      {['Office / Doctor','Contact','Tier','Last Touch'].map(h=>(
                        <div key={h} style={{fontSize:9,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:C.choc3}}>{h}</div>
                      ))}
                    </div>
                    {cityOff.map((o,i)=>{
                      const od=isOverdue(o.lastVisit);
                      const dnt=o.status==='Do Not Target';
                      const isNew=o.status==='New - not visited';
                      return(
                        <div key={o.id} onClick={()=>!dnt&&setSelectedOffice(o)} style={{display:'grid',gridTemplateColumns:'3fr 1.5fr 80px 100px',padding:'12px 16px',background:i%2===0?'rgba(255,255,255,0.1)':'rgba(255,245,230,0.15)',borderBottom:i<cityOff.length-1?'1px solid rgba(255,255,255,0.3)':'none',cursor:dnt?'default':'pointer',borderLeft:`3px solid ${dnt?'rgba(255,255,255,0.2)':o.tier==='hot'?C.hot:od?'#E85C5C':'rgba(201,169,110,0.4)'}`,opacity:dnt?0.45:1,gap:8,transition:'background 0.15s'}} onMouseEnter={e=>{if(!dnt)e.currentTarget.style.background='rgba(201,169,110,0.12)'}} onMouseLeave={e=>{e.currentTarget.style.background=i%2===0?'rgba(255,255,255,0.1)':'rgba(255,245,230,0.15)'}}>
                          <div>
                            <div style={{display:'flex',alignItems:'center',gap:5,flexWrap:'wrap'}}>
                              <span style={{fontSize:13,fontWeight:700,color:C.choc}}>{o.name}</span>
                              {o.topReferrer&&<span style={badge(C.goldDark)}>Top</span>}
                              {isNew&&<span style={badge(C.sage)}>New</span>}
                              {dnt&&<span style={badge(C.hot)}>DNT</span>}
                            </div>
                            {o.doctor&&<div style={{fontSize:11,fontWeight:500,color:C.choc3,marginTop:2}}>{o.doctor}</div>}
                          </div>
                          <div style={{fontSize:12,fontWeight:500,color:C.choc3,alignSelf:'center'}}>{o.contact||'—'}</div>
                          <div style={{alignSelf:'center'}}><span style={badge(o.tier==='hot'?C.hot:C.goldDark)}>{o.tier}</span></div>
                          <div style={{alignSelf:'center'}}>
                            <div style={{fontSize:12,fontWeight:700,color:od&&!dnt?'#E85C5C':C.sage}}>{!o.lastVisit?'Never':Math.floor((Date.now()-new Date(o.lastVisit))/864e5)+'d ago'}</div>
                            {o.lastAttempt&&(!o.lastVisit||new Date(o.lastAttempt)>new Date(o.lastVisit))&&<div style={{fontSize:9,fontWeight:700,color:C.lav,marginTop:2}}>Attempted {new Date(o.lastAttempt).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>}
                            {o.referralVolume>0&&<div style={{fontSize:10,fontWeight:700,color:C.goldDark,marginTop:2}}>{o.referralVolume}/yr</div>}
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

        {/* ══ FIELD ══════════════════════════════════════════ */}
        {tab==='field'&&(
          <div>
            <div style={sectionTitle}>Field Assistant</div>
            <div style={glassCard()}>
              <div style={{...cardHeader,paddingBottom:8,marginBottom:10}}>
                <div style={cardLabel}>Quick Note — Any Interaction</div>
              </div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:8}}>
                <select style={{...input,marginBottom:0,flex:1,minWidth:140}} value={quickNoteOffice} onChange={e=>setQuickNoteOffice(e.target.value)}>
                  <option value="">Select office...</option>
                  {offices.filter(o=>o.status!=='Do Not Target').map(o=><option key={o.id} value={o.name}>{o.name}</option>)}
                </select>
                <select style={{...input,marginBottom:0,width:150}} value={quickNoteType} onChange={e=>setQuickNoteType(e.target.value)}>
                  <option value="Visit">Visit (in person)</option><option value="Closed / No Contact">Closed / No Contact</option>
                  <option value="Call">Phone Call</option><option value="Email">Email</option><option value="Text">Text</option>
                  <option value="Lunch Coord">Lunch Coord</option><option value="Dr. Patel Request">Dr. Patel Request</option><option value="Other">Other</option>
                </select>
              </div>
              <div style={{display:'flex',gap:8}}>
                <input style={{...input,marginBottom:0,flex:1}} value={quickNoteText} onChange={e=>setQuickNoteText(e.target.value)} placeholder="What happened — saves with timestamp..." onKeyDown={e=>e.key==='Enter'&&saveQuickNote()}/>
                <button style={{...btn.primary,whiteSpace:'nowrap',opacity:quickNoteSaving?0.7:1}} onClick={saveQuickNote} disabled={quickNoteSaving}>{quickNoteSaving?'Saving...':'Save'}</button>
              </div>
            </div>

            {/* LIVE CHAT */}
            <div style={glassCard()}>
              <div style={{...cardHeader,marginBottom:0,paddingBottom:10}}>
                <div style={cardLabel}>Live Field Chat — Talk to MULE HQ</div>
                <span style={{fontSize:12,fontWeight:700,color:C.goldDark,cursor:'pointer'}} onClick={()=>setChatMessages([])}>Clear</span>
              </div>
              <div style={{minHeight:220,maxHeight:420,overflowY:'auto',padding:'12px 0'}}>
                {chatMessages.length===0&&(
                  <div style={{textAlign:'center',padding:'32px 12px'}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:C.choc,marginBottom:10}}>Your AI field companion is ready.</div>
                    <div style={{fontSize:13,fontWeight:500,color:C.choc3,lineHeight:1.8}}>
                      <em>"What should my route be today?"</em><br/>
                      <em>"Just left Ace Smile — met Christina, interested in L&L"</em><br/>
                      <em>"Ready for EOD"</em><br/>
                      <em>"Give me Referral Lab notes"</em>
                    </div>
                  </div>
                )}
                {chatMessages.map((m,i)=>(
                  <div key={i} style={{marginBottom:12,display:'flex',flexDirection:'column',alignItems:m.role==='user'?'flex-end':'flex-start'}}>
                    <div style={{maxWidth:'85%',background:m.role==='user'?`linear-gradient(135deg,${C.goldDark},${C.gold})`:'rgba(255,255,255,0.65)',color:m.role==='user'?'white':C.choc,borderRadius:m.role==='user'?'18px 18px 4px 18px':'18px 18px 18px 4px',padding:'11px 15px',fontSize:13,fontWeight:500,lineHeight:1.6,backdropFilter:'blur(8px)',border:m.role==='assistant'?'1px solid rgba(255,255,255,0.6)':'none',boxShadow:m.role==='user'?`0 4px 16px ${C.gold}44`:'0 2px 8px rgba(0,0,0,0.06)',whiteSpace:'pre-wrap'}}>
                      {m.content}
                    </div>
                    {m.ts&&<div style={{fontSize:10,fontWeight:500,color:C.choc3,marginTop:3,padding:'0 4px'}}>{m.ts}</div>}
                  </div>
                ))}
                {chatLoading&&(
                  <div style={{display:'flex',alignItems:'flex-start',marginBottom:12}}>
                    <div style={{background:'rgba(255,255,255,0.65)',border:'1px solid rgba(255,255,255,0.6)',borderRadius:'18px 18px 18px 4px',padding:'11px 15px',fontSize:13,color:C.choc3,backdropFilter:'blur(8px)'}}>Thinking...</div>
                  </div>
                )}
                <div ref={chatEndRef}/>
              </div>
              <div style={{borderTop:'1px solid rgba(255,255,255,0.4)',paddingTop:12,display:'flex',gap:8}}>
                <textarea style={{...input,marginBottom:0,flex:1,minHeight:48,resize:'none',fontSize:13}} value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Type your notes or ask anything..." rows={2} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}}}/>
                <button style={{...btn.primary,alignSelf:'flex-end',padding:'11px 18px'}} onClick={sendChat} disabled={chatLoading}>Send</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ VAULT ══════════════════════════════════════════ */}
        {tab==='vault'&&(
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div style={sectionTitle}>Visit Vault</div>
              <span style={{fontSize:12,fontWeight:600,color:C.choc3}}>{visits.length} total</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
              {[...visits].reverse().map(v=>(
                <div key={v.id} onClick={()=>setSelectedVisit(v)} style={{...glassCard({marginBottom:0,cursor:'pointer',transition:'all 0.25s'})}} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 12px 40px ${C.gold}22`;}} onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 8px 32px rgba(160,120,48,0.12)';e.currentTarget.style.border='1px solid rgba(255,255,255,0.6)';}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <div style={{fontWeight:700,fontSize:13,color:C.choc,flex:1,paddingRight:8}}>{v.office}</div>
                    <div style={{fontSize:10,fontWeight:600,color:C.choc3,flexShrink:0}}>{new Date(v.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
                  </div>
                  {v.contact&&<div style={{fontSize:11,fontWeight:500,color:C.choc3,marginBottom:4}}>Spoke with: {v.contact}</div>}
                  {v.gift&&<div style={{fontSize:11,fontWeight:700,color:C.goldDark,marginBottom:4}}>Drop: {v.gift}</div>}
                  {v.notes&&<div style={{fontSize:12,fontWeight:500,color:C.choc3,lineHeight:1.5,marginTop:6,paddingTop:6,borderTop:'1px solid rgba(255,255,255,0.4)'}}>{v.notes.substring(0,110)}{v.notes.length>110?'...':''}</div>}
                  {v.nextAction&&<div style={{fontSize:11,fontWeight:700,color:C.sage,marginTop:6}}>Next: {v.nextAction}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ CALENDAR ══════════════════════════════════════ */}
        {tab==='calendar'&&(
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div style={sectionTitle}>Calendar</div>
              <button style={btn.primary} onClick={()=>setShowAddEvent(true)}>+ Add Event</button>
            </div>

            <div style={glassCard()}>
              {/* MONTH NAV */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <button style={{...btn.secondary,...btn.sm}} onClick={()=>setCalDate(new Date(calYear,calMonth-1,1))}>‹ Prev</button>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:C.choc}}>{monthName}</div>
                <button style={{...btn.secondary,...btn.sm}} onClick={()=>setCalDate(new Date(calYear,calMonth+1,1))}>Next ›</button>
              </div>

              {/* DAY HEADERS */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2,marginBottom:4}}>
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
                  <div key={d} style={{fontSize:10,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:C.choc3,textAlign:'center',padding:'4px 0'}}>{d}</div>
                ))}
              </div>

              {/* CALENDAR GRID */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3}}>
                {Array.from({length:firstDay}).map((_,i)=><div key={'empty-'+i}/>)}
                {Array.from({length:daysInMonth}).map((_,i)=>{
                  const day=i+1;
                  const dateStr2=`${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                  const dayEvents=getEventsForDate(dateStr2);
                  const isToday=new Date().toISOString().split('T')[0]===dateStr2;
                  const isSelected=selectedDay===dateStr2;
                  return(
                    <div key={day} onClick={()=>setSelectedDay(isSelected?null:dateStr2)} style={{minHeight:52,padding:'4px',borderRadius:10,background:isToday?`${C.gold}22`:isSelected?'rgba(255,255,255,0.6)':'rgba(255,255,255,0.25)',border:isToday?`1.5px solid ${C.gold}`:isSelected?`1.5px solid rgba(255,255,255,0.8)`:'1px solid rgba(255,255,255,0.3)',cursor:'pointer',transition:'all 0.15s'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.5)'} onMouseLeave={e=>e.currentTarget.style.background=isToday?`${C.gold}22`:isSelected?'rgba(255,255,255,0.6)':'rgba(255,255,255,0.25)'}>
                      <div style={{fontSize:12,fontWeight:isToday?800:600,color:isToday?C.goldDark:C.choc,marginBottom:2}}>{day}</div>
                      {dayEvents.slice(0,2).map(ev=>(
                        <div key={ev.id} style={{fontSize:8,fontWeight:700,color:'white',background:EVENT_COLORS[ev.type]||C.choc3,borderRadius:4,padding:'1px 4px',marginBottom:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ev.title}</div>
                      ))}
                      {dayEvents.length>2&&<div style={{fontSize:8,fontWeight:700,color:C.choc3}}>+{dayEvents.length-2}</div>}
                    </div>
                  );
                })}
              </div>

              {/* SELECTED DAY EVENTS */}
              {selectedDay&&getEventsForDate(selectedDay).length>0&&(
                <div style={{marginTop:16,paddingTop:16,borderTop:'1px solid rgba(255,255,255,0.4)'}}>
                  <div style={{fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:C.choc3,marginBottom:10}}>
                    {new Date(selectedDay+'T12:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}
                  </div>
                  {getEventsForDate(selectedDay).map(ev=>(
                    <div key={ev.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'rgba(255,255,255,0.5)',borderRadius:10,marginBottom:8,borderLeft:`3px solid ${EVENT_COLORS[ev.type]||C.choc3}`}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:C.choc}}>{ev.title}</div>
                        {ev.time&&<div style={{fontSize:11,fontWeight:500,color:C.choc3,marginTop:2}}>{ev.time}</div>}
                        {ev.notes&&<div style={{fontSize:11,fontWeight:500,color:C.choc3,marginTop:2}}>{ev.notes}</div>}
                      </div>
                      <span style={badge(EVENT_COLORS[ev.type]||C.choc3)}>{ev.type}</span>
                      <span style={{cursor:'pointer',color:C.choc3,fontSize:16}} onClick={async()=>{await fetch('/api/events',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:ev.id})});await loadAll();}}>×</span>
                    </div>
                  ))}
                </div>
              )}

              {/* UPCOMING */}
              <div style={{marginTop:16,paddingTop:16,borderTop:'1px solid rgba(255,255,255,0.4)'}}>
                <div style={{fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:C.choc3,marginBottom:10}}>Upcoming</div>
                {calEvents.filter(e=>e.date>=new Date().toISOString().split('T')[0]).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5).map(ev=>(
                  <div key={ev.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.3)'}}>
                    <div style={{width:36,textAlign:'center'}}>
                      <div style={{fontSize:16,fontWeight:800,color:C.goldDark,fontFamily:"'Playfair Display',serif"}}>{new Date(ev.date+'T12:00:00').getDate()}</div>
                      <div style={{fontSize:9,fontWeight:700,color:C.choc3,textTransform:'uppercase'}}>{new Date(ev.date+'T12:00:00').toLocaleDateString('en-US',{month:'short'})}</div>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:C.choc}}>{ev.title}</div>
                      {ev.time&&<div style={{fontSize:11,fontWeight:500,color:C.choc3}}>{ev.time}</div>}
                    </div>
                    <span style={badge(EVENT_COLORS[ev.type]||C.choc3)}>{ev.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ LUNCHES ══════════════════════════════════════════ */}
        {tab==='lunches'&&(
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div style={sectionTitle}>Lunch Tracker</div>
              <button style={btn.primary} onClick={()=>setShowAddLunch(true)}>+ Add Office</button>
            </div>
            {[['Ordered','Confirmed — confirm delivery or follow up',C.gold],['Pending','QR scanned — waiting on order submission',C.choc3],['To Schedule','Not yet offered — slate on next route','rgba(122,96,80,0.8)'],['Delivered','Done — relationship locked',C.sage]].map(([status,desc,color])=>{
              const group=lunches.filter(l=>l.status===status);
              if(!group.length)return null;
              return(
                <div key={status} style={{marginBottom:24}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                    <div style={{width:10,height:10,borderRadius:'50%',background:color,flexShrink:0}}></div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:C.choc}}>{status}</div>
                    <div style={{fontSize:11,fontWeight:500,color:C.choc3}}>{desc}</div>
                    <div style={{flex:1,height:1,background:'linear-gradient(90deg,rgba(201,169,110,0.3),transparent)',marginLeft:4}}></div>
                    <div style={{fontSize:11,fontWeight:600,color:C.choc3}}>{group.length}</div>
                  </div>
                  <div style={{...glass({borderRadius:16}),overflow:'hidden'}}>
                    {group.map((l,i)=>(
                      <div key={l.id} style={{padding:'14px 16px',background:i%2===0?'rgba(255,255,255,0.1)':'rgba(255,245,230,0.15)',borderBottom:i<group.length-1?'1px solid rgba(255,255,255,0.3)':'none',borderLeft:`3px solid ${color}`}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10,marginBottom:6}}>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontWeight:700,fontSize:13,color:C.choc,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l.office}</div>
                            {l.contact&&<div style={{fontSize:11,fontWeight:500,color:C.choc3,marginTop:2}}>{l.contact}</div>}
                          </div>
                          <div style={{display:'flex',gap:5,flexShrink:0}}>
                            {status!=='Delivered'&&<button style={btn.primary} onClick={()=>updateLunch(l.id,{status:'Delivered'})}>Delivered</button>}
                            {(status==='To Schedule'||status==='Pending')&&<button style={{...btn.secondary,...btn.sm}} onClick={()=>updateLunch(l.id,{status:'Ordered'})}>Ordered</button>}
                            <button style={{...btn.secondary,...btn.sm}} onClick={()=>setEditLunch({...l})}>Edit</button>
                          </div>
                        </div>
                        <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>
                          {l.restaurant&&<div style={{fontSize:12,fontWeight:700,color:C.goldDark}}>{l.restaurant}</div>}
                          {l.date&&<div style={{fontSize:12,fontWeight:500,color:C.choc3,fontFamily:'monospace'}}>{new Date(l.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</div>}
                          {l.staffCount&&<div style={{fontSize:11,fontWeight:500,color:C.choc3}}>{l.staffCount} staff</div>}
                          {l.notes&&<div style={{fontSize:11,fontWeight:500,color:C.choc3,width:'100%',marginTop:2,lineHeight:1.5}}>{l.notes}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ SUPPLIES ══════════════════════════════════════ */}
        {tab==='supplies'&&(
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div style={sectionTitle}>Supply Depot</div>
              <button style={btn.primary} onClick={()=>setShowAddSupply(true)}>+ Add Item</button>
            </div>
            <div style={glassCard({maxWidth:500})}>
              {supplies.map((sup,i)=>(
                <div key={sup.id} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 0',borderBottom:i<supplies.length-1?'1px solid rgba(255,255,255,0.4)':'none'}}>
                  <div style={{flex:1,fontSize:13,fontWeight:700,color:C.choc}}>{sup.name}</div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <button onClick={()=>adjSupply(sup.id,sup.count,-1)} style={{width:30,height:30,borderRadius:8,...glass({borderRadius:8,padding:0}),cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:C.choc,border:'1px solid rgba(255,255,255,0.5)'}}>−</button>
                    <div style={{fontFamily:'monospace',fontSize:22,fontWeight:800,minWidth:42,textAlign:'center',color:sup.count<=sup.low_alert?C.hot:C.sage}}>{sup.count}</div>
                    <button onClick={()=>adjSupply(sup.id,sup.count,1)} style={{width:30,height:30,borderRadius:8,...glass({borderRadius:8,padding:0}),cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:C.choc,border:'1px solid rgba(255,255,255,0.5)'}}>+</button>
                  </div>
                  <div style={{fontSize:10,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.07em',color:sup.count<=sup.low_alert?C.hot:C.sage,minWidth:50,textAlign:'right'}}>{sup.count<=sup.low_alert?'Restock':'Stocked'}</div>
                  <span style={{cursor:'pointer',color:C.choc3,fontSize:16}} onClick={()=>deleteSupply(sup.id)}>×</span>
                </div>
              ))}
              <div style={{marginTop:14,fontSize:11,fontWeight:500,color:C.choc3,lineHeight:1.6}}>Storage: Public Storage, 601 N Stemmons Fwy, Lewisville 75067. Restock on Friday admin day.</div>
            </div>
          </div>
        )}

        {/* ══ REPORTS ══════════════════════════════════════════ */}
        {tab==='reports'&&(
          <div>
            <div style={sectionTitle}>Reports</div>
            <div style={glassCard()}>
              <div style={{...cardHeader,paddingBottom:8,marginBottom:10}}>
                <div style={cardLabel}>Your Field Notes — Scratch Format OK</div>
              </div>
              <div style={{fontSize:12,fontWeight:500,color:C.choc3,marginBottom:10,lineHeight:1.7}}>Dump your notes exactly as you took them in the field. Claude fixes the wording and generates your EOD email, Referral Lab notes, and Excel notes simultaneously.</div>
              <textarea style={{...input,minHeight:200,fontSize:13}} value={scratchNotes} onChange={e=>setScratchNotes(e.target.value)} placeholder={'Milestones - met Leah, needed cards, met dr patel very nice\nDivine - met illiani, dirty soda, online referrals\nFamily Smiles - minnie excited, needs ref forms, bought jewelry from 9yr old cancer fundraiser...\n\nAttempted: Ace Smile - closed'}/>
              <button style={{...btn.primary,width:'100%',padding:'13px'}} onClick={generateReports} disabled={reportLoading}>{reportLoading?'Generating all reports...':'Generate EOD + Referral Lab + Excel Notes'}</button>
            </div>
            {eodDraft&&(
              <div style={glassCard()}>
                <div style={cardHeader}>
                  <div style={cardLabel}>EOD Email Draft</div>
                  <div style={{display:'flex',gap:12}}>
                    <span style={{fontSize:12,fontWeight:700,color:C.goldDark,cursor:'pointer'}} onClick={()=>navigator.clipboard.writeText(eodDraft)}>Copy</span>
                    <span style={{fontSize:12,fontWeight:700,color:C.goldDark,cursor:'pointer'}} onClick={()=>window.open('https://outlook.office.com/mail/new','_blank')}>Outlook </span>
                  </div>
                </div>
                <div style={{fontSize:13,fontWeight:500,color:C.choc,lineHeight:1.9,whiteSpace:'pre-wrap',background:'rgba(255,255,255,0.5)',padding:16,borderRadius:12,border:'1px solid rgba(255,255,255,0.5)'}}>{eodDraft}</div>
              </div>
            )}
            {rlDraft&&(
              <div style={glassCard()}>
                <div style={cardHeader}>
                  <div style={cardLabel}>Referral Lab Notes</div>
                  <span style={{fontSize:12,fontWeight:700,color:C.goldDark,cursor:'pointer'}} onClick={()=>navigator.clipboard.writeText(rlDraft)}>Copy</span>
                </div>
                <div style={{fontSize:13,fontWeight:500,color:C.choc,lineHeight:1.9,whiteSpace:'pre-wrap',background:'rgba(255,255,255,0.5)',padding:16,borderRadius:12,border:'1px solid rgba(255,255,255,0.5)'}}>{rlDraft}</div>
              </div>
            )}
            {excelDraft&&(
              <div style={glassCard()}>
                <div style={cardHeader}>
                  <div style={cardLabel}>Excel / Simple Notes</div>
                  <span style={{fontSize:12,fontWeight:700,color:C.goldDark,cursor:'pointer'}} onClick={()=>navigator.clipboard.writeText(excelDraft)}>Copy</span>
                </div>
                <div style={{fontSize:13,fontWeight:500,color:C.choc,lineHeight:1.9,whiteSpace:'pre-wrap',background:'rgba(255,255,255,0.5)',padding:16,borderRadius:12,border:'1px solid rgba(255,255,255,0.5)'}}>{excelDraft}</div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,...glass({borderRadius:0,borderBottom:'none',borderLeft:'none',borderRight:'none'}),display:'flex',zIndex:100,height:68,boxShadow:'0 -4px 20px rgba(160,120,48,0.12)'}}>
        {TABS.map((t,i)=>(
          <div key={t} onClick={()=>setTab(t)} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',color:tab===t?C.goldDark:C.choc3,borderTop:tab===t?`2.5px solid ${C.gold}`:'2.5px solid transparent',paddingTop:4,transition:'all 0.15s',gap:2}}>
            <div style={{fontSize:18,lineHeight:1}}>{TAB_ICONS[i]}</div>
            <div style={{fontSize:8,fontWeight:800,letterSpacing:'0.07em',textTransform:'uppercase'}}>{TAB_LABELS[i]}</div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button onClick={()=>setTab('field')} style={{position:'fixed',bottom:78,right:16,width:52,height:52,borderRadius:'50%',background:`linear-gradient(135deg,${C.goldDark},${C.gold})`,color:'white',border:'none',fontSize:22,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 20px ${C.gold}55`,cursor:'pointer',zIndex:99,transition:'transform 0.2s'}} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.08)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>+</button>

      {/* ─── MODALS ───────────────────────────────────────────── */}

      {/* OFFICE DETAIL */}
      {selectedOffice&&(
        <div style={modal} onClick={e=>e.target===e.currentTarget&&setSelectedOffice(null)}>
          <div style={modalBox}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
              <div style={{flex:1,paddingRight:12}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:C.choc,marginBottom:6}}>{selectedOffice.name}</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:4}}>
                  <span style={badge(selectedOffice.tier==='hot'?C.hot:C.goldDark)}>{selectedOffice.tier}</span>
                  {selectedOffice.topReferrer&&<span style={badge(C.goldDark)}>Top Referrer</span>}
                  <span style={{fontSize:11,fontWeight:700,color:isOverdue(selectedOffice.lastVisit)?'#E85C5C':C.sage}}>{!selectedOffice.lastVisit?'Never visited':`Last: ${Math.floor((Date.now()-new Date(selectedOffice.lastVisit))/864e5)}d ago`}</span>
                  {selectedOffice.lastAttempt&&<span style={{fontSize:11,fontWeight:700,color:C.lav}}>Attempted {new Date(selectedOffice.lastAttempt).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>}
                </div>
              </div>
              <span style={{cursor:'pointer',color:C.choc3,fontSize:22}} onClick={()=>setSelectedOffice(null)}>×</span>
            </div>
            {selectedOffice.notes&&(
              <div style={{background:`${C.gold}18`,border:`1px solid ${C.gold}33`,borderRadius:12,padding:'12px 14px',marginBottom:14}}>
                <div style={{fontSize:10,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:C.goldDark,marginBottom:6}}>Field Intel</div>
                <div style={{fontSize:13,fontWeight:500,color:C.choc,lineHeight:1.7,whiteSpace:'pre-wrap'}}>{selectedOffice.notes}</div>
              </div>
            )}
            <div style={{height:1,background:'rgba(255,255,255,0.5)',margin:'12px 0'}}/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
              {[{l:'Contact',f:'contact',p:'Front desk, OM...'},{l:'Doctor(s)',f:'doctor',p:'Dr. Last Name'},{l:'Phone',f:'phone',p:'(XXX) XXX-XXXX'},{l:'Email',f:'email',p:'office@email.com'}].map(({l,f,p})=>(
                <div key={f}>
                  <div style={label}>{l}</div>
                  <input style={{...input,marginBottom:0,fontSize:13}} defaultValue={selectedOffice[f]||''} placeholder={p} onBlur={async(e)=>{if(e.target.value!==(selectedOffice[f]||'')){await updateOfficeField(selectedOffice.id,f,e.target.value);setSelectedOffice({...selectedOffice,[f]:e.target.value});}}}/>
                </div>
              ))}
              <div style={{gridColumn:'1/-1'}}><div style={label}>Address</div><input style={{...input,marginBottom:0,fontSize:13}} defaultValue={selectedOffice.address||''} placeholder="Full address" onBlur={async(e)=>{if(e.target.value!==(selectedOffice.address||'')){await updateOfficeField(selectedOffice.id,'address',e.target.value);setSelectedOffice({...selectedOffice,address:e.target.value});}}}/></div>
              <div style={{gridColumn:'1/-1'}}><div style={label}>Website</div><input style={{...input,marginBottom:0,fontSize:13}} defaultValue={selectedOffice.website||''} placeholder="https://..." onBlur={async(e)=>{if(e.target.value!==(selectedOffice.website||'')){await updateOfficeField(selectedOffice.id,'website',e.target.value);setSelectedOffice({...selectedOffice,website:e.target.value});}}}/></div>
              <div><div style={label}>Hours</div><input style={{...input,marginBottom:0,fontSize:13}} defaultValue={selectedOffice.hours||''} placeholder="Mon-Fri 8-5" onBlur={async(e)=>{if(e.target.value!==(selectedOffice.hours||'')){await updateOfficeField(selectedOffice.id,'hours',e.target.value);setSelectedOffice({...selectedOffice,hours:e.target.value});}}}/></div>
              <div><div style={label}>Closed Days</div><input style={{...input,marginBottom:0,fontSize:13,color:C.hot}} defaultValue={selectedOffice.closedDays||''} placeholder="Mondays, Sat-Sun" onBlur={async(e)=>{if(e.target.value!==(selectedOffice.closedDays||'')){await updateOfficeField(selectedOffice.id,'closedDays',e.target.value);setSelectedOffice({...selectedOffice,closedDays:e.target.value});}}}/></div>
              <div><div style={label}>Territory</div><input style={{...input,marginBottom:0,fontSize:13}} defaultValue={selectedOffice.territory||''} placeholder="Flower Mound" onBlur={async(e)=>{if(e.target.value!==(selectedOffice.territory||'')){await updateOfficeField(selectedOffice.id,'territory',e.target.value);setSelectedOffice({...selectedOffice,territory:e.target.value});}}}/></div>
              <div><div style={label}>DSO / Group</div><input style={{...input,marginBottom:0,fontSize:13}} defaultValue={selectedOffice.dso||''} placeholder="Dental Depot..." onBlur={async(e)=>{if(e.target.value!==(selectedOffice.dso||'')){await updateOfficeField(selectedOffice.id,'dso',e.target.value);setSelectedOffice({...selectedOffice,dso:e.target.value});}}}/></div>
              <div style={{gridColumn:'1/-1'}}><div style={label}>At a Glance</div><textarea style={{...input,marginBottom:0,fontSize:13,minHeight:60}} defaultValue={selectedOffice.atAGlance||''} placeholder="The one-line assistant summary..." onBlur={async(e)=>{if(e.target.value!==(selectedOffice.atAGlance||'')){await updateOfficeField(selectedOffice.id,'atAGlance',e.target.value);setSelectedOffice({...selectedOffice,atAGlance:e.target.value});}}}/></div>
              <div style={{gridColumn:'1/-1'}}><div style={label}>Open Follow-ups</div><textarea style={{...input,marginBottom:0,fontSize:13,minHeight:60,color:C.sage}} defaultValue={selectedOffice.openFollowUps||''} placeholder="What's owed / pending..." onBlur={async(e)=>{if(e.target.value!==(selectedOffice.openFollowUps||'')){await updateOfficeField(selectedOffice.id,'openFollowUps',e.target.value);setSelectedOffice({...selectedOffice,openFollowUps:e.target.value});}}}/></div>
              <div>
                <div style={label}>Tier</div>
                <select style={{...input,marginBottom:0,fontSize:13}} value={selectedOffice.tier} onChange={async(e)=>{await updateOfficeField(selectedOffice.id,'tier',e.target.value);setSelectedOffice({...selectedOffice,tier:e.target.value});}}>
                  <option value="hot">Hot</option><option value="warm">Warm</option><option value="cold">Cold</option>
                </select>
              </div>
              <div><div style={label}>Last Gift</div><input style={{...input,marginBottom:0,fontSize:13,color:C.goldDark}} defaultValue={selectedOffice.gift||''} placeholder="Last drop..." onBlur={async(e)=>{if(e.target.value!==(selectedOffice.gift||'')){await updateOfficeField(selectedOffice.id,'gift',e.target.value);setSelectedOffice({...selectedOffice,gift:e.target.value});}}}/></div>
              <div style={{gridColumn:'1/-1'}}><div style={label}>Next Action</div><input style={{...input,marginBottom:0,fontSize:13,color:C.sage}} defaultValue={selectedOffice.nextAction||''} placeholder="Next steps..." onBlur={async(e)=>{if(e.target.value!==(selectedOffice.nextAction||'')){await updateOfficeField(selectedOffice.id,'nextAction',e.target.value);setSelectedOffice({...selectedOffice,nextAction:e.target.value});}}}/></div>
              <div style={{gridColumn:'1/-1'}}><div style={label}>Full Notes</div><textarea style={{...input,marginBottom:0,fontSize:13,minHeight:100}} defaultValue={selectedOffice.notes||''} placeholder="Office intel, Dr. Patel notes, therapy dog, anything important..." onBlur={async(e)=>{if(e.target.value!==(selectedOffice.notes||'')){await updateOfficeField(selectedOffice.id,'notes',e.target.value);setSelectedOffice({...selectedOffice,notes:e.target.value});}}}/></div>
            </div>
            <div style={{height:1,background:'rgba(255,255,255,0.5)',margin:'12px 0'}}/>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:C.choc3,marginBottom:8}}>Doctors</div>
              {doctors.filter(d=>d.office===selectedOffice.name).map(d=>(
                <div key={d.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',background:'rgba(255,255,255,0.4)',borderRadius:10,marginBottom:6}}>
                  <div style={{minWidth:0}}><div style={{fontSize:13,fontWeight:700,color:C.choc}}>{d.name}</div>{(d.specialty||d.notes)&&<div style={{fontSize:11,color:C.choc3}}>{[d.specialty,d.notes].filter(Boolean).join(' \u00b7 ')}</div>}</div>
                  {d.referralVolume>0&&<span style={badge(C.goldDark)}>{d.referralVolume}/yr</span>}
                </div>
              ))}
              <div style={{display:'flex',gap:8,marginTop:6}}>
                <input style={{...input,marginBottom:0,fontSize:13,flex:1}} value={newDoctorName} onChange={e=>setNewDoctorName(e.target.value)} placeholder="Add doctor — Dr. Name" onKeyDown={e=>e.key==='Enter'&&addDoctor()}/>
                <button style={{...btn.secondary,whiteSpace:'nowrap'}} onClick={addDoctor}>+ Add</button>
              </div>
            </div>
            <div style={{height:1,background:'rgba(255,255,255,0.5)',margin:'12px 0'}}/>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              <button style={btn.primary} onClick={()=>{if(!route.find(r=>r.name===selectedOffice.name))updateRoute([...route,{...selectedOffice,order:route.length+1,done:false,stopNote:''}]);setSelectedOffice(null);setTab('command');}}>+ Add to Route</button>
              {selectedOffice.address&&<button style={btn.secondary} onClick={()=>window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedOffice.address+' '+selectedOffice.city+' TX')}`,'_blank')}>Google Maps</button>}
              <button style={btn.secondary} onClick={()=>{setQuickNoteOffice(selectedOffice.name);setSelectedOffice(null);setTab('field');}}>Quick Note</button>
              <button style={btn.danger} onClick={()=>deleteOffice(selectedOffice.id)}>Remove Office</button>
            </div>
          </div>
        </div>
      )}

      {/* VISIT DETAIL */}
      {selectedVisit&&(
        <div style={modal} onClick={e=>e.target===e.currentTarget&&setSelectedVisit(null)}>
          <div style={modalBox}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
              <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:C.choc,marginBottom:4}}>{selectedVisit.office}</div><div style={{fontSize:11,fontWeight:600,color:C.choc3}}>{new Date(selectedVisit.date).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</div></div>
              <span style={{cursor:'pointer',color:C.choc3,fontSize:22}} onClick={()=>setSelectedVisit(null)}>×</span>
            </div>
            <div style={{height:1,background:'rgba(255,255,255,0.5)',margin:'12px 0'}}/>
            {[['Doctor',selectedVisit.doctor,C.choc],['Contact',selectedVisit.contact,C.choc],['Gift / Drop',selectedVisit.gift,C.goldDark],['Next Action',selectedVisit.nextAction,C.sage]].filter(([,v])=>v).map(([l,val,color])=>(
              <div key={l} style={{marginBottom:10}}><div style={{fontSize:10,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:C.choc3,marginBottom:3}}>{l}</div><div style={{fontSize:13,fontWeight:600,color}}>{val}</div></div>
            ))}
            {selectedVisit.notes&&(<div style={{marginBottom:10}}><div style={{fontSize:10,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:C.choc3,marginBottom:3}}>Notes</div><div style={{fontSize:13,fontWeight:500,color:C.choc,background:'rgba(255,255,255,0.5)',border:'1px solid rgba(255,255,255,0.5)',borderRadius:10,padding:12,lineHeight:1.7,whiteSpace:'pre-wrap'}}>{selectedVisit.notes}</div></div>)}
            <div style={{height:1,background:'rgba(255,255,255,0.5)',margin:'12px 0'}}/>
            <div style={{display:'flex',gap:8}}><button style={btn.secondary} onClick={()=>setSelectedVisit(null)}>Close</button><button style={btn.danger} onClick={()=>deleteVisit(selectedVisit.id)}>Delete Visit</button></div>
          </div>
        </div>
      )}

      {/* TASK NOTE */}
      {taskNoteModal&&(
        <div style={modal} onClick={e=>e.target===e.currentTarget&&setTaskNoteModal(null)}>
          <div style={modalBox}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:C.choc,marginBottom:10}}>Add Note</div>
            <div style={{fontSize:13,fontWeight:600,color:C.choc2,marginBottom:12,padding:'10px 14px',background:'rgba(255,255,255,0.5)',borderRadius:10}}>{taskNoteModal.text}</div>
            {taskNoteModal.notes&&(<div style={{marginBottom:14}}><div style={{fontSize:10,fontWeight:800,textTransform:'uppercase',letterSpacing:'0.08em',color:C.choc3,marginBottom:8}}>Previous Notes</div>{taskNoteModal.notes.split('\n').map((note,i)=>(<div key={i} style={{fontSize:12,fontWeight:500,color:C.choc3,padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,0.4)',lineHeight:1.5}}>{note}</div>))}</div>)}
            <div style={label}>New Note</div>
            <textarea style={{...input,minHeight:80}} value={taskNoteText} onChange={e=>setTaskNoteText(e.target.value)} placeholder="Called 7/16 — office manager out, try again Monday..." autoFocus/>
            <div style={{display:'flex',gap:8}}><button style={btn.primary} onClick={saveTaskNote}>Save Note</button><button style={btn.secondary} onClick={()=>setTaskNoteModal(null)}>Cancel</button></div>
          </div>
        </div>
      )}

      {/* EDIT TASK */}
      {editTaskModal&&(
        <div style={modal} onClick={e=>e.target===e.currentTarget&&setEditTaskModal(null)}>
          <div style={modalBox}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:C.choc,marginBottom:16}}>Edit Task</div>
            <div style={label}>Task</div>
            <textarea style={{...input,minHeight:80}} value={editTaskModal.text} onChange={e=>setEditTaskModal({...editTaskModal,text:e.target.value})}/>
            <div style={label}>Priority</div>
            <select style={input} value={editTaskModal.priority} onChange={e=>setEditTaskModal({...editTaskModal,priority:e.target.value})}><option value="urgent">Urgent</option><option value="today">Today</option><option value="week">This Week</option></select>
            <div style={{display:'flex',gap:8}}><button style={btn.primary} onClick={saveTaskEdit}>Save</button><button style={btn.secondary} onClick={()=>setEditTaskModal(null)}>Cancel</button></div>
          </div>
        </div>
      )}

      {/* ADD TASK */}
      {showAddTask&&(
        <div style={modal} onClick={e=>e.target===e.currentTarget&&setShowAddTask(false)}>
          <div style={modalBox}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:C.choc,marginBottom:16}}>Add Task</div>
            <div style={label}>Task</div>
            <textarea style={{...input,minHeight:80}} value={newTask.text} onChange={e=>setNewTask({...newTask,text:e.target.value})} placeholder="What needs to get done?" autoFocus/>
            <div style={label}>Priority</div>
            <select style={input} value={newTask.priority} onChange={e=>setNewTask({...newTask,priority:e.target.value})}><option value="urgent">Urgent</option><option value="today">Today</option><option value="week">This Week</option></select>
            <div style={{display:'flex',gap:8}}><button style={btn.primary} onClick={addTask}>Add Task</button><button style={btn.secondary} onClick={()=>setShowAddTask(false)}>Cancel</button></div>
          </div>
        </div>
      )}

      {/* ADD OFFICE */}
      {showAddOffice&&(
        <div style={modal} onClick={e=>e.target===e.currentTarget&&setShowAddOffice(false)}>
          <div style={modalBox}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:C.choc,marginBottom:16}}>Add Office</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div style={{gridColumn:'1/-1'}}><div style={label}>Practice Name</div><input style={input} value={newOffice.name} onChange={e=>setNewOffice({...newOffice,name:e.target.value})} placeholder="Practice name" autoFocus/></div>
              <div><div style={label}>Doctor</div><input style={input} value={newOffice.doctor} onChange={e=>setNewOffice({...newOffice,doctor:e.target.value})} placeholder="Dr. Last Name"/></div>
              <div><div style={label}>Contact</div><input style={input} value={newOffice.contact} onChange={e=>setNewOffice({...newOffice,contact:e.target.value})} placeholder="Front desk, OM..."/></div>
              <div><div style={label}>City</div><select style={input} value={newOffice.city} onChange={e=>setNewOffice({...newOffice,city:e.target.value})}><option>Flower Mound</option><option>Highland Village</option><option>Lewisville</option><option>Other</option></select></div>
              <div><div style={label}>Tier</div><select style={input} value={newOffice.tier} onChange={e=>setNewOffice({...newOffice,tier:e.target.value})}><option value="warm">Warm</option><option value="hot">Hot</option><option value="cold">Cold</option></select></div>
              <div style={{gridColumn:'1/-1'}}><div style={label}>Address</div><input style={input} value={newOffice.address} onChange={e=>setNewOffice({...newOffice,address:e.target.value})} placeholder="Full address"/></div>
              <div><div style={label}>Phone</div><input style={input} value={newOffice.phone} onChange={e=>setNewOffice({...newOffice,phone:e.target.value})} placeholder="(XXX) XXX-XXXX"/></div>
              <div><div style={label}>Email</div><input style={input} value={newOffice.email} onChange={e=>setNewOffice({...newOffice,email:e.target.value})} placeholder="office@email.com"/></div>
              <div style={{gridColumn:'1/-1'}}><div style={label}>Notes</div><textarea style={{...input,minHeight:80}} value={newOffice.notes} onChange={e=>setNewOffice({...newOffice,notes:e.target.value})} placeholder="First impression, referral interest, intel..."/></div>
            </div>
            <div style={{display:'flex',gap:8}}><button style={btn.primary} onClick={addOffice}>Add Office</button><button style={btn.secondary} onClick={()=>setShowAddOffice(false)}>Cancel</button></div>
          </div>
        </div>
      )}

      {/* ADD LUNCH */}
      {showAddLunch&&(
        <div style={modal} onClick={e=>e.target===e.currentTarget&&setShowAddLunch(false)}>
          <div style={modalBox}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:C.choc,marginBottom:16}}>Add Lunch</div>
            <div style={label}>Office Name</div><input style={input} value={newLunch.office} onChange={e=>setNewLunch({...newLunch,office:e.target.value})} placeholder="Practice name" autoFocus/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><div style={label}>Doctor</div><input style={input} value={newLunch.doctor} onChange={e=>setNewLunch({...newLunch,doctor:e.target.value})} placeholder="Dr. Last Name"/></div>
              <div><div style={label}>Contact</div><input style={input} value={newLunch.contact} onChange={e=>setNewLunch({...newLunch,contact:e.target.value})} placeholder="Front desk, OM..."/></div>
              <div><div style={label}>Status</div><select style={input} value={newLunch.status} onChange={e=>setNewLunch({...newLunch,status:e.target.value})}><option value="To Schedule">To Schedule</option><option value="Pending">Pending (QR Sent)</option><option value="Ordered">Ordered</option><option value="Delivered">Delivered</option></select></div>
              <div><div style={label}>Restaurant</div><input style={input} value={newLunch.restaurant} onChange={e=>setNewLunch({...newLunch,restaurant:e.target.value})} placeholder="e.g. Chuy's..."/></div>
              <div><div style={label}>Date</div><input style={input} type="date" value={newLunch.date} onChange={e=>setNewLunch({...newLunch,date:e.target.value})}/></div>
              <div><div style={label}>Staff Count</div><input style={input} type="number" value={newLunch.staffCount} onChange={e=>setNewLunch({...newLunch,staffCount:e.target.value})} placeholder="# staff"/></div>
            </div>
            <div style={label}>Notes</div><textarea style={{...input,minHeight:70}} value={newLunch.notes} onChange={e=>setNewLunch({...newLunch,notes:e.target.value})} placeholder="Dr. Patel requested, dietary restrictions, EzCater order..."/>
            <div style={{display:'flex',gap:8}}><button style={btn.primary} onClick={addLunch}>Add</button><button style={btn.secondary} onClick={()=>setShowAddLunch(false)}>Cancel</button></div>
          </div>
        </div>
      )}

      {/* EDIT LUNCH */}
      {editLunch&&(
        <div style={modal} onClick={e=>e.target===e.currentTarget&&setEditLunch(null)}>
          <div style={modalBox}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:C.choc,marginBottom:16}}>Edit — {editLunch.office}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div style={{gridColumn:'1/-1'}}><div style={label}>Office</div><input style={input} value={editLunch.office||''} onChange={e=>setEditLunch({...editLunch,office:e.target.value})}/></div>
              <div><div style={label}>Doctor</div><input style={input} value={editLunch.doctor||''} onChange={e=>setEditLunch({...editLunch,doctor:e.target.value})}/></div>
              <div><div style={label}>Contact</div><input style={input} value={editLunch.contact||''} onChange={e=>setEditLunch({...editLunch,contact:e.target.value})}/></div>
              <div><div style={label}>Status</div><select style={input} value={editLunch.status} onChange={e=>setEditLunch({...editLunch,status:e.target.value})}><option value="To Schedule">To Schedule</option><option value="Pending">Pending</option><option value="Ordered">Ordered</option><option value="Delivered">Delivered</option></select></div>
              <div><div style={label}>Restaurant</div><input style={input} value={editLunch.restaurant||''} onChange={e=>setEditLunch({...editLunch,restaurant:e.target.value})}/></div>
              <div><div style={label}>Date</div><input style={input} type="date" value={editLunch.date||''} onChange={e=>setEditLunch({...editLunch,date:e.target.value})}/></div>
              <div><div style={label}>Staff Count</div><input style={input} type="number" value={editLunch.staffCount||''} onChange={e=>setEditLunch({...editLunch,staffCount:e.target.value})}/></div>
            </div>
            <div style={label}>Notes</div><textarea style={{...input,minHeight:70}} value={editLunch.notes||''} onChange={e=>setEditLunch({...editLunch,notes:e.target.value})}/>
            <div style={{display:'flex',justifyContent:'space-between',gap:8}}>
              <div style={{display:'flex',gap:8}}><button style={btn.primary} onClick={saveLunchEdit}>Save</button><button style={btn.secondary} onClick={()=>setEditLunch(null)}>Cancel</button></div>
              <button style={btn.danger} onClick={()=>deleteLunch(editLunch.id)}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SUPPLY */}
      {showAddSupply&&(
        <div style={modal} onClick={e=>e.target===e.currentTarget&&setShowAddSupply(false)}>
          <div style={modalBox}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:C.choc,marginBottom:16}}>Add Supply Item</div>
            <div style={label}>Item Name</div><input style={input} value={newSupply.name} onChange={e=>setNewSupply({...newSupply,name:e.target.value})} placeholder="e.g. Referral Pads" autoFocus/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><div style={label}>Count</div><input style={input} type="number" value={newSupply.count} onChange={e=>setNewSupply({...newSupply,count:parseInt(e.target.value)||0})}/></div>
              <div><div style={label}>Low Alert At</div><input style={input} type="number" value={newSupply.low} onChange={e=>setNewSupply({...newSupply,low:parseInt(e.target.value)||5})}/></div>
            </div>
            <div style={{display:'flex',gap:8}}><button style={btn.primary} onClick={addSupply}>Add Item</button><button style={btn.secondary} onClick={()=>setShowAddSupply(false)}>Cancel</button></div>
          </div>
        </div>
      )}

      {/* ADD EVENT */}
      {showAddEvent&&(
        <div style={modal} onClick={e=>e.target===e.currentTarget&&setShowAddEvent(false)}>
          <div style={modalBox}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:C.choc,marginBottom:16}}>Add Calendar Event</div>
            <div style={label}>Event Title</div><input style={input} value={newEvent.title} onChange={e=>setNewEvent({...newEvent,title:e.target.value})} placeholder="e.g. Appreciation Lunch — Active Dental" autoFocus/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><div style={label}>Date</div><input style={input} type="date" value={newEvent.date} onChange={e=>setNewEvent({...newEvent,date:e.target.value})}/></div>
              <div><div style={label}>Time</div><input style={input} value={newEvent.time} onChange={e=>setNewEvent({...newEvent,time:e.target.value})} placeholder="12:00 PM"/></div>
              <div style={{gridColumn:'1/-1'}}><div style={label}>Type</div>
                <select style={input} value={newEvent.type} onChange={e=>setNewEvent({...newEvent,type:e.target.value})}>
                  <option value="visit">Office Visit</option><option value="lunch">Appreciation Lunch</option><option value="meeting">Meeting</option><option value="admin">Admin Day</option><option value="personal">Personal</option><option value="other">Other</option>
                </select>
              </div>
            </div>
            <div style={label}>Notes</div><textarea style={{...input,minHeight:60}} value={newEvent.notes} onChange={e=>setNewEvent({...newEvent,notes:e.target.value})} placeholder="Additional details..."/>
            <div style={{display:'flex',gap:8}}>
              <button style={btn.primary} onClick={async()=>{if(!newEvent.title||!newEvent.date)return;await fetch('/api/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newEvent)});setShowAddEvent(false);setNewEvent({title:'',date:'',time:'',type:'visit',notes:''});await loadAll();}}>Add Event</button>
              <button style={btn.secondary} onClick={()=>setShowAddEvent(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        *{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}
        input::placeholder,textarea::placeholder{color:${C.choc3};opacity:0.6}
        input:focus,textarea:focus,select:focus{border-color:rgba(201,169,110,0.6)!important;box-shadow:0 0 0 3px rgba(201,169,110,0.15)!important;}
        *::-webkit-scrollbar{width:4px}
        *::-webkit-scrollbar-thumb{background:rgba(160,120,48,0.3);border-radius:2px}
        @media(max-width:480px){
          div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  );
}
