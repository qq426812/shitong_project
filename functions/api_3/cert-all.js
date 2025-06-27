export async function onRequestGet({ request, env }) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const maxPageSize = 100;
    const pageSize = Math.min(Math.max(parseInt(searchParams.get("pageSize") || "30"), 1), maxPageSize);
    const offset = (page - 1) * pageSize;

    const countStmt = env.DB.prepare("SELECT COUNT(*) AS count FROM certificates3");
    const countResult = await countStmt.first();
    const total = countResult?.count || 0;

    const stmt = env.DB.prepare("SELECT * FROM certificates3 ORDER BY id DESC LIMIT ? OFFSET ?");
    const result = await stmt.bind(pageSize, offset).all();

    return new Response(JSON.stringify({
      success: true,
      data: result.results,
      total
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  } catch (e) {
    console.error("API error:", e);
    return new Response(JSON.stringify({
      success: false,
      error: e.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
