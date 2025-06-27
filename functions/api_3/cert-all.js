export async function onRequestGet({ request, env }) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "30");
  const offset = (page - 1) * pageSize;

  const countStmt = env.DB.prepare("SELECT COUNT(*) AS count FROM certificates3");
  const countResult = await countStmt.first();
  const total = countResult.count;

  const stmt = env.DB.prepare("SELECT * FROM certificates3 ORDER BY id DESC LIMIT ? OFFSET ?");
  const result = await stmt.bind(pageSize, offset).all();

  return new Response(JSON.stringify({
    success: true,
    data: result.results,
    total
  }), { headers: { 'Content-Type': 'application/json' } });
}
