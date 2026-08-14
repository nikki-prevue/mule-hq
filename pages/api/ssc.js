const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function query(method, path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

function mapOut(m){
  return {
    id:m.id, doctor:m.doctor||'', office:m.office||'', location:m.location||'',
    email:m.email||'', phone:m.phone||'', rep:m.rep||'',
    saveDatesSent:m.save_dates_sent||null, confirmCall:m.confirm_call||null,
    cell:m.cell||'', duesReminderSent:m.dues_reminder_sent||null,
    duesPaid:m.dues_paid||false, rsvpNotes:m.rsvp_notes||'',
    status:m.status||'', notes:m.notes||'',
  };
}
function mapIn(d){
  const m={};
  if(d.doctor!==undefined)m.doctor=d.doctor;
  if(d.office!==undefined)m.office=d.office;
  if(d.location!==undefined)m.location=d.location;
  if(d.email!==undefined)m.email=d.email;
  if(d.phone!==undefined)m.phone=d.phone;
  if(d.rep!==undefined)m.rep=d.rep;
  if(d.saveDatesSent!==undefined)m.save_dates_sent=d.saveDatesSent;
  if(d.confirmCall!==undefined)m.confirm_call=d.confirmCall;
  if(d.cell!==undefined)m.cell=d.cell;
  if(d.duesReminderSent!==undefined)m.dues_reminder_sent=d.duesReminderSent;
  if(d.duesPaid!==undefined)m.dues_paid=d.duesPaid;
  if(d.rsvpNotes!==undefined)m.rsvp_notes=d.rsvpNotes;
  if(d.status!==undefined)m.status=d.status;
  if(d.notes!==undefined)m.notes=d.notes;
  return m;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    if (req.method === 'GET') {
      const data = await query('GET', 'ssc_members?order=doctor.asc&select=*');
      return res.status(200).json(Array.isArray(data) ? data.map(mapOut) : []);
    }
    if (req.method === 'POST') {
      const { id, ...body } = req.body;
      const data = await query('POST', 'ssc_members', mapIn(body));
      return res.status(200).json(mapOut(data[0] || {}));
    }
    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body;
      const data = await query('PATCH', `ssc_members?id=eq.${id}`, mapIn(updates));
      return res.status(200).json(mapOut(data[0] || {}));
    }
    if (req.method === 'DELETE') {
      await query('DELETE', `ssc_members?id=eq.${req.body.id}`);
      return res.status(200).json({ success: true });
    }
  } catch (e) {
    console.error('ssc error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
