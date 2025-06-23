export const onRequestPost = async ({ request, env }) => {
  try {
    const { records } = await request.json();

    if (!Array.isArray(records)) {
      return new Response(JSON.stringify({ success: false, error: "records 必须是数组" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const batchId = crypto.randomUUID(); // ✅ 批次 ID，防止并发冲突
    const insertedIds = [];

    for (const rec of records) {
      const stmt = env.DB.prepare(`
        INSERT INTO certificates3 (
          certificate_number,
          certificate_unit,
          certificate_type,
          instrument_name,
          model,
          serial_number,
          asset_number,
          manufacturer,
          calibration_date,
          calibration_personnel,
          batch_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const values = [
        rec["certificate_number"] || rec["证书编号"] || "",
        rec["certificate_unit"] || rec["证书单位"] || "",
        rec["certificate_type"] || rec["证书类型"] || "",
        rec["instrument_name"] || rec["仪器名称"] || "",
        rec["model"] || rec["规格型号"] || "",
        rec["serial_number"] || rec["出厂编号"] || "",
        rec["asset_number"] || rec["资产编号"] || "",
        rec["manufacturer"] || rec["制造厂商"] || "",
        rec["calibration_date"] || rec["检/校日期"] || "",
        rec["calibration_personnel"] || rec["校准/检定员"] || "",
        batchId
      ];

      await stmt.bind(...values).run();

      const row = await env.DB.prepare("SELECT last_insert_rowid() AS id").first();
      if (row?.id) insertedIds.push(row.id);
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
