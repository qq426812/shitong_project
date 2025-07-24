export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  // 校验参数
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
    // 查询 certificates5 表
    const row = await env.DB.prepare(`
      SELECT 
        id,
        certificate_number,
        certificate_unit,
        instrument_name,
        model_spec,
        serial_number,
        asset_number,
        calibration_date,
        status,
        created_at,
        batch_id
      FROM certificates5
      WHERE id = ?
    `).bind(id).first();

    if (!row) {
      return new Response(JSON.stringify({ success: false, error: "未找到证书" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: row
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
