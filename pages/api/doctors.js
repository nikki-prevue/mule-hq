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

function mapOut(d) {
  return {
    id: d.id,
    office: d.office || '',
    name: d.name || '',
    specialty: d.specialty || '',
    referralVolume: d.referral_volume || 0,
    notes: d.notes || '',
  };
}
function mapIn(data) {
  const m = {};
  if (data.office !== undefined) m.office = data.office;
  if (data.name !== undefined) m.name = data.name;
  if (data.specialty !== undefined) m.specialty = data.specialty;
  if (data.referralVolume !== undefined) m.referral_volume = data.referralVolume;
  if (data.notes !== undefined) m.notes = data.notes;
  return m;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    if (req.method === 'GET') {
      const data = await query('GET', 'doctors?order=name.asc&select=*');
      return res.status(200).json(data.map(mapOut));
    }
    if (req.method === 'POST') {
      const { id, ...body } = req.body;
      const data = await query('POST', 'doctors', mapIn(body));
      return res.status(200).json(mapOut(data[0] || {}));
    }
    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body;
      const data = await query('PATCH', `doctors?id=eq.${id}`, mapIn(updates));
      return res.status(200).json(mapOut(data[0] || {}));
    }
    if (req.method === 'DELETE') {
      await query('DELETE', `doctors?id=eq.${req.body.id}`);
      return res.status(200).json({ success: true });
    }
  } catch (e) {
    console.error('doctors error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
