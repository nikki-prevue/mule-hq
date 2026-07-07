import { getVisits, addVisit } from '../../lib/notion';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const data = await getVisits();
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const data = await addVisit(req.body);
      return res.status(200).json(data);
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
