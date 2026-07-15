import { useState, useEffect } from 'react';

const GOLD='#A07840',SAGE='#5C7F59',HOT='#C17B5A',WARM='#A07840',COLD='#5C7F59';

const s={
  body:{fontFamily:"'Jost',sans-serif",background:'#FAFAF7',color:'#1A1410',minHeight:'100vh',fontWeight:400},
  topbar:{background:'#FDFCFA',borderBottom:'1px solid #DDD5C4',padding:'0 32px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100},
  logo:{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:500,letterSpacing:'0.12em'},
  nav:{background:'#FDFCFA',borderBottom:'1px solid #DDD5C4',padding:'0 32px',display:'flex',gap:2},
  tab:(a)=>({padding:'13px 18px',fontSize:12,fontWeight:500,letterSpacing:'0.08em',textTransform:'uppercase',color:a?GOLD:'#7A6E64',cursor:'pointer',borderBottom:`2px solid ${a?GOLD:'transparent'}`,transition:'all 0.15s'}),
  main:{padding:'28px 32px',maxWidth:1400,margin:'0 auto'},
  card:{background:'#FDFCFA',border:'1px solid #DDD5C4',borderRadius:12,padding:22,marginBottom:18},
  cardHeader:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,paddingBottom:12,borderBottom:'1px solid #EDE6D6'},
  cardTitle:{fontSize:10,fontWeight:600,letterSpacing:'0.14em',textTransform:'uppercase',color:'#6E5F50'},
  cardAction:{fontSize:12,color:GOLD,cursor:'pointer',fontWeight:500},
  grid2:{display:'grid',gridTemplateColumns:'1fr 360px',gap:20},
  grid2eq:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20},
  statPill:{background:'#FDFCFA',border:'1px solid #DDD5C4',borderRadius:10,padding:'14px 18px',flex:1},
  input:{background:'#FAFAF7',border:'1px solid #DDD5C4',borderRadius:8,color:'#1A1410',fontFamily:"'Jost',sans-serif",fontSize:13,padding:'9px 13px',outline:'none',width:'100%',marginBottom:12},
  textarea:{background:'#FAFAF7',border:'1px solid #DDD5C4',borderRadius:8,color:'#1A1410',fontFamily:"'Jost',sans-serif",fontSize:13,padding:'9px 13px',outline:'none',width:'100%',marginBottom:12,resize:'vertical',minHeight:80},
  select:{background:'#FAFAF7',border:'1px solid #DDD5C4',borderRadius:8,color:'#1A1410',fontFamily:"'Jost',sans-serif",fontSize:13,padding:'9px 13px',outline:'none',width:'100%',marginBottom:12},
  btnPrimary:{background:GOLD,color:'white',border:'none',borderRadius:8,padding:'9px 18px',fontFamily:"'Jost',sans-serif",fontSize:12,fontWeight:600,cursor:'pointer',letterSpacing:'0.06em'},
  btnSecondary:{background:'#F5F0E8',color:'#3D3228',border:'1px solid #DDD5C4',borderRadius:8,padding:'9px 18px',fontFamily:"'Jost',sans-serif",fontSize:12,fontWeight:500,cursor:'pointer'},
  btnSm:{padding:'5px 12px',fontSize:11},
  label:{fontSize:11,fontWeight:500,letterSpacing:'0.07em',color:'#6E5F50',marginBottom:6,display:'block',textTransform:'uppercase'},
  modal:{position:'fixed',inset:0,background:'rgba(44,40,32,0.5)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(2px)'},
  modalBox:{background:'#FAFAF7',border:'1px solid #DDD5C4',borderRadius:14,padding:30,width:560,maxWidth:'95vw',maxHeight:'88vh',overflowY:'auto'},
  modalTitle:{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:500,marginBottom:4},
  tierBadge:(t)=>({fontSize:9,fontWeight:700,padding:'3px 10px',borderRadius:20,textTransform:'uppercase',letterSpacing:'0.07em',display:'inline-block',background:t==='hot'?'rgba(193,123,90,0.12)':t==='warm'?'rgba(160,120,64,0.14)':'rgba(92,127,89,0.14)',color:t==='hot'?HOT:t==='warm'?WARM:COLD}),
  sectionTitle:{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:400,marginBottom:22},
  divider:{height:1,background:'linear-gradient(90deg,transparent,#D4B483,transparent)',margin:'16px 0',opacity:0.4},
  pill:(color)=>({fontSize:10,fontWeight:600,padding:'2px 8px',borderRadius:20,background:color+'22',color:color,textTransform:'uppercase',letterSpacing:'0.06em',display:'inline-block'}),
};

