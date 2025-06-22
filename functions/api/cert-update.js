export async function onRequestPost({ request, env }) {
  const { id, certificate_unit } = await request.json();
  const stmt = env.DB.prepare("UPDATE certificates SET certificate_unit = ? WHERE id = ?");
  await stmt.bind(certificate_unit, id).run();
  return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
}