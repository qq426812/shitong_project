export async function onRequestPost({ request, env }) {
  try {
    const {
      id,
      certificate_unit,
      instrument_name,
      serial_number,
      asset_number,
      calibration_date,
      certificate_number,
      batch_id // 新增字段
    } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: "缺少 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stmt = env.DB.prepare(`
      UPDATE certificates5 SET
        certificate_unit = ?,
        instrument_name = ?,
        serial_number = ?,
        asset_number = ?,
        calibration_date = ?,
        certificate_number = ?,
        batch_id = ?
      WHERE id = ?
    `);

    await stmt
      .bind(
        certificate_unit,
        instrument_name,
        serial_number,
        asset_number,
        calibration_date,
        certificate_number,
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
