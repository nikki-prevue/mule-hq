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

function mapOut(o) {
  return {
    id: o.id,
    name: o.name || '',
    doctor: o.doctor || '',
    city: o.city || '',
    tier: o.tier || 'warm',
    status: o.status || '',
    address: o.address || '',
    contact: o.contact || '',
    notes: o.notes || '',
    gift: o.gift || '',
    nextAction: o.next_action || '',
    lastVisit: o.last_visit || null,
    referralVolume: o.referral_volume || 0,
    topReferrer: o.top_referrer || false,
  };
}

function mapIn(data) {
  const mapped = {};
  if (data.name !== undefined) mapped.name = data.name;
  if (data.doctor !== undefined) mapped.doctor = data.doctor;
  if (data.city !== undefined) mapped.city = data.city;
  if (data.tier !== undefined) mapped.tier = data.tier;
  if (data.status !== undefined) mapped.status = data.status;
  if (data.address !== undefined) mapped.address = data.address;
  if (data.contact !== undefined) mapped.contact = data.contact;
  if (data.notes !== undefined) mapped.notes = data.notes;
  if (data.gift !== undefined) mapped.gift = data.gift;
  if (data.nextAction !== undefined) mapped.next_action = data.nextAction;
  if (data.lastVisit !== undefined) mapped.last_visit = data.lastVisit;
  if (data.referralVolume !== undefined) mapped.referral_volume = data.referralVolume;
  if (data.topReferrer !== undefined) mapped.top_referrer = data.topReferrer;
  return mapped;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    if (req.method === 'GET') {
      const data = await query('GET', 'offices?order=name.asc&select=*');
      return res.status(200).json(data.map(mapOut));
    }
    if (req.method === 'POST') {
      const { id, ...body } = req.body;
      const data = await query('POST', 'offices', mapIn(body));
      return res.status(200).json(mapOut(data[0] || {}));
    }
    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body;
      const data = await query('PATCH', `offices?id=eq.${id}`, mapIn(updates));
      return res.status(200).json(mapOut(data[0] || {}));
    }
    if (req.method === 'DELETE') {
      await query('DELETE', `offices?id=eq.${req.body.id}`);
      return res.status(200).json({ success: true });
    }
  } catch (e) {
    console.error('offices error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
