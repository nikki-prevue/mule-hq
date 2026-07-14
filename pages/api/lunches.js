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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    if (req.method === 'GET') {
      const data = await query('GET', 'lunches?order=created_at.asc&select=*');
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { id, ...body } = req.body;
      const mapped = {
        office: body.office,
        doctor: body.doctor,
        contact: body.contact,
        status: body.status || 'To Schedule',
        restaurant: body.restaurant,
        date: body.date || null,
        notes: body.notes,
        staff_count: body.staffCount || null
      };
      const data = await query('POST', 'lunches', mapped);
      return res.status(200).json(data[0] || {});
    }
    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body;
      const mapped = { ...updates };
      if ('staffCount' in mapped) { mapped.staff_count = mapped.staffCount; delete mapped.staffCount; }
      const data = await query('PATCH', `lunches?id=eq.${id}`, mapped);
      return res.status(200).json(data[0] || {});
    }
    if (req.method === 'DELETE') {
      await query('DELETE', `lunches?id=eq.${req.body.id}`);
      return res.status(200).json({ success: true });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
