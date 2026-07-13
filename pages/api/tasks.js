const TASKS = [];
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'GET') return res.status(200).json(TASKS);
  if (req.method === 'POST') {
    const t = { ...req.body, id: Date.now().toString(), done: false };
    TASKS.push(t);
    return res.status(200).json(t);
  }
  if (req.method === 'PATCH') {
    const idx = TASKS.findIndex(t => t.id === req.body.id);
    if (idx >= 0) TASKS[idx].done = req.body.done;
    return res.status(200).json(TASKS[idx] || {});
  }
  if (req.method === 'DELETE') {
    const idx = TASKS.findIndex(t => t.id === req.body.id);
    if (idx >= 0) TASKS.splice(idx, 1);
    return res.status(200).json({ success: true });
  }
}
