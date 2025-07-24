export const onRequestPost = async ({ request, env }) => {
  const data = await request.json();

  const {
    certificateUnit,
    instrumentName,
    serialNumber,
    assetNumber,
    calibrationDate,
    certificateNumber,
  } = data;

  if (!certificateUnit || !instrumentName) {
    return new Response(JSON.stringify({ success: false, error: "字段缺失" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stmt = env.DB.prepare(`
    INSERT INTO certificates5 (
      certificate_unit, instrument_name, serial_number,
      asset_number, calibration_date, certificate_number, batch_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  await stmt.bind(
    certificateUnit,
    instrumentName,
    serialNumber,
    assetNumber,
    calibrationDate,
    certificateNumber,

  ).run();

  const lastId = await env.DB.prepare("SELECT last_insert_rowid() as id").first();

  return new Response(JSON.stringify({ success: true, id: lastId.id }), {
    headers: { "Content-Type": "application/json" }
  });
};
