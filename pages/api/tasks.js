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
  if (!res.ok) throw new Error(text);
  return text ? JSON.parse(text) : [];
}

function mapOut(t) {
  return {
    id: t.id,
    text: t.text || '',
    priority: t.priority || 'today',
    done: t.done === true || t.done === 'true' ? true : false,
    createdAt: t.created_at,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    if (req.method === 'GET') {
      const data = await query('GET', 'tasks?order=created_at.asc&select=*');
      return res.status(200).json(data.map(mapOut));
    }
    if (req.method === 'POST') {
      const { id, ...body } = req.body;
      const data = await query('POST', 'tasks', {
        text: body.text,
        priority: body.priority || 'today',
        done: false,
      });
      return res.status(200).json(mapOut(data[0] || {}));
    }
    if (req.method === 'PATCH') {
      const { id, done, text, priority } = req.body;
      const updates = {};
      if (done !== undefined) updates.done = done === true || done === 'true' ? true : false;
      if (text !== undefined) updates.text = text;
      if (priority !== undefined) updates.priority = priority;
      const data = await query('PATCH', `tasks?id=eq.${id}`, updates);
      return res.status(200).json(mapOut(data[0] || {}));
    }
    if (req.method === 'DELETE') {
      await query('DELETE', `tasks?id=eq.${req.body.id}`);
      return res.status(200).json({ success: true });
    }
  } catch (e) {
    console.error('tasks error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
