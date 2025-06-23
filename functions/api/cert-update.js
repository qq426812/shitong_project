export async function onRequestPost({ request, env }) {
  try {
    const {
      id,
      new_id, // 可选字段，用于修改 ID
      certificate_unit,
      instrument_name,
      serial_number,
      asset_number,
      calibration_date,
      certificate_number
    } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: "缺少 ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (new_id && new_id !== id) {
      // 先检查 new_id 是否已存在，避免主键冲突
      const exists = await env.DB.prepare(`SELECT id FROM certificates WHERE id = ?`)
        .bind(new_id)
        .first();

      if (exists) {
        return new Response(JSON.stringify({ success: false, error: "新的 ID 已存在，不能重复" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // 执行 ID 变更 + 字段更新：使用 batch 执行两个语句
      await env.DB.batch([
        env.DB.prepare(`DELETE FROM certificates WHERE id = ?`).bind(id),
        env.DB.prepare(`INSERT INTO certificates (
          id, certificate_unit, instrument_name, serial_number,
          asset_number, calibration_date, certificate_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(
          new_id,
          certificate_unit,
          instrument_name,
          serial_number,
          asset_number,
          calibration_date,
          certificate_number
        )
      ]);

    } else {
      // 普通字段更新，不涉及 ID
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

      await stmt
        .bind(
          certificate_unit,
          instrument_name,
          serial_number,
          asset_number,
          calibration_date,
          certificate_number,
          id
        )
        .run();
    }

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
