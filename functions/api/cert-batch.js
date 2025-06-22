export async function onRequestPost({ request, env }) {
  const { data } = await request.json();
  if (!Array.isArray(data)) return new Response(JSON.stringify({ success: false, error: "数据格式错误" }), { status: 400 });
  const ids = [];
  for (const item of data) {
    const stmt = env.DB.prepare(
      `INSERT INTO certificates (certificate_unit, instrument_name, serial_number, asset_number, calibration_date, certificate_number)
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    const res = await stmt.bind(
      item.certificate_unit,
      item.instrument_name,
      item.serial_number,
      item.asset_number,
      item.calibration_date,
      item.certificate_number
    ).run();
    ids.push(res.meta.last_row_id);
  }
  return new Response(JSON.stringify({ success: true, ids }), { headers: { 'Content-Type': 'application/json' } });
}