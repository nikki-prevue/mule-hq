const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function sb(method, path, body) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const t = await r.text();
  return t ? JSON.parse(t) : [];
}

async function aiSummary(office, visits, doctors) {
  const ctx = `Office: ${office.name} (${office.city || ''}). Tier: ${office.tier}. Top referrer: ${office.top_referrer ? 'yes' : 'no'}. Doctor(s): ${office.doctor || (doctors.map(d => d.name).join(', ')) || 'unknown'}. Closed days: ${office.closed_days || 'n/a'}. Hours: ${office.hours || 'n/a'}. Open follow-ups: ${office.open_follow_ups || 'none'}. Next action: ${office.next_action || 'none'}. Last visit: ${office.last_visit || 'never'}. Last attempt: ${office.last_attempt || 'none'}. Notes: ${office.notes || ''}. Recent touchpoints: ${visits.map(v => `(${v.date}) ${v.notes}`).join(' | ') || 'none'}.`;
  const prompt = `You are Nikki's provider-relations assistant at ROOT Perio (periodontal practice). In 1-2 short sentences, write an "at a glance" brief for this dental office so Nikki walks in prepared: who they are and the relationship (top referrer, new prospect, warm, cold), the key doctor or front-desk contact, any standing quirk (closed day or a warm-open tip), and the single most important open item or next step. Factual only, never invent. No emojis.\n\n${ctx}`;
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 160, messages: [{ role: 'user', content: prompt }] })
  });
  const d = await r.json();
  return (d.content?.[0]?.text || '').trim();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();
  try {
    let names = req.body?.offices;
    if (!names || !names.length) {
      const routes = await sb('GET', 'routes?order=updated_at.desc&limit=1&select=stops');
      const stops = routes?.[0]?.stops || [];
      names = Array.isArray(stops) ? stops.map(s => s.name).filter(Boolean) : [];
    }
    if (!names.length) return res.status(200).json({ briefed: 0, message: 'No route set' });
    const results = await Promise.all(names.map(async (name) => {
      const offs = await sb('GET', `offices?name=eq.${encodeURIComponent(name)}&select=*`);
      const office = offs?.[0];
      if (!office) return null;
      const visits = await sb('GET', `visits?office=ilike.${encodeURIComponent(name)}&order=date.desc&limit=4&select=date,notes`);
      const doctors = await sb('GET', `doctors?office=ilike.${encodeURIComponent(name)}&select=name,specialty,notes`);
      const summary = await aiSummary(office, visits || [], doctors || []);
      if (summary) await sb('PATCH', `offices?id=eq.${office.id}`, { at_a_glance: summary, at_a_glance_at: new Date().toISOString() });
      return { name, summary };
    }));
    const done = results.filter(Boolean);
    return res.status(200).json({ briefed: done.length, offices: done });
  } catch (e) {
    console.error('brief error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
