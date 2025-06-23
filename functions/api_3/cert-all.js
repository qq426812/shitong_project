export async function onRequestGet({ env }) {
  const stmt = env.DB.prepare(`
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
  `);

  const result = await stmt.all();

  return new Response(
    JSON.stringify({ success: true, data: result.results }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
