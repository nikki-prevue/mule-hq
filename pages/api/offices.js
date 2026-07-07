import { getOffices, addOffice, updateOffice, deleteOffice } from '../../lib/notion';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const data = await getOffices();
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const data = await addOffice(req.body);
      return res.status(200).json(data);
    }
    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body;
      const data = await updateOffice(id, updates);
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      await deleteOffice(req.body.id);
      return res.status(200).json({ success: true });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
