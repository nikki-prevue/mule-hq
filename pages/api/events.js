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

function mapOut(e) {
  return {
    id: e.id,
    date: e.date || '',
    title: e.title || '',
    type: e.type || 'meeting',
    time: e.time || '',
    notes: e.notes || '',
    source: e.source || 'manual',
  };
}
function mapIn(d) {
  const m = {};
  if (d.date !== undefined) m.date = d.date;
  if (d.title !== undefined) m.title = d.title;
  if (d.type !== undefined) m.type = d.type;
  if (d.time !== undefined) m.time = d.time;
  if (d.notes !== undefined) m.notes = d.notes;
  if (d.source !== undefined) m.source = d.source;
  return m;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    if (req.method === 'GET') {
      const data = await query('GET', 'events?order=date.asc&select=*');
      return res.status(200).json(data.map(mapOut));
    }
    if (req.method === 'POST') {
      const { id, ...body } = req.body;
      const data = await query('POST', 'events', mapIn(body));
      return res.status(200).json(mapOut(data[0] || {}));
    }
    if (req.method === 'DELETE') {
      await query('DELETE', `events?id=eq.${req.body.id}`);
      return res.status(200).json({ success: true });
    }
  } catch (e) {
    console.error('events error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
