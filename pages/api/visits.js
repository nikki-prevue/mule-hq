const VISITS = [];
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'GET') return res.status(200).json(VISITS);
  if (req.method === 'POST') {
    const v = { ...req.body, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] };
    VISITS.push(v);
    return res.status(200).json(v);
  }
}
