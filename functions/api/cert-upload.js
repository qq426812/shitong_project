export async function onRequestPost({ request, env }) {
  const body = await request.json();
  const content = body.content || "";
  const stmt = env.DB.prepare(
    `INSERT INTO certificates (certificate_unit, instrument_name, serial_number, asset_number, calibration_date, certificate_number)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  const res = await stmt.bind(
    content, content, content, content, content, content
  ).run();
  return new Response(JSON.stringify({ success: true, id: res.meta.last_row_id }), {
    headers: { 'Content-Type': 'application/json' }
  });
}