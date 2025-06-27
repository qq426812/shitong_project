export async function onRequestGet({ request, env }) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);
    const pageSize = Math.max(parseInt(searchParams.get('pageSize') || '30'), 1);
    const offset = (page - 1) * pageSize;

    // 查询总条数
    const countStmt = env.DB.prepare('SELECT COUNT(*) AS count FROM certificates_simple');
    const countResult = await countStmt.first();
    const total = countResult?.count || 0;

    // 分页查询数据
    const dataStmt = env.DB.prepare(`
      SELECT 
        id,
        company,
        device,
        serial,
        management,
        calibration_date,
        certificate_number
      FROM certificates_simple
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `);
    const dataResult = await dataStmt.bind(pageSize, offset).all();  // ✅ 必须 .bind(...).all()

    return new Response(
      JSON.stringify({
        success: true,
        data: dataResult.results,
        total  // ✅ 与前端统一字段
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: e.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
