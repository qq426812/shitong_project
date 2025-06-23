export async function onRequestPost({ request, env }) {
  try {
    const {
      id,            // 原始 ID
      new_id,        // 要修改成的新 ID（前端传过来的）
      certificate_unit,
      instrument_name,
      serial_number,
      asset_number,
      calibration_date,
      certificate_number
    } = await request.json();

    if (!id || !new_id) {
      return new Response(JSON.stringify({ success: false, error: "缺少 ID 或 new_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 开启事务（可选：保持安全）
    await env.DB.exec("BEGIN");

    // 先更新 ID
    if (id !== new_id) {
      const check = await env.DB.prepare("SELECT id FROM certificates WHERE id = ?").bind(new_id).first();
      if (check) {
        return new Response(JSON.stringify({ success: false, error: "目标 ID 已存在，无法修改" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      await env.DB.prepare("UPDATE certificates SET id = ? WHERE id = ?").bind(new_id, id).run();
    }

    // 然后更新其它字段
    const stmt = env.DB.prepare(`
      UPDATE certificates SET
        certificate_unit = ?,
        instrument_name = ?,
        serial_number = ?,
        asset_number = ?,
        calibration_date = ?,
        certificate_number = ?
      WHERE id = ?
    `);

    await stmt.bind(
      certificate_unit,
      instrument_name,
      serial_number,
      asset_number,
      calibration_date,
      certificate_number,
      new_id // 用新 ID 更新
    ).run();

    await env.DB.exec("COMMIT");

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    await env.DB.exec("ROLLBACK").catch(() => {}); // 出错就回滚
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
