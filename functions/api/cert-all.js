export async function onRequestGet({ env }) {
  const stmt = env.DB.prepare("SELECT * FROM certificates ORDER BY id DESC");
  const all = await stmt.all();
  return new Response(JSON.stringify({ success: true, data: all.results }), { headers: { 'Content-Type': 'application/json' } });
}
