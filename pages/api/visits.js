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

function mapOut(v) {
  return {
    id: v.id,
    office: v.office || '',
    doctor: v.doctor || '',
    contact: v.contact || '',
    gift: v.gift || '',
    notes: v.notes || '',
    nextAction: v.next_action || '',
    tier: v.tier || '',
    date: v.date || '',
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    if (req.method === 'GET') {
      const data = await query('GET', 'visits?order=created_at.desc&select=*');
      return res.status(200).json(data.map(mapOut));
    }
    if (req.method === 'POST') {
      const { id, ...body } = req.body;
      const mapped = {
        office: body.office,
        doctor: body.doctor || '',
        contact: body.contact || '',
        gift: body.gift || '',
        notes: body.notes || '',
        next_action: body.nextAction || '',
        tier: body.tier || 'warm',
        date: body.date || new Date().toISOString().split('T')[0],
      };
      const data = await query('POST', 'visits', mapped);
      return res.status(200).json(mapOut(data[0] || {}));
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
