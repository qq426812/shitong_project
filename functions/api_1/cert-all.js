export async function onRequestGet({ request, env }) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "30");
    const currentPage = Number.isInteger(page) && page > 0 ? page : 1;
    const size = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 30;
    const offset = (currentPage - 1) * size;

    const countStmt = env.DB.prepare("SELECT COUNT(*) AS count FROM cert_lookup");
    const countResult = await countStmt.first();
    const total = countResult.count;

    const stmt = env.DB.prepare(`
      SELECT id, certificate_number, certificate_unit, calibration_date, instrument_name, serial_number, asset_number
      FROM cert_lookup ORDER BY id DESC LIMIT ? OFFSET ?
    `);
    const result = await stmt.bind(size, offset).all();

    return new Response(JSON.stringify({
      success: true,
      data: result.results,
      total
    }), { headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || '服务器错误'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
