export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ success: false, error: "缺少 id 参数" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (!/^\d+$/.test(id)) {
    return new Response(JSON.stringify({ success: false, error: "无效的 ID 格式" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const row = await env.DB.prepare(`
      SELECT * FROM cert_lookup WHERE id = ?
    `).bind(id).first();

    if (!row) {
      return new Response(JSON.stringify({ success: false, error: "未找到证书" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const {
      certificate_number,
      certificate_unit,
      calibration_date,
      instrument_name,
      serial_number,
      asset_number
    } = row;

    return new Response(JSON.stringify({
      success: true,
      record: {
        certificate_number,
        certificate_unit,
        calibration_date,
        instrument_name,
        serial_number,
        asset_number
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: "服务器错误：" + e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
