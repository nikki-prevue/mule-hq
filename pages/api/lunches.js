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

function mapOut(l) {
  return {
    id: l.id,
    office: l.office || '',
    doctor: l.doctor || '',
    contact: l.contact || '',
    status: l.status || 'To Schedule',
    restaurant: l.restaurant || '',
    date: l.date || '',
    notes: l.notes || '',
    staffCount: l.staff_count || null,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    if (req.method === 'GET') {
      const data = await query('GET', 'lunches?order=created_at.asc&select=*');
      return res.status(200).json(data.map(mapOut));
    }
    if (req.method === 'POST') {
      const { id, ...body } = req.body;
      const data = await query('POST', 'lunches', {
        office: body.office,
        doctor: body.doctor || '',
        contact: body.contact || '',
        status: body.status || 'To Schedule',
        restaurant: body.restaurant || null,
        date: body.date || null,
        notes: body.notes || '',
        staff_count: body.staffCount || null,
      });
      return res.status(200).json(mapOut(data[0] || {}));
    }
    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body;
      const mapped = {};
      if (updates.status !== undefined) mapped.status = updates.status;
      if (updates.restaurant !== undefined) mapped.restaurant = updates.restaurant;
      if (updates.date !== undefined) mapped.date = updates.date;
      if (updates.notes !== undefined) mapped.notes = updates.notes;
      if (updates.office !== undefined) mapped.office = updates.office;
      if (updates.doctor !== undefined) mapped.doctor = updates.doctor;
      if (updates.contact !== undefined) mapped.contact = updates.contact;
      if (updates.staffCount !== undefined) mapped.staff_count = updates.staffCount;
      const data = await query('PATCH', `lunches?id=eq.${id}`, mapped);
      return res.status(200).json(mapOut(data[0] || {}));
    }
    if (req.method === 'DELETE') {
      await query('DELETE', `lunches?id=eq.${req.body.id}`);
      return res.status(200).json({ success: true });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