export default function Home() {
  const [page,setPage]=useState('command');
  const [briefing,setBriefing]=useState('Loading your morning briefing...');
  const [offices,setOffices]=useState([]);
  const [visits,setVisits]=useState([]);
  const [tasks,setTasks]=useState([]);
  const [supplies,setSupplies]=useState([]);
  const [route,setRoute]=useState([]);
  const [time,setTime]=useState('');
  const [phase,setPhase]=useState('');
  const [dateStr,setDateStr]=useState('');
  const [alertOn,setAlertOn]=useState(true);
  const [selectedOffice,setSelectedOffice]=useState(null);
  const [selectedVisit,setSelectedVisit]=useState(null);
  const [quickTask,setQuickTask]=useState('');
  const [officeSearch,setOfficeSearch]=useState('');
  const [tierFilter,setTierFilter]=useState('');
  const [cityFilter,setCityFilter]=useState('');
  const [logOffice,setLogOffice]=useState('');
  const [logContact,setLogContact]=useState('');
  const [logGift,setLogGift]=useState('');
  const [logNotes,setLogNotes]=useState('');
  const [logNextAction,setLogNextAction]=useState('');
  const [logTier,setLogTier]=useState('warm');
  const [logLunch,setLogLunch]=useState('no');
  const [logLunchRestaurant,setLogLunchRestaurant]=useState('');
  const [logLunchDate,setLogLunchDate]=useState('');
  const [logLunchNotes,setLogLunchNotes]=useState('');
  const [logAddTask,setLogAddTask]=useState(false);
  const [quickNoteOffice,setQuickNoteOffice]=useState('');
  const [quickNoteType,setQuickNoteType]=useState('Call');
  const [quickNoteText,setQuickNoteText]=useState('');
  const [quickNoteSaving,setQuickNoteSaving]=useState(false);
  const [eodDraft,setEodDraft]=useState('');
  const [showAddOffice,setShowAddOffice]=useState(false);
  const [showAddSupply,setShowAddSupply]=useState(false);
  const [routeSearch,setRouteSearch]=useState('');
  const [smartPlan,setSmartPlan]=useState(null);
  const [planLoading,setPlanLoading]=useState(false);
  const [smartPlanQueue,setSmartPlanQueue]=useState([]);
  const [smartPlanSearch,setSmartPlanSearch]=useState('');
  const [comingDue,setComingDue]=useState([]);
  const [taskNoteModal,setTaskNoteModal]=useState(null);
  const [taskNoteText,setTaskNoteText]=useState('');
  const [showRouteSearch,setShowRouteSearch]=useState(false);
  const [lunches,setLunches]=useState([]);
  const [selectedLunch,setSelectedLunch]=useState(null);
  const [showAddLunch,setShowAddLunch]=useState(false);
  const [editLunch,setEditLunch]=useState(null);
  const [newLunch,setNewLunch]=useState({office:'',doctor:'',contact:'',status:'To Schedule',restaurant:'',date:'',notes:'',staffCount:''});
  const [newOffice,setNewOffice]=useState({name:'',doctor:'',city:'Flower Mound',tier:'warm',address:'',contact:'',notes:''});
  const [newSupply,setNewSupply]=useState({name:'',count:0,low:5});

  useEffect(()=>{loadAll();const t=setInterval(tick,1000);tick();return()=>clearInterval(t);},[]);

  function tick(){
    const n=new Date();
    setTime(n.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',hour12:true}));
    setDateStr(n.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}));
    const h=n.getHours()+n.getMinutes()/60;
    setPhase(h<8?'Pre-Day':h<9?'Morning Prep':h<9.5?'Team Meeting':h<15?'Field Hours':h<16?'EOD Window':'Wrap Up');
  }

  async function loadAll(){
    try{
      const [o,v,t,sp,lu]=await Promise.all([
        fetch('/api/offices').then(r=>r.json()),
        fetch('/api/visits').then(r=>r.json()),
        fetch('/api/tasks').then(r=>r.json()),
        fetch('/api/supplies').then(r=>r.json()),
        fetch('/api/lunches').then(r=>r.json()),
      ]);
      setOffices(Array.isArray(o)?o:[]);
      setVisits(Array.isArray(v)?v:[]);
      setTasks(Array.isArray(t)?t:[]);
      setSupplies(Array.isArray(sp)?sp:[]);
      setLunches(Array.isArray(lu)?lu:[]);
      // Auto generate briefing once loaded
      generateBriefing(Array.isArray(o)?o:[],Array.isArray(t)?t:[]);
    }catch(e){console.error(e);}
  }

  async function generateBriefing(offs,tks){
    const hot=(offs||offices).filter(o=>o.tier==='hot').length;
    const overdue=(offs||offices).filter(o=>!o.lastVisit||(Date.now()-new Date(o.lastVisit))>30*864e5).length;
    try{
      const r=await fetch('/api/briefing',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({hotCount:hot,overdueCount:overdue,route:route.map(s=>s.name).join(', '),tasks:(tks||tasks).filter(t=>!t.done&&t.priority!=='week').map(t=>t.text).join(', '),isFriday:new Date().getDay()===5})});
      const d=await r.json();
      setBriefing(d.briefing||'Good morning, Nikki. Ready for the field.');
    }catch{setBriefing(`Good morning, Nikki. Today is ${dateStr}. Focus on your hot offices and be back by 3:30 PM.`);}
  }

  async function toggleTask(id,done){
    // Optimistic update - update UI immediately
    setTasks(prev=>prev.map(t=>t.id===id?{...t,done:!done}:t));
    try{
      await fetch('/api/tasks',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,done:!done})});
    }catch(e){
      // Revert on error
      setTasks(prev=>prev.map(t=>t.id===id?{...t,done:done}:t));
    }
  }
  async function deleteTask(id){
    // Remove immediately from UI
    setTasks(prev=>prev.filter(t=>t.id!==id));
    await fetch('/api/tasks',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});
  }
  async function quickAddTask(){
    if(!quickTask.trim())return;
    await fetch('/api/tasks',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:quickTask,priority:'today'})});
    setQuickTask('');await loadAll();
  }
  async function logVisit(){
    if(!logOffice)return alert('Select an office.');
    await fetch('/api/visits',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({office:logOffice,gift:logGift,notes:logNotes,nextAction:logNextAction,tier:logTier})});
    setLogGift('');setLogNotes('');setLogNextAction('');setLogOffice('');
    await loadAll();
  }


  async function generateSmartPlan(){
    setPlanLoading(true);
    try{
      const now = Date.now();
      const dow = new Date().getDay();

      if(dow===5){
        setSmartPlan([]);
        setSmartPlanQueue([]);
        setComingDue([]);
        setPlanLoading(false);
        return;
      }

      const BLOCKED = ['irving kids dentist','shine and sparkle dentistry'];
      const ON_HOLD = ['glorious smiles','baylor scott'];
      const refPadsInStock = supplies.some(s=>s.name.toLowerCase().includes('referral')&&s.count>0);
      const cardsInStock = supplies.some(s=>s.name.toLowerCase().includes('card')&&s.count>0);
      const pendingTaskText = tasks.filter(t=>!t.done).map(t=>t.text.toLowerCase());

      const eligible = offices
        .filter(o=>{
          const n=o.name.toLowerCase();
          if(BLOCKED.some(b=>n.includes(b))) return false;
          if(ON_HOLD.some(h=>n.includes(h))) return false;
          if(o.status==='Do Not Target') return false;
          if(o.status==='On Hold - Pending Info') return false;
          return true;
        })
        .map(o=>{
          const daysSince=o.lastVisit?Math.floor((now-new Date(o.lastVisit))/864e5):90;
          const neverVisited=!o.lastVisit;
          const nextLower=(o.nextAction||'').toLowerCase();
          const needsRefPads=nextLower.includes('referral pad')||nextLower.includes('ref pad')||nextLower.includes('owed');
          const needsCards=nextLower.includes('card')&&nextLower.includes('drop');
          const dropBackReady=(needsRefPads&&refPadsInStock)||(needsCards&&cardsInStock);
          const hasExplicitTask=pendingTaskText.some(t=>t.includes(o.name.toLowerCase().slice(0,10))&&(t.includes('call')||t.includes('confirm')||t.includes('lock')));
          const hasOverride=dropBackReady||hasExplicitTask;

          // TIER 1: 25+ days or never visited — fully eligible
          // TIER 2: 20-24 days — eligible as fill-in
          // TIER 3: has override — eligible regardless of time
          const tier1=neverVisited||daysSince>=25||hasOverride;
          const tier2=daysSince>=18&&daysSince<25;
          const isEligible=tier1||tier2;
          if(!isEligible) return null;

          let score=0;
          if(daysSince>=30) score+=50;
          else if(daysSince>=25) score+=35;
          else if(neverVisited) score+=40;
          else if(hasOverride) score+=35;
          else if(tier2) score+=10; // fill-in only

          if(o.tier==='hot') score+=25;
          else if(o.tier==='warm') score+=10;
          if(o.topReferrer) score+=20;
          if((o.referralVolume||0)>20) score+=15;
          if(hasOverride) score+=15;

          return {...o,score,daysSince,neverVisited,hasOverride,dropBackReady,hasExplicitTask,tier1,tier2};
        })
        .filter(Boolean)
        .sort((a,b)=>b.score-a.score);

      // Geo-cluster
      const fm=eligible.filter(o=>o.city==='Flower Mound');
      const hv=eligible.filter(o=>o.city==='Highland Village');
      const lv=eligible.filter(o=>o.city==='Lewisville');
      const ot=eligible.filter(o=>o.city==='Other');

      let clustered;
      if(dow===2) clustered=[...lv,...hv,...fm,...ot];
      else clustered=[...fm,...hv,...lv,...ot];

      // Dedupe
      const seen=new Set();
      const deduped=clustered.filter(o=>{if(seen.has(o.id))return false;seen.add(o.id);return true;});

      // Take up to 7 — prioritize tier1, fill with tier2
      const tier1offices=deduped.filter(o=>o.tier1).slice(0,7);
      const tier2offices=deduped.filter(o=>o.tier2&&!tier1offices.find(t=>t.id===o.id));
      const combined=[...tier1offices,...tier2offices].slice(0,7);
      const suggested=combined.map((o,i)=>({...o,order:i+1,done:false,stopNote:''}));

      // Backup queue
      const selectedIds=new Set(suggested.map(o=>o.id));
      const backup=deduped.filter(o=>!selectedIds.has(o.id)).slice(0,8).map((o,i)=>({...o,order:8+i,done:false,stopNote:''}));

      // Coming due this week (15-24 days)
      const comingDueList=offices
        .filter(o=>{
          const n=o.name.toLowerCase();
          if(BLOCKED.some(b=>n.includes(b))||ON_HOLD.some(h=>n.includes(h))) return false;
          if(o.status==='Do Not Target'||o.status==='On Hold - Pending Info') return false;
          if(!o.lastVisit) return false;
          const d=Math.floor((now-new Date(o.lastVisit))/864e5);
          return d>=15&&d<25;
        })
        .map(o=>({...o,daysSince:Math.floor((now-new Date(o.lastVisit))/864e5)}))
        .sort((a,b)=>b.daysSince-a.daysSince)
        .slice(0,5);

      setSmartPlan(suggested);
      setSmartPlanQueue(backup);
      setComingDue(comingDueList);
    }catch(e){console.error('smart plan error:',e);}
    setPlanLoading(false);
  }

  function acceptSmartPlan(){
    if(smartPlan&&smartPlan.length>0){
      setRoute(smartPlan.map((o,i)=>({...o,order:i+1,done:false})));
      setSmartPlan(null);
      setSmartPlanQueue([]);
    }
  }

  function addToSmartPlan(office){
    if(smartPlan&&!smartPlan.find(s=>s.id===office.id)){
      const updated=[...smartPlan,{...office,order:smartPlan.length+1,done:false,stopNote:''}];
      setSmartPlan(updated);
      setSmartPlanSearch('');
    }
  }

  async function saveTaskNote(){
    if(!taskNoteModal||!taskNoteText.trim()) return;
    const timestamp=new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',hour12:true});
    const noteEntry=`[${timestamp}] ${taskNoteText.trim()}`;
    const updatedText=taskNoteModal.notes
      ? taskNoteModal.text+'||'+taskNoteModal.notes+'||'+noteEntry
      : taskNoteModal.text+'||'+noteEntry;
    // Store notes as appended text with separator
    await fetch('/api/tasks',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      id:taskNoteModal.id,
      text:taskNoteModal.text,
      notes:(taskNoteModal.notes?taskNoteModal.notes+'\n':'')+noteEntry
    })});
    setTaskNoteText('');
    setTaskNoteModal(null);
    await loadAll();
  }

  async function saveQuickNote(){
    if(!quickNoteOffice||!quickNoteText.trim()){alert('Select an office and add a note.');return;}
    setQuickNoteSaving(true);
    const officeRecord=offices.find(o=>o.name===quickNoteOffice);
    const timestamp=new Date();
    const timeStr=timestamp.toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',hour12:true});
    const noteEntry='['+quickNoteType+' — '+timeStr+'] '+quickNoteText.trim();
    try{
      await fetch('/api/visits',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        office:quickNoteOffice,doctor:officeRecord?.doctor||'',contact:'',gift:'',
        notes:noteEntry,nextAction:'',tier:officeRecord?.tier||'warm',
        date:timestamp.toISOString().split('T')[0],
      })});
      const updatedNotes=officeRecord?.notes?officeRecord.notes+' | '+noteEntry:noteEntry;
      await fetch('/api/offices',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:officeRecord?.id,notes:updatedNotes})});
      setQuickNoteOffice('');setQuickNoteText('');setQuickNoteType('Call');
      await loadAll();
    }catch(e){console.error('quick note error:',e);}
    setQuickNoteSaving(false);
  }

  async function smartLogVisit(){
    if(!logOffice){alert('Select an office.');return;}
    const officeRecord=offices.find(o=>o.name===logOffice);
    await fetch('/api/visits',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      office:logOffice,doctor:officeRecord?.doctor||'',contact:logContact,
      gift:logGift,notes:logNotes,nextAction:logNextAction,tier:logTier,
      date:new Date().toISOString().split('T')[0]
    })});
    await fetch('/api/offices',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      id:officeRecord?.id,tier:logTier,
      contact:logContact||officeRecord?.contact,
      gift:logGift||officeRecord?.gift,
      notes:logNotes?(officeRecord?.notes?officeRecord.notes+' | '+logNotes:logNotes):officeRecord?.notes,
      nextAction:logNextAction,
      lastVisit:new Date().toISOString().split('T')[0],
    })});
    if(logLunch!=='no'){
      const lunchStatus=logLunch==='pending'?'Pending':logLunch==='ordered'?'Ordered':'To Schedule';
      await fetch('/api/lunches',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        office:logOffice,doctor:officeRecord?.doctor||'',contact:logContact,
        status:lunchStatus,restaurant:logLunchRestaurant||null,
        date:logLunchDate||null,notes:logLunchNotes||'Discussed during visit',staffCount:null
      })});
    }
    if(logAddTask&&logNextAction){
      await fetch('/api/tasks',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        text:logOffice+' — '+logNextAction,priority:'today',done:false
      })});
    }
    setLogOffice('');setLogContact('');setLogGift('');setLogNotes('');
    setLogNextAction('');setLogTier('warm');setLogLunch('no');
    setLogLunchRestaurant('');setLogLunchDate('');setLogLunchNotes('');
    setLogAddTask(false);
    await loadAll();
  }

  async function addLunch() {
    if(!newLunch.office) return;
    await fetch('/api/lunches',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newLunch)});
    setShowAddLunch(false);
    setNewLunch({office:'',doctor:'',contact:'',status:'To Schedule',restaurant:'',date:'',notes:'',staffCount:''});
    await loadAll();
  }

  async function saveLunchEdit() {
    if(!editLunch) return;
    await fetch('/api/lunches',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(editLunch)});
    setEditLunch(null);
    await loadAll();
  }

  async function deleteLunch(id) {
    await fetch('/api/lunches',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});
    await loadAll();
  }

  async function updateLunch(id, updates) {
    await fetch('/api/lunches',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,...updates})});
    await loadAll();
  }

  async function generateEOD(){
    const today=new Date().toLocaleDateString();
    const todayV=visits.filter(v=>new Date(v.date).toLocaleDateString()===today);
    if(!todayV.length){setEodDraft('No visits logged today. Log field visits first.');return;}
    setEodDraft('Drafting...');
    const r=await fetch('/api/eod',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visits:todayV})});
    const d=await r.json();
    setEodDraft(d.draft||'Error generating draft.');
  }
  async function adjSupply(id,count,delta){
    await fetch('/api/supplies',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,count:Math.max(0,count+delta)})});
    await loadAll();
  }
  async function addOfficeSubmit(){
    if(!newOffice.name)return;
    await fetch('/api/offices',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newOffice)});
    setShowAddOffice(false);setNewOffice({name:'',doctor:'',city:'Flower Mound',tier:'warm',address:'',contact:'',notes:''});
    await loadAll();
  }
  async function addSupplySubmit(){
    if(!newSupply.name)return;
    await fetch('/api/supplies',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newSupply)});
    setShowAddSupply(false);setNewSupply({name:'',count:0,low:5});
    await loadAll();
  }

  const filteredOffices=offices.filter(o=>{
    const ms=officeSearch.toLowerCase();
    return(!ms||o.name.toLowerCase().includes(ms)||(o.doctor||'').toLowerCase().includes(ms))&&(!tierFilter||o.tier===tierFilter)&&(!cityFilter||o.city===cityFilter);
  });

  const todayVisits=visits.filter(v=>new Date(v.date).toLocaleDateString()===new Date().toLocaleDateString());
  const hotCount=offices.filter(o=>o.tier==='hot').length;
  const overdueCount=offices.filter(o=>!o.lastVisit||(Date.now()-new Date(o.lastVisit))>30*864e5).length;
  const urgentTasks=tasks.filter(t=>!t.done&&t.priority==='urgent').length;
  const lowSupplies=supplies.filter(s=>s.count<=s.low).length;

  const daysAgo=(d)=>{if(!d)return'Never';const n=Math.floor((Date.now()-new Date(d))/864e5);return n===0?'Today':n===1?'Yesterday':`${n}d ago`;};
  const isOverdue=(d)=>!d||(Date.now()-new Date(d))>30*864e5;

  const TABS=['command','offices','fieldlog','vault','eod','depot','lunches'];
  const LABELS=['Command','Offices','Field Log','Visit Vault','EOD Draft','Supply Depot','Lunch Tracker'];

  return(
    <div style={s.body}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet"/>

      {/* TOPBAR */}
      <div className="topbar-inner" style={s.topbar}>
        <div style={s.logo}>MULE <span style={{color:GOLD}}>HQ</span></div>
        <div style={{display:'flex',alignItems:'center',gap:24}}>
          <span style={{fontSize:11,color:'#7A6E64'}}><span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',background:SAGE,marginRight:5}}></span>Synced</span>
          <span style={{fontSize:11,color:'#7A6E64',fontFamily:'monospace'}}>{dateStr}</span>
          {alertOn&&<span style={{background:HOT,color:'white',fontSize:10,fontWeight:600,padding:'3px 10px',borderRadius:20,cursor:'pointer'}} onClick={()=>setAlertOn(false)}>New Referrer Alert</span>}
        </div>
      </div>

      {/* DESKTOP NAV */}
      <div className="desktop-nav" style={s.nav}>
        {TABS.map((t,i)=><div key={t} style={s.tab(page===t)} onClick={()=>setPage(t)}>{LABELS[i]}</div>)}
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="mobile-nav" style={{position:'fixed',bottom:0,left:0,right:0,background:'#FDFCFA',borderTop:'1px solid #DDD5C4',display:'flex',zIndex:100,height:64}}>
        {[
          ['command','⌂','Command'],
          ['offices','◎','Offices'],
          ['fieldlog','✎','Log'],
          ['vault','⊟','Vault'],
          ['lunches','◈','Lunches'],
        ].map(([t,icon,label])=>(
          <div key={t} onClick={()=>setPage(t)} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',color:page===t?GOLD:'#9A8E82',borderTop:page===t?`2px solid ${GOLD}`:'2px solid transparent',paddingTop:4}}>
            <div style={{fontSize:18,lineHeight:1}}>{icon}</div>
            <div style={{fontSize:9,fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase',marginTop:3}}>{label}</div>
          </div>
        ))}
      </div>

      <div className="main-content" style={{...s.main,paddingBottom:80}}>

        {/* ═══ COMMAND CENTER ═══ */}
        {page==='command'&&(
          <div>
            {alertOn&&(
              <div style={{background:'rgba(193,123,90,0.07)',border:'1px solid rgba(193,123,90,0.25)',borderRadius:10,padding:'13px 18px',display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
                <div style={{width:7,height:7,borderRadius:'50%',background:HOT,flexShrink:0}}></div>
                <div style={{fontSize:13,color:'#3D3228'}}><strong>New Referrer Alert:</strong> Ace Smile Dentistry is actively searching for a perio partner. Follow up this week — HIGH priority.</div>
                <button style={{...s.btnSecondary,...s.btnSm,marginLeft:'auto'}} onClick={()=>setAlertOn(false)}>Dismiss</button>
              </div>
            )}
            <div style={{background:'#F5F0E8',border:'1px solid #DDD5C4',borderRadius:10,padding:'10px 18px',display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:SAGE,animation:'pulse 2s infinite'}}></div>
              <span style={{fontFamily:'monospace',fontSize:13,color:'#3D3228'}}>{time}</span>
              <span style={{marginLeft:'auto',fontSize:11,fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:GOLD}}>{phase}</span>
            </div>
            <div className="grid-main" style={s.grid2}>
              <div>
                <div style={s.card}>
                  <div style={s.cardHeader}>
                    <div style={s.cardTitle}>Morning Briefing</div>
                    <span style={s.cardAction} onClick={()=>generateBriefing()}>Refresh</span>
                  </div>
                  <div style={{fontSize:15,lineHeight:1.8,color:'#3D3228',background:'#FAFAF7',borderRadius:8,padding:18,fontFamily:"'Cormorant Garamond',serif",border:'1px solid #EDE6D6'}}>{briefing}</div>
                </div>
                <div className="stat-row-inner" style={{display:'flex',gap:14,marginBottom:20}}>
                  {[{val:todayVisits.length,lbl:'Visits Today',c:'#1A1410'},{val:hotCount,lbl:'Hot Offices',c:HOT},{val:urgentTasks,lbl:'Urgent Tasks',c:WARM},{val:lowSupplies,lbl:'Low Supplies',c:SAGE}].map((st,i)=>(
                    <div key={i} className="stat-pill-inner" style={s.statPill}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:500,color:st.c}}>{st.val}</div>
                      <div style={{fontSize:10,color:'#7A6E64',marginTop:4,letterSpacing:'0.06em',textTransform:'uppercase'}}>{st.lbl}</div>
                    </div>
                  ))}
                </div>
                <div style={s.card}>
                  <div style={s.cardHeader}>
                    <div style={s.cardTitle}>Today's Route</div>
                    <div style={{display:'flex',gap:10,alignItems:'center'}}>
                      {route.length>0&&(
                        <span style={s.cardAction} onClick={()=>{
                          const stops=route.sort((a,b)=>a.order-b.order).map(s=>encodeURIComponent((s.address||s.name)+' '+(s.city||'')+' TX'));
                          window.open(`https://www.google.com/maps/dir/${stops.join('/')}+`,'_blank');
                        }}>Google Maps</span>
                      )}
                      <span style={s.cardAction} onClick={generateSmartPlan}>{planLoading?'Planning...':'Smart Plan'}</span>
                      <span style={s.cardAction} onClick={()=>setShowRouteSearch(!showRouteSearch)}>+ Add</span>
                    </div>
                  </div>

                  {/* SMART PLAN SUGGESTION */}
                  {smartPlan!==null&&(
                    <div style={{background:'rgba(92,127,89,0.08)',border:'1px solid rgba(92,127,89,0.25)',borderRadius:10,padding:16,marginBottom:14}}>
                      {smartPlan.length===0?(
                        <div style={{fontSize:13,color:SAGE,textAlign:'center',padding:'8px 0'}}>
                          Friday Admin Day — No field visits. Focus on route planning, Referral Lab updates, and supply prep.
                        </div>
                      ):(
                        <div>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                            <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',color:SAGE}}>Smart Plan — {smartPlan.length} stops · {new Date().toLocaleDateString('en-US',{weekday:'long'})}</div>
                            <div style={{display:'flex',gap:8}}>
                              <button style={{...s.btnPrimary,...s.btnSm}} onClick={acceptSmartPlan}>Accept Route</button>
                              <button style={{...s.btnSecondary,...s.btnSm}} onClick={()=>{setSmartPlan(null);setSmartPlanQueue([]);setComingDue([]);}}>Dismiss</button>
                            </div>
                          </div>
                          {smartPlan.map((o,i)=>(
                            <div key={o.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:i<smartPlan.length-1?'1px solid rgba(92,127,89,0.15)':'none'}}>
                              {/* STOP NUMBER */}
                              <div style={{width:24,height:24,borderRadius:'50%',background:o.hasOverride?GOLD:SAGE,color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,flexShrink:0}}>{i+1}</div>
                              {/* CLICKABLE OFFICE INFO — opens full profile */}
                              <div onClick={()=>setSelectedOffice(offices.find(off=>off.id===o.id)||o)} style={{flex:1,minWidth:0,cursor:'pointer'}} title="Tap to see full office profile">
                                <div style={{display:'flex',alignItems:'center',gap:6}}>
                                  <div style={{fontSize:12,fontWeight:600,color:'#1A1410',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{o.name}</div>
                                  <span style={{fontSize:9,color:GOLD,flexShrink:0}}>▶ view</span>
                                </div>
                                <div style={{fontSize:10,color:'#7A6E64'}}>{o.city} · {o.neverVisited?'Never visited':o.daysSince+'d ago'}</div>
                                {o.hasOverride&&o.nextAction&&(
                                  <div style={{fontSize:10,color:GOLD,fontWeight:600,marginTop:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                                    {o.dropBackReady?'Drop-back ready: ':o.hasExplicitTask?'Task: ':''}{o.nextAction.substring(0,55)}
                                  </div>
                                )}
                              </div>
                              {/* BADGES + DISMISS */}
                              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:3,flexShrink:0}}>
                                <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:10,background:o.tier==='hot'?'rgba(193,123,90,0.12)':'rgba(160,120,64,0.12)',color:o.tier==='hot'?HOT:GOLD,textTransform:'uppercase'}}>{o.tier}</span>
                                {o.daysSince>=30&&<span style={{fontSize:9,fontWeight:700,color:'#E85C5C',textTransform:'uppercase'}}>Overdue</span>}
                                {o.neverVisited&&<span style={{fontSize:9,fontWeight:700,color:SAGE,textTransform:'uppercase'}}>New</span>}
                                <span
                                  title="Remove — next best replaces it"
                                  onClick={()=>{
                                    const next=smartPlanQueue[0];
                                    const updated=smartPlan.filter((_,si)=>si!==i).map((s,si)=>({...s,order:si+1}));
                                    if(next){
                                      setSmartPlan([...updated,{...next,order:updated.length+1}]);
                                      setSmartPlanQueue(smartPlanQueue.slice(1));
                                    } else {
                                      setSmartPlan(updated);
                                    }
                                  }}
                                  style={{cursor:'pointer',color:'#C4B49E',fontSize:15,fontWeight:700,marginTop:2,lineHeight:1}}
                                >✕</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* MANUAL ADD TO PLAN */}
                      <div style={{marginTop:12,paddingTop:12,borderTop:'1px solid rgba(92,127,89,0.2)'}}>
                        <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:SAGE,marginBottom:8}}>Add Another Office</div>
                        <div style={{position:'relative'}}>
                          <input
                            style={{...s.input,marginBottom:0,fontSize:12}}
                            value={smartPlanSearch}
                            onChange={e=>setSmartPlanSearch(e.target.value)}
                            placeholder="Search any office to add..."
                          />
                          {smartPlanSearch.length>1&&(
                            <div style={{position:'absolute',top:'100%',left:0,right:0,background:'#FDFCFA',border:'1px solid #DDD5C4',borderRadius:8,zIndex:60,maxHeight:160,overflowY:'auto',marginTop:4,boxShadow:'0 4px 12px rgba(0,0,0,0.08)'}}>
                              {offices
                                .filter(o=>
                                  o.status!=='Do Not Target'&&
                                  o.status!=='On Hold - Pending Info'&&
                                  !['irving kids dentist','shine and sparkle'].some(b=>o.name.toLowerCase().includes(b))&&
                                  !smartPlan.find(s=>s.id===o.id)&&
                                  o.name.toLowerCase().includes(smartPlanSearch.toLowerCase())
                                )
                                .slice(0,5)
                                .map(o=>{
                                  const d=o.lastVisit?Math.floor((Date.now()-new Date(o.lastVisit))/864e5):null;
                                  return(
                                    <div key={o.id} onClick={()=>addToSmartPlan(o)} style={{padding:'9px 14px',cursor:'pointer',borderBottom:'1px solid #EDE6D6',fontSize:13}} onMouseEnter={e=>e.currentTarget.style.background='#F5EFE6'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                                      <div style={{fontWeight:500}}>{o.name}</div>
                                      <div style={{fontSize:10,color:'#7A6E64'}}>{o.city} · {d===null?'Never visited':d+'d ago'} · {o.tier}</div>
                                    </div>
                                  );
                                })
                              }
                            </div>
                          )}
                        </div>
                      </div>

                      {/* COMING DUE THIS WEEK */}
                      {comingDue.length>0&&(
                        <div style={{marginTop:12,paddingTop:12,borderTop:'1px solid rgba(92,127,89,0.2)'}}>
                          <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#A07840',marginBottom:8}}>Coming Due This Week</div>
                          {comingDue.map(o=>(
                            <div key={o.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #EDE6D6',fontSize:12}}>
                              <div>
                                <div style={{fontWeight:500,color:'#1A1410'}}>{o.name}</div>
                                <div style={{fontSize:10,color:'#7A6E64'}}>{o.city} · {o.daysSince}d ago</div>
                              </div>
                              <button style={{...s.btnSecondary,...s.btnSm,fontSize:10}} onClick={()=>addToSmartPlan(o)}>+ Add</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ROUTE SEARCH */}
                  {showRouteSearch&&(
                    <div style={{marginBottom:14,position:'relative'}}>
                      <input
                        style={{...s.input,marginBottom:0}}
                        value={routeSearch}
                        onChange={e=>setRouteSearch(e.target.value)}
                        placeholder="Search offices to add..."
                        autoFocus
                      />
                      {routeSearch.length>0&&(
                        <div style={{position:'absolute',top:'100%',left:0,right:0,background:'#FDFCFA',border:'1px solid #DDD5C4',borderRadius:8,zIndex:50,maxHeight:200,overflowY:'auto',marginTop:4,boxShadow:'0 4px 16px rgba(0,0,0,0.08)'}}>
                          {offices.filter(o=>
                            o.status!=='Do Not Target'&&
                            !route.find(r=>r.name===o.name)&&
                            (o.name.toLowerCase().includes(routeSearch.toLowerCase())||
                            (o.city||'').toLowerCase().includes(routeSearch.toLowerCase()))
                          ).slice(0,6).map(o=>(
                            <div key={o.id} onClick={()=>{
                              setRoute([...route,{...o,order:route.length+1,done:false}]);
                              setRouteSearch('');
                              setShowRouteSearch(false);
                            }} style={{padding:'10px 14px',cursor:'pointer',borderBottom:'1px solid #EDE6D6',fontSize:13}} onMouseEnter={e=>e.currentTarget.style.background='#F5EFE6'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                              <div style={{fontWeight:500}}>{o.name}</div>
                              <div style={{fontSize:11,color:'#7A6E64'}}>{o.city} · {o.tier}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ROUTE STOPS */}
                  {route.length===0?(
                    <div>
                      <div style={{color:'#7A6E64',fontSize:13,textAlign:'center',padding:'12px 0'}}>No stops yet. Type an office name above to add.</div>
                      <div style={s.divider}/>
                      <div style={{background:'rgba(92,127,89,0.08)',border:'1px solid rgba(92,127,89,0.2)',borderRadius:10,padding:16}}>
                        <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',color:SAGE,marginBottom:10}}>Dead Day Playbook</div>
                        <div style={{fontSize:13,color:'#3D3228',lineHeight:2.2}}>
                          1. Follow up Ace Smile — lock L&L / happy hour<br/>
                          2. Confirm lunch deliveries — The Dental Studio<br/>
                          3. Cross Timbers lunch tomorrow 12pm — confirm<br/>
                          4. Drop referral pads once order arrives<br/>
                          5. Lock Dr. Patel + Dr. Nash intro lunch<br/>
                          6. Update Referral Lab — flag closed offices
                        </div>
                      </div>
                    </div>
                  ):(
                    <div>
                      {route.sort((a,b)=>a.order-b.order).map((stop,i)=>(
                        <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 0',borderBottom:'1px solid #EDE6D6',opacity:stop.done?0.6:1}}>
                          {/* STOP NUMBER */}
                          <div style={{width:28,height:28,borderRadius:'50%',border:`2px solid ${stop.done?SAGE:GOLD}`,color:stop.done?SAGE:GOLD,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0,background:stop.done?'rgba(92,127,89,0.08)':'transparent'}}>{stop.done?'✓':stop.order}</div>
                          {/* OFFICE INFO */}
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:13,fontWeight:600,color:stop.done?'#9A8E82':'#1A1410',textDecoration:stop.done?'line-through':'none',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{stop.name}</div>
                            <div style={{fontSize:11,color:'#7A6E64'}}>{stop.city}{stop.address?' · '+stop.address:''}</div>
                            {stop.stopNote&&<div style={{fontSize:11,color:GOLD,marginTop:2,fontStyle:'italic'}}>{stop.stopNote}</div>}
                          </div>
                          {/* ACTIONS */}
                          <div style={{display:'flex',gap:4,flexShrink:0,alignItems:'center'}}>
                            <div style={{display:'flex',flexDirection:'column',gap:2,marginRight:2}}>
                              <span style={{cursor:i===0?'default':'pointer',color:i===0?'#EDE6D6':'#9A8E82',fontSize:11,lineHeight:1,userSelect:'none'}} onClick={()=>{if(i===0)return;const r=[...route];[r[i-1],r[i]]=[r[i],r[i-1]];setRoute(r.map((s,idx)=>({...s,order:idx+1})));}}>▲</span>
                              <span style={{cursor:i===route.length-1?'default':'pointer',color:i===route.length-1?'#EDE6D6':'#9A8E82',fontSize:11,lineHeight:1,userSelect:'none'}} onClick={()=>{if(i===route.length-1)return;const r=[...route];[r[i],r[i+1]]=[r[i+1],r[i]];setRoute(r.map((s,idx)=>({...s,order:idx+1})));}}>▼</span>
                            </div>
                            {stop.address&&(
                              <button style={{...s.btnSecondary,...s.btnSm,padding:'5px 10px'}} onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent((stop.address||stop.name)+' '+(stop.city||'')+' TX')}`,'_blank')}>Nav</button>
                            )}
                            <button style={{...s.btnSecondary,...s.btnSm,background:stop.done?'rgba(92,127,89,0.1)':undefined,color:stop.done?SAGE:undefined}} onClick={()=>setRoute(route.map((r,ri)=>ri===i?{...r,done:!r.done}:r))}>{stop.done?'Undo':'Done'}</button>
                            <span style={{cursor:'pointer',color:'#C4B49E',fontSize:18,lineHeight:1,alignSelf:'center'}} onClick={()=>setRoute(route.filter((_,ri)=>ri!==i))}>×</span>
                          </div>
                        </div>
                      ))}
                      {/* ROUTE SUMMARY */}
                      <div style={{marginTop:12,padding:'10px 14px',background:'#F5F0E8',borderRadius:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <div style={{fontSize:12,color:'#7A6E64'}}>{route.filter(s=>s.done).length} of {route.length} completed</div>
                        <button style={{...s.btnPrimary,...s.btnSm}} onClick={()=>{
                          const stops=route.sort((a,b)=>a.order-b.order).map(s=>encodeURIComponent((s.address||s.name)+' '+(s.city||'')+' TX'));
                          window.open(`https://www.google.com/maps/dir/${stops.join('/')}+`,'_blank');
                        }}>Full Route in Maps</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div style={s.card}>
                  <div style={s.cardHeader}>
                    <div style={s.cardTitle}>Tasks</div>
                  </div>
                  {tasks.slice(0,10).map(t=>(
                    <div key={t.id} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'9px 0',borderBottom:'1px solid #EDE6D6',opacity:t.done?0.5:1}}>
                      <div onClick={()=>toggleTask(t.id,t.done)} style={{width:18,height:18,border:`2px solid ${t.done?SAGE:'#C4B49E'}`,borderRadius:4,cursor:'pointer',flexShrink:0,marginTop:1,background:t.done?SAGE:'transparent',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'white',transition:'all 0.15s'}}>{t.done?'✓':''}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,color:t.done?'#9A8E82':'#3D3228',textDecoration:t.done?'line-through':'none',lineHeight:1.4}}>{t.text}</div>
                        {t.notes&&t.notes.split('\n').map((note,ni)=>(
                          <div key={ni} style={{fontSize:11,color:'#9A8E82',marginTop:3,paddingLeft:8,borderLeft:'2px solid #EDE6D6',lineHeight:1.4}}>{note}</div>
                        ))}
                      </div>
                      <div style={{fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:20,textTransform:'uppercase',background:t.priority==='urgent'?'rgba(193,123,90,0.12)':'rgba(160,120,64,0.14)',color:t.priority==='urgent'?HOT:GOLD}}>{t.priority}</div>
                      <span style={{cursor:'pointer',color:'#A07840',fontSize:11,fontWeight:600,padding:'2px 6px',borderRadius:4,border:'1px solid #DDD5C4'}} onClick={()=>{setTaskNoteModal(t);setTaskNoteText('');}}>+ Note</span>
                      <span style={{cursor:'pointer',color:'#7A6E64',fontSize:16}} onClick={()=>deleteTask(t.id)}>×</span>
                    </div>
                  ))}
                  {tasks.filter(t=>t.done).length>0&&(
                    <div style={{fontSize:11,color:'#9A8E82',textAlign:'center',padding:'8px 0',borderTop:'1px solid #EDE6D6',marginTop:4}}>
                      {tasks.filter(t=>t.done).length} completed today
                    </div>
                  )}
                  <div style={{display:'flex',gap:8,marginTop:12}}>
                    <input style={{...s.input,marginBottom:0,flex:1}} value={quickTask} onChange={e=>setQuickTask(e.target.value)} placeholder="Quick add..." onKeyDown={e=>e.key==='Enter'&&quickAddTask()}/>
                    <button style={s.btnPrimary} onClick={quickAddTask}>Add</button>
                  </div>
                </div>
                <div style={s.card}>
                  <div style={s.cardHeader}><div style={s.cardTitle}>This Week</div></div>
                  {[['Mon','Field — FM / Highland Village'],['Tue','Field — Lewisville'],['Wed','Check Alyse email — new referrers'],['Thu','DSO Calls'],['Fri','Admin Day — Routes + Prep']].map(([day,ev])=>(
                    <div key={day} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #EDE6D6',fontSize:13}}>
                      <span style={{fontWeight:500,width:36}}>{day}</span>
                      <span style={{color:day==='Wed'||day==='Fri'?GOLD:'#7A6E64'}}>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ OFFICES ═══ */}
        {page==='offices'&&(
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div className="section-title-inner" style={s.sectionTitle}>Office Tracker <span style={{fontSize:13,color:'#7A6E64',fontFamily:"'Jost',sans-serif",fontWeight:300}}>Flower Mound · Highland Village · Lewisville</span></div>
              <button style={s.btnPrimary} onClick={()=>setShowAddOffice(true)}>+ Add Office</button>
            </div>
            <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
              <input style={{...s.input,width:240,marginBottom:0}} placeholder="Search offices or doctors..." value={officeSearch} onChange={e=>setOfficeSearch(e.target.value)}/>
              <select style={{...s.select,width:130,marginBottom:0}} value={tierFilter} onChange={e=>setTierFilter(e.target.value)}>
                <option value="">All Tiers</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
              <div style={{display:'flex',gap:12,marginLeft:'auto',alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'#7A6E64'}}><div style={{width:8,height:8,borderRadius:'50%',background:'#E85C5C'}}></div>Overdue 30+ days</div>
                <div style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'#7A6E64'}}><div style={{width:8,height:8,borderRadius:'50%',background:'#F7C87A'}}></div>Top Referrer</div>
                <div style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'#7A6E64'}}><div style={{width:8,height:8,borderRadius:'50%',background:'#C17B5A'}}></div>Hot</div>
                <span style={{fontSize:11,color:'#7A6E64'}}>{filteredOffices.length} offices</span>
              </div>
            </div>
            {/* GROUPED BY CITY */}
            {(()=>{
              const cities = cityFilter ? [cityFilter] : ['Flower Mound','Highland Village','Lewisville','Other'];
              const now = Date.now();
              const isOD = (d) => !d || (now - new Date(d)) > 30*864e5;
              const dnt = (o) => o.status === 'Do Not Target';
              const sortFn = (a,b) => {
                if(dnt(a)&&!dnt(b))return 1;
                if(!dnt(a)&&dnt(b))return -1;
                if(a.tier==='hot'&&b.tier!=='hot')return -1;
                if(a.tier!=='hot'&&b.tier==='hot')return 1;
                if(isOD(a.lastVisit)&&!isOD(b.lastVisit))return -1;
                if(!isOD(a.lastVisit)&&isOD(b.lastVisit))return 1;
                return 0;
              };
              return cities.map(city => {
                const cityOffices = filteredOffices.filter(o=>o.city===city).sort(sortFn);
                if(!cityOffices.length) return null;
                return (
                  <div key={city} style={{marginBottom:28}}>
                    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:500,color:'#1A1410'}}>{city}</div>
                      <div style={{flex:1,height:1,background:'linear-gradient(90deg,#DDD5C4,transparent)'}}></div>
                      <div style={{fontSize:11,color:'#7A6E64'}}>{cityOffices.length} offices · {cityOffices.filter(o=>o.tier==='hot'&&!dnt(o)).length} hot · {cityOffices.filter(o=>isOD(o.lastVisit)&&!dnt(o)).length} overdue</div>
                    </div>
                    <div style={{background:'#FDFCFA',border:'1px solid #DDD5C4',borderRadius:12,overflow:'hidden'}}>
                      {/* TABLE HEADER */}
                      <div className="city-table-header" style={{display:'grid',gridTemplateColumns:'3fr 2fr 100px 110px 2fr',gap:0,padding:'8px 16px',background:'#F5F0E8',borderBottom:'1px solid #DDD5C4'}}>
                        {['Office / Doctor','Contact','Tier','Last Touch','Next Action'].map(h=>(
                          <div key={h} style={{fontSize:9,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',color:'#6E5F50'}}>{h}</div>
                        ))}
                      </div>
                      {/* ROWS */}
                      {cityOffices.map((o,i)=>{
                        const od=isOD(o.lastVisit);
                        const isDnt=dnt(o);
                        const rowBg=i%2===0?'#FDFCFA':'#FAF8F5';
                        return(
                          <div key={o.id} onClick={()=>!isDnt&&setSelectedOffice(o)} className="city-office-row" style={{display:'grid',gridTemplateColumns:'3fr 2fr 100px 110px 2fr',gap:0,padding:'12px 16px',background:isDnt?'#F5F3F0':rowBg,borderBottom:i<cityOffices.length-1?'1px solid #EDE6D6':'none',cursor:isDnt?'default':'pointer',borderLeft:`3px solid ${isDnt?'#C4B49E':o.tier==='hot'?'#C17B5A':od?'#E85C5C':'#DDD5C4'}`,transition:'background 0.1s',opacity:isDnt?0.55:1}} onMouseEnter={e=>{if(!isDnt)e.currentTarget.style.background='#F5EFE6';}} onMouseLeave={e=>{e.currentTarget.style.background=isDnt?'#F5F3F0':rowBg;}}>
                          <div>
                            <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
                              <span style={{fontSize:13,fontWeight:600,color:isDnt?'#9A8E82':'#1A1410'}}>{o.name}</span>
                              {o.topReferrer&&<span style={{fontSize:8,fontWeight:700,padding:'1px 5px',borderRadius:10,background:'rgba(247,200,122,0.3)',color:'#8B6914',textTransform:'uppercase'}}>Top</span>}
                              {o.status==='New - not visited'&&<span style={{fontSize:8,fontWeight:700,padding:'1px 5px',borderRadius:10,background:'rgba(92,127,89,0.15)',color:'#5C7F59',textTransform:'uppercase'}}>New</span>}
                              {isDnt&&<span style={{fontSize:8,fontWeight:700,padding:'1px 5px',borderRadius:10,background:'rgba(193,123,90,0.15)',color:'#C17B5A',textTransform:'uppercase'}}>DNT</span>}
                            </div>
                            {o.doctor&&<div style={{fontSize:11,color:'#7A6E64',marginTop:2}}>{o.doctor}</div>}
                          </div>
                          <div style={{fontSize:12,color:'#7A6E64',alignSelf:'center'}}>{o.contact||'—'}</div>
                          <div style={{alignSelf:'center'}}><span style={{...s.tierBadge(o.tier)}}>{o.tier}</span></div>
                          <div style={{alignSelf:'center'}}>
                            <span style={{fontSize:12,color:od&&!isDnt?'#E85C5C':'#5C7F59',fontWeight:od&&!isDnt?700:400,background:od&&!isDnt?'rgba(232,92,92,0.08)':'transparent',padding:od&&!isDnt?'2px 6px':'0',borderRadius:4}}>
                              {!o.lastVisit?'Never':`${Math.floor((Date.now()-new Date(o.lastVisit))/864e5)}d ago`}
                            </span>
                            {o.referralVolume>0&&<div style={{fontSize:10,color:'#A07840',fontWeight:600,marginTop:2}}>{o.referralVolume}/yr</div>}
                          </div>
                          <div style={{fontSize:12,color:'#5C7F59',alignSelf:'center',lineHeight:1.4}}>{o.nextAction||'—'}</div>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {/* ═══ FIELD LOG ═══ */}
        {page==='fieldlog'&&(
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div style={s.sectionTitle}>Field Log <span style={{fontSize:13,color:'#7A6E64',fontFamily:"'Jost',sans-serif",fontWeight:300}}>One entry. Updates everywhere.</span></div>
              <span style={s.cardAction} onClick={()=>{setPage('eod');generateEOD();}}>Push to EOD</span>
            </div>
            {/* QUICK NOTE BANNER */}
            <div style={{background:'#FDFCFA',border:'1px solid #DDD5C4',borderRadius:12,padding:'18px 22px',marginBottom:20}}>
              <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.12em',color:'#6E5F50',marginBottom:12}}>Quick Note — Phone Call, Email, Text, Any Interaction</div>
              <div className="quick-note-bar" style={{display:'grid',gridTemplateColumns:'2fr 140px 1fr auto',gap:10,alignItems:'center'}}>
                <select style={{...s.select,marginBottom:0}} value={quickNoteOffice} onChange={e=>setQuickNoteOffice(e.target.value)}>
                  <option value="">Select office...</option>
                  {offices.filter(o=>o.status!=='Do Not Target').map(o=><option key={o.id} value={o.name}>{o.name}</option>)}
                </select>
                <select className="qn-type" style={{...s.select,marginBottom:0}} value={quickNoteType} onChange={e=>setQuickNoteType(e.target.value)}>
                  <option value="Call">Phone Call</option>
                  <option value="Email">Email</option>
                  <option value="Text">Text</option>
                  <option value="Lunch Coord">Lunch Coord</option>
                  <option value="Dr. Patel Request">Dr. Patel Request</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  style={{...s.input,marginBottom:0}}
                  value={quickNoteText}
                  onChange={e=>setQuickNoteText(e.target.value)}
                  placeholder="e.g. Nicole called to confirm Olive Garden lunch for 27 staff, 7/15 at 12pm..."
                  onKeyDown={e=>e.key==='Enter'&&saveQuickNote()}
                />
                <button
                  style={{...s.btnPrimary,padding:'9px 20px',whiteSpace:'nowrap',opacity:quickNoteSaving?0.7:1}}
                  onClick={saveQuickNote}
                  disabled={quickNoteSaving}
                >
                  {quickNoteSaving?'Saving...':'Save Note'}
                </button>
              </div>
              <div style={{fontSize:11,color:'#7A6E64',marginTop:8}}>Auto-stamps date & time. Saves to office profile and Visit Vault.</div>
            </div>

            <div className="field-log-grid" style={s.grid2eq}>
              {/* SMART LOG FORM */}
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <div style={s.cardTitle}>Log a Visit</div>
                  {logOffice&&<div style={{fontSize:11,color:SAGE,fontWeight:500}}>Updates office profile automatically</div>}
                </div>

                {/* OFFICE SELECTOR */}
                <label style={s.label}>Office</label>
                <select style={s.select} value={logOffice} onChange={e=>{
                  setLogOffice(e.target.value);
                  const found=offices.find(o=>o.name===e.target.value);
                  if(found){
                    setLogContact(found.contact||'');
                    setLogTier(found.tier||'warm');
                    setLogNextAction(found.nextAction||'');
                  }
                }}>
                  <option value="">Select office...</option>
                  {offices.filter(o=>o.status!=='Do Not Target').map(o=><option key={o.id} value={o.name}>{o.name} — {o.city}</option>)}
                </select>

                {/* AUTO-FILLED FROM OFFICE PROFILE */}
                {logOffice&&offices.find(o=>o.name===logOffice)&&(
                  <div style={{background:'rgba(92,127,89,0.08)',border:'1px solid rgba(92,127,89,0.2)',borderRadius:8,padding:'10px 14px',marginBottom:12,fontSize:12,color:'#5C7F59'}}>
                    {(()=>{const f=offices.find(o=>o.name===logOffice);return(<>
                      Last visit: <strong>{f.lastVisit?`${Math.floor((Date.now()-new Date(f.lastVisit))/864e5)}d ago`:'Never'}</strong>
                      {f.doctor&&<span> · {f.doctor}</span>}
                      {f.gift&&<span> · Last drop: {f.gift}</span>}
                    </>);})()}
                  </div>
                )}

                {/* WHO YOU MET */}
                <label style={s.label}>Who You Spoke With</label>
                <input style={s.input} value={logContact} onChange={e=>setLogContact(e.target.value)} placeholder="Front desk name, doctor, OM..."/>

                {/* GIFT DROP */}
                <label style={s.label}>Gift / Drop</label>
                <input style={s.input} value={logGift} onChange={e=>setLogGift(e.target.value)} placeholder="Dirty soda kit, snack box, Tiff's Treats..."/>

                {/* FIELD NOTES */}
                <label style={s.label}>Field Notes</label>
                <textarea style={s.textarea} value={logNotes} onChange={e=>setLogNotes(e.target.value)} placeholder="Key conversation, interest level, what they said, intel gathered..."/>

                {/* NEXT ACTION */}
                <label style={s.label}>Next Action</label>
                <input style={s.input} value={logNextAction} onChange={e=>setLogNextAction(e.target.value)} placeholder="Follow up in 2 weeks, schedule L&L, drop ref pads..."/>

                {/* TIER + LUNCH ROW */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div>
                    <label style={s.label}>Update Tier</label>
                    <select style={s.select} value={logTier} onChange={e=>setLogTier(e.target.value)}>
                      <option value="hot">Hot</option>
                      <option value="warm">Warm</option>
                      <option value="cold">Cold</option>
                    </select>
                  </div>
                  <div>
                    <label style={s.label}>Lunch Discussed?</label>
                    <select style={s.select} value={logLunch} onChange={e=>setLogLunch(e.target.value)}>
                      <option value="no">No</option>
                      <option value="pending">Yes — QR / Pending</option>
                      <option value="ordered">Yes — Ordered</option>
                      <option value="schedule">Yes — To Schedule</option>
                    </select>
                  </div>
                </div>

                {/* LUNCH DETAILS IF DISCUSSED */}
                {logLunch!=='no'&&(
                  <div style={{background:'rgba(160,120,64,0.06)',border:'1px solid rgba(160,120,64,0.2)',borderRadius:8,padding:'12px 14px',marginBottom:12}}>
                    <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:GOLD,marginBottom:10}}>Lunch Details</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                      <div>
                        <label style={s.label}>Restaurant</label>
                        <input style={{...s.input,marginBottom:0}} value={logLunchRestaurant} onChange={e=>setLogLunchRestaurant(e.target.value)} placeholder="e.g. Chuy's, Luna Grill..."/>
                      </div>
                      <div>
                        <label style={s.label}>Delivery Date</label>
                        <input style={{...s.input,marginBottom:0}} type="date" value={logLunchDate} onChange={e=>setLogLunchDate(e.target.value)}/>
                      </div>
                    </div>
                    <div style={{marginTop:10}}>
                      <label style={s.label}>Staff Count & Notes</label>
                      <input style={{...s.input,marginBottom:0}} value={logLunchNotes} onChange={e=>setLogLunchNotes(e.target.value)} placeholder="27 staff, dietary restrictions, ordered via EzCater..."/>
                    </div>
                  </div>
                )}

                {/* ADD FOLLOW-UP TASK */}
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                  <input type="checkbox" id="addTask" checked={logAddTask} onChange={e=>setLogAddTask(e.target.checked)} style={{width:16,height:16,cursor:'pointer'}}/>
                  <label htmlFor="addTask" style={{fontSize:13,color:'#3D3228',cursor:'pointer'}}>Add follow-up as a task</label>
                </div>

                <button style={{...s.btnPrimary,width:'100%',padding:'12px',fontSize:13}} onClick={smartLogVisit}>
                  Save — Updates Office Profile + Visit Vault
                </button>
              </div>

              {/* TODAY'S LOGS */}
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <div style={s.cardTitle}>Today's Field Notes</div>
                  <span style={{fontSize:11,color:'#7A6E64'}}>{todayVisits.length} visits</span>
                </div>
                {todayVisits.length===0&&(
                  <div style={{color:'#7A6E64',fontSize:13,textAlign:'center',padding:'32px 0'}}>
                    No visits logged yet today.<br/>
                    <span style={{fontSize:11,marginTop:8,display:'block'}}>Select an office and start logging.</span>
                  </div>
                )}
                {todayVisits.map(v=>(
                  <div key={v.id} onClick={()=>setSelectedVisit(v)} style={{background:'#FAFAF7',border:'1px solid #EDE6D6',borderRadius:10,padding:14,marginBottom:10,cursor:'pointer',borderLeft:`3px solid ${v.tier==='hot'?HOT:GOLD}`}} onMouseEnter={e=>e.currentTarget.style.borderColor=GOLD} onMouseLeave={e=>e.currentTarget.style.borderColor='#EDE6D6'}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                      <div style={{fontWeight:600,fontSize:13}}>{v.office}</div>
                      <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:10,background:v.tier==='hot'?'rgba(193,123,90,0.12)':'rgba(160,120,64,0.12)',color:v.tier==='hot'?HOT:GOLD,textTransform:'uppercase'}}>{v.tier}</span>
                    </div>
                    {v.contact&&<div style={{fontSize:11,color:'#7A6E64',marginBottom:4}}>Spoke with: {v.contact}</div>}
                    {v.notes&&<div style={{fontSize:12,color:'#7A6E64',lineHeight:1.5,marginBottom:4}}>{v.notes.substring(0,120)}{v.notes.length>120?'...':''}</div>}
                    {v.gift&&<div style={{fontSize:11,color:GOLD}}>Drop: {v.gift}</div>}
                    {v.nextAction&&<div style={{fontSize:11,color:SAGE,marginTop:4}}>Next: {v.nextAction}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ VISIT VAULT ═══ */}
        {page==='vault'&&(
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
              <div style={s.sectionTitle}>Visit Vault <span style={{fontSize:13,color:'#7A6E64',fontFamily:"'Jost',sans-serif",fontWeight:300}}>Every touchpoint, always here</span></div>
              <span style={{fontSize:12,color:'#7A6E64'}}>Total: <strong style={{color:'#1A1410'}}>{visits.length}</strong> visits</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:12}}>
              {[...visits].reverse().map(v=>(
                <div key={v.id} onClick={()=>setSelectedVisit(v)} style={{background:'#FDFCFA',border:'1px solid #DDD5C4',borderRadius:12,padding:16,cursor:'pointer',transition:'border 0.15s'}} onMouseEnter={e=>e.currentTarget.style.borderColor=GOLD} onMouseLeave={e=>e.currentTarget.style.borderColor='#DDD5C4'}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <div style={{fontWeight:600,fontSize:13}}>{v.office}</div>
                    <div style={{fontSize:10,color:'#7A6E64',fontFamily:'monospace'}}>{new Date(v.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
                  </div>
                  {v.doctor&&<div style={{fontSize:11,color:'#7A6E64',marginBottom:4}}>{v.doctor}</div>}
                  {v.gift&&<div style={{fontSize:11,color:GOLD,marginBottom:4}}>Drop: {v.gift}</div>}
                  {v.nextAction&&<div style={{fontSize:11,color:SAGE}}>Next: {v.nextAction}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ EOD ═══ */}
        {page==='eod'&&(
          <div>
            <div style={s.sectionTitle}>EOD Draft <span style={{fontSize:13,color:'#7A6E64',fontFamily:"'Jost',sans-serif",fontWeight:300}}>End of day report for Neel Patel</span></div>
            <div className="field-log-grid" style={s.grid2eq}>
              <div style={s.card}>
                <div style={s.cardHeader}><div style={s.cardTitle}>Auto-Draft</div><span style={s.cardAction} onClick={generateEOD}>Generate from Today</span></div>
                <div style={{fontSize:13,color:'#7A6E64',lineHeight:1.7}}>Log your field visits first, then click Generate. Review, edit if needed, then copy to Outlook.</div>
              </div>
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <div style={s.cardTitle}>Email Preview</div>
                  <div style={{display:'flex',gap:12}}>
                    <span style={s.cardAction} onClick={()=>navigator.clipboard.writeText(eodDraft)}>Copy</span>
                    <span style={s.cardAction} onClick={()=>window.open('https://outlook.office.com/mail/new','_blank')}>Open Outlook</span>
                  </div>
                </div>
                <div style={{fontSize:13,lineHeight:1.9,color:'#3D3228',background:'#FAFAF7',padding:18,borderRadius:10,minHeight:300,whiteSpace:'pre-wrap',border:'1px solid #EDE6D6'}}>{eodDraft||'Generate your EOD above to preview here.'}</div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ SUPPLY DEPOT ═══ */}
        {page==='depot'&&(
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
              <div style={s.sectionTitle}>Supply Depot <span style={{fontSize:13,color:'#7A6E64',fontFamily:"'Jost',sans-serif",fontWeight:300}}>Restock before Friday</span></div>
              <button style={s.btnPrimary} onClick={()=>setShowAddSupply(true)}>+ Add Item</button>
            </div>
            <div style={{...s.card,maxWidth:580}}>
              {supplies.map(sup=>(
                <div key={sup.id} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 0',borderBottom:'1px solid #EDE6D6'}}>
                  <div style={{flex:1,fontSize:13}}>{sup.name}</div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <button onClick={()=>adjSupply(sup.id,sup.count,-1)} style={{width:28,height:28,borderRadius:6,background:'#F5F0E8',border:'1px solid #DDD5C4',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>−</button>
                    <div style={{fontFamily:'monospace',fontSize:20,fontWeight:500,minWidth:40,textAlign:'center',color:sup.count<=sup.low?HOT:SAGE}}>{sup.count}</div>
                    <button onClick={()=>adjSupply(sup.id,sup.count,1)} style={{width:28,height:28,borderRadius:6,background:'#F5F0E8',border:'1px solid #DDD5C4',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
                  </div>
                  <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.07em',color:sup.count<=sup.low?HOT:SAGE}}>{sup.count<=sup.low?'Restock':'Stocked'}</div>
                </div>
              ))}
              <div style={{marginTop:16,fontSize:11,color:'#7A6E64'}}>Items at or below threshold show red. Restock on Friday admin day. Supplies stored at Public Storage, 601 N Stemmons Fwy, Lewisville 75067.</div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ OFFICE DETAIL PANEL ═══ */}
      {selectedOffice&&(
        <div style={s.modal} onClick={e=>e.target===e.currentTarget&&setSelectedOffice(null)}>
          <div className="modal-box-inner" style={{...s.modalBox,width:640,maxHeight:'90vh'}}>

            {/* HEADER */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
              <div style={{flex:1,paddingRight:16}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:500,color:'#1A1410',lineHeight:1.2}}>{selectedOffice.name}</div>
                <div style={{fontSize:12,color:'#7A6E64',marginTop:4}}>{selectedOffice.city} · {selectedOffice.doctor||'Doctor not listed'}</div>
              </div>
              <span style={{cursor:'pointer',color:'#7A6E64',fontSize:22,lineHeight:1}} onClick={()=>setSelectedOffice(null)}>×</span>
            </div>

            {/* TIER + STATUS BADGES */}
            <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
              <span style={s.tierBadge(selectedOffice.tier)}>{selectedOffice.tier}</span>
              {selectedOffice.topReferrer&&<span style={{fontSize:9,fontWeight:700,padding:'3px 8px',borderRadius:20,background:'rgba(247,200,122,0.25)',color:'#8B6914',textTransform:'uppercase'}}>Top Referrer</span>}
              {selectedOffice.referralVolume>0&&<span style={{fontSize:10,color:GOLD,fontWeight:600}}>{selectedOffice.referralVolume} referrals/yr</span>}
              <span style={{fontSize:11,color:!selectedOffice.lastVisit||(Date.now()-new Date(selectedOffice.lastVisit))>25*864e5?'#E85C5C':SAGE,fontWeight:600}}>
                {!selectedOffice.lastVisit?'Never visited':`Last visit: ${Math.floor((Date.now()-new Date(selectedOffice.lastVisit))/864e5)}d ago`}
              </span>
            </div>

            <div style={{height:1,background:'linear-gradient(90deg,transparent,#D4B483,transparent)',marginBottom:16,opacity:0.4}}></div>

            {/* PRE-VISIT INTEL — shown prominently */}
            {selectedOffice.notes&&(
              <div style={{background:'rgba(160,120,64,0.06)',border:'1px solid rgba(160,120,64,0.2)',borderRadius:10,padding:'12px 16px',marginBottom:16}}>
                <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',color:GOLD,marginBottom:8}}>Field Intel & Notes</div>
                <div style={{fontSize:13,color:'#3D3228',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{selectedOffice.notes}</div>
              </div>
            )}

            {/* EDITABLE FIELDS GRID */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
              {/* CONTACT */}
              <div>
                <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:4}}>Contact Person</div>
                <input
                  style={{...s.input,marginBottom:0,fontSize:13}}
                  defaultValue={selectedOffice.contact||''}
                  placeholder="Front desk name, OM..."
                  onBlur={async(e)=>{
                    if(e.target.value!==selectedOffice.contact){
                      await fetch('/api/offices',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:selectedOffice.id,contact:e.target.value})});
                      setSelectedOffice({...selectedOffice,contact:e.target.value});
                      await loadAll();
                    }
                  }}
                />
              </div>
              {/* DOCTOR */}
              <div>
                <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:4}}>Doctor(s)</div>
                <input
                  style={{...s.input,marginBottom:0,fontSize:13}}
                  defaultValue={selectedOffice.doctor||''}
                  placeholder="Dr. Last Name"
                  onBlur={async(e)=>{
                    if(e.target.value!==selectedOffice.doctor){
                      await fetch('/api/offices',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:selectedOffice.id,doctor:e.target.value})});
                      setSelectedOffice({...selectedOffice,doctor:e.target.value});
                      await loadAll();
                    }
                  }}
                />
              </div>
              {/* ADDRESS */}
              <div style={{gridColumn:'1/-1'}}>
                <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:4}}>Address</div>
                <input
                  style={{...s.input,marginBottom:0,fontSize:13}}
                  defaultValue={selectedOffice.address||''}
                  placeholder="Full address..."
                  onBlur={async(e)=>{
                    if(e.target.value!==selectedOffice.address){
                      await fetch('/api/offices',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:selectedOffice.id,address:e.target.value})});
                      setSelectedOffice({...selectedOffice,address:e.target.value});
                      await loadAll();
                    }
                  }}
                />
              </div>
              {/* TIER */}
              <div>
                <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:4}}>Tier</div>
                <select
                  style={{...s.select,marginBottom:0,fontSize:13}}
                  value={selectedOffice.tier}
                  onChange={async(e)=>{
                    await fetch('/api/offices',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:selectedOffice.id,tier:e.target.value})});
                    setSelectedOffice({...selectedOffice,tier:e.target.value});
                    await loadAll();
                  }}
                >
                  <option value="hot">Hot</option>
                  <option value="warm">Warm</option>
                  <option value="cold">Cold</option>
                </select>
              </div>
              {/* LAST GIFT */}
              <div>
                <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:4}}>Last Gift / Drop</div>
                <input
                  style={{...s.input,marginBottom:0,fontSize:13,color:GOLD}}
                  defaultValue={selectedOffice.gift||''}
                  placeholder="What did you drop last time?"
                  onBlur={async(e)=>{
                    if(e.target.value!==selectedOffice.gift){
                      await fetch('/api/offices',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:selectedOffice.id,gift:e.target.value})});
                      setSelectedOffice({...selectedOffice,gift:e.target.value});
                      await loadAll();
                    }
                  }}
                />
              </div>
              {/* NEXT ACTION */}
              <div style={{gridColumn:'1/-1'}}>
                <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:4}}>Next Action</div>
                <input
                  style={{...s.input,marginBottom:0,fontSize:13,color:SAGE}}
                  defaultValue={selectedOffice.nextAction||''}
                  placeholder="What needs to happen next?"
                  onBlur={async(e)=>{
                    if(e.target.value!==selectedOffice.nextAction){
                      await fetch('/api/offices',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:selectedOffice.id,nextAction:e.target.value})});
                      setSelectedOffice({...selectedOffice,nextAction:e.target.value});
                      await loadAll();
                    }
                  }}
                />
              </div>
              {/* NOTES — FULL EDITABLE */}
              <div style={{gridColumn:'1/-1'}}>
                <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:4}}>Full Notes (click to edit)</div>
                <textarea
                  style={{...s.textarea,marginBottom:0,fontSize:13,minHeight:100}}
                  defaultValue={selectedOffice.notes||''}
                  placeholder="Office intel, staff notes, Dr. Patel requests, anything important..."
                  onBlur={async(e)=>{
                    if(e.target.value!==selectedOffice.notes){
                      await fetch('/api/offices',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:selectedOffice.id,notes:e.target.value})});
                      setSelectedOffice({...selectedOffice,notes:e.target.value});
                      await loadAll();
                    }
                  }}
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{display:'flex',gap:8,flexWrap:'wrap',paddingTop:12,borderTop:'1px solid #EDE6D6'}}>
              <button style={s.btnPrimary} onClick={()=>{
                if(!route.find(r=>r.name===selectedOffice.name)){
                  setRoute([...route,{...selectedOffice,order:route.length+1,done:false,stopNote:''}]);
                }
                setSelectedOffice(null);
                setPage('command');
              }}>+ Add to Route</button>
              {selectedOffice.address&&(
                <button style={s.btnSecondary} onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedOffice.address+' '+selectedOffice.city+' TX')}`,'_blank')}>
                  Google Maps
                </button>
              )}
              <button style={s.btnSecondary} onClick={()=>{
                setLogOffice(selectedOffice.name);
                setLogContact(selectedOffice.contact||'');
                setLogTier(selectedOffice.tier||'warm');
                setLogNextAction(selectedOffice.nextAction||'');
                setSelectedOffice(null);
                setPage('fieldlog');
              }}>Log Visit</button>
              <button style={s.btnSecondary} onClick={()=>{
                setQuickNoteOffice(selectedOffice.name);
                setSelectedOffice(null);
                setPage('fieldlog');
              }}>Quick Note</button>
            </div>
          </div>
        </div>
      )}

            {/* ═══ VISIT DETAIL PANEL ═══ */}
      {selectedVisit&&(
        <div style={s.modal} onClick={e=>e.target===e.currentTarget&&setSelectedVisit(null)}>
          <div className="modal-box-inner" style={{...s.modalBox,width:560}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
              <div style={s.modalTitle}>{selectedVisit.office}</div>
              <span style={{cursor:'pointer',color:'#7A6E64',fontSize:20}} onClick={()=>setSelectedVisit(null)}>×</span>
            </div>
            <div style={{fontSize:11,color:'#7A6E64',fontFamily:'monospace',marginBottom:16}}>{new Date(selectedVisit.date).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</div>
            <div style={s.divider}/>
            {selectedVisit.doctor&&<div style={{marginBottom:12}}><div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:3}}>Doctor</div><div style={{fontSize:13}}>{selectedVisit.doctor}</div></div>}
            {selectedVisit.contact&&<div style={{marginBottom:12}}><div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:3}}>Contact</div><div style={{fontSize:13}}>{selectedVisit.contact}</div></div>}
            {selectedVisit.gift&&<div style={{marginBottom:12}}><div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:3}}>Gift / Drop</div><div style={{fontSize:13,color:GOLD}}>{selectedVisit.gift}</div></div>}
            {selectedVisit.notes&&<div style={{marginBottom:12}}><div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:3}}>Field Notes</div><div style={{fontSize:13,color:'#3D3228',background:'#FAFAF7',border:'1px solid #EDE6D6',borderRadius:8,padding:12,lineHeight:1.6}}>{selectedVisit.notes}</div></div>}
            {selectedVisit.nextAction&&<div style={{marginBottom:12}}><div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:3}}>Next Action</div><div style={{fontSize:13,color:SAGE,fontWeight:500}}>{selectedVisit.nextAction}</div></div>}
            <div style={s.divider}/>
            <button style={s.btnSecondary} onClick={()=>setSelectedVisit(null)}>Close</button>
          </div>
        </div>
      )}

      {/* ADD OFFICE MODAL */}
      {showAddOffice&&(
        <div style={s.modal} onClick={e=>e.target===e.currentTarget&&setShowAddOffice(false)}>
          <div style={s.modalBox}>
            <div style={s.modalTitle}>Add Office</div>
            <div style={s.divider}/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><label style={s.label}>Practice Name</label><input style={s.input} value={newOffice.name} onChange={e=>setNewOffice({...newOffice,name:e.target.value})} placeholder="Practice name"/></div>
              <div><label style={s.label}>Doctor</label><input style={s.input} value={newOffice.doctor} onChange={e=>setNewOffice({...newOffice,doctor:e.target.value})} placeholder="Dr. Last Name"/></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><label style={s.label}>City</label><select style={s.select} value={newOffice.city} onChange={e=>setNewOffice({...newOffice,city:e.target.value})}><option>Flower Mound</option><option>Highland Village</option><option>Lewisville</option><option>Other</option></select></div>
              <div><label style={s.label}>Tier</label><select style={s.select} value={newOffice.tier} onChange={e=>setNewOffice({...newOffice,tier:e.target.value})}><option value="warm">Warm</option><option value="hot">Hot</option><option value="cold">Cold</option></select></div>
            </div>
            <label style={s.label}>Address</label><input style={s.input} value={newOffice.address} onChange={e=>setNewOffice({...newOffice,address:e.target.value})} placeholder="Full address"/>
            <label style={s.label}>Contact Person</label><input style={s.input} value={newOffice.contact} onChange={e=>setNewOffice({...newOffice,contact:e.target.value})} placeholder="Front desk name, OM..."/>
            <label style={s.label}>Notes</label><textarea style={s.textarea} value={newOffice.notes} onChange={e=>setNewOffice({...newOffice,notes:e.target.value})} placeholder="First impression, referral interest..."/>
            <div style={{display:'flex',gap:10}}>
              <button style={s.btnPrimary} onClick={addOfficeSubmit}>Add Office</button>
              <button style={s.btnSecondary} onClick={()=>setShowAddOffice(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SUPPLY MODAL */}
      {showAddSupply&&(
        <div style={s.modal} onClick={e=>e.target===e.currentTarget&&setShowAddSupply(false)}>
          <div style={s.modalBox}>
            <div style={s.modalTitle}>Add Supply Item</div>
            <label style={s.label}>Item Name</label><input style={s.input} value={newSupply.name} onChange={e=>setNewSupply({...newSupply,name:e.target.value})} placeholder="e.g. Referral Pads"/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><label style={s.label}>Count</label><input style={s.input} type="number" value={newSupply.count} onChange={e=>setNewSupply({...newSupply,count:parseInt(e.target.value)||0})}/></div>
              <div><label style={s.label}>Low Alert At</label><input style={s.input} type="number" value={newSupply.low} onChange={e=>setNewSupply({...newSupply,low:parseInt(e.target.value)||5})}/></div>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button style={s.btnPrimary} onClick={addSupplySubmit}>Add Item</button>
              <button style={s.btnSecondary} onClick={()=>setShowAddSupply(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}


        {/* LUNCH TRACKER */}
        {page==='lunches'&&(
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div style={s.sectionTitle}>Lunch Tracker <span style={{fontSize:13,color:'#7A6E64',fontFamily:"'Jost',sans-serif",fontWeight:300}}>Appreciation lunches</span></div>
              <div style={{display:'flex',gap:16,alignItems:'center'}}>
                <button style={s.btnPrimary} onClick={()=>setShowAddLunch(true)}>+ Add Office</button>
                {[['Ordered',GOLD],['Pending','#9A8E82'],['To Schedule','#C4B49E'],['Delivered',SAGE]].map(([st,c])=>(
                  <div key={st} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'#7A6E64'}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:c}}></div>
                    {st} ({lunches.filter(l=>l.status===st).length})
                  </div>
                ))}
              </div>
            </div>
            {[
              ['Ordered','Confirmed — confirm delivery or follow up',GOLD],
              ['Pending','QR scanned — waiting on order submission','#9A8E82'],
              ['To Schedule','Not yet offered — slate on next route','#C4B49E'],
              ['Delivered','Done — relationship locked',SAGE]
            ].map(([status,desc,color])=>{
              const group=lunches.filter(l=>l.status===status);
              if(!group.length) return null;
              return(
                <div key={status} style={{marginBottom:24}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                    <div style={{width:10,height:10,borderRadius:'50%',background:color,flexShrink:0}}></div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:500}}>{status}</div>
                    <div style={{fontSize:11,color:'#7A6E64'}}>{desc}</div>
                    <div style={{flex:1,height:1,background:'linear-gradient(90deg,#DDD5C4,transparent)',marginLeft:4}}></div>
                    <div style={{fontSize:11,color:'#7A6E64'}}>{group.length} offices</div>
                  </div>
                  <div style={{background:'#FDFCFA',border:'1px solid #DDD5C4',borderRadius:12,overflow:'hidden'}}>
                    {group.map((l,i)=>(
                      <div key={l.id} style={{padding:'14px 16px',background:i%2===0?'#FDFCFA':'#FAF8F5',borderBottom:i<group.length-1?'1px solid #EDE6D6':'none',borderLeft:'3px solid '+color}}>
                        {/* ROW TOP — office + actions */}
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10,marginBottom:6}}>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontWeight:600,fontSize:13,color:'#1A1410',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l.office}</div>
                            {l.contact&&<div style={{fontSize:11,color:'#7A6E64',marginTop:2}}>{l.contact}</div>}
                          </div>
                          <div style={{display:'flex',gap:6,flexShrink:0}}>
                            {status!=='Delivered'&&(
                              <button style={{...s.btnPrimary,...s.btnSm}} onClick={()=>updateLunch(l.id,{status:'Delivered'})}>Delivered</button>
                            )}
                            {(status==='To Schedule'||status==='Pending')&&(
                              <button style={{...s.btnSecondary,...s.btnSm}} onClick={()=>updateLunch(l.id,{status:'Ordered'})}>Ordered</button>
                            )}
                            <button style={{...s.btnSecondary,...s.btnSm}} onClick={()=>setEditLunch({...l})}>Edit</button>
                          </div>
                        </div>
                        {/* ROW BOTTOM — details */}
                        <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
                          {l.restaurant&&<div style={{fontSize:12,color:GOLD,fontWeight:500}}>{l.restaurant}</div>}
                          {l.date&&<div style={{fontSize:12,color:'#7A6E64',fontFamily:'monospace'}}>{new Date(l.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</div>}
                          {l.staffCount&&<div style={{fontSize:11,color:'#7A6E64'}}>{l.staffCount} staff</div>}
                          {l.notes&&<div style={{fontSize:11,color:'#9A8E82',width:'100%',marginTop:2,lineHeight:1.4}}>{l.notes}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}


      {/* ADD LUNCH MODAL */}
      {showAddLunch&&(
        <div style={s.modal} onClick={e=>e.target===e.currentTarget&&setShowAddLunch(false)}>
          <div className="modal-box-inner" style={{...s.modalBox,width:560}}>
            <div style={{...s.modalTitle,marginBottom:16}}>Add Lunch</div>
            <label style={s.label}>Office Name</label>
            <input style={s.input} value={newLunch.office} onChange={e=>setNewLunch({...newLunch,office:e.target.value})} placeholder="Practice name"/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><label style={s.label}>Doctor</label><input style={s.input} value={newLunch.doctor} onChange={e=>setNewLunch({...newLunch,doctor:e.target.value})} placeholder="Dr. Last Name"/></div>
              <div><label style={s.label}>Contact Person</label><input style={s.input} value={newLunch.contact} onChange={e=>setNewLunch({...newLunch,contact:e.target.value})} placeholder="Front desk, OM..."/></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><label style={s.label}>Status</label>
                <select style={s.select} value={newLunch.status} onChange={e=>setNewLunch({...newLunch,status:e.target.value})}>
                  <option value="To Schedule">To Schedule</option>
                  <option value="Pending">Pending (QR Sent)</option>
                  <option value="Ordered">Ordered</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <div><label style={s.label}>Restaurant</label><input style={s.input} value={newLunch.restaurant} onChange={e=>setNewLunch({...newLunch,restaurant:e.target.value})} placeholder="e.g. Chuy's, Luna Grill..."/></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><label style={s.label}>Date</label><input style={s.input} type="date" value={newLunch.date} onChange={e=>setNewLunch({...newLunch,date:e.target.value})}/></div>
              <div><label style={s.label}>Staff Count</label><input style={s.input} type="number" value={newLunch.staffCount} onChange={e=>setNewLunch({...newLunch,staffCount:e.target.value})} placeholder="Number of staff"/></div>
            </div>
            <label style={s.label}>Notes</label>
            <textarea style={s.textarea} value={newLunch.notes} onChange={e=>setNewLunch({...newLunch,notes:e.target.value})} placeholder="Dr. Patel requested, context, special instructions..."/>
            <div style={{display:'flex',gap:10}}>
              <button style={s.btnPrimary} onClick={addLunch}>Add</button>
              <button style={s.btnSecondary} onClick={()=>setShowAddLunch(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT LUNCH MODAL */}
      {editLunch&&(
        <div style={s.modal} onClick={e=>e.target===e.currentTarget&&setEditLunch(null)}>
          <div className="modal-box-inner" style={{...s.modalBox,width:560}}>
            <div style={{...s.modalTitle,marginBottom:16}}>Edit — {editLunch.office}</div>
            <label style={s.label}>Office Name</label>
            <input style={s.input} value={editLunch.office} onChange={e=>setEditLunch({...editLunch,office:e.target.value})}/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><label style={s.label}>Doctor</label><input style={s.input} value={editLunch.doctor||''} onChange={e=>setEditLunch({...editLunch,doctor:e.target.value})}/></div>
              <div><label style={s.label}>Contact</label><input style={s.input} value={editLunch.contact||''} onChange={e=>setEditLunch({...editLunch,contact:e.target.value})}/></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><label style={s.label}>Status</label>
                <select style={s.select} value={editLunch.status} onChange={e=>setEditLunch({...editLunch,status:e.target.value})}>
                  <option value="To Schedule">To Schedule</option>
                  <option value="Pending">Pending (QR Sent)</option>
                  <option value="Ordered">Ordered</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <div><label style={s.label}>Restaurant</label><input style={s.input} value={editLunch.restaurant||''} onChange={e=>setEditLunch({...editLunch,restaurant:e.target.value})}/></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><label style={s.label}>Date</label><input style={s.input} type="date" value={editLunch.date||''} onChange={e=>setEditLunch({...editLunch,date:e.target.value})}/></div>
              <div><label style={s.label}>Staff Count</label><input style={s.input} type="number" value={editLunch.staffCount||''} onChange={e=>setEditLunch({...editLunch,staffCount:e.target.value})}/></div>
            </div>
            <label style={s.label}>Notes</label>
            <textarea style={s.textarea} value={editLunch.notes||''} onChange={e=>setEditLunch({...editLunch,notes:e.target.value})}/>
            <div style={{display:'flex',gap:10,justifyContent:'space-between'}}>
              <div style={{display:'flex',gap:10}}>
                <button style={s.btnPrimary} onClick={saveLunchEdit}>Save Changes</button>
                <button style={s.btnSecondary} onClick={()=>setEditLunch(null)}>Cancel</button>
              </div>
              <button style={{...s.btnSecondary,color:'#E85C5C',borderColor:'#E85C5C'}} onClick={()=>{if(confirm('Remove this lunch?')){deleteLunch(editLunch.id);setEditLunch(null);}}}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE FLOATING LOG BUTTON */}
      {page!=="fieldlog"&&<button className="mobile-log-btn" onClick={()=>setPage('fieldlog')} title="Log a Visit" style={{position:"fixed",bottom:80,right:20,width:58,height:58,borderRadius:"50%",background:GOLD,color:"white",fontSize:28,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(160,120,64,0.4)",cursor:"pointer",border:"none",zIndex:150}}>+</button>}


      {/* TASK NOTE MODAL */}
      {taskNoteModal&&(
        <div style={s.modal} onClick={e=>e.target===e.currentTarget&&setTaskNoteModal(null)}>
          <div style={{...s.modalBox,width:500}}>
            <div style={{...s.modalTitle,marginBottom:4}}>Add Note</div>
            <div style={{fontSize:12,color:'#7A6E64',marginBottom:16}}>{taskNoteModal.text}</div>
            {taskNoteModal.notes&&(
              <div style={{background:'#FAFAF7',border:'1px solid #EDE6D6',borderRadius:8,padding:12,marginBottom:16}}>
                <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:8}}>Call Log</div>
                {taskNoteModal.notes.split('\n').map((note,i)=>(
                  <div key={i} style={{fontSize:12,color:'#7A6E64',padding:'5px 0',borderBottom:'1px solid #EDE6D6',lineHeight:1.5}}>{note}</div>
                ))}
              </div>
            )}
            <label style={s.label}>New Note</label>
            <textarea
              style={{...s.textarea,minHeight:80}}
              value={taskNoteText}
              onChange={e=>setTaskNoteText(e.target.value)}
              placeholder="e.g. Called 7/15 — office manager out, try again next week. Or: Stopped by — Dr. Mendu in with patient, left card..."
              autoFocus
            />
            <div style={{display:'flex',gap:10}}>
              <button style={s.btnPrimary} onClick={saveTaskNote}>Save Note</button>
              <button style={s.btnSecondary} onClick={()=>setTaskNoteModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
        *::-webkit-scrollbar{width:5px}
        *::-webkit-scrollbar-thumb{background:#DDD5C4;border-radius:3px}

        /* MOBILE RESPONSIVE */
        @media(max-width:768px){
          .desktop-nav{display:none!important;}
          .mobile-nav{display:flex!important;}
          .main-content{padding:16px!important;}
          .grid-2col{grid-template-columns:1fr!important;}
          .grid-main{grid-template-columns:1fr!important;}
          .topbar-inner{padding:0 16px!important;}
          .office-table-row{grid-template-columns:1fr 70px 80px!important;}
          .office-table-row .col-contact,.office-table-row .col-next{display:none!important;}
          .vault-row-inner{grid-template-columns:100px 1fr!important;}
          .vault-row-inner .col-gift,.vault-row-inner .col-next{display:none!important;}
          .lunch-row-inner{grid-template-columns:1fr 80px 90px!important;}
          .lunch-row-inner .col-doctor,.lunch-row-inner .col-restaurant,.lunch-row-inner .col-notes{display:none!important;}
          .stat-row-inner{flex-wrap:wrap!important;}
          .stat-pill-inner{min-width:calc(50% - 7px)!important;}
          .quick-note-bar{grid-template-columns:1fr!important;gap:8px!important;}
          .quick-note-bar .qn-type{display:none!important;}
          .section-title-inner{font-size:20px!important;}
          .modal-box-inner{width:95vw!important;padding:20px!important;}
          .field-log-grid{grid-template-columns:1fr!important;}
          .city-table-header{display:none!important;}
          .city-office-row{grid-template-columns:1fr 70px 80px!important;}
        }

        @media(min-width:769px){
          .mobile-nav{display:none!important;}
          .desktop-nav{display:flex!important;}
        }

        /* MOBILE TAP TARGETS */
        @media(max-width:768px){
          button{min-height:44px!important;}
          select,input{min-height:44px!important;font-size:16px!important;}
          .mobile-log-btn{
            position:fixed!important;
            bottom:80px!important;
            right:20px!important;
            width:58px!important;
            height:58px!important;
            border-radius:50%!important;
            background:#A07840!important;
            color:white!important;
            font-size:28px!important;
            display:flex!important;
            align-items:center!important;
            justify-content:center!important;
            box-shadow:0 4px 16px rgba(160,120,64,0.4)!important;
            cursor:pointer!important;
            border:none!important;
            z-index:150!important;
          }
        }
        @media(min-width:769px){
          .mobile-log-btn{display:none!important;}
        }
      `}</style>
    </div>
  );
}
