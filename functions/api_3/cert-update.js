export async function onRequestPost({ request, env }) {
  try {
    const {
      id,
      certificate_number,   // 证书编号
      certificate_unit,     // 证书单位
      calibration_date,     // 校准日期
      instrument_name,      // 仪器名称
      serial_number,        // 出厂编号
      asset_number          // 管理编号
    } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: "缺少 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stmt = env.DB.prepare(`
      UPDATE cert_lookup SET
        certificate_number = ?,
        certificate_unit = ?,
        calibration_date = ?,
        instrument_name = ?,
        serial_number = ?,
        asset_number = ?
      WHERE id = ?
    `);

    await stmt
      .bind(
        certificate_number,
        certificate_unit,
        calibration_date,
        instrument_name,
        serial_number,
        asset_number,
        id
      )
      .run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
