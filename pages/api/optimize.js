const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function cacheCoords(id, lat, lon) {
  if (!id) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/offices?id=eq.${id}`, {
      method: 'PATCH',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lon })
    });
  } catch (e) {}
}

function cleanAddr(a) {
  if (!a) return '';
  let s = String(a);
  s = s.replace(/#\s*\S+/g, ' ');
  s = s.replace(/\b(ste|suite|unit|apt|apartment|bldg|building|fl|floor|rm|room)\b\.?\s*[a-z0-9-]+/ig, ' ');
  s = s.replace(/\s{2,}/g, ' ').replace(/\s*,\s*/g, ', ').replace(/,+\s*$/,'').trim();
  return s;
}

async function censusLookup(q) {
  try {
    const url = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${encodeURIComponent(q)}&benchmark=Public_AR_Current&format=json`;
    const r = await fetch(url);
    const d = await r.json();
    const m = d?.result?.addressMatches?.[0];
    if (m && m.coordinates) return { lat: m.coordinates.y, lon: m.coordinates.x };
  } catch (e) {}
  return null;
}

async function geocode(addr, city) {
  const street = cleanAddr(addr);
  const c = city || '';
  const tries = [`${street}, ${c}, TX`, `${street}, TX`, `${addr}, ${c}, TX`];
  for (const q of tries) {
    if (!q || q.replace(/[ ,]/g,'').length < 5) continue;
    const g = await censusLookup(q);
    if (g) return g;
  }
  return null;
}

function haversine(a, b) {
  const R = 6371, r = Math.PI / 180;
  const dLa = (b.lat - a.lat) * r, dLo = (b.lon - a.lon) * r;
  const s1 = Math.sin(dLa / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s1));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const stops = req.body?.stops || [];
    if (stops.length < 2) return res.status(200).json({ error: 'Add at least 2 stops.' });
    const resolved = await Promise.all(stops.map(async (s) => {
      let lat = s.lat, lon = s.lon;
      if ((lat == null || lon == null) && s.address) {
        const g = await geocode(s.address, s.city);
        if (g) { lat = g.lat; lon = g.lon; await cacheCoords(s.id, lat, lon); }
      }
      return { name: s.name, lat, lon };
    }));
    const geo = resolved.filter(s => s.lat != null && s.lon != null);
    const nogeo = resolved.filter(s => s.lat == null || s.lon == null);
    if (geo.length < 2) return res.status(200).json({ error: 'Could not locate enough stops. Check their addresses.' });
    let start = geo.reduce((a, b) => (b.lon < a.lon ? b : a));
    const order = [start];
    const rest = geo.filter(s => s !== start);
    while (rest.length) {
      const last = order[order.length - 1];
      let bi = 0, bd = Infinity;
      rest.forEach((s, i) => { const dd = haversine(last, s); if (dd < bd) { bd = dd; bi = i; } });
      order.push(rest.splice(bi, 1)[0]);
    }
    const ordered = [...order, ...nogeo];
    return res.status(200).json({ ordered: ordered.map(s => s.name), located: geo.length, unlocated: nogeo.map(s => s.name) });
  } catch (e) {
    console.error('optimize error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
