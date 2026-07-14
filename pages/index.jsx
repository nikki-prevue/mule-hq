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
  const [logGift,setLogGift]=useState('');
  const [logNotes,setLogNotes]=useState('');
  const [logNextAction,setLogNextAction]=useState('');
  const [logTier,setLogTier]=useState('warm');
  const [eodDraft,setEodDraft]=useState('');
  const [showAddOffice,setShowAddOffice]=useState(false);
  const [showAddSupply,setShowAddSupply]=useState(false);
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
    await fetch('/api/tasks',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,done:!done})});
    await loadAll();
  }
  async function deleteTask(id){
    await fetch('/api/tasks',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});
    await loadAll();
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
      <div style={s.topbar}>
        <div style={s.logo}>MULE <span style={{color:GOLD}}>HQ</span></div>
        <div style={{display:'flex',alignItems:'center',gap:24}}>
          <span style={{fontSize:11,color:'#7A6E64'}}><span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',background:SAGE,marginRight:5}}></span>Live</span>
          <span style={{fontSize:11,color:'#7A6E64',fontFamily:'monospace'}}>{dateStr}</span>
          {alertOn&&<span style={{background:HOT,color:'white',fontSize:10,fontWeight:600,padding:'3px 10px',borderRadius:20,cursor:'pointer'}} onClick={()=>setAlertOn(false)}>New Referrer Alert</span>}
        </div>
      </div>

      {/* NAV */}
      <div style={s.nav}>
        {TABS.map((t,i)=><div key={t} style={s.tab(page===t)} onClick={()=>setPage(t)}>{LABELS[i]}</div>)}
      </div>

      <div style={s.main}>

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
            <div style={s.grid2}>
              <div>
                <div style={s.card}>
                  <div style={s.cardHeader}>
                    <div style={s.cardTitle}>Morning Briefing</div>
                    <span style={s.cardAction} onClick={()=>generateBriefing()}>Refresh</span>
                  </div>
                  <div style={{fontSize:15,lineHeight:1.8,color:'#3D3228',background:'#FAFAF7',borderRadius:8,padding:18,fontFamily:"'Cormorant Garamond',serif",border:'1px solid #EDE6D6'}}>{briefing}</div>
                </div>
                <div style={{display:'flex',gap:14,marginBottom:20}}>
                  {[{val:todayVisits.length,lbl:'Visits Today',c:'#1A1410'},{val:hotCount,lbl:'Hot Offices',c:HOT},{val:urgentTasks,lbl:'Urgent Tasks',c:WARM},{val:lowSupplies,lbl:'Low Supplies',c:SAGE}].map((st,i)=>(
                    <div key={i} style={s.statPill}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:500,color:st.c}}>{st.val}</div>
                      <div style={{fontSize:10,color:'#7A6E64',marginTop:4,letterSpacing:'0.06em',textTransform:'uppercase'}}>{st.lbl}</div>
                    </div>
                  ))}
                </div>
                <div style={s.card}>
                  <div style={s.cardHeader}>
                    <div style={s.cardTitle}>Today's Route</div>
                    <span style={s.cardAction} onClick={()=>{const stops=route.sort((a,b)=>a.order-b.order).map(s=>encodeURIComponent(s.address||s.name+' '+s.city));if(!stops.length)return;window.open(`https://www.google.com/maps/dir/${stops.join('/')}`,'_blank');}}>Open Maps</span>
                  </div>
                  {route.length===0?(
                    <div>
                      <div style={{color:'#7A6E64',fontSize:13,textAlign:'center',padding:'16px 0'}}>No stops planned. Add from Offices tab.</div>
                      <div style={s.divider}/>
                      <div style={{background:'rgba(92,127,89,0.08)',border:'1px solid rgba(92,127,89,0.2)',borderRadius:10,padding:16}}>
                        <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',color:SAGE,marginBottom:10}}>Dead Day Playbook</div>
                        <div style={{fontSize:13,color:'#3D3228',lineHeight:2.2}}>1. Follow up Ace Smile — lock L&L / happy hour<br/>2. Confirm lunch deliveries — The Dental Studio + Prestige<br/>3. Collect lunch orders — Northlake, Active, Lifetime<br/>4. Drop referral pads once order arrives (7 offices)<br/>5. Lock Dr. Patel + Dr. Nash intro lunch<br/>6. Update Referral Lab — flag closed / do not target offices</div>
                      </div>
                    </div>
                  ):route.map((stop,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 0',borderBottom:'1px solid #EDE6D6'}}>
                      <div style={{width:26,height:26,borderRadius:'50%',border:`1.5px solid ${stop.done?SAGE:GOLD}`,color:stop.done?SAGE:GOLD,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0}}>{stop.order}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:500}}>{stop.name}</div>
                        <div style={{fontSize:11,color:'#7A6E64'}}>{stop.city}</div>
                      </div>
                      <button style={{...s.btnSecondary,...s.btnSm}} onClick={()=>setRoute(route.map((r,ri)=>ri===i?{...r,done:!r.done}:r))}>{stop.done?'Undo':'Done'}</button>
                      <span style={{cursor:'pointer',color:'#7A6E64',fontSize:17}} onClick={()=>setRoute(route.filter((_,ri)=>ri!==i))}>×</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={s.card}>
                  <div style={s.cardHeader}>
                    <div style={s.cardTitle}>Tasks</div>
                  </div>
                  {tasks.filter(t=>t.priority!=='week').slice(0,8).map(t=>(
                    <div key={t.id} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'9px 0',borderBottom:'1px solid #EDE6D6'}}>
                      <div onClick={()=>toggleTask(t.id,t.done)} style={{width:17,height:17,border:`1.5px solid ${t.done?SAGE:'#C4B49E'}`,borderRadius:4,cursor:'pointer',flexShrink:0,marginTop:2,background:t.done?SAGE:'transparent',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'white'}}>{t.done?'✓':''}</div>
                      <div style={{flex:1,fontSize:13,color:t.done?'#7A6E64':'#3D3228',textDecoration:t.done?'line-through':'none'}}>{t.text}</div>
                      <div style={{fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:20,textTransform:'uppercase',background:t.priority==='urgent'?'rgba(193,123,90,0.12)':'rgba(160,120,64,0.14)',color:t.priority==='urgent'?HOT:GOLD}}>{t.priority}</div>
                      <span style={{cursor:'pointer',color:'#7A6E64',fontSize:16}} onClick={()=>deleteTask(t.id)}>×</span>
                    </div>
                  ))}
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
              <div style={s.sectionTitle}>Office Tracker <span style={{fontSize:13,color:'#7A6E64',fontFamily:"'Jost',sans-serif",fontWeight:300}}>Flower Mound · Highland Village · Lewisville</span></div>
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
                      <div style={{display:'grid',gridTemplateColumns:'3fr 2fr 100px 110px 2fr',gap:0,padding:'8px 16px',background:'#F5F0E8',borderBottom:'1px solid #DDD5C4'}}>
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
                          <div key={o.id} onClick={()=>!isDnt&&setSelectedOffice(o)} style={{display:'grid',gridTemplateColumns:'3fr 2fr 100px 110px 2fr',gap:0,padding:'12px 16px',background:isDnt?'#F5F3F0':rowBg,borderBottom:i<cityOffices.length-1?'1px solid #EDE6D6':'none',cursor:isDnt?'default':'pointer',borderLeft:`3px solid ${isDnt?'#C4B49E':o.tier==='hot'?'#C17B5A':od?'#E85C5C':'#DDD5C4'}`,transition:'background 0.1s',opacity:isDnt?0.55:1}} onMouseEnter={e=>{if(!isDnt)e.currentTarget.style.background='#F5EFE6';}} onMouseLeave={e=>{e.currentTarget.style.background=isDnt?'#F5F3F0':rowBg;}}>
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
            <div style={s.sectionTitle}>Field Log <span style={{fontSize:13,color:'#7A6E64',fontFamily:"'Jost',sans-serif",fontWeight:300}}>Log visits in real time</span></div>
            <div style={s.grid2eq}>
              <div style={s.card}>
                <div style={s.cardHeader}><div style={s.cardTitle}>Log a Visit</div></div>
                <label style={s.label}>Office</label>
                <select style={s.select} value={logOffice} onChange={e=>setLogOffice(e.target.value)}>
                  <option value="">Select office...</option>
                  {offices.map(o=><option key={o.id} value={o.name}>{o.name}</option>)}
                </select>
                <label style={s.label}>Gift / Drop</label>
                <input style={s.input} value={logGift} onChange={e=>setLogGift(e.target.value)} placeholder="Snack box, referral pads, dirty soda..."/>
                <label style={s.label}>Field Notes</label>
                <textarea style={s.textarea} value={logNotes} onChange={e=>setLogNotes(e.target.value)} placeholder="Who you met, conversation, interest level..."/>
                <label style={s.label}>Next Action</label>
                <input style={s.input} value={logNextAction} onChange={e=>setLogNextAction(e.target.value)} placeholder="Follow up in 2 weeks, schedule L&L..."/>
                <label style={s.label}>Update Tier</label>
                <select style={s.select} value={logTier} onChange={e=>setLogTier(e.target.value)}>
                  <option value="warm">Warm</option>
                  <option value="hot">Hot</option>
                  <option value="cold">Cold</option>
                </select>
                <button style={{...s.btnPrimary,width:'100%'}} onClick={logVisit}>Save Visit</button>
              </div>
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <div style={s.cardTitle}>Today's Notes</div>
                  <span style={s.cardAction} onClick={()=>{setPage('eod');generateEOD();}}>Push to EOD</span>
                </div>
                {todayVisits.length===0&&<div style={{color:'#7A6E64',fontSize:13,textAlign:'center',padding:'32px 0'}}>No visits logged yet today.</div>}
                {todayVisits.map(v=>(
                  <div key={v.id} style={{background:'#FAFAF7',border:'1px solid #EDE6D6',borderRadius:10,padding:14,marginBottom:10,cursor:'pointer'}} onClick={()=>setSelectedVisit(v)}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                      <div style={{fontWeight:600,fontSize:13}}>{v.office}</div>
                      <div style={{fontSize:10,color:'#7A6E64',fontFamily:'monospace'}}>{new Date(v.date).toLocaleDateString()}</div>
                    </div>
                    {v.notes&&<div style={{fontSize:12,color:'#7A6E64',lineHeight:1.5}}>{v.notes.substring(0,100)}{v.notes.length>100?'...':''}</div>}
                    {v.gift&&<div style={{fontSize:11,color:GOLD,marginTop:4}}>Drop: {v.gift}</div>}
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
            <div style={s.grid2eq}>
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
          <div style={{...s.modalBox,width:620}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
              <div style={s.modalTitle}>{selectedOffice.name}</div>
              <span style={{cursor:'pointer',color:'#7A6E64',fontSize:20,padding:'0 4px'}} onClick={()=>setSelectedOffice(null)}>×</span>
            </div>
            <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
              <span style={s.tierBadge(selectedOffice.tier)}>{selectedOffice.tier}</span>
              {selectedOffice.status&&<span style={s.pill(selectedOffice.status==='Visited'?SAGE:selectedOffice.status==='Do Not Target'?HOT:'#9A8E82')}>{selectedOffice.status}</span>}
              <span style={{fontSize:11,color:'#7A6E64'}}>{selectedOffice.city}</span>
            </div>
            <div style={s.divider}/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
              {selectedOffice.doctor&&<div><div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:3}}>Doctor</div><div style={{fontSize:13}}>{selectedOffice.doctor}</div></div>}
              {selectedOffice.contact&&<div><div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:3}}>Contact</div><div style={{fontSize:13}}>{selectedOffice.contact}</div></div>}
              {selectedOffice.address&&<div><div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:3}}>Address</div><a href={`https://maps.google.com/?q=${encodeURIComponent(selectedOffice.address)}`} target="_blank" rel="noreferrer" style={{fontSize:13,color:GOLD,textDecoration:'none'}}>{selectedOffice.address}</a></div>}
              <div><div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:3}}>Last Visit</div><div style={{fontSize:13,color:isOverdue(selectedOffice.lastVisit)?HOT:SAGE,fontWeight:isOverdue(selectedOffice.lastVisit)?600:400}}>{daysAgo(selectedOffice.lastVisit)}</div></div>
            </div>
            {selectedOffice.gift&&<div style={{marginBottom:12}}><div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:3}}>Last Gift / Drop</div><div style={{fontSize:13,color:GOLD}}>{selectedOffice.gift}</div></div>}
            {selectedOffice.notes&&<div style={{marginBottom:12}}><div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:3}}>Notes</div><div style={{fontSize:13,color:'#3D3228',background:'#FAFAF7',border:'1px solid #EDE6D6',borderRadius:8,padding:12,lineHeight:1.6}}>{selectedOffice.notes}</div></div>}
            {selectedOffice.nextAction&&<div style={{marginBottom:16}}><div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6E5F50',marginBottom:3}}>Next Action</div><div style={{fontSize:13,color:SAGE,fontWeight:500}}>{selectedOffice.nextAction}</div></div>}
            <div style={s.divider}/>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              <button style={s.btnPrimary} onClick={()=>{if(!route.find(r=>r.name===selectedOffice.name)){setRoute([...route,{...selectedOffice,order:route.length+1,done:false}]);}setSelectedOffice(null);setPage('command');}}>+ Add to Route</button>
              {selectedOffice.address&&<button style={s.btnSecondary} onClick={()=>window.open(`https://maps.google.com/?q=${encodeURIComponent(selectedOffice.address)}`,'_blank')}>Map It</button>}
              <button style={s.btnSecondary} onClick={()=>{setLogOffice(selectedOffice.name);setSelectedOffice(null);setPage('fieldlog');}}>Log Visit</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ VISIT DETAIL PANEL ═══ */}
      {selectedVisit&&(
        <div style={s.modal} onClick={e=>e.target===e.currentTarget&&setSelectedVisit(null)}>
          <div style={{...s.modalBox,width:560}}>
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
                    <div style={{display:'grid',gridTemplateColumns:'2fr 1.5fr 1fr 100px 2fr 110px',padding:'8px 16px',background:'#F5F0E8',borderBottom:'1px solid #DDD5C4',gap:12}}>
                      {['Office','Doctor / Contact','Restaurant','Date','Notes','Action'].map(h=>(
                        <div key={h} style={{fontSize:9,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em',color:'#6E5F50'}}>{h}</div>
                      ))}
                    </div>
                    {group.map((l,i)=>(
                      <div key={l.id} style={{display:'grid',gridTemplateColumns:'2fr 1.5fr 1fr 100px 2fr 110px',padding:'12px 16px',background:i%2===0?'#FDFCFA':'#FAF8F5',borderBottom:i<group.length-1?'1px solid #EDE6D6':'none',borderLeft:'3px solid '+color,gap:12,alignItems:'center'}}>
                        <div style={{fontWeight:600,fontSize:13,color:'#1A1410'}}>{l.office}</div>
                        <div>
                          <div style={{fontSize:12,color:'#3D3228'}}>{l.doctor||'—'}</div>
                          <div style={{fontSize:11,color:'#7A6E64',marginTop:2}}>{l.contact||'—'}</div>
                        </div>
                        <div style={{fontSize:12,color:GOLD,fontWeight:l.restaurant?500:400}}>{l.restaurant||'—'}</div>
                        <div style={{fontSize:12,color:'#3D3228',fontFamily:'monospace'}}>{l.date?new Date(l.date).toLocaleDateString('en-US',{month:'short',day:'numeric'}):'—'}</div>
                        <div style={{fontSize:11,color:'#7A6E64',lineHeight:1.4}}>{l.notes||'—'}</div>
                        <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                          {status!=='Delivered'&&(
                            <button style={{...s.btnPrimary,...s.btnSm}} onClick={()=>updateLunch(l.id,{status:'Delivered'})}>Delivered</button>
                          )}
                          {(status==='To Schedule'||status==='Pending')&&(
                            <button style={{...s.btnSecondary,...s.btnSm}} onClick={()=>updateLunch(l.id,{status:'Ordered'})}>Ordered</button>
                          )}
                          <button style={{...s.btnSecondary,...s.btnSm}} onClick={()=>setEditLunch({...l})}>Edit</button>
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
          <div style={{...s.modalBox,width:560}}>
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
          <div style={{...s.modalBox,width:560}}>
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

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}*::-webkit-scrollbar{width:5px}*::-webkit-scrollbar-thumb{background:#DDD5C4;border-radius:3px}`}</style>
    </div>
  );
}
