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
      const data = await query('GET', 'supplies?order=name.asc&select=*');
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { id, ...body } = req.body;
      const data = await query('POST', 'supplies', body);
      return res.status(200).json(data[0] || {});
    }
    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body;
      // map count field
      const mapped = { ...updates };
      if ('count' in mapped) mapped.count = mapped.count;
      const data = await query('PATCH', `supplies?id=eq.${id}`, mapped);
      return res.status(200).json(data[0] || {});
    }
    if (req.method === 'DELETE') {
      await query('DELETE', `supplies?id=eq.${req.body.id}`);
      return res.status(200).json({ success: true });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
