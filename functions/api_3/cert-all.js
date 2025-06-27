export async function onRequestGet({ env, url }) {
  try {
    // 从查询参数获取 page 和 pageSize，默认第一页30条
    const page = Math.max(1, parseInt(url.searchParams.get('page')) || 1);
    const pageSize = Math.min(100, parseInt(url.searchParams.get('pageSize')) || 30); // 限制最大100条，防止一次请求太大
    const offset = (page - 1) * pageSize;

    // 查询总条数
    const countStmt = env.DB.prepare(`SELECT COUNT(*) AS totalCount FROM certificates3`);
    const countResult = await countStmt.all();
    const totalCount = countResult.results[0]?.totalCount || 0;

    // 查询当前页数据
    const dataStmt = env.DB.prepare(`
      SELECT 
        id,
        certificate_number,
        certificate_unit,
        certificate_type,
        instrument_name,
        model,
        serial_number,
        asset_number,
        manufacturer,
        calibration_date,
        calibration_personnel
      FROM certificates3
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `);

    const dataResult = await dataStmt.all(pageSize, offset);

    return new Response(
      JSON.stringify({
        success: true,
        data: dataResult.results,
        totalCount: totalCount
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
