const TASKS = [
{"id":"t1","text":"Follow up Ace Smile (~1 wk) — lock L&L / happy hour","priority":"urgent","done":false},
{"id":"t2","text":"Lock Dr. Patel + Dr. Nash intro lunch (FM Family Dentistry)","priority":"urgent","done":false},
{"id":"t3","text":"Drop referral pads once order arrives — Isla, FM Family, Northstar, Campbell & Williams, Wakefield, Hillcrest, Smiles Family","priority":"urgent","done":false},
{"id":"t4","text":"Confirm The Dental Studio lunch delivery (Luna Grill)","priority":"urgent","done":false},
{"id":"t5","text":"Confirm Prestige Family lunch delivered — Market Street","priority":"today","done":true},
{"id":"t6","text":"Collect + schedule Northlake Dentistry lunch order","priority":"today","done":false},
{"id":"t7","text":"Collect + schedule Active Dental lunch order","priority":"today","done":false},
{"id":"t8","text":"Collect + schedule Lifetime Dental lunch order","priority":"today","done":false},
{"id":"t9","text":"Titensor Dental — revisit after office move (late July / early Aug)","priority":"week","done":false},
{"id":"t10","text":"Tenney Dental — happy hour follow-up (target: fall)","priority":"week","done":false},
{"id":"t11","text":"Confirm CFOP/insurance follow-up at Brad Duren Dentistry","priority":"week","done":false},
{"id":"t12","text":"Slate appreciation lunches: Dental Depot Lewisville, Dental Depot HV, Campbell & Williams, Prentice, Family Smiles, Flower Mound Dental, Cross Timbers, 214 Dental Arts, Jordan Carl","priority":"week","done":false},
{"id":"t13","text":"First visits still needed: Hashem Ortho, Hubbard Ortho, Smile Craft Dental, Divine Dental Lewisville, Castle Hills 3D Ortho, All About You Dental","priority":"week","done":false},
{"id":"t14","text":"Update My Highland Village Dentist in Referral Lab — PERMANENTLY CLOSED","priority":"today","done":false},
{"id":"t15","text":"Flag Las Colinas Dental Care in Referral Lab — Dr. Patel DO NOT TARGET","priority":"today","done":false}
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'GET') return res.status(200).json(TASKS);
  if (req.method === 'POST') {
    const t = { ...req.body, id: 't' + Date.now(), done: false };
    TASKS.push(t);
    return res.status(200).json(t);
  }
  if (req.method === 'PATCH') {
    const idx = TASKS.findIndex(t => t.id === req.body.id);
    if (idx >= 0) TASKS[idx].done = req.body.done;
    return res.status(200).json(TASKS[idx] || {});
  }
  if (req.method === 'DELETE') {
    const idx = TASKS.findIndex(t => t.id === req.body.id);
    if (idx >= 0) TASKS.splice(idx, 1);
    return res.status(200).json({ success: true });
  }
}
