export const onRequestPost = async ({ request, env }) => {
  try {
    const { records } = await request.json();

    if (!Array.isArray(records)) {
      return new Response(JSON.stringify({ success: false, error: "records 必须是数组" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const batchId = crypto.randomUUID(); // ✅ 自动生成唯一 batch_id
    const insertedIds = [];

    for (const rec of records) {
      // 插入一条数据到 certificates5 表
      await env.DB.prepare(`
        INSERT INTO certificates5 (
          certificate_number,
          certificate_unit,
          instrument_name,
          model_spec,
          serial_number,
          asset_number,
          calibration_date,
          batch_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        rec.certificate_number || "",
        rec.certificate_unit || "",
        rec.instrument_name || "",
        rec.model_spec || "",
        rec.serial_number || "",
        rec.asset_number || "",
        rec.calibration_date || "",
        batchId
      ).run();

      const row = await env.DB.prepare("SELECT last_insert_rowid() AS id").first();
      if (row?.id) {
        insertedIds.push(row.id);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      count: insertedIds.length,
      ids: insertedIds,
      batch_id: batchId
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
