import { getSupplies, addSupply, updateSupply } from '../../lib/notion';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') return res.status(200).json(await getSupplies());
    if (req.method === 'POST') return res.status(200).json(await addSupply(req.body));
    if (req.method === 'PATCH') return res.status(200).json(await updateSupply(req.body.id, req.body.count));
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
