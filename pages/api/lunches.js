const LUNCHES = [
  { id: 'l1', office: 'Prestige Family Dentistry', doctor: 'Dr. Vincent DiRusso', contact: 'Stacy (scheduler)', status: 'Delivered', restaurant: 'Market Street', date: '2026-07-09', notes: 'Delivered on time — team thrilled. Staff group photo. Dr. DiRusso in person.', staffCount: 16 },
  { id: 'l2', office: 'The Dental Studio', doctor: 'Dr. Yasi Sabour', contact: 'Yori', status: 'Ordered', restaurant: 'Luna Grill', date: '2026-07-09', notes: 'Nikki paid in person. Yori picking up. Confirm delivery.', staffCount: null },
  { id: 'l3', office: 'Lifetime Dental of Flower Mound', doctor: 'Dr. Dexter Dafney', contact: 'Tyra (front)', status: 'Ordered', restaurant: "Chuy's", date: '2026-07-14', notes: 'Order confirmed. Delivery Tuesday July 14 at 12:45 PM. Need to meet Dr. Dafney in person.', staffCount: null },
  { id: 'l4', office: 'Active Dental', doctor: 'Dr. Jyothi Chodisetty', contact: 'Suzette & Natasha', status: 'Pending', restaurant: null, date: null, notes: 'QR scanned 7/9. Order not yet submitted. Top referrer — never had appreciation lunch.', staffCount: null },
  { id: 'l5', office: 'Northlake Dentistry', doctor: 'Dr. Catherine Whinery', contact: 'Kaylee (front)', status: 'Pending', restaurant: null, date: null, notes: 'QR scanned 7/9. Per Amanda — $10K case. Order not yet submitted.', staffCount: null },
  { id: 'l6', office: 'Dental Depot Lewisville', doctor: '', contact: 'Lucas (mgr)', status: 'To Schedule', restaurant: null, date: null, notes: 'Not yet offered. Slate next route.', staffCount: null },
  { id: 'l7', office: 'Dental Depot - Highland Village', doctor: 'Dr. Neil Patel / Dr. Michael Wing / Dr. Tony Zhang', contact: 'Eboni (mgr)', status: 'To Schedule', restaurant: null, date: null, notes: 'Not yet offered. Slate next route.', staffCount: null },
  { id: 'l8', office: 'Campbell and Williams Family Dentistry', doctor: 'Dr. David Campbell / Dr. Mark Williams', contact: 'Sulee', status: 'To Schedule', restaurant: null, date: null, notes: 'Not yet offered. Slate next route.', staffCount: null },
  { id: 'l9', office: 'Prentice Dental', doctor: 'Dr. Joshua Prentice', contact: 'Esi', status: 'To Schedule', restaurant: null, date: null, notes: 'Top referrer. Not yet offered.', staffCount: null },
  { id: 'l10', office: 'Family Smiles Dental Group', doctor: 'Dr. Nicole Miller / Dr. Jenifer Nichols', contact: 'Minnie', status: 'To Schedule', restaurant: null, date: null, notes: 'Top referrer. Not yet offered.', staffCount: null },
  { id: 'l11', office: 'Flower Mound Dental', doctor: 'Dr. Bellingham', contact: '', status: 'To Schedule', restaurant: null, date: null, notes: 'Top referrer. Not yet offered.', staffCount: null },
  { id: 'l12', office: 'Cross Timbers Dental', doctor: 'Dr. Buschel / Dr. Medici / Dr. Revering', contact: 'Betsy & Sonya', status: 'To Schedule', restaurant: null, date: null, notes: 'Top referrer. Not yet offered.', staffCount: null },
  { id: 'l13', office: '214 Dental Arts', doctor: 'Dr. Leena Ponnapali', contact: 'Emily', status: 'To Schedule', restaurant: null, date: null, notes: 'Top referrer. Not yet offered.', staffCount: null },
  { id: 'l14', office: 'Jordan Carl DMD', doctor: 'Dr. Jordan Carl', contact: 'Nancy', status: 'To Schedule', restaurant: null, date: null, notes: 'Top referrer. Not yet offered.', staffCount: null },
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'GET') return res.status(200).json(LUNCHES);
  if (req.method === 'POST') {
    const l = { ...req.body, id: 'l' + Date.now() };
    LUNCHES.push(l);
    return res.status(200).json(l);
  }
  if (req.method === 'PATCH') {
    const idx = LUNCHES.findIndex(l => l.id === req.body.id);
    if (idx >= 0) Object.assign(LUNCHES[idx], req.body);
    return res.status(200).json(LUNCHES[idx] || {});
  }
  if (req.method === 'DELETE') {
    const idx = LUNCHES.findIndex(l => l.id === req.body.id);
    if (idx >= 0) LUNCHES.splice(idx, 1);
    return res.status(200).json({ success: true });
  }
}
