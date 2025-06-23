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
      // 插入一条数据
      await env.DB.prepare(`
        INSERT INTO certificates (
          certificate_unit,
          instrument_name,
          serial_number,
          asset_number,
          calibration_date,
          certificate_number,
          batch_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        rec["公司名称"] || "",
        rec["设备名称"] || "",
        rec["出厂编号"] || "",
        rec["管理编号"] || "",
        rec["校准日期"] || "",
        rec["证书编号"] || "",
        batchId
      ).run();

      // 获取刚插入的 ID（必须紧跟插入之后）
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
