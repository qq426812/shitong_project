export const onRequestPost = async ({ request, env }) => {
  try {
    const { records } = await request.json();

    if (!Array.isArray(records)) {
      return new Response(JSON.stringify({ success: false, error: "records 必须是数组" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const batchId = crypto.randomUUID(); // ✅ 生成唯一批次 ID
    const insertedIds = [];

    for (const rec of records) {
      const stmt = env.DB.prepare(`
        INSERT INTO certificates_simple (
          certificate_number,
          company,
          device,
          serial,
          management,
          calibration_date,
          batch_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const values = [
        rec["certificate_number"] || rec["证书编号"] || "",
        rec["company"] || rec["公司名称"] || "",
        rec["device"] || rec["设备名称"] || "",
        rec["serial"] || rec["出厂编号"] || "",
        rec["management"] || rec["管理编号"] || "",
        rec["calibration_date"] || rec["检/校日期"] || "",
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
