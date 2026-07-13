export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { hotCount, overdueCount, route, isFriday } = req.body;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        messages: [{ role: 'user', content: `You are a senior PRC advisor. Write a sharp 3-sentence morning briefing for Nikki, PRC at ROOT Periodontal covering Flower Mound, Highland Village, and Lewisville TX. Today: ${today}. Hot offices: ${hotCount || 0}. Overdue: ${overdueCount || 0}. Route: ${route || 'No stops yet'}. Friday admin day: ${isFriday}. Be direct and field-focused. End with one priority action. No bullets. No emojis.` }]
      })
    });
    const data = await response.json();
    return res.status(200).json({ briefing: data.content[0].text });
  } catch (e) {
    return res.status(200).json({ briefing: `Good morning, Nikki. Today is ${today}. Focus on your hot offices first and aim to be heading back by 3:30 PM. Your territory is yours to own.` });
  }
}
