export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  console.log('Morning briefing cron fired:', new Date().toISOString());
  return res.status(200).json({ fired: true, time: new Date().toISOString() });
}
