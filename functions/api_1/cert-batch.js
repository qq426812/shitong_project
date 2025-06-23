export const onRequestPost = async ({ request, env }) => {
  try {
    const { records } = await request.json();

    if (!Array.isArray(records)) {
      return new Response(JSON.stringify({ success: false, error: "records 必须是数组" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let successCount = 0;

    for (const rec of records) {
      const stmt = env.DB.prepare(`
        INSERT INTO cert_lookup (
          certificate_number,
          certificate_unit,
          calibration_date,
          instrument_name,
          serial_number,
          asset_number
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);

      const values = [
        rec["证书编号"] || "",
        rec["证书单位"] || "",
        rec["校准日期"] || "",
        rec["仪器名称"] || "",
        rec["出厂编号"] || "",
        rec["管理编号"] || ""
      ];

      await stmt.bind(...values).run();
      successCount++;
    }

    return new Response(JSON.stringify({ success: true, count: successCount }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
