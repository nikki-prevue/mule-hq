const SUPPLIES = [
  { id: '1', name: 'Snack Boxes', count: 12, low: 5 },
  { id: '2', name: 'Referral Pads', count: 8, low: 5 },
  { id: '3', name: 'Business Cards (Dr. Patel)', count: 50, low: 10 },
  { id: '4', name: 'Insurance Info Sheets', count: 20, low: 5 },
  { id: '5', name: 'Dirty Soda Boxes', count: 6, low: 3 },
  { id: '6', name: "Tiff's Treats Boxes", count: 4, low: 2 },
  { id: '7', name: 'Veggie Trays', count: 5, low: 2 },
];
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'GET') return res.status(200).json(SUPPLIES);
  if (req.method === 'POST') {
    const s = { ...req.body, id: Date.now().toString() };
    SUPPLIES.push(s);
    return res.status(200).json(s);
  }
  if (req.method === 'PATCH') {
    const idx = SUPPLIES.findIndex(s => s.id === req.body.id);
    if (idx >= 0) SUPPLIES[idx].count = req.body.count;
    return res.status(200).json(SUPPLIES[idx] || {});
  }
}
