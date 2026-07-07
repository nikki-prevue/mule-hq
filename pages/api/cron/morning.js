// Cron: fires at 8:00 AM CT daily
// Vercel cron schedule: 0 13 * * * (8AM CT = 13:00 UTC)

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }
  // Trigger briefing generation — stored in Notion for app to read
  console.log('Morning briefing cron fired:', new Date().toISOString());
  return res.status(200).json({ fired: true, time: new Date().toISOString() });
}

export const config = { runtime: 'edge' };
