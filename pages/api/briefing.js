import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { hotCount, overdueCount, route, tasks, isFriday } = req.body;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are a senior PRC advisor. Write a sharp 3-sentence morning briefing for Nikki, PRC at ROOT Periodontal covering Flower Mound, Highland Village, and Lewisville TX.

Today: ${today}. Hot offices: ${hotCount}. Overdue (14+ days): ${overdueCount}. Route: ${route || 'No stops yet'}. Tasks: ${tasks || 'None'}. Friday admin day: ${isFriday}.

Direct. Field-focused. End with one priority action. No bullets. No emojis.`
      }]
    });
    return res.status(200).json({ briefing: msg.content[0].text });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
