import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB = {
  offices: process.env.NOTION_DB_OFFICES,
  visits: process.env.NOTION_DB_VISITS,
  tasks: process.env.NOTION_DB_TASKS,
  supplies: process.env.NOTION_DB_SUPPLIES,
};

// OFFICES
export async function getOffices() {
  const res = await notion.databases.query({ database_id: DB.offices, sorts: [{ property: 'Name', direction: 'ascending' }] });
  return res.results.map(p => ({
    id: p.id,
    name: p.properties.Name?.title[0]?.plain_text || '',
    doctor: p.properties.Doctor?.rich_text[0]?.plain_text || '',
    city: p.properties.City?.select?.name || '',
    tier: p.properties.Tier?.select?.name || 'warm',
    address: p.properties.Address?.rich_text[0]?.plain_text || '',
    phone: p.properties.Phone?.rich_text[0]?.plain_text || '',
    notes: p.properties.Notes?.rich_text[0]?.plain_text || '',
    lastVisit: p.properties.LastVisit?.date?.start || null,
    nextAction: p.properties.NextAction?.rich_text[0]?.plain_text || '',
  }));
}

export async function addOffice(data) {
  return notion.pages.create({
    parent: { database_id: DB.offices },
    properties: {
      Name: { title: [{ text: { content: data.name } }] },
      Doctor: { rich_text: [{ text: { content: data.doctor || '' } }] },
      City: { select: { name: data.city } },
      Tier: { select: { name: data.tier } },
      Address: { rich_text: [{ text: { content: data.address || '' } }] },
      Phone: { rich_text: [{ text: { content: data.phone || '' } }] },
      Notes: { rich_text: [{ text: { content: data.notes || '' } }] },
      NextAction: { rich_text: [{ text: { content: data.nextAction || '' } }] },
    }
  });
}

export async function updateOffice(id, data) {
  const props = {};
  if (data.tier) props.Tier = { select: { name: data.tier } };
  if (data.nextAction !== undefined) props.NextAction = { rich_text: [{ text: { content: data.nextAction } }] };
  if (data.lastVisit) props.LastVisit = { date: { start: data.lastVisit } };
  if (data.doctor !== undefined) props.Doctor = { rich_text: [{ text: { content: data.doctor } }] };
  return notion.pages.update({ page_id: id, properties: props });
}

export async function deleteOffice(id) {
  return notion.pages.update({ page_id: id, archived: true });
}

// VISITS
export async function getVisits() {
  const res = await notion.databases.query({ database_id: DB.visits, sorts: [{ property: 'Date', direction: 'descending' }] });
  return res.results.map(p => ({
    id: p.id,
    office: p.properties.Office?.title[0]?.plain_text || '',
    gift: p.properties.Gift?.rich_text[0]?.plain_text || '',
    notes: p.properties.Notes?.rich_text[0]?.plain_text || '',
    nextAction: p.properties.NextAction?.rich_text[0]?.plain_text || '',
    tier: p.properties.Tier?.select?.name || '',
    date: p.properties.Date?.date?.start || '',
  }));
}

export async function addVisit(data) {
  return notion.pages.create({
    parent: { database_id: DB.visits },
    properties: {
      Office: { title: [{ text: { content: data.office } }] },
      Gift: { rich_text: [{ text: { content: data.gift || '' } }] },
      Notes: { rich_text: [{ text: { content: data.notes || '' } }] },
      NextAction: { rich_text: [{ text: { content: data.nextAction || '' } }] },
      Tier: { select: { name: data.tier || 'warm' } },
      Date: { date: { start: new Date().toISOString().split('T')[0] } },
    }
  });
}

// TASKS
export async function getTasks() {
  const res = await notion.databases.query({ database_id: DB.tasks, sorts: [{ property: 'Priority', direction: 'ascending' }] });
  return res.results.map(p => ({
    id: p.id,
    text: p.properties.Task?.title[0]?.plain_text || '',
    priority: p.properties.Priority?.select?.name || 'today',
    done: p.properties.Done?.checkbox || false,
  }));
}

export async function addTask(data) {
  return notion.pages.create({
    parent: { database_id: DB.tasks },
    properties: {
      Task: { title: [{ text: { content: data.text } }] },
      Priority: { select: { name: data.priority || 'today' } },
      Done: { checkbox: false },
    }
  });
}

export async function updateTask(id, done) {
  return notion.pages.update({ page_id: id, properties: { Done: { checkbox: done } } });
}

export async function deleteTask(id) {
  return notion.pages.update({ page_id: id, archived: true });
}

// SUPPLIES
export async function getSupplies() {
  const res = await notion.databases.query({ database_id: DB.supplies });
  return res.results.map(p => ({
    id: p.id,
    name: p.properties.Item?.title[0]?.plain_text || '',
    count: p.properties.Count?.number || 0,
    low: p.properties.LowAlert?.number || 5,
  }));
}

export async function updateSupply(id, count) {
  return notion.pages.update({ page_id: id, properties: { Count: { number: count } } });
}

export async function addSupply(data) {
  return notion.pages.create({
    parent: { database_id: DB.supplies },
    properties: {
      Item: { title: [{ text: { content: data.name } }] },
      Count: { number: data.count || 0 },
      LowAlert: { number: data.low || 5 },
    }
  });
}
