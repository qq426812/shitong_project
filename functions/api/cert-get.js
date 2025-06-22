export async function onRequestGet({ request, env }) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ success: false, error: "缺少 ID" }), { status: 400 });
  const stmt = env.DB.prepare("SELECT * FROM certificates WHERE id = ?");
  const data = await stmt.bind(id).first();
  if (!data) return new Response(JSON.stringify({ success: false, error: "未找到数据" }), { status: 404 });
  return new Response(JSON.stringify({ success: true, data }), { headers: { 'Content-Type': 'application/json' } });
}