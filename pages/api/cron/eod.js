// Cron: fires at 3:30 PM CT daily
// Vercel cron schedule: 30 20 * * * (3:30PM CT = 20:30 UTC)

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }
  console.log('EOD cron fired:', new Date().toISOString());
  return res.status(200).json({ fired: true, time: new Date().toISOString() });
}

export const config = { runtime: 'edge' };
