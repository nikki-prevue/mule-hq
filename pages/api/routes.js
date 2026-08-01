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

// Single persistent route: always read/write the most-recently-updated row.
// No date keying (avoids per-day reset + timezone edge cases + duplicate rows).
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, max-age=0'); // widget always pulls fresh

  try {
    if (req.method === 'GET') {
      const data = await query('GET', `routes?select=*&order=updated_at.desc&limit=1`);
      if (data.length > 0) return res.status(200).json(data[0].stops || []);
      return res.status(200).json([]);
    }

    if (req.method === 'POST') {
      const stops = req.body.stops || [];
      // Always update the single latest route row; create one only if none exists.
      const existing = await query('GET', `routes?select=id&order=updated_at.desc&limit=1`);
      if (existing.length > 0) {
        await query('PATCH', `routes?id=eq.${existing[0].id}`, {
          stops: stops,
          updated_at: new Date().toISOString()
        });
      } else {
        await query('POST', 'routes', {
          date: new Date().toISOString().split('T')[0],
          stops: stops
        });
      }
      return res.status(200).json({ success: true, stops });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('routes error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
