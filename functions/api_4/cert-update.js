export async function onRequestPost({ request, env }) {
  try {
    const {
      id,
      certificate_number,       // 证书编号
      certificate_unit,         // 证书单位
      certificate_type,         // 证书类型
      instrument_name,          // 仪器名称
      model,                    // 规格型号
      serial_number,            // 出厂编号
      asset_number,             // 管理编号
      manufacturer,             // 制造厂商
      calibration_date,         // 校准日期
      calibration_personnel     // 校准/检定员
    } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: "缺少 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stmt = env.DB.prepare(`
      UPDATE certificates3 SET
        certificate_number = ?,
        certificate_unit = ?,
        certificate_type = ?,
        instrument_name = ?,
        model = ?,
        serial_number = ?,
        asset_number = ?,
        manufacturer = ?,
        calibration_date = ?,
        calibration_personnel = ?
      WHERE id = ?
    `);

    await stmt
      .bind(
        certificate_number,
        certificate_unit,
        certificate_type,
        instrument_name,
        model,
        serial_number,
        asset_number,
        manufacturer,
        calibration_date,
        calibration_personnel,
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
