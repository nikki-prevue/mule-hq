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
  const today = new Date().toISOString().split('T')[0];

  try {
    if (req.method === 'GET') {
      // Get today's route
      const data = await query('GET', `routes?date=eq.${today}&select=*`);
      if (data.length > 0) {
        return res.status(200).json(data[0].stops || []);
      }
      return res.status(200).json([]);
    }

    if (req.method === 'POST') {
      // Save today's route - upsert
      const stops = req.body.stops || [];
      // Check if today's route exists
      const existing = await query('GET', `routes?date=eq.${today}&select=id`);
      if (existing.length > 0) {
        await query('PATCH', `routes?date=eq.${today}`, {
          stops: stops,
          updated_at: new Date().toISOString()
        });
      } else {
        await query('POST', 'routes', {
          date: today,
          stops: stops
        });
      }
      return res.status(200).json({ success: true, stops });
    }
  } catch (e) {
    console.error('routes error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
