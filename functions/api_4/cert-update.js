export async function onRequestPost({ request, env }) {
  try {
    const {
      id,
      company,
      device,
      serial,
      management,
      calibration_date,
      certificate_number
    } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: "缺少 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stmt = env.DB.prepare(`
      UPDATE certificates_simple SET
        company = ?,
        device = ?,
        serial = ?,
        management = ?,
        calibration_date = ?,
        certificate_number = ?
      WHERE id = ?
    `);

    await stmt
      .bind(
        company,
        device,
        serial,
        management,
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
