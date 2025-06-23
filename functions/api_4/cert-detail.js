export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url);
  const certificateNumber = url.searchParams.get("certificate_number");

  if (!certificateNumber) {
    return new Response(JSON.stringify({ success: false, error: "缺少 certificate_number 参数" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
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
      WHERE certificate_number = ?
      ORDER BY id DESC
      LIMIT 1
    `);

    const row = await stmt.bind(certificateNumber).first();

    if (!row) {
      return new Response(JSON.stringify({ success: false, error: "未找到证书" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      record: row
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: "服务器错误：" + e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
