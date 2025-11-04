const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type, authorization"
};

function ok(body) { return new Response(JSON.stringify(body), { headers: jsonHeaders, status: 200 }); }
function bad(status, msg) { return new Response(JSON.stringify({ ok:false, error: msg }), { headers: jsonHeaders, status }); }

async function readDoc(env, key){
  const res = await env.FRYSER.get(key, { type: "json" });
  if (!res) return { items: [], version: 0, updatedAt: new Date().toISOString() };
  return {
    items: Array.isArray(res.items) ? res.items : [],
    version: Number.isFinite(res.version) ? res.version : 0,
    updatedAt: res.updatedAt || new Date().toISOString()
  };
}
async function writeDoc(env, key, doc){
  const payload = { ...doc, updatedAt: new Date().toISOString() };
  await env.FRYSER.put(key, JSON.stringify(payload));
  return payload;
}

export const onRequestOptions = async () => new Response("", { status: 204, headers: jsonHeaders });

export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url);
  const id = (url.searchParams.get("id") || "").trim();
  if (!id) return bad(400, "missing id");
  const key = `household:${id}`;
  const doc = await readDoc(env, key);
  return ok({ ok:true, ...doc });
};

export const onRequestPost = async ({ request, env }) => {
  const url = new URL(request.url);
  const id = (url.searchParams.get("id") || "").trim();
  if (!id) return bad(400, "missing id");
  const key = `household:${id}`;

  let client;
  try {
    client = await request.json();
  } catch (e) {
    return bad(400, "invalid json");
  }
  const clientItems = Array.isArray(client.items) ? client.items : [];
  const clientVersion = Number(client.version || 0);

  const serverDoc = await readDoc(env, key);
  const serverItems = serverDoc.items || [];
  const serverMap = new Map(serverItems.map(i => [i.id, i]));

  const mergedMap = new Map(serverMap);
  for (const ci of clientItems) {
    if (!ci || !ci.id) continue;
    const si = serverMap.get(ci.id);
    const cLU = Number(ci.lastUpdated || 0);
    const sLU = Number(si?.lastUpdated || 0);
    if (!si || cLU >= sLU) {
      mergedMap.set(ci.id, ci);
    }
  }
  const mergedItems = Array.from(mergedMap.values()).filter(x => !x._deleted);
  const newVersion = Math.max(serverDoc.version || 0, clientVersion || 0) + 1;
  const saved = await writeDoc(env, key, { items: mergedItems, version: newVersion });

  return ok({ ok:true, ...saved });
};