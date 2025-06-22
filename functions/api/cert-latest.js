export async function onRequestGet({ env }) {
  const stmt = env.DB.prepare("SELECT id FROM certificates ORDER BY id DESC LIMIT 1");
  const result = await stmt.first();
  return new Response(JSON.stringify({ success: true, id: result?.id }), { headers: { 'Content-Type': 'application/json' } });
}
