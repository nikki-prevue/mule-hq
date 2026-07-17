export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { notes, date, territory } = req.body;
  try {
    const prompt = `You are generating reports for Nikki Williams, Provider Relations Coordinator at ROOT Periodontal & Implant Center covering Flower Mound, Highland Village, and Lewisville TX.

Today's date: ${date}
Territory: ${territory}

From these scratch field notes, generate THREE separate reports:

REPORT 1 — EOD EMAIL (professional, send to Neel Patel COO):
Subject: Daily Marketing Activity Report – ${date}

Good afternoon Neel,

Here is my marketing activity report for today, [Day], ${date}.

OFFICES VISITED:
[For each office: Office Name | City, Contact: name/role, Gift/Drop: what was left, Notes: professional summary, Next Steps: what happens next]

LUNCH COORDINATIONS:
[Any lunch scheduling]

ADDITIONAL NOTES:
[Anything worth flagging — supplies needed, offices closed, Dr. Patel intel]

Total Offices Visited: [X]

Thank you,
Nikki Williams
Provider Relations Coordinator | ROOT Periodontal & Implant Center

---SEPARATOR---

REPORT 2 — REFERRAL LAB NOTES (detailed, one per office):
Format exactly: [Date] — [Visit type]. [Gift dropped]. [Who spoke with and their role]. [Key conversation details]. [Referral intel if any]. — NW

For closed/attempted offices:
[Date] — Visited within posted business hours; office closed, no contact. [Follow-up plan]. (General Communication.) — NW

---SEPARATOR---

REPORT 3 — EXCEL NOTES (simplified, one line per office):
Format exactly: [Gift]; [Contact name] ([role, staff count if known]) — [one-line summary] — [Date] - NW

Generate all three clearly labeled. Do not add initials NW to EOD. Keep RL and Excel notes in exact format shown.

SCRATCH NOTES FROM FIELD:
${notes}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    const full = data.content?.[0]?.text || '';
    const parts = full.split('---SEPARATOR---');
    return res.status(200).json({
      eod: parts[0]?.trim() || '',
      rl: parts[1]?.trim() || '',
      excel: parts[2]?.trim() || ''
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
