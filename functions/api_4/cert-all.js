export async function onRequestGet({ env, url }) {
  try {
    // 从url参数获取分页参数
    const page = parseInt(url.searchParams.get('page')) || 1;
    const pageSize = parseInt(url.searchParams.get('pageSize')) || 30;
    const offset = (page - 1) * pageSize;

    // 查询总条数
    const countStmt = env.DB.prepare('SELECT COUNT(*) AS count FROM certificates_simple');
    const countResult = await countStmt.all();
    const totalCount = countResult.results[0]?.count || 0;

    // 分页查询
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
    const dataResult = await dataStmt.all(pageSize, offset);

    return new Response(
      JSON.stringify({
        success: true,
        data: dataResult.results,
        totalCount
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
