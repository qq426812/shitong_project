export async function onRequestGet({ env }) {
  try {
    const stmt = env.DB.prepare(`
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
    `);

    const result = await stmt.all();

    return new Response(
      JSON.stringify({ success: true, data: result.results }),
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
