export async function onRequestDelete({ request, env }) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ success: false, error: "缺少 ID" }), { status: 400 });
  await env.DB.prepare("DELETE FROM certificates5 WHERE id = ?").bind(id).run();
  return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
}
