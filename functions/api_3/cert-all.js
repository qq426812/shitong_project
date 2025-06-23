export async function onRequestGet({ env }) {
  const stmt = env.DB.prepare(`
    SELECT 
      id,
      certificate_number,
      certificate_unit,
      calibration_date,
      instrument_name,
      serial_number,
      asset_number
    FROM cert_lookup
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
