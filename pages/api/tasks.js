import { getTasks, addTask, updateTask, deleteTask } from '../../lib/notion';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') return res.status(200).json(await getTasks());
    if (req.method === 'POST') return res.status(200).json(await addTask(req.body));
    if (req.method === 'PATCH') return res.status(200).json(await updateTask(req.body.id, req.body.done));
    if (req.method === 'DELETE') { await deleteTask(req.body.id); return res.status(200).json({ success: true }); }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
