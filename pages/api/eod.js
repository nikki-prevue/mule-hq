import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { visits } = req.body;
  if (!visits?.length) return res.status(400).json({ error: 'No visits provided' });

  const summary = visits.map(v =>
    `${v.office}: ${v.notes || 'No notes'}. Gift: ${v.gift || 'None'}. Next: ${v.nextAction || 'TBD'}`
  ).join('\n');

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Write a professional EOD report email for Nikki, PRC at ROOT Periodontal, to Neel Patel (COO).

Today's visits:\n${summary}

Format: Subject line, greeting, offices visited (bulleted), key highlights, next steps, mileage placeholder. Professional, direct, warm. No fluff. No emojis.`
      }]
    });
    return res.status(200).json({ draft: msg.content[0].text });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
